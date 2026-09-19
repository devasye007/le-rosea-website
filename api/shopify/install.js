// GET /api/shopify/install
// Step 1 of a ONE-TIME Shopify OAuth handshake. Redirects the merchant's
// browser to Shopify's authorize screen. After approval Shopify redirects to
// /api/shopify/callback, which exchanges the code for a PERMANENT Admin API
// access token.
//
// Env required: SHOPIFY_STORE_DOMAIN (e.g. your-store.myshopify.com),
//               SHOPIFY_CLIENT_ID, SHOPIFY_CLIENT_SECRET (used only to sign the
//               short-lived CSRF `state` cookie).
// Env optional: SHOPIFY_REDIRECT_URI — the exact callback URL registered in the
//               Shopify Dev Dashboard. Defaults to https://<this-host>/api/shopify/callback.
const crypto = require('crypto');

const SCOPES = 'write_orders,read_orders,write_customers,read_customers';

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}

function callbackUrl(req) {
  if (process.env.SHOPIFY_REDIRECT_URI) return process.env.SHOPIFY_REDIRECT_URI;
  const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return proto + '://' + host + '/api/shopify/callback';
}

module.exports = function handler(req, res) {
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!storeDomain || !clientId || !clientSecret) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end(
      'Shopify OAuth is not configured. Set SHOPIFY_STORE_DOMAIN (your-store.myshopify.com), ' +
      'SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET in the environment, then redeploy.'
    );
  }

  // Random per-request state, stored in a short-lived signed httpOnly cookie so
  // the callback can verify it (CSRF protection).
  const state = crypto.randomBytes(16).toString('hex');
  const cookieVal = state + '.' + sign(state, clientSecret);
  const redirectUri = callbackUrl(req);

  const authorizeUrl = 'https://' + storeDomain + '/admin/oauth/authorize'
    + '?client_id=' + encodeURIComponent(clientId)
    + '&scope=' + encodeURIComponent(SCOPES)
    + '&redirect_uri=' + encodeURIComponent(redirectUri)
    + '&state=' + encodeURIComponent(state);

  // SameSite=Lax so the cookie survives the top-level GET redirect back from
  // Shopify; Secure because the deploy is HTTPS; short Max-Age (10 min).
  const cookie = 'shopify_oauth_state=' + cookieVal
    + '; Max-Age=600; Path=/; HttpOnly; Secure; SameSite=Lax';

  res.writeHead(302, { 'Location': authorizeUrl, 'Set-Cookie': cookie });
  res.end();
};
