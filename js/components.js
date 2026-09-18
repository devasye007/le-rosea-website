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
          <button type="button" class="home-icon-link header-search-btn" id="homeSearchToggle" aria-label="Search the collection">${ICONS.search}</button>
          <a href="index.html" class="logo home-logo">
            <img class="logo-img" src="assets/logo.png" alt="">
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
              <a href="shop.html?category=Top">Top</a>
              <span></span>
              <a href="shop.html?category=Skirt">Skirt</a>
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
              <a href="shop.html?category=Top">Top</a>
              <span></span>
              <a href="shop.html?category=Skirt">Skirt</a>
              <span></span>
              <a href="shop.html?category=Gowns">Gowns</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.getElementById('cartToggle')?.addEventListener('click', openCart);
    document.getElementById('homeSearchToggle')?.addEventListener('click', openSearch);
    setupCollectionsAccordion();
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
        <img class="logo-img" src="assets/logo.png" alt="">
        LE ROSÈA
      </a>
      <div class="header-side right">
        <button class="icon-btn header-search-btn" id="searchToggle" aria-label="Search the collection">${ICONS.search}</button>
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
  document.getElementById('searchToggle')?.addEventListener('click', openSearch);
}

// ---- Header search overlay: translucent panel with live name filtering ----
function renderSearchOverlay(){
  if (document.getElementById('searchOverlay')) return;
  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.id = 'searchOverlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="search-panel" role="dialog" aria-modal="true" aria-label="Search products">
      <div class="search-bar">
        <span class="search-ico" aria-hidden="true">${ICONS.search}</span>
        <input type="text" id="searchInput" placeholder="Search pieces&hellip;" autocomplete="off" aria-label="Search pieces">
        <button type="button" class="search-close" id="searchClose" aria-label="Close search">${ICONS.close}</button>
      </div>
      <div class="search-results" id="searchResults"></div>
    </div>`;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeSearch(); });
  document.getElementById('searchClose').addEventListener('click', closeSearch);
  document.getElementById('searchInput').addEventListener('input', (e) => runSearch(e.target.value));
}

function openSearch(){
  const overlay = document.getElementById('searchOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  const input = document.getElementById('searchInput');
  if (input){ input.value = ''; runSearch(''); requestAnimationFrame(() => input.focus()); }
}

function closeSearch(){
  const overlay = document.getElementById('searchOverlay');
  if (!overlay || !overlay.classList.contains('open')) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const input = document.getElementById('searchInput');
  if (input) input.value = '';
  const box = document.getElementById('searchResults');
  if (box) box.innerHTML = '';
}

function runSearch(q){
  const box = document.getElementById('searchResults');
  if (!box) return;
  q = (q || '').trim().toLowerCase();
  if (!q){ box.innerHTML = ''; return; }
  const pool = (typeof PRODUCTS !== 'undefined') ? PRODUCTS : [];
  const matches = pool.filter(p => p.name.toLowerCase().includes(q)).slice(0, 8);
  if (!matches.length){
    box.innerHTML = `<p class="search-empty">No pieces match &ldquo;${escapeHtml(q)}&rdquo;.</p>`;
    return;
  }
  box.innerHTML = matches.map(p => `
    <a class="search-result" href="product.html?id=${p.id}">
      <span class="search-result-name">${escapeHtml(p.name)}</span>
      <span class="search-result-meta">${escapeHtml(p.category)} &middot; ${formatINR(p.price)}</span>
    </a>`).join('');
}

// On mobile the persistent collections mega-menu becomes a tap accordion
// (hidden by default, expands on tapping "Collections") instead of a wide
// always-open dropdown. On desktop it stays persistent and the toggle links out.
function setupCollectionsAccordion(){
  const toggle = document.querySelector('.home-collections-toggle');
  const panel = document.querySelector('.home-collections-panel');
  if (!toggle || !panel) return;
  const mq = window.matchMedia('(max-width: 980px)');
  const applyMode = () => {
    if (mq.matches){
      panel.classList.add('is-collapsible');
      toggle.setAttribute('aria-expanded', panel.classList.contains('is-open') ? 'true' : 'false');
    } else {
      panel.classList.remove('is-collapsible', 'is-open');
      toggle.removeAttribute('aria-expanded');
    }
  };
  applyMode();
  mq.addEventListener('change', applyMode);
  toggle.addEventListener('click', (e) => {
    if (!mq.matches) return; // desktop: follow the link to the shop
    e.preventDefault();
    const open = panel.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
}

function renderFooter(){
  const el = document.getElementById('site-footer');
  if (!el) return;
  el.innerHTML = `
    <div class="footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo" style="justify-content:flex-start; color:var(--espresso); margin-bottom:16px;">
          <img class="logo-img" src="assets/logo.png" alt="">
          LE ROSÈA
        </a>
        <p>Modern femininity, elevated through couture-inspired detail and made for the moments worth remembering.</p>
        <div class="social-row">
          <a href="https://instagram.com/le.rosea" aria-label="Instagram" target="_blank" rel="noopener">Instagram</a>
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
        </ul>
      </div>
      <div>
        <h4>Customer Care</h4>
        <ul>
          <li><a href="contact.html">Contact &amp; Appointments</a></li>
          <li><a href="appointment.html">Book an Atelier Appointment</a></li>
          <li><a href="shipping-returns.html">Shipping &amp; Returns</a></li>
          <li><a href="policies.html">Terms &amp; Privacy</a></li>
        </ul>
        <h4 style="margin-top:22px;">Get in Touch</h4>
        <ul>
          <li><a href="tel:+919599428824">+91 95994 28824</a></li>
          <li><a href="mailto:office@lerosea.com">office@lerosea.com</a></li>
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

// Use the real rose logo as the favicon (recognisable at small size).
function setFavicon(){
  if (document.querySelector('link[rel="icon"]')) return;
  const link = document.createElement('link');
  link.rel = 'icon';
  link.type = 'image/png';
  link.href = 'assets/logo.png';
  document.head.appendChild(link);
}

document.addEventListener('DOMContentLoaded', () => {
  setFavicon();
  renderHeader();
  renderFooter();
  renderCartDrawerShell();
  renderCartDrawer();
  renderSearchOverlay();
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape'){ closeCart(); closeSearch(); } });
});
