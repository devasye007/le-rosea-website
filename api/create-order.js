// POST /api/create-order
// Creates a Razorpay order server-side using the active (test|live) credentials
// resolved by _razorpay-config. The secret never leaves the server. Returns the
// order plus the publishable key_id so the static front-end can open Checkout
// without embedding any credential in the page.
const Razorpay = require('razorpay');
const razorpayConfig = require('./_razorpay-config');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keyId, keySecret } = razorpayConfig();
  if (!keyId || !keySecret) {
    return res.status(500).json({ error: 'Payment gateway is not configured' });
  }

  // Vercel usually parses JSON bodies; fall back to manual parsing just in case.
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const amount = Math.round(Number(body.amount));
  const currency = body.currency || 'INR';
  const receipt = body.receipt || ('rcpt_' + Date.now());
  // Optional contact/shipping details, stored on the Razorpay order for records.
  const notes = (body.notes && typeof body.notes === 'object') ? body.notes : undefined;

  // Razorpay requires a minimum of 100 paise (₹1).
  if (!Number.isFinite(amount) || amount < 100) {
    return res.status(400).json({ error: 'Amount must be at least 100 paise' });
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

  try {
    const order = await razorpay.orders.create({ amount, currency, receipt, notes });
    return res.status(200).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: keyId, // publishable — safe to expose to the browser
    });
  } catch (err) {
    // Bad/expired keys → surface as an auth failure; everything else → 500.
    if (err && err.statusCode === 401) {
      return res.status(401).json({ error: 'Payment gateway authentication failed' });
    }
    const description = err && err.error && err.error.description;
    return res.status(500).json({ error: description || 'Could not create order' });
  }
};
