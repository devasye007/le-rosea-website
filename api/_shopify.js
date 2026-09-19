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

  const order = {
    email: customer.email || '',
    phone: customer.phone || '',
    line_items: lineItems,
    shipping_address: address,
    billing_address: address,
    financial_status: 'paid',
    currency: payload.currency || 'INR',
    tags: 'lerosea-web, razorpay',
    note: 'Paid through Razorpay on lerosea.com',
    note_attributes: [
      { name: 'Razorpay Order ID', value: payment.razorpay_order_id || '' },
      { name: 'Razorpay Payment ID', value: payment.razorpay_payment_id || '' },
    ],
    transactions: [{
      kind: 'sale',
      status: 'success',
      amount: money(payload.total),
      gateway: 'Razorpay',
      authorization: payment.razorpay_payment_id || payment.razorpay_order_id || '',
    }],
  };

  return shopifyRequest('/orders.json', {
    method: 'POST',
    body: { order },
  });
}

module.exports = {
  createPaidOrder,
  shopifyRequest,
};
