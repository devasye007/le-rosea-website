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

function addToCart(productId, size, qty=1){
  const lines = readCart();
  const key = productId + '|' + size;
  const existing = lines.find(l => l.key === key);
  if (existing){ existing.qty += qty; }
  else { lines.push({ key, productId, size, qty }); }
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
  container.innerHTML = lines.map(l => `
    <div class="cart-line">
      ${productImageBlock(l.product)}
      <div class="cart-line-info">
        <span class="name">${l.product.name}</span>
        <span class="meta">Size ${l.size} · ${formatINR(l.product.price)}</span>
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
  `).join('');
  initPlaceholderArt(container);
  const subtotalEl = document.getElementById('cartSubtotalValue');
  if (subtotalEl) subtotalEl.textContent = formatINR(cartSubtotal());
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartCount();
  renderCartDrawer();
});
