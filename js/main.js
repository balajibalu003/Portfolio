/* ==========================================================================
   Balaji Yalburgi · portfolio
   Shell, theme, navigation, reveal, and the motion layer.
   Every animation is optional: with reduced motion the page is simply static.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = reduceQuery.matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- year ---------- */
  var yearEl = $('#year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- theme ---------- */
  var themeBtn = $('#theme');

  function labelTheme() {
    if (!themeBtn) return;
    var night = root.getAttribute('data-theme') === 'night';
    var t = night ? 'Switch to light theme' : 'Switch to dark theme';
    themeBtn.setAttribute('aria-label', t);
    themeBtn.setAttribute('title', t);
  }
  labelTheme();

  function paintTheme(next) {
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('by-theme', next); } catch (e) {}
    labelTheme();
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'night' ? 'paper' : 'night';
      if (document.startViewTransition && !reduced) {
        document.startViewTransition(function () { paintTheme(next); });
      } else {
        paintTheme(next);
      }
    });
  }

  /* follow the system until the visitor makes an explicit choice */
  var scheme = window.matchMedia('(prefers-color-scheme: light)');
  var onScheme = function (e) {
    var stored = null;
    try { stored = localStorage.getItem('by-theme'); } catch (err) {}
    if (!stored) root.setAttribute('data-theme', e.matches ? 'paper' : 'night');
  };
  if (scheme.addEventListener) scheme.addEventListener('change', onScheme);

  /* ---------- masthead + progress + back to top ---------- */
  var mast = $('#mast');
  var progress = $('#progress');
  var progressFill = progress ? progress.querySelector('i') : null;
  var toTop = $('#toTop');
  var ticking = false;

  function onScroll() {
    var y = window.pageYOffset || 0;
    if (mast) mast.classList.toggle('stuck', y > 10);

    var max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressFill) {
      var p = max > 0 ? Math.min(y / max, 1) : 0;
      progressFill.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }

    if (toTop) toTop.classList.toggle('on', y > 700);
    updateSpy();
    ticking = false;
  }

  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; window.requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- mobile drawer ---------- */
  var burger = $('#burger');
  var drawer = $('#drawer');

  function closeDrawer(returnFocus) {
    if (!drawer || !burger || drawer.hidden) return;
    drawer.hidden = true;
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (returnFocus) burger.focus();
  }

  if (burger && drawer) {
    burger.addEventListener('click', function () {
      var open = drawer.hidden;
      drawer.hidden = !open;
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
      if (open) {
        var first = drawer.querySelector('a');
        if (first) first.focus();
      } else {
        burger.focus();
      }
    });

    $$('a', drawer).forEach(function (a) {
      a.addEventListener('click', function () { closeDrawer(false); });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer(true);
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 1100 && !drawer.hidden) closeDrawer(false);
    });
  }

  /* ---------- reveal ---------- */
  var revealables = $$('.rv');
  revealables.forEach(function (el) {
    var i = el.getAttribute('data-i');
    if (i) el.style.setProperty('--i', i);
  });

  if (reduced || !('IntersectionObserver' in window)) {
    revealables.forEach(function (el) { el.classList.add('in'); });
  } else {
    var revealObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        obs.unobserve(en.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    revealables.forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------- scroll spy + sliding nav pill ---------- */
  var nav = $('#nav');
  var pill = $('#navPill');
  var navLinks = {};

  if (nav) {
    $$('a[href^="#"]', nav).forEach(function (a) {
      navLinks[a.getAttribute('href')] = a;
    });
  }

  function movePill(link) {
    if (!pill || !link) return;
    pill.style.width = link.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + link.offsetLeft + 'px)';
    pill.classList.add('on');
    Object.keys(navLinks).forEach(function (k) {
      navLinks[k].removeAttribute('aria-current');
    });
    link.setAttribute('aria-current', 'true');
  }

  var sections = $$('section[id]');
  var currentLink = null;

  function clearPill() {
    if (pill) pill.classList.remove('on');
    Object.keys(navLinks).forEach(function (k) {
      navLinks[k].removeAttribute('aria-current');
    });
  }

  /* Scroll position decides the current section. Intersection events alone
     leave a stale highlight when the page jumps back to the top. */
  function updateSpy() {
    if (!nav || !sections || !sections.length) return;

    var trigger = (window.pageYOffset || 0) + window.innerHeight * 0.38;
    var current = null;

    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= trigger) current = sections[i];
    }
    if (window.innerHeight + (window.pageYOffset || 0) >= document.documentElement.scrollHeight - 4) {
      current = sections[sections.length - 1];
    }

    var link = current ? (navLinks['#' + current.id] || null) : null;
    if (link === currentLink) return;

    currentLink = link;
    if (link) movePill(link);
    else clearPill();
  }

  window.addEventListener('resize', function () {
    if (!nav) return;
    currentLink = null;
    updateSpy();
  }, { passive: true });

  updateSpy();

  /* ---------- anchors, offset for the sticky masthead ---------- */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#') return;
      var el = document.querySelector(id);
      if (!el) return;

      e.preventDefault();
      closeDrawer(false);

      var offset = mast ? mast.offsetHeight : 72;
      var top = el.getBoundingClientRect().top + window.pageYOffset - offset - 10;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: reduced ? 'auto' : 'smooth' });

      if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });

      if (history.replaceState) history.replaceState(null, '', id);
    });
  });

  /* ---------- project filters ---------- */
  (function filters() {
    var grid = $('#projGrid');
    if (!grid) return;

    var buttons = $$('#projFilters .filter');
    var empty = $('#filterEmpty');
    var count = $('#filterCount');
    var cards = $$('.proj', grid);

    function apply(filter) {
      var shown = 0;

      buttons.forEach(function (b) {
        var on = b.getAttribute('data-filter') === filter;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      cards.forEach(function (c) {
        var cats = c.getAttribute('data-cat') || '';
        var match = filter === 'all' || (' ' + cats + ' ').indexOf(' ' + filter + ' ') > -1;
        c.hidden = !match;
        if (match) {
          c.classList.add('in');
          shown++;
        }
      });

      if (empty) empty.hidden = shown > 0;
      if (count) count.textContent = shown + (shown === 1 ? ' project' : ' projects');
    }

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.getAttribute('data-filter'));
      });
    });
  })();

  /* ---------- count up on the real numbers ---------- */
  (function counters() {
    var els = $$('[data-count]');
    if (!els.length) return;

    if (reduced || !('IntersectionObserver' in window)) return;

    function run(el) {
      var target = parseFloat(el.getAttribute('data-count'));
      if (isNaN(target)) return;
      var start = null;
      var duration = 1100;

      function step(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3);
        el.textContent = String(Math.round(target * eased));
        if (t < 1) window.requestAnimationFrame(step);
        else el.textContent = String(target);
      }

      el.textContent = '0';
      window.requestAnimationFrame(step);
    }

    var co = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        run(en.target);
        obs.unobserve(en.target);
      });
    }, { threshold: 0.6 });

    els.forEach(function (el) { co.observe(el); });
  })();

  /* ---------- card tilt and spotlight ---------- */
  if (finePointer && !reduced) {
    $$('[data-tilt]').forEach(function (card) {
      var raf = null;

      function move(e) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          var r = card.getBoundingClientRect();
          var px = (e.clientX - r.left) / r.width;
          var py = (e.clientY - r.top) / r.height;
          var rx = (0.5 - py) * 5;
          var ry = (px - 0.5) * 5;
          card.style.transform =
            'perspective(1100px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' +
            ry.toFixed(2) + 'deg) translateY(-3px)';
          card.style.setProperty('--mx', (px * 100).toFixed(1) + '%');
          card.style.setProperty('--my', (py * 100).toFixed(1) + '%');
          raf = null;
        });
      }

      function reset() {
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
        card.style.transform = '';
        card.style.removeProperty('--mx');
        card.style.removeProperty('--my');
      }

      card.addEventListener('mousemove', move);
      card.addEventListener('mouseleave', reset);
      card.addEventListener('blur', reset, true);
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduced) {
    $$('.magnetic').forEach(function (btn) {
      var raf = null;

      btn.addEventListener('mousemove', function (e) {
        if (raf) return;
        raf = window.requestAnimationFrame(function () {
          var r = btn.getBoundingClientRect();
          var dx = (e.clientX - (r.left + r.width / 2)) * 0.18;
          var dy = (e.clientY - (r.top + r.height / 2)) * 0.28;
          btn.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
          raf = null;
        });
      });

      btn.addEventListener('mouseleave', function () {
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
        btn.style.transform = '';
      });
    });
  }

  /* ---------- copy email ---------- */
  (function copy() {
    var btn = $('#copyMail');
    var toastEl = $('#toast');
    if (!btn) return;

    var timer = null;

    function say(msg) {
      if (!toastEl) return;
      toastEl.textContent = msg;
      toastEl.classList.add('on');
      window.clearTimeout(timer);
      timer = window.setTimeout(function () { toastEl.classList.remove('on'); }, 2200);
    }

    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy') || '';
      var done = function () { say('Email copied'); };

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () {
          window.prompt('Copy the email address:', text);
        });
      } else {
        window.prompt('Copy the email address:', text);
      }
    });
  })();


  /* ---------- cursor glow ---------- */
  var glowEl = $('#cursorGlow');
  if (glowEl && finePointer && !reduced) {
    document.addEventListener('mousemove', function (e) {
      glowEl.style.left = e.clientX + 'px';
      glowEl.style.top  = e.clientY + 'px';
    }, { passive: true });
  }

  root.classList.add('js-ready');

})();

