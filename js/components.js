// LE ROSÈA - shared header / footer / cart-drawer injection.
// Kept as plain DOM injection (no fetch()) so the site runs identically
// when opened directly from disk or served from any host.

function currentPage(){
  const p = location.pathname.split('/').pop() || 'index.html';
  return p;
}

const NAV_LINKS = [
  { href: 'index.html', label: 'Home' },
  { href: 'shop.html', label: 'Shop' },
  { href: 'about.html', label: 'About' },
  { href: 'customization.html', label: 'Customization' },
  { href: 'size-guide.html', label: 'Size Guide' },
  { href: 'contact.html', label: 'Contact' },
];

function renderHeader(){
  const el = document.getElementById('site-header');
  if (!el) return;
  const page = currentPage();
  if (page === 'index.html'){
    el.innerHTML = `
      <div class="home-header">
        <div class="home-header-top">
          <a href="shop.html" class="home-icon-link" aria-label="Search the collection">${ICONS.search}</a>
          <a href="index.html" class="logo home-logo">
            <span class="rose-mark hero-emblem" id="heroEmblem">${ICONS.rose}</span>
            LE ROSÈA
          </a>
          <div class="home-header-actions">
            <button class="icon-btn home-icon-btn" aria-label="Account">${ICONS.user}</button>
            <button class="icon-btn home-icon-btn" id="cartToggle" aria-label="Open cart">
              ${ICONS.cart}
            </button>
          </div>
        </div>
        <div class="home-header-nav">
          <a href="shop.html" class="home-collections-toggle">Collections <span>${ICONS.chevron}</span></a>
          <a href="index.html" class="active">Home</a>
          <a href="about.html">The Brand</a>
          <a href="contact.html">Contact Us</a>
          <a href="size-guide.html">Size Chart</a>
        </div>
        <div class="home-collections-panel" aria-label="Collections">
          <div class="home-collections-col">
            <h3>PRET</h3>
            <div class="home-collections-links">
              <a href="shop.html?category=Dresses">Dresses</a>
              <span></span>
              <a href="shop.html?category=Co-ords+%26+Separates">Co-ord Sets</a>
              <span></span>
              <a href="shop.html?collection=Day+%26+Resort">Top</a>
              <span></span>
              <a href="shop.html?collection=Celebration">Skirt</a>
              <span></span>
              <a href="shop.html?category=Gowns">Gowns</a>
            </div>
          </div>
          <div class="home-collections-divider" aria-hidden="true"></div>
          <div class="home-collections-col">
            <h3>COUTURE</h3>
            <div class="home-collections-links">
              <a href="shop.html?category=Dresses">Dresses</a>
              <span></span>
              <a href="shop.html?category=Co-ords+%26+Separates">Co-ord Sets</a>
              <span></span>
              <a href="shop.html?collection=Day+%26+Resort">Top</a>
              <span></span>
              <a href="shop.html?collection=Celebration">Skirt</a>
              <span></span>
              <a href="shop.html?category=Gowns">Gowns</a>
            </div>
          </div>
        </div>
        <div class="home-collections-video" aria-label="Video placeholder">
          <video class="home-collections-video-frame" autoplay muted loop playsinline preload="metadata" poster="assets/runway-hero.png">
            <source src="VIDEO-2026-08-31-12-11-02.mp4" type="video/mp4">
          </video>
        </div>
      </div>
    `;
    document.getElementById('cartToggle')?.addEventListener('click', openCart);
    return;
  }

  const links = NAV_LINKS.map(l =>
    `<a href="${l.href}" class="${page === l.href ? 'active' : ''}">${l.label}</a>`
  ).join('');

  el.innerHTML = `
    <div class="announce-bar">Made-to-order &amp; customization available &middot; Ships across India &amp; internationally</div>
    <div class="header-bar">
      <div class="header-side left">
        <button class="nav-toggle" id="navToggle" aria-label="Open menu" aria-expanded="false">${ICONS.menu}</button>
        <nav class="main-nav" id="mainNav">
          <button class="nav-toggle" id="navClose" aria-label="Close menu" style="align-self:flex-end; display:none;">${ICONS.close}</button>
          ${links}
        </nav>
      </div>
      <a href="index.html" class="logo">
        <span class="rose-mark">${ICONS.rose}</span>
        LE ROSÈA
      </a>
      <div class="header-side right">
        <button class="icon-btn" id="cartToggle" aria-label="Open cart">
          ${ICONS.cart}
          <span class="count" data-cart-count>0</span>
        </button>
      </div>
    </div>
  `;

  const navToggle = document.getElementById('navToggle');
  const navClose = document.getElementById('navClose');
  const mainNav = document.getElementById('mainNav');
  navToggle?.addEventListener('click', () => {
    mainNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navClose.style.display = 'block';
  });
  navClose?.addEventListener('click', () => mainNav.classList.remove('open'));
  document.getElementById('cartToggle')?.addEventListener('click', openCart);
}

