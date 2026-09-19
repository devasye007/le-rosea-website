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
const DEFAULT_LIVE_KEY_ID = 'rzp_live_Tda22Iod0pIk5u';
const DEFAULT_LIVE_KEY_SECRET = 'qX0AmVrW6j143aR1Y3KS4Epc';

module.exports = function razorpayConfig() {
  const mode = (process.env.RAZORPAY_MODE || 'live').trim().toLowerCase();
  if (mode === 'live') {
    const keyId = process.env.RAZORPAY_LIVE_KEY_ID || process.env.RAZORPAY_KEY_ID || DEFAULT_LIVE_KEY_ID;
    const keySecret = process.env.RAZORPAY_LIVE_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET || DEFAULT_LIVE_KEY_SECRET;
    return {
      mode: 'live',
      keyId,
      keySecret,
      keyIdVar: process.env.RAZORPAY_LIVE_KEY_ID ? 'RAZORPAY_LIVE_KEY_ID' : (process.env.RAZORPAY_KEY_ID ? 'RAZORPAY_KEY_ID' : 'DEFAULT_LIVE_KEY_ID'),
      keySecretVar: process.env.RAZORPAY_LIVE_KEY_SECRET ? 'RAZORPAY_LIVE_KEY_SECRET' : (process.env.RAZORPAY_KEY_SECRET ? 'RAZORPAY_KEY_SECRET' : 'DEFAULT_LIVE_KEY_SECRET'),
    };
  }
  // Test mode: prefer RAZORPAY_TEST_KEY_*, fall back to the original
  // RAZORPAY_KEY_* names for backward compatibility.
  return {
    mode: 'test',
    keyId: process.env.RAZORPAY_TEST_KEY_ID || process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_TEST_KEY_SECRET || process.env.RAZORPAY_KEY_SECRET,
    keyIdVar: process.env.RAZORPAY_TEST_KEY_ID ? 'RAZORPAY_TEST_KEY_ID' : 'RAZORPAY_KEY_ID',
    keySecretVar: process.env.RAZORPAY_TEST_KEY_SECRET ? 'RAZORPAY_TEST_KEY_SECRET' : 'RAZORPAY_KEY_SECRET',
  };
};
