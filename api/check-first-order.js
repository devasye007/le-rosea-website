// POST /api/check-first-order   { email }         → { eligible, priorOrders }
// GET  /api/check-first-order?email=...           → { eligible, priorOrders }
//
// Tells the checkout whether an email qualifies for the FIRST10 first-order
// discount. This is advisory for the UI only - the discount is re-verified
// server-side in /api/verify-payment before the Shopify order is created, so a
// tampered or stale client result can never actually grant the discount.
const { checkFirstOrderEligibility } = require('./_first-order');

module.exports = async function handler(req, res) {
  let email;
  if (req.method === 'POST') {
    let body = req.body;
    if (typeof body === 'string') {
      try { body = JSON.parse(body); } catch (_) { body = {}; }
    }
    email = body && body.email;
  } else if (req.method === 'GET') {
    email = req.query && req.query.email;
  } else {
    res.setHeader('Allow', 'POST, GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const result = await checkFirstOrderEligibility(email);
    return res.status(200).json({ eligible: result.eligible, priorOrders: result.priorOrders });
  } catch (err) {
    console.error('[check-first-order]', err && (err.data || err.message || err));
    // Indeterminate - signal ineligible so the UI does NOT apply the discount.
    return res.status(502).json({ error: 'Could not verify eligibility', eligible: false });
  }
};
