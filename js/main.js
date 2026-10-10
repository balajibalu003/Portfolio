/* ==========================================================================
   Balaji Yalburgi — Portfolio · main.js
   Nav, theme, scroll reveal, counters, typing, skills
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem('by-theme'); } catch (e) {}

  if (stored) {
    root.setAttribute('data-theme', stored);
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.setAttribute('data-theme', 'light');
  }

  function toggleTheme() {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('by-theme', next); } catch (e) {}
    syncThemeMeta(next);
  }

  function syncThemeMeta(theme) {
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#07090d' : '#f6f8fb');
  }
  syncThemeMeta(root.getAttribute('data-theme'));

  var themeBtn = $('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  /* ---------- Year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Nav: scrolled state + progress ---------- */
  var nav = $('#nav');
  var bar = $('#scrollBar');
  var toTop = $('#toTop');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;

    if (nav) nav.classList.toggle('scrolled', y > 12);

    if (bar) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    }

    if (toTop) toTop.classList.toggle('show', y > 520);

    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Mobile menu ---------- */
  var burger = $('#burger');
  var navLinks = $('#navLinks');

  function closeMenu() {
    if (!navLinks) return;
    navLinks.classList.remove('open');
    if (burger) burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && navLinks) {
    burger.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    $$('a', navLinks).forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
      if (!navLinks.classList.contains('open')) return;
      if (!navLinks.contains(e.target) && !burger.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  /* ---------- Scroll spy ---------- */
  var sections = $$('section[id]');
  var linkMap = {};
  $$('.nav-links a').forEach(function (a) {
    var href = a.getAttribute('href');
    if (href && href.charAt(0) === '#') linkMap[href.slice(1)] = a;
  });

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        Object.keys(linkMap).forEach(function (k) { linkMap[k].classList.remove('active'); });
        var link = linkMap[en.target.id];
        if (link) link.classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('.reveal');

  if (reduced || !('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- Animated counters ---------- */
  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';

    if (reduced) { el.textContent = target + suffix; return; }

    var dur = 1400;
    var start = null;

    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
  }

  var counters = $$('.stat-num');
  if (counters.length) {
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      var co = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { animateCount(en.target); obs.unobserve(en.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (c) { co.observe(c); });
    }
  }

  /* ---------- Hero typing ---------- */
  var typed = $('#typed');
  if (typed) {
    var phrases = [
      'QA Automation',
      'Manual & API Testing',
      'Mobile & USSD Testing',
      'Defect Hunting'
    ];

    if (reduced) {
      typed.textContent = phrases[0];
    } else {
      var pi = 0, ci = 0, deleting = false;

      (function tick() {
        var word = phrases[pi];
        typed.textContent = word.slice(0, ci);

        var delay = deleting ? 45 : 85;

        if (!deleting && ci === word.length) {
          delay = 1900; deleting = true;
        } else if (deleting && ci === 0) {
          deleting = false; pi = (pi + 1) % phrases.length; delay = 320;
        } else {
          ci += deleting ? -1 : 1;
        }
        window.setTimeout(tick, delay);
      })();
    }
  }

  /* ---------- Skills interaction ---------- */
  var chips = $$('.chip[data-detail]');
  var sdName = $('#sdName');
  var sdText = $('#sdText');
  var bars = $$('.sd-bar i');

  function showSkill(chip) {
    if (!chip) return;
    chips.forEach(function (c) { c.classList.remove('on'); });
    chip.classList.add('on');

    if (sdName) sdName.textContent = chip.textContent.trim();
    if (sdText) sdText.textContent = chip.getAttribute('data-detail') || '';

    // deterministic pseudo-level per chip so bars feel responsive but stable
    var seed = 0, str = chip.textContent;
    for (var i = 0; i < str.length; i++) seed = (seed + str.charCodeAt(i) * (i + 3)) % 97;

    bars.forEach(function (b, i) {
      var base = [78, 66, 55][i] || 60;
      var v = Math.max(42, Math.min(97, base + ((seed + i * 17) % 18) - 9));
      b.style.width = v + '%';
    });
  }

  chips.forEach(function (chip) {
    chip.setAttribute('type', 'button');
    chip.addEventListener('mouseenter', function () { showSkill(chip); });
    chip.addEventListener('focus', function () { showSkill(chip); });
    chip.addEventListener('click', function () { showSkill(chip); });
  });

  if (chips.length) showSkill(chips[0]);

  /* ---------- Smooth anchor offset (fixed nav) ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      var navH = nav ? nav.offsetHeight : 68;
      var top = el.getBoundingClientRect().top + window.pageYOffset - navH - 10;

      window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduced ? 'auto' : 'smooth' });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

})();
