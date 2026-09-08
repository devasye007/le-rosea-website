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

  function onReveal(entries){
    for (const entry of entries){
      if (!entry.isIntersecting) continue;
      const el = entry.target;
      el.classList.add('is-visible');
      revealObserver.unobserve(el);
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

  function observeSiblings(parent, selector, includeSelf = false){
    if (!parent) return;
    const items = includeSelf && parent.matches?.(selector)
      ? [parent]
      : Array.from(parent.children).filter(child => child.matches?.(selector));
    items.forEach((item, index) => registerReveal(item, index * 60));
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

  function scan(root = document){
    if (reducedMotion) {
      setupHeroEmblem();
      disableAutoplayVideo();
      return;
    }

    if (!(root instanceof Element) && root !== document) return;

    const sectionHeads = root.querySelectorAll?.('.section-head') || [];
    sectionHeads.forEach(el => registerReveal(el));

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

    queueParallaxMeasure();
  }

  function watchMutations(){
    if (reducedMotion) return;
    const observer = new MutationObserver(records => {
      let needsMeasure = false;
      for (const record of records){
        for (const node of record.addedNodes){
          if (!(node instanceof Element)) continue;
          scan(node);
          needsMeasure = true;
        }
        if (record.target instanceof Element) {
          scan(record.target);
          needsMeasure = true;
        }
      }
      if (needsMeasure) queueParallaxMeasure();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  function init(){
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
