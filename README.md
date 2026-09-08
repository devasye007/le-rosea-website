# LE ROSÈA - Website Build

A static, e-commerce-ready front end for LE ROSÈA, built from the brand guidelines,
brand story, website page requirements, and shipping/returns policy you provided.

## How to preview
Unzip and open `index.html` in a browser - no build step or server required.
For local development with routing that behaves closer to production, serve the
folder with any static server, e.g. `python3 -m http.server` from inside it.

## Pages included
Home · Shop (with category/collection/colour/size/price filters) · Product detail
(dynamic, one template for all 16 sample products) · Cart (slide-out drawer, on
every page) · Checkout · About the House · Customization · Size Guide ·
Shipping & Returns (your policy text, verbatim) · Contact · Journal · Terms & Privacy.

## What's real vs. what's a placeholder
- **Design system, copy, structure, cart logic, filtering, and the checkout flow
  are fully functional** - built in plain HTML/CSS/JS, no framework dependency.
- **Product photography is placeholder art** - abstract gold-line motifs in the
  brand palette, generated with SVG, standing in for campaign photography.
  Replace the `.art` divs (see `js/placeholder-art.js`) with real `<img>`/`<picture>`
  tags once you have shoot assets; the layout and aspect ratios are already set.
- **The founder quote on About** uses a `[Founder Name]` placeholder - drop in the
  real name and title.
- **Payments are not live.** The checkout collects shipping details and shows an
  order summary and confirmation, but no money moves. To go live, wire a backend
  that calls Razorpay Orders API or Stripe PaymentIntents, and only show the
  confirmation once that backend confirms payment + persists the order. The exact
  spot to change is marked with a comment above `placeOrder()` in `checkout.html`.
- **Contact details (WhatsApp number, email) are placeholders** in `contact.html`
  and the footer - swap in your real ones.
- Cart state is stored in the browser's `localStorage`, so it's per-device with
  no account system yet.

## Brand system used
Colours, type pairing (Cormorant Garamond + Jost), voice, page architecture and
the shipping/returns copy all follow your v1.1 brand guidelines and requirements
docs directly.
