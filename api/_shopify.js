const API_VERSION = process.env.SHOPIFY_API_VERSION || '2026-07';

function shopifyConfig() {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
  return { storeDomain, token, apiVersion: API_VERSION };
}

function normalizeStoreDomain(storeDomain) {
  return String(storeDomain || '').replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
}

async function shopifyRequest(path, opts) {
  const cfg = shopifyConfig();
  const storeDomain = normalizeStoreDomain(cfg.storeDomain);
  if (!storeDomain || !cfg.token) {
    const err = new Error('Shopify Admin API is not configured');
    err.statusCode = 500;
    throw err;
  }

  const res = await fetch('https://' + storeDomain + '/admin/api/' + cfg.apiVersion + path, {
    method: (opts && opts.method) || 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Shopify-Access-Token': cfg.token,
    },
    body: opts && opts.body ? JSON.stringify(opts.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.errors ? JSON.stringify(data.errors) : 'Shopify API request failed');
    err.statusCode = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

function splitName(fullName) {
  const parts = String(fullName || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return { first_name: '', last_name: '' };
  if (parts.length === 1) return { first_name: parts[0], last_name: '' };
  return { first_name: parts.slice(0, -1).join(' '), last_name: parts.slice(-1)[0] };
}

function money(value) {
  return Number(value || 0).toFixed(2);
}

// Human-readable rupee amount for notes shown to ops/fulfilment (e.g. "₹13,800").
function inr(value) {
  return '₹' + Number(value || 0).toLocaleString('en-IN');
}

async function createPaidOrder(payload) {
  payload = payload || {};
  const customer = payload.customer || {};
  const shipping = payload.shipping || {};
  const payment = payload.payment || {};
  const lines = Array.isArray(payload.lines) ? payload.lines : [];

  if (!lines.length) {
    const err = new Error('No order lines supplied');
    err.statusCode = 400;
    throw err;
  }

  const name = splitName(customer.name || shipping.name);
  const lineItems = lines.map((line) => {
    const properties = [];
    if (line.productId) properties.push({ name: 'Product ID', value: String(line.productId) });
    if (line.size) properties.push({ name: 'Size', value: String(line.size) });
    if (line.color) properties.push({ name: 'Colour', value: String(line.color) });
    if (line.measurements) properties.push({ name: 'Measurements', value: String(line.measurements) });

    return {
      title: String(line.name || 'LE ROSEA piece'),
      quantity: Math.max(1, Number(line.quantity || 1)),
      price: money(line.price),
      requires_shipping: true,
      taxable: false,
      properties,
    };
  });

  const address = {
    first_name: name.first_name,
    last_name: name.last_name,
    address1: shipping.address || '',
    city: shipping.city || '',
    province: shipping.state || '',
    zip: shipping.pin || '',
    country: shipping.country || '',
    phone: customer.phone || shipping.phone || '',
  };

  // Order total from the line items themselves — exactly what Shopify computes
  // as the order total. (We never trust a client-sent total for the money math.)
  const lineSubtotal = lineItems.reduce((sum, li) => sum + Number(li.price) * li.quantity, 0);
  const isPartial = payload.paymentMethod === 'partial';

  // --- FIRST10 first-order discount (server-enforced) ----------------------
  // Honour the discount ONLY when the code was claimed AND the caller passed a
  // server-verified `couponEligible` flag (set in verify-payment after a live
  // eligibility re-check). We never trust a client amount or eligibility flag.
  // If it was claimed but is NOT eligible (stale email / tampering / frontend
  // bug), the order is billed at FULL price and the discrepancy is flagged.
  const DISCOUNT_RATE = 0.10;
  const claimed = !!(payload.coupon && String(payload.coupon.code || '').toUpperCase() === 'FIRST10');
  const eligible = payload.couponEligible === true;
  const honour = claimed && eligible;
  const discount = honour ? Math.round(lineSubtotal * DISCOUNT_RATE) : 0;
  const orderTotal = lineSubtotal - discount;   // what Shopify records as total_price
  const discrepancy = claimed && !eligible;     // applied at checkout but not valid

  // What was actually captured online now. The checkout applies the discount iff
  // it claimed the code, so reconstruct the charged amount from the claim using
  // the same server rate — independent of any client-sent number.
  const chargedTotal = lineSubtotal - (claimed ? Math.round(lineSubtotal * DISCOUNT_RATE) : 0);
  const chargedNow = isPartial ? Math.round(chargedTotal / 2) : chargedTotal;
  const balance = orderTotal - chargedNow;      // remaining owed (partial-COD, or a discrepancy)

  // Notes -------------------------------------------------------------------
  let note = isPartial
    ? ('PARTIAL COD — Balance due at delivery: ' + inr(balance) + ' (cash). ' +
       'Advance ' + inr(chargedNow) + ' paid online via Razorpay. ' +
       'Collect ' + inr(balance) + ' in cash when booking the courier COD shipment.')
    : 'Paid through Razorpay on lerosea.com';
  if (discrepancy) {
    note = 'DISCOUNT DISCREPANCY — FIRST10 was applied at checkout but this customer is NOT eligible ' +
      '(a prior order exists for ' + (customer.email || 'this email') + '). Discount NOT honoured; order ' +
      'billed at full price ' + inr(lineSubtotal) + '. Amount charged online: ' + inr(chargedNow) +
      '. Outstanding: ' + inr(orderTotal - chargedNow) + '. Review before fulfilment.\n\n' + note;
  }

  const noteAttributes = [
    { name: 'Razorpay Order ID', value: payment.razorpay_order_id || '' },
    { name: 'Razorpay Payment ID', value: payment.razorpay_payment_id || '' },
  ];
  if (isPartial) {
    // Prepend so the balance-due amount surfaces at the top of "Additional details".
    noteAttributes.unshift(
      { name: 'Payment Method', value: 'Partial COD (50% advance)' },
      { name: 'Advance Paid Online', value: inr(chargedNow) },
      { name: 'Balance Due at Delivery (cash)', value: inr(balance) },
    );
  }
  if (honour) {
    noteAttributes.push({ name: 'Coupon', value: 'FIRST10 — 10% first-order (−' + inr(discount) + ')' });
  }
  if (discrepancy) {
    noteAttributes.unshift({ name: 'Discount Discrepancy',
      value: 'FIRST10 claimed but NOT eligible — billed full price; outstanding ' + inr(orderTotal - chargedNow) });
  }

  // Full payment that covers the (server-legitimate) total is paid; partial-COD
  // or an underpaid discrepancy is partially_paid, leaving the rest outstanding.
  const coversTotal = chargedNow >= orderTotal - 1; // ₹1 rounding tolerance
  const financialStatus = (!isPartial && coversTotal) ? 'paid' : 'partially_paid';

  let tags = 'lerosea-web, razorpay';
  if (isPartial) tags += ', partial-cod';
  if (honour) tags += ', first10';
  if (discrepancy) tags += ', discount-discrepancy';

  const order = {
    email: customer.email || '',
    phone: customer.phone || '',
    line_items: lineItems, // sum of line prices = FULL subtotal; discount_codes below reduces the total
    shipping_address: address,
    billing_address: address,
    financial_status: financialStatus,
    currency: payload.currency || 'INR',
    tags,
    note,
    note_attributes: noteAttributes,
    transactions: [{
      kind: 'sale',
      status: 'success',
      amount: money(chargedNow), // the amount actually captured online via Razorpay
      gateway: 'Razorpay',
      authorization: payment.razorpay_payment_id || payment.razorpay_order_id || '',
    }],
  };

  // Record the honoured discount as an order-level code so Shopify's total_price
  // = subtotal − discount (matching what was charged). fixed_amount is used so
  // the total reconciles to the exact rupee that was captured.
  if (honour) {
    order.discount_codes = [{ code: 'FIRST10', amount: money(discount), type: 'fixed_amount' }];
  }

  return shopifyRequest('/orders.json', {
    method: 'POST',
    body: { order },
  });
}

module.exports = {
  createPaidOrder,
  shopifyRequest,
};
