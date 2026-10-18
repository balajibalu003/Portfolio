/* ==========================================================================
   Balaji Yalburgi — portfolio
   Interaction only where it earns its place: navigation, theme,
   scroll position, and section reveal.
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

  /* ---------- theme ---------- */
  var KEY = 'by-theme';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) {}

  /* Night is the default. Paper is the alternate, and either choice sticks. */
  var theme = (stored === 'paper' || stored === 'night') ? stored : 'night';
  root.setAttribute('data-theme', theme);

  var themeBtn = $('#theme');
  if (themeBtn) {
    var paintThemeLabel = function () {
      var night = root.getAttribute('data-theme') === 'night';
      themeBtn.setAttribute('aria-label', night ? 'Switch to paper theme' : 'Switch to night theme');
      themeBtn.setAttribute('title', night ? 'Switch to paper theme' : 'Switch to night theme');
    };
    paintThemeLabel();

    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'night' ? 'paper' : 'night';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      paintThemeLabel();
    });
  }

  /* ---------- masthead material + scroll position ---------- */
  var mast = $('#mast');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || 0;
    if (mast) mast.classList.toggle('is-stuck', y > 8);
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  /* ---------- nav indicator: springs between items ---------- */
  (function navIndicator() {
    var nav = $('#contents');
    var ind = $('#navInd');
    if (!nav || !ind) return;
    if (window.matchMedia('(hover: none)').matches) { ind.style.display = 'none'; return; }

    var links = $$('a', nav);
    if (!links.length) return;
    var hovered = null;

    function place(el) {
      if (!el) { ind.classList.remove('on'); return; }
      var r = el.getBoundingClientRect();
      var nr = nav.getBoundingClientRect();
      ind.style.width = r.width + 'px';
      ind.style.transform = 'translate(' + (r.left - nr.left) + 'px,-50%)';
      ind.classList.add('on');
    }

    function rest() {
      /* when nothing is hovered, the indicator tracks the current section */
      place(hovered || nav.querySelector('a[aria-current="true"]') || null);
    }

    links.forEach(function (a) {
      a.addEventListener('mouseenter', function () { hovered = a; place(a); });
      a.addEventListener('focus', function () { hovered = a; place(a); });
    });

    nav.addEventListener('mouseleave', function () { hovered = null; rest(); });

    /* follow the active section as the spy moves */
    var spy = new MutationObserver(function () { if (!hovered) rest(); });
    spy.observe(nav, { attributes: true, subtree: true, attributeFilter: ['aria-current'] });

    window.addEventListener('resize', rest, { passive: true });
    rest();
  })();

  /* ---------- drawer ---------- */
  var menuBtn = $('#menuBtn');
  var drawer = $('#drawer');

  function closeDrawer() {
    if (!drawer || !menuBtn) return;
    drawer.hidden = true;
    menuBtn.setAttribute('aria-expanded', 'false');
  }

  if (menuBtn && drawer) {
    menuBtn.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        var first = drawer.querySelector('a');
        if (first) first.focus();
      }
    });

    $$('a', drawer).forEach(function (a) { a.addEventListener('click', closeDrawer); });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !drawer.hidden) { closeDrawer(); menuBtn.focus(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1080 && !drawer.hidden) closeDrawer();
    });
  }

  /* ---------- section reveal ---------- */
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
    }, { threshold: 0.06, rootMargin: '0px 0px -4% 0px' });
    revealables.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- scroll spy ---------- */
  var navLinks = {};
  $$('[href^="#"]').forEach(function (a) {
    var id = a.getAttribute('href');
    if (id.length > 1 && !navLinks[id]) navLinks[id] = [];
    if (id.length > 1 && a.closest('.contents')) navLinks[id].push(a);
  });

  var targets = $$('section[id]');
  if ('IntersectionObserver' in window && targets.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var links = navLinks['#' + en.target.id] || [];
        Object.keys(navLinks).forEach(function (k) {
          navLinks[k].forEach(function (a) { a.removeAttribute('aria-current'); });
        });
        links.forEach(function (a) { a.setAttribute('aria-current', 'true'); });
      });
    }, { rootMargin: '-42% 0px -52% 0px', threshold: 0 });
    targets.forEach(function (s) { spy.observe(s); });
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
      var y = el.getBoundingClientRect().top + window.pageYOffset - offset - 8;
      window.scrollTo({ top: y < 0 ? 0 : y, behavior: reduced ? 'auto' : 'smooth' });

      /* keep the keyboard where the eye went */
      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

})();