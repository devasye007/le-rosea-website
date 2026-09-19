// GET /api/debug-env-check  — TEMPORARY diagnostic. Remove after confirming.
// Returns ONLY booleans + non-secret names (the RAZORPAY_MODE string and env var
// names). It never returns any secret value. Lets us confirm from the browser
// whether the live deployment actually has the Razorpay vars loaded, and which
// ones the mode-based resolver is actually reading.
const razorpayConfig = require('./_razorpay-config');

module.exports = function handler(req, res) {
  const present = (name) => !!(process.env[name] && String(process.env[name]).trim());
  const cfg = razorpayConfig();

  return res.status(200).json({
    // The two the request asked for — reflect the RESOLVED active keys, i.e.
    // what actually determines whether checkout is "configured".
    razorpayKeyIdPresent: !!(cfg.keyId && String(cfg.keyId).trim()),
    razorpayKeySecretPresent: !!(cfg.keySecret && String(cfg.keySecret).trim()),

    // Extra breakdown (still only booleans + names) to pinpoint a mismatch.
    razorpayMode: cfg.mode,                 // "test" | "live" — not a secret
    activeKeyIdVar: cfg.keyIdVar,           // which env var the resolver read
    activeKeySecretVar: cfg.keySecretVar,
    vars: {
      RAZORPAY_MODE: present('RAZORPAY_MODE'),
      RAZORPAY_KEY_ID: present('RAZORPAY_KEY_ID'),
      RAZORPAY_KEY_SECRET: present('RAZORPAY_KEY_SECRET'),
      RAZORPAY_TEST_KEY_ID: present('RAZORPAY_TEST_KEY_ID'),
      RAZORPAY_TEST_KEY_SECRET: present('RAZORPAY_TEST_KEY_SECRET'),
      RAZORPAY_LIVE_KEY_ID: present('RAZORPAY_LIVE_KEY_ID'),
      RAZORPAY_LIVE_KEY_SECRET: present('RAZORPAY_LIVE_KEY_SECRET'),
      SHOPIFY_STORE_DOMAIN: present('SHOPIFY_STORE_DOMAIN'),
      SHOPIFY_ADMIN_API_ACCESS_TOKEN: present('SHOPIFY_ADMIN_API_ACCESS_TOKEN'),
      SHOPIFY_API_VERSION: present('SHOPIFY_API_VERSION'),
    },
  });
};