function renderFooter(){
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo" style="justify-content:flex-start; color:var(--ivory); margin-bottom:16px;">
          <span class="rose-mark" style="color:var(--gold);">${ICONS.rose}</span>
          LE ROSÈA
        </a>
        <p>Modern femininity, elevated through couture-inspired detail and made for the moments worth remembering.</p>
        <div class="social-row">
          <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noopener">Instagram</a>
          <a href="https://pinterest.com" aria-label="Pinterest" target="_blank" rel="noopener">Pinterest</a>
        </div>
      </div>
      <div>
        <h4>Shop</h4>
        <ul>
          <li><a href="shop.html">New Arrivals</a></li>
          <li><a href="shop.html?category=Dresses">Dresses</a></li>
          <li><a href="shop.html?category=Gowns">Gowns</a></li>
          <li><a href="shop.html?category=Co-ords+%26+Separates">Co-ords &amp; Separates</a></li>
          <li><a href="shop.html?collection=Statement+Pr%C3%AAt-Couture">Statement Prêt-Couture</a></li>
        </ul>
      </div>
      <div>
        <h4>The House</h4>
        <ul>
          <li><a href="about.html">About Le Rosèa</a></li>
          <li><a href="customization.html">Customization</a></li>
          <li><a href="size-guide.html">Size Guide</a></li>
          <li><a href="journal.html">Journal</a></li>
        </ul>
      </div>
      <div>
        <h4>Customer Care</h4>
        <ul>
          <li><a href="contact.html">Contact &amp; Appointments</a></li>
          <li><a href="shipping-returns.html">Shipping &amp; Returns</a></li>
          <li><a href="policies.html">Terms &amp; Privacy</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">
      <span>&copy; 2026 Le Rosèa. All rights reserved.</span>
      <span>Prêt-couture, made to order in India.</span>
    </div>
  `;
}

function renderCartDrawerShell(){
  if (document.getElementById('cartDrawer')) return;
  const overlay = document.createElement('div');
  overlay.className = 'cart-overlay';
  overlay.id = 'cartOverlay';
  overlay.addEventListener('click', closeCart);

  const drawer = document.createElement('aside');
  drawer.className = 'cart-drawer';
  drawer.id = 'cartDrawer';
  drawer.setAttribute('aria-label', 'Shopping bag');
  drawer.innerHTML = `
    <div class="cart-head">
      <h3>Your Bag</h3>
      <button class="cart-close" id="cartClose" aria-label="Close bag">${ICONS.close}</button>
    </div>
    <div class="cart-items" id="cartItems"></div>
    <div class="cart-foot hidden" id="cartFoot">
      <div class="cart-subtotal">
        <span>Subtotal</span>
        <strong id="cartSubtotalValue">₹0</strong>
      </div>
      <p style="font-size:0.75rem; color:var(--taupe); margin-bottom:16px;">Shipping and any customization charges are calculated at checkout.</p>
      <a href="checkout.html" class="btn btn-primary btn-block">Checkout</a>
    </div>
  `;
  document.body.appendChild(overlay);
  document.body.appendChild(drawer);
  document.getElementById('cartClose').addEventListener('click', closeCart);
}

document.addEventListener('DOMContentLoaded', () => {
  renderHeader();
  renderFooter();
  renderCartDrawerShell();
  renderCartDrawer();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeCart(); });
});
