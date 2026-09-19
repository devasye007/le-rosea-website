// POST /api/create-shopify-order
// Creates a paid Shopify order from a server-verified checkout payload.
// Normal checkout calls this through /api/verify-payment after Razorpay
// signature verification; this route also exists for direct server-side tests.
const { createPaidOrder } = require('./_shopify');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch (_) { body = {}; }
  }

  try {
    const data = await createPaidOrder(body || {});
    return res.status(200).json({
      success: true,
      order: {
        id: data.order && data.order.id,
        name: data.order && data.order.name,
        admin_url: data.order && data.order.admin_graphql_api_id,
      },
    });
  } catch (err) {
    console.error('[create-shopify-order]', err && (err.data || err.message || err));
    return res.status(err.statusCode || 500).json({
      success: false,
      error: err.message || 'Could not create Shopify order',
    });
  }
};
