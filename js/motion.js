// LE ROSÈA - shared motion layer.
// One observer, one parallax loop, and a small hero emblem draw-in.

(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealObserver = reducedMotion ? null : new IntersectionObserver(onReveal, {
    threshold: 0.15,
  });
  const revealSeen = new WeakSet();
  const parallaxSeen = new WeakSet();
  const parallaxItems = [];
  let parallaxMeasureQueued = false;
  let parallaxUpdateQueued = false;

  // anime.js is optional progressive enhancement: a few signature, non-parallaxed
  // elements per page (section/page headers) get a richer one-shot reveal when
  // it's available; everything else keeps the cheap CSS-transition reveal below.
  // We deliberately never drive many or looping targets with it, so it stays
  // buttery on low-end phones/tablets. Captured at init() so script order can't
  // matter.
  let anime = null;
  let useAnime = false;
  const fxTargets = new Map();  // el -> preset, for anime-driven reveals

  function onReveal(entries){
    for (const entry of entries){
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      revealObserver.unobserve(el);
      // anime-driven signature elements take the richer path; everything else
      // uses the cheap CSS transition.
      const preset = fxTargets.get(el);
      if (preset){ fxTargets.delete(el); playFx(el, preset); continue; }
      // Promote to its own layer only for the duration of the reveal, then
      // release it - otherwise dozens of revealed cards each keep a permanent
      // GPU layer, which bloats memory and makes scrolling stutter.
      el.style.willChange = 'opacity, transform';
      el.classList.add('is-visible');
      const delay = parseFloat(el.style.transitionDelay) || 0;
      setTimeout(() => { el.style.willChange = 'auto'; }, delay + 750);
    }
  }

  function registerReveal(el, delay = 0){
    if (!revealObserver || !el || revealSeen.has(el)) return;
    revealSeen.add(el);
    el.classList.add('motion-reveal');
    el.style.setProperty('--motion-delay', `${delay}ms`);
    el.style.transitionDelay = `${delay}ms`;
    revealObserver.observe(el);
  }

  function clearRevealDelay(el){
    el.style.removeProperty('--motion-delay');
    el.style.transitionDelay = '';
  }

  // Register an element for an anime.js one-shot reveal (opacity + transform
  // only - compositor-cheap, no layout/paint work). Returns false when anime is
  // unavailable so the caller can fall back to the CSS reveal. We hide only with
  // opacity (never display/height) so nothing reflows. Never call this on a
  // parallaxed element (its inline transform would fight the parallax loop).
  function registerFx(el, preset){
    if (!useAnime || !el || revealSeen.has(el)) return false;
    revealSeen.add(el);
    fxTargets.set(el, preset);
    // Hide with opacity only (no layer, no reflow) until it scrolls in.
    const parts = preset === 'children' ? Array.from(el.children) : [el];
    parts.forEach(p => { p.style.opacity = '0'; });
    revealObserver.observe(el);
    return true;
  }

  function playFx(el, preset){
    const parts = preset === 'children' ? Array.from(el.children) : [el];
    // Promote just these few elements for the ~0.7s reveal, then release.
    parts.forEach(p => { p.style.willChange = 'opacity, transform'; });
    anime({
      targets: parts,
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 720,
      delay: preset === 'children' ? anime.stagger(90) : 0,
      easing: 'easeOutQuad',
      complete(){ parts.forEach(p => { p.style.willChange = 'auto'; }); },
    });
  }

  function observeSiblings(parent, selector, includeSelf = false){
    if (!parent) return;
    const items = includeSelf && parent.matches?.(selector)
      ? [parent]
      : Array.from(parent.children).filter(child => child.matches?.(selector));
    // Cap the stagger so a large grid doesn't cascade in over a second+ (which
    // reads as "cards loading slowly"); the first few keep a gentle stagger.
    items.forEach((item, index) => registerReveal(item, Math.min(index, 8) * 55));
  }

  function registerParallax(el){
    if (!el || parallaxSeen.has(el)) return;
    parallaxSeen.add(el);
    parallaxItems.push({
      el,
      depth: el.classList.contains('hero-art') ? 25 : 15 + (parallaxItems.length % 3) * 5,
      centerY: 0,
    });
    el.style.setProperty('--parallax-y', '0px');
  }

  function refreshParallaxCenters(){
    if (reducedMotion) return;
    const scrollY = window.scrollY || window.pageYOffset || 0;
    parallaxItems.forEach(item => {
      const rect = item.el.getBoundingClientRect();
      item.centerY = rect.top + scrollY + rect.height / 2;
    });
  }

  function updateParallax(){
    if (reducedMotion || !parallaxItems.length) return;
    const viewportMid = (window.scrollY || window.pageYOffset || 0) + window.innerHeight / 2;
    parallaxItems.forEach(item => {
      const drift = (viewportMid - item.centerY) * 0.04;
      const value = Math.max(-item.depth, Math.min(item.depth, drift));
      item.el.style.setProperty('--parallax-y', `${value.toFixed(1)}px`);
    });
  }

  function queueParallaxUpdate(){
    if (parallaxUpdateQueued || reducedMotion) return;
    parallaxUpdateQueued = true;
    requestAnimationFrame(() => {
      parallaxUpdateQueued = false;
      updateParallax();
    });
  }

  function queueParallaxMeasure(){
    if (parallaxMeasureQueued || reducedMotion) return;
    parallaxMeasureQueued = true;
    requestAnimationFrame(() => {
      parallaxMeasureQueued = false;
      refreshParallaxCenters();
      queueParallaxUpdate();
    });
  }

  function setupHeroEmblem(){
    const emblem = document.getElementById('heroEmblem');
    if (!emblem || emblem.dataset.motionReady === '1') return;
    emblem.dataset.motionReady = '1';

    const svg = emblem.querySelector('svg');
    if (!svg){
      emblem.classList.add('is-ready');
      return;
    }

    const paths = Array.from(svg.querySelectorAll('path'));
    if (!paths.length){
      emblem.classList.add('is-ready');
      return;
    }

    if (reducedMotion){
      paths.forEach(path => {
        path.style.strokeDasharray = 'none';
        path.style.strokeDashoffset = '0';
      });
      emblem.classList.add('is-ready');
      return;
    }

    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    emblem.classList.add('is-ready');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        paths.forEach(path => {
          path.style.strokeDashoffset = '0';
        });
      });
    });
  }

  function disableAutoplayVideo(){
    document.querySelectorAll('video[autoplay]').forEach(video => {
      try { video.pause(); } catch (_) {}
      video.removeAttribute('autoplay');
    });
  }

  // Only decode video that is actually on screen. Looping background videos
  // decoding off-screen are a major scroll-jank source, so pause them the
  // moment they leave the viewport and resume when they return.
  const videoSeen = new WeakSet();
  let videoObserver = null;
  function setupVideoVisibility(root = document){
    if (reducedMotion) return;
    if (!videoObserver){
      videoObserver = new IntersectionObserver(entries => {
        for (const e of entries){
          const v = e.target;
          if (e.isIntersecting){ const p = v.play(); if (p && p.catch) p.catch(() => {}); }
          else { try { v.pause(); } catch (_) {} }
        }
      }, { threshold: 0.05 });
    }
    const vids = (root instanceof Element && root.matches?.('video[autoplay]'))
      ? [root]
      : Array.from(root.querySelectorAll?.('video[autoplay]') || []);
    vids.forEach(v => { if (!videoSeen.has(v)){ videoSeen.add(v); videoObserver.observe(v); } });
  }

  // ---- Hover-to-play product card video -----------------------------------
  // When the cursor dwells on a garment card for 1.2s, its runway clip plays
  // inside the card; it stops and is torn down the instant the cursor leaves.
  // Gated to devices with a real hovering pointer (skipped on touch phones), and
  // only the hovered card's clip is ever loaded/decoded - so it costs nothing on
  // mobile and stays light on desktop/tablet. No autoplay attribute, so these
  // are never picked up by setupVideoVisibility.
  const HOVER_DELAY = 1200; // ms the cursor must rest on the card first
  const canHoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const cardHoverSeen = new WeakSet();

  function cardVideoUrl(card){
    const href = card.getAttribute('href') || '';
    const q = href.indexOf('?');
    if (q < 0) return '';
    let id = '';
    try { id = new URLSearchParams(href.slice(q + 1)).get('id') || ''; } catch (_) {}
    if (!id || typeof getProductById !== 'function') return '';
    const p = getProductById(id);
    return (p && p.video) ? p.video : '';
  }

  function wireCardHover(card){
    if (cardHoverSeen.has(card)) return;
    const url = cardVideoUrl(card);
    if (!url) return;                    // no clip for this piece - leave the still
    cardHoverSeen.add(card);
    const media = card.querySelector('.art');
    if (!media) return;

    let dwellTimer = null;
    let video = null;

    function teardown(){
      clearTimeout(dwellTimer); dwellTimer = null;
      if (!video) return;
      const v = video; video = null;
      v.classList.remove('is-playing');
      try { v.pause(); } catch (_) {}
      // Let the fade-out finish, then free the decoder + element.
      setTimeout(() => { try { v.removeAttribute('src'); v.load(); } catch (_) {} v.remove(); }, 260);
    }

    function startVideo(){
      if (video) return;
      video = document.createElement('video');
      video.className = 'card-hover-video';
      video.muted = true; video.loop = true; video.playsInline = true;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
      video.preload = 'auto';
      video.src = (typeof assetPath === 'function') ? assetPath(url) : url;
      video.addEventListener('playing', () => { if (video) video.classList.add('is-playing'); }, { once: true });
      video.addEventListener('error', teardown, { once: true });
      media.appendChild(video);
      const pr = video.play();
      if (pr && pr.catch) pr.catch(() => {});
    }

    card.addEventListener('pointerenter', (e) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return; // ignore touch taps
      clearTimeout(dwellTimer);
      dwellTimer = setTimeout(startVideo, HOVER_DELAY);
    });
    card.addEventListener('pointerleave', teardown);
  }

  function setupCardHover(root){
    if (!canHoverPointer) return;
    const cards = (root instanceof Element && root.matches?.('.product-card'))
      ? [root]
      : Array.from(root.querySelectorAll?.('.product-card') || []);
    cards.forEach(wireCardHover);
  }

  function scan(root = document){
    if (reducedMotion) {
      setupHeroEmblem();
      disableAutoplayVideo();
      return;
    }

    if (!(root instanceof Element) && root !== document) return;

    // Section/page headers are the signature anime moment on every page; they
    // are never parallaxed, so this can't fight the parallax loop. Falls back to
    // the CSS reveal when anime.js isn't available.
    const sectionHeads = root.querySelectorAll?.('.section-head') || [];
    sectionHeads.forEach(el => { if (!registerFx(el, 'children')) registerReveal(el); });

    const standalone = ['.split', '.home-collections-panel'];
    standalone.forEach(selector => {
      if (root.matches?.(selector)) registerReveal(root);
      root.querySelectorAll?.(selector).forEach(el => registerReveal(el));
    });

    const groupSelectors = [
      ['.product-grid', '.product-card'],
      ['.scroll-row', '.product-card'],
      ['.cat-grid', '.cat-tile'],
      ['.journal-grid', '.journal-card'],
      ['.checkout-grid', '.checkout-card'],
      ['.feature-grid', '.feature-card'],
    ];
    groupSelectors.forEach(([parentSelector, childSelector]) => {
      if (root.matches?.(parentSelector)) observeSiblings(root, childSelector);
      root.querySelectorAll?.(parentSelector).forEach(parent => observeSiblings(parent, childSelector));
    });

    const parallaxTargets = ['.hero-art', '.art.tall'];
    parallaxTargets.forEach(selector => {
      if (root.matches?.(selector)) registerParallax(root);
      root.querySelectorAll?.(selector).forEach(registerParallax);
    });

    if (root.matches?.('#heroEmblem')) setupHeroEmblem();
    root.querySelectorAll?.('#heroEmblem').forEach(setupHeroEmblem);

    setupVideoVisibility(root);
    setupCardHover(root);
    queueParallaxMeasure();
  }

  // Coalesce DOM mutations: instead of scanning (and forcing a layout reflow)
  // once per mutation record, collect the unique roots that changed and scan
  // them all in a single rAF batch. This keeps card-heavy pages from thrashing
  // layout as their grids are populated.
  let scanQueued = false;
  const pendingScan = new Set();
  function flushScans(){
    scanQueued = false;
    const roots = Array.from(pendingScan);
    pendingScan.clear();
    for (const node of roots){
      if (node.isConnected) scan(node);
    }
    queueParallaxMeasure();
  }
  function queueScan(node){
    pendingScan.add(node);
    if (scanQueued) return;
    scanQueued = true;
    requestAnimationFrame(flushScans);
  }

  function watchMutations(){
    if (reducedMotion) return;
    const observer = new MutationObserver(records => {
      for (const record of records){
        for (const node of record.addedNodes){
          if (node instanceof Element) queueScan(node);
        }
        if (record.target instanceof Element) queueScan(record.target);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init(){
    // Capture anime here (not at module top) so it doesn't matter whether the
    // anime.js <script> is placed before or after this file on a given page.
    anime = window.anime;
    useAnime = !reducedMotion && typeof anime === 'function';
    setupHeroEmblem();
    if (reducedMotion) disableAutoplayVideo();
    scan(document);
    if (!reducedMotion){
      watchMutations();
      window.addEventListener('scroll', queueParallaxUpdate, { passive: true });
      window.addEventListener('resize', queueParallaxMeasure, { passive: true });
    }
  }

  if (document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(init), { once: true });
  } else {
    requestAnimationFrame(init);
  }
})();
