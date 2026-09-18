// LE ROSÈA local dev/prod server.
//
// Serves the static site AND the Razorpay backend from ONE origin, so the
// front-end's fetch('/api/...') calls resolve without CORS/proxy issues.
// (`python3 -m http.server` cannot do this — it only serves static files and
// cannot execute the /api handlers.)
//
// The exact same handler files in /api are used here and by Vercel in
// production, so behaviour is identical in both environments.
//
//   Run:  npm start        (loads credentials from .env via dotenv)
//   Then: http://localhost:3000/checkout.html
require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

// Backend API — reuse the Vercel-style handlers verbatim.
app.post('/api/create-order', require('./api/create-order'));
app.post('/api/verify-payment', require('./api/verify-payment'));

// Everything else is the static site (index.html served at /).
app.use(express.static(__dirname, { extensions: ['html'] }));

const razorpayConfig = require('./api/_razorpay-config');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  const cfg = razorpayConfig();
  const loaded = !!(cfg.keyId && cfg.keySecret);
  console.log(`LE ROSÈA running at http://localhost:${PORT}`);
  console.log(`Razorpay mode: ${cfg.mode.toUpperCase()}  |  keys loaded: ${loaded ? 'yes' : 'NO — check .env'}`);
  if (cfg.mode === 'live') {
    console.log('⚠  LIVE mode — real payments will be charged. Do not use test cards.');
  }
});
