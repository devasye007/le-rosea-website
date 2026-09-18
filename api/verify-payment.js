// POST /api/verify-payment
// Verifies the Razorpay payment signature server-side. The signature is
// HMAC-SHA256(razorpay_order_id + "|" + razorpay_payment_id) keyed with the
// active KEY_SECRET (test|live, from _razorpay-config). The order is only ever
// treated as paid when the generated signature matches the one Razorpay
// returned to the browser.
const crypto = require('crypto');
const razorpayConfig = require('./_razorpay-config');

module.exports = function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { keySecret } = razorpayConfig();
  if (!keySecret) {
    return res.status(500).json({ error: 'Payment gateway is not configured' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }
  body = body || {};

  const orderId = body.razorpay_order_id;
  const paymentId = body.razorpay_payment_id;
  const signature = body.razorpay_signature;

  if (!orderId || !paymentId || !signature) {
    return res.status(400).json({ success: false, error: 'Missing payment verification fields' });
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(orderId + '|' + paymentId)
    .digest('hex');

  // Constant-time comparison; guard length first (timingSafeEqual throws on
  // unequal-length buffers).
  const expectedBuf = Buffer.from(expected);
  const signatureBuf = Buffer.from(String(signature));
  const valid = expectedBuf.length === signatureBuf.length &&
    crypto.timingSafeEqual(expectedBuf, signatureBuf);

  if (!valid) {
    return res.status(400).json({ success: false, error: 'Signature verification failed' });
  }

  // Signature valid — this is where you would persist / fulfil the order.
  return res.status(200).json({ success: true, order_id: orderId, payment_id: paymentId });
};
