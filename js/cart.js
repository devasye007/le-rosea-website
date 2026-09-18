// LE ROSÈA - client-side cart (localStorage-backed).
// NOTE: this manages cart state and checkout UI only. Wiring a live payment
// gateway (Razorpay/Stripe) and order persistence requires a backend - see
// the comment above `placeOrder()` in checkout.html.

const CART_KEY = 'lerosea_cart_v1';

function readCart(){
  try{
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  }catch(e){ return []; }
}
function writeCart(lines){
  localStorage.setItem(CART_KEY, JSON.stringify(lines));
  updateCartCount();
}

// opts: { color, customMeasurements:{height,bust,waist,hip} }
// Two lines only merge when product + size + colour + custom measurements all
// match, so different colours (or different custom measurements) of the same
// piece/size stay as separate cart lines.
function addToCart(productId, size, qty=1, opts={}){
  const lines = readCart();
  const color = opts.color || null;
  const custom = (size === 'Custom' && opts.customMeasurements) ? opts.customMeasurements : null;
  const customSig = custom ? [custom.height, custom.bust, custom.waist, custom.hip].join('x') : '';
  const key = [productId, size, color || '', customSig].join('|');
  const existing = lines.find(l => l.key === key);
  if (existing){ existing.qty += qty; }
  else {
    const line = { key, productId, size, qty };
    if (color) line.color = color;
    if (custom) line.customMeasurements = custom;
    lines.push(line);
  }
  writeCart(lines);
  renderCartDrawer();
  openCart();
}

function updateLineQty(key, qty){
  let lines = readCart();
  if (qty <= 0){ lines = lines.filter(l => l.key !== key); }
  else{
    const line = lines.find(l => l.key === key);
    if (line) line.qty = qty;
  }
  writeCart(lines);
  renderCartDrawer();
}

function removeLine(key){
  const lines = readCart().filter(l => l.key !== key);
  writeCart(lines);
  renderCartDrawer();
}

function cartCount(){
  return readCart().reduce((sum, l) => sum + l.qty, 0);
}

function cartLinesWithData(){
  return readCart().map(l => ({ ...l, product: getProductById(l.productId) })).filter(l => l.product);
}

// A product view whose images/colourway reflect the line's chosen colour, so
// cart/checkout thumbnails show the right variant.
function lineProductView(line){
  const p = line.product;
  if (line.color && p.colors){
    const imgs = (typeof colorImages === 'function') ? colorImages(p, line.color) : p.images;
    // Drop cardImage so the thumbnail shows the chosen colour, not the group shot.
    const { cardImage, ...rest } = p;
    return { ...rest, images: imgs, colorway: line.color };
  }
  return p;
}

// "Size M · Sea Green" — colour appended only when the line carries one.
function lineMetaLabel(line){
  let label = 'Size ' + line.size;
  if (line.color) label += ' · ' + line.color;
  return label;
}

// Formatted custom measurements, or '' when the line isn't a custom order.
function lineMeasurementsLabel(line){
  const m = line.customMeasurements;
  if (line.size !== 'Custom' || !m) return '';
  return 'Height ' + m.height + ' · Bust ' + m.bust + ' · Waist ' + m.waist + ' · Hip ' + m.hip + ' (cm)';
}

function cartSubtotal(){
  return cartLinesWithData().reduce((sum, l) => sum + l.product.price * l.qty, 0);
}

function updateCartCount(){
  document.querySelectorAll('[data-cart-count]').forEach(el => {
    const n = cartCount();
    el.textContent = n;
    el.style.display = n > 0 ? 'inline-flex' : 'none';
  });
}

function openCart(){
  document.getElementById('cartOverlay')?.classList.add('open');
  document.getElementById('cartDrawer')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart(){
  document.getElementById('cartOverlay')?.classList.remove('open');
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.body.style.overflow = '';
}

function renderCartDrawer(){
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFoot');
  if (!container) return;
  const lines = cartLinesWithData();
  if (lines.length === 0){
    container.innerHTML = `<div class="cart-empty">
      <p style="font-family:var(--serif); font-size:1.2rem; margin-bottom:8px;">Your bag is empty</p>
      <p style="font-size:0.85rem;">Pieces you add will appear here.</p>
      <a href="shop.html" class="btn btn-sm" style="margin-top:14px;">Browse the collection</a>
    </div>`;
    if (footer) footer.classList.add('hidden');
    return;
  }
  if (footer) footer.classList.remove('hidden');
  container.innerHTML = lines.map(l => {
    const measure = lineMeasurementsLabel(l);
    return `
    <div class="cart-line">
      ${productImageBlock(lineProductView(l))}
      <div class="cart-line-info">
        <span class="name">${l.product.name}</span>
        <span class="meta">${escapeHtml(lineMetaLabel(l))} · ${formatINR(l.product.price)}</span>
        ${measure ? `<span class="meta cart-line-measure">${escapeHtml(measure)}</span>` : ''}
        <div class="row">
          <div class="qty-control">
            <button aria-label="Decrease quantity" onclick="updateLineQty('${l.key}', ${l.qty - 1})">−</button>
            <span>${l.qty}</span>
            <button aria-label="Increase quantity" onclick="updateLineQty('${l.key}', ${l.qty + 1})">+</button>
          </div>
          <button class="remove" onclick="removeLine('${l.key}')">Remove</button>
        </div>
      </div>
    </div>
  `;}).join('');
  initPlaceholderArt(container);
  const subtotalEl = document.getElementById('cartSubtotalValue');
  if (subtotalEl) subtotalEl.textContent = formatINR(cartSubtotal());
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartDrawer();
});
