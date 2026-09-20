// Shared first-order eligibility check for the FIRST10 discount.
//
// Source of truth: the Shopify Admin API. Orders here are created via the Admin
// API AFTER Razorpay payment (not through Shopify's native checkout), so
// Shopify's own "once per customer" discount setting cannot self-enforce in
// this flow - we must check prior orders ourselves. An email is eligible for
// FIRST10 only when it has NO prior order (status=any) in the store.
const { shopifyRequest } = require('./_shopify');

// Returns { eligible, priorOrders }. Throws (with statusCode) when Shopify is
// unreachable/misconfigured so callers can decide how to treat an indeterminate
// result (the safe default everywhere is: do NOT honour the discount).
async function checkFirstOrderEligibility(email) {
  const clean = String(email || '').trim().toLowerCase();
  // No usable email → not eligible (can't prove it's a first order).
  if (!clean || clean.indexOf('@') < 0) {
    return { eligible: false, priorOrders: 0, reason: 'invalid-email' };
  }

  // status=any so closed/cancelled orders also count; limit=1 - we only need to
  // know whether ANY prior order exists for this exact email.
  const path = '/orders.json?status=any&limit=1&fields=id,email&email=' + encodeURIComponent(clean);
  const data = await shopifyRequest(path);
  const orders = Array.isArray(data.orders) ? data.orders : [];
  const priorOrders = orders.length;
  return { eligible: priorOrders === 0, priorOrders };
}

module.exports = { checkFirstOrderEligibility };
