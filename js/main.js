/* ==========================================================================
   Balaji Yalburgi — portfolio · main.js
   Theme, navigation, scroll spy, reveal. Nothing here is decorative.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- year ---------- */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());

  /* ---------- theme ----------
     Set pre-paint in <head>. Here we only wire the toggle and persist. */
  var themeBtn = $('#theme');

  function labelTheme() {
    if (!themeBtn) return;
    var night = root.getAttribute('data-theme') === 'night';
    var t = night ? 'Switch to light theme' : 'Switch to dark theme';
    themeBtn.setAttribute('aria-label', t);
    themeBtn.setAttribute('title', t);
  }
  labelTheme();

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'night' ? 'paper' : 'night';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('by-theme', next); } catch (e) {}
      labelTheme();
    });
  }

  /* ---------- masthead border on scroll ---------- */
  var mast = $('#mast');
  var ticking = false;

  function onScroll() {
    if (mast) mast.classList.toggle('stuck', (window.pageYOffset || 0) > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- mobile drawer ---------- */
  var burger = $('#burger');
  var drawer = $('#drawer');

  function closeDrawer() {
    if (!drawer || !burger) return;
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = drawer.querySelector('a');
        if (first) first.focus();
      } else {
        burger.focus();
      }
    });

    $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) { closeDrawer(); burger.focus(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1040 && !drawer.hidden) closeDrawer();
    });
  }

  /* ---------- reveal ---------- */
  var revealables = $$('.rv');
  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -4% 0px' });
    revealables.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- scroll spy ---------- */
  var navLinks = {};
  $$('.nav a').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id && id.length > 1) navLinks[id] = a;
  });

  var sections = $$('section[id]');
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var link = navLinks['#' + en.target.id];
        Object.keys(navLinks).forEach(function (k) { navLinks[k].removeAttribute('aria-current'); });
        if (link) link.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- anchors: offset for the sticky masthead ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      closeDrawer();

      var offset = mast ? mast.offsetHeight : 60;
      var top = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduced ? 'auto' : 'smooth' });

      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  root.classList.add('js-ready');

})();