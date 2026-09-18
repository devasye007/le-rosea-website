// Resolves the ACTIVE Razorpay credentials from the environment.
//
// RAZORPAY_MODE selects the key set:
//   "test" (default) → RAZORPAY_TEST_KEY_ID / RAZORPAY_TEST_KEY_SECRET  (no real money)
//   "live"           → RAZORPAY_LIVE_KEY_ID / RAZORPAY_LIVE_KEY_SECRET  (REAL money)
//
// Keeping both key sets side by side means local dev can stay on test while
// production runs on live by setting a single env var — and the KEY_SECRET
// never leaves the server in either mode.
//
// The filename is underscore-prefixed so Vercel does NOT expose it as a
// routable /api endpoint; it's a shared module, required by the handlers.
module.exports = function razorpayConfig() {
  const mode = (process.env.RAZORPAY_MODE || 'test').trim().toLowerCase();
  if (mode === 'live') {
    return {
      mode: 'live',
      keyId: process.env.RAZORPAY_LIVE_KEY_ID,
      keySecret: process.env.RAZORPAY_LIVE_KEY_SECRET,
    };
  }
  return {
    mode: 'test',
    // Fall back to the original RAZORPAY_KEY_* names for backward compatibility.
    keyId: process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET,
  };
};
