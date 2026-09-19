// GET /api/shopify/callback
// Step 2 of the ONE-TIME Shopify OAuth handshake. Shopify redirects here after
// approval with ?code&shop&state (&hmac&timestamp&host). This function:
//   1. Verifies `state` matches the signed cookie set by install.js (CSRF).
//   2. Validates `shop` is a real *.myshopify.com host (prevents SSRF).
//   3. POSTs code + client_id + client_secret to Shopify's access_token endpoint
//      WITHOUT an `expiring` param → a PERMANENT (non-expiring) Admin token.
//   4. Shows the access_token ONCE (and logs it once) so it can be pasted into
//      the SHOPIFY_ADMIN_API_ACCESS_TOKEN env var. Nothing is persisted.
const crypto = require('crypto');

function sign(value, secret) {
  return crypto.createHmac('sha256', secret).update(value).digest('hex');
}
function safeEqual(a, b) {
  const ab = Buffer.from(String(a));
  const bb = Buffer.from(String(b));
  return ab.length === bb.length && crypto.timingSafeEqual(ab, bb);
}
function readCookie(req, name) {
  const raw = req.headers.cookie || '';
  const hit = raw.split(';').map(s => s.trim()).find(s => s.startsWith(name + '='));
  return hit ? decodeURIComponent(hit.slice(name.length + 1)) : null;
}
function esc(s) {
  return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}
function page(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'text/html; charset=utf-8',
    // Always clear the one-time state cookie.
    'Set-Cookie': 'shopify_oauth_state=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Lax',
  });
  res.end(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<body style="font-family:system-ui,-apple-system,sans-serif;max-width:680px;margin:40px auto;padding:0 20px;line-height:1.55;color:#1a1a1a">' +
    body + '</body>'
  );
}

module.exports = async function handler(req, res) {
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return page(res, 500, '<h1>Not configured</h1><p>Set SHOPIFY_CLIENT_ID and SHOPIFY_CLIENT_SECRET, then redeploy.</p>');
  }

  const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
  const code = q.code;
  const shop = q.shop;
  const state = q.state;

  // 1) CSRF: state must match the signed cookie from install.js
  const cookie = readCookie(req, 'shopify_oauth_state');
  if (!state || !cookie) {
    return page(res, 400, '<h1>Missing state</h1><p>Start again from <code>/api/shopify/install</code>.</p>');
  }
  const dot = cookie.indexOf('.');
  const cookieState = dot >= 0 ? cookie.slice(0, dot) : '';
  const cookieSig = dot >= 0 ? cookie.slice(dot + 1) : '';
  if (!safeEqual(cookieState, state) || !safeEqual(cookieSig, sign(state, clientSecret))) {
    return page(res, 403, '<h1>State mismatch</h1><p>Possible CSRF — request rejected. Start again from <code>/api/shopify/install</code>.</p>');
  }

  // 2) Validate shop host (prevents pointing the token exchange at a rogue host)
  if (!shop || !/^[a-zA-Z0-9][a-zA-Z0-9-]*\.myshopify\.com$/.test(shop)) {
    return page(res, 400, '<h1>Invalid shop</h1><p>The <code>shop</code> parameter is missing or not a valid myshopify.com domain.</p>');
  }
  if (!code) {
    return page(res, 400, '<h1>Missing code</h1><p>No authorization code was returned by Shopify.</p>');
  }

  // 3) Exchange the code for a PERMANENT token — no `expiring` param is sent.
  let data;
  try {
    const r = await fetch('https://' + shop + '/admin/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code: code }),
    });
    data = await r.json().catch(() => ({}));
    if (!r.ok) {
      return page(res, 502, '<h1>Token exchange failed</h1><p>Shopify returned HTTP ' + r.status + '.</p><pre>' + esc(JSON.stringify(data, null, 2)) + '</pre>');
    }
  } catch (e) {
    return page(res, 502, '<h1>Token exchange error</h1><p>' + esc(e.message) + '</p>');
  }

  const token = data.access_token || '';
  const scope = data.scope || '';
  const permanent = !('expires_in' in data); // permanent tokens carry no expires_in

  // 4) Log once (Vercel function logs) as a backup, and show once in the page.
  //    Not written to any file or database.
  console.log('[shopify-oauth] shop=' + shop + ' permanent=' + permanent + ' scope=' + scope + ' access_token=' + token);

  return page(res, 200,
    '<h1>Shopify connected ✓</h1>' +
    '<p><strong>' +
      (permanent
        ? 'Permanent token — no expiry (no <code>expires_in</code> returned) ✓'
        : '⚠ The response included <code>expires_in</code>, so this token is NOT permanent. Re-run the install without requesting an online/expiring token.') +
    '</strong></p>' +
    '<p>Copy this value into your Vercel env var <code>SHOPIFY_ADMIN_API_ACCESS_TOKEN</code> now. It is shown <strong>once</strong> and is not stored anywhere:</p>' +
    '<pre style="background:#f4f1e9;padding:16px;border-radius:8px;white-space:pre-wrap;word-break:break-all;font-size:15px"><strong>' + esc(token || '(no token returned)') + '</strong></pre>' +
    '<p>Granted scopes: <code>' + esc(scope) + '</code></p>' +
    '<hr style="margin:24px 0;border:none;border-top:1px solid #ddd">' +
    '<p style="color:#555;font-size:14px">After saving it and redeploying, this handshake is complete. <code>SHOPIFY_CLIENT_SECRET</code> is only needed for this one-time exchange — you can remove <code>SHOPIFY_CLIENT_ID</code> / <code>SHOPIFY_CLIENT_SECRET</code> from the runtime env afterwards if you want to minimise stored secrets. If you ever need a fresh token, start over from <code>/api/shopify/install</code>.</p>'
  );
};
