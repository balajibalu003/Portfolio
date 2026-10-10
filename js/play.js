/* ==========================================================================
   Balaji Yalburgi — portfolio · play.js
   The playful layer. Every interaction here earns its place:

     · pointer inspector  — a tester instrument readout in the hero
     · Break My UI        — an isolated demo with one seeded defect
     · console            — a real command interface (fixed, whitelisted)
     · QA mode            — press q, see what this page was checked for
     · footer easter egg  — a button that says do not click

   Nothing here is required to read the page. Everything degrades to plain
   content if this file fails to load.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── discoveries: drives the footer message ───────────────────────────── */
  var found = Object.create(null);
  function discover(key) {
    if (found[key]) return;
    found[key] = true;
    var n = Object.keys(found).length;
    var banner = $('#footFound');
    if (banner && n >= 3) banner.hidden = false;
  }

  /* ══════════════════════════════════════════════════════════════════════
     1. Pointer inspector — the hero reads the pointer like an instrument
     ══════════════════════════════════════════════════════════════════════ */
  (function inspector() {
    var box = $('#inspector'), xy = $('#insXY'), over = $('#insOver');
    if (!box || !xy || !over) return;

    var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (!fine) { box.hidden = true; return; }

    var raf = 0, lastX = -1, lastY = -1, lastTag = '';

    function paint() {
      raf = 0;
      var tag = '—';
      var el = document.elementFromPoint(lastX, lastY);
      if (el) {
        var tagged = el.closest('[data-qa]');
        tag = tagged ? tagged.getAttribute('data-qa').split(',')[0] : el.tagName.toLowerCase();
      }
      var xs = String(lastX).padStart(4, '0');
      var ys = String(lastY).padStart(4, '0');
      if (xy.textContent !== xs + ', ' + ys) xy.textContent = xs + ', ' + ys;
      if (tag !== lastTag) { over.textContent = tag; lastTag = tag; }
    }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      lastX = e.clientX; lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(paint);
    }, { passive: true });

    document.addEventListener('pointerleave', function () {
      xy.textContent = '—, —'; over.textContent = '—'; lastTag = '';
    }, { passive: true });
  })();

  /* ══════════════════════════════════════════════════════════════════════
     2. Break My UI — one seeded defect, strictly contained here
     ══════════════════════════════════════════════════════════════════════ */
  var playground = (function () {
    var wrap = $('#playground');
    if (!wrap) return null;

    var tbody = $('#pgRows');
    var status = $('#pgStatus');
    var hint = $('#pgHint');
    var answer = $('#pgAnswer');
    var revealBtn = $('#pgReveal');
    var resetBtn = $('#pgReset');
    var filters = $$('.fbtn', wrap);
    if (!tbody || !filters.length) return null;

    /* INC-106 is seeded with a trailing space in `status`. */
    var RAW = { 'INC-106': 'Closed ' };
    var current = 'All';
    var tries = 0;
    var answered = false;

    /* the two truths that disagree — this is the whole point of the demo */
    function rawCount(f) {
      var n = 0;
      $$('tr', tbody).forEach(function (tr) {
        var id = $('th', tr);
        if (!id) return;
        var st = $('.pg-status', tr).textContent;
        var key = id.textContent.replace(/\s+/g, '');
        var value = RAW[key] || st;
        if (f === 'All' || value === f) n++;
      });
      return n;
    }

    function trimCount(f) {
      var n = 0;
      $$('tr', tbody).forEach(function (tr) {
        var id = $('th', tr);
        if (!id) return;
        var st = $('.pg-status', tr).textContent;
        var key = id.textContent.replace(/\s+/g, '');
        var value = (RAW[key] || st).trim();
        if (f === 'All' || value === f) n++;
      });
      return n;
    }

    function apply(f) {
      current = f;
      filters.forEach(function (b) {
        var on = b.getAttribute('data-filter') === f;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      $$('tr', tbody).forEach(function (tr) {
        var id = $('th', tr);
        if (!id) return;
        var key = id.textContent.replace(/\s+/g, '');
        var value = (RAW[key] || $('.pg-status', tr).textContent).trim();
        var show = (f === 'All' || value === f);
        tr.hidden = !show;
        if (!show) collapse(tr);
      });

      if (status) status.innerHTML = 'Filter applied: <b>' + f + '</b>.';

      /* the mismatch is only visible if you check — which is the lesson */
      tries++;
      if (!answered && tries >= 3 && hint && !hint.hidden === false) {
        hint.hidden = false;
      }
    }

    function collapse(tr) {
      var btn = $('.row-t', tr);
      if (btn) btn.setAttribute('aria-expanded', 'false');
      /* the repro row is a sibling of tr, not a child */
      var extra = tr.nextElementSibling;
      if (extra && extra.classList.contains('pg-repro')) extra.remove();
    }

    function toggleRow(tr) {
      var btn = $('.row-t', tr);
      if (!btn) return;
      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { collapse(tr); return; }

      btn.setAttribute('aria-expanded', 'true');
      var id = btn.textContent.trim();
      var extra = document.createElement('tr');
      extra.className = 'pg-repro';
      var td = document.createElement('td');
      td.colSpan = 4;
      td.textContent = REPRO[id] || 'No reproduction notes recorded for this demo row.';
      extra.appendChild(td);
      tr.parentNode.insertBefore(extra, tr.nextSibling);
      discover('row');
    }

    var REPRO = {
      'INC-101': 'Repro: sign in, fail MFA once, retry. The challenge re-renders instead of clearing.',
      'INC-102': 'Repro: open USSD menu, pause past the session timer, continue. Menu state is lost.',
      'INC-103': 'Repro: complete a transfer below the receipt threshold. Template renders empty.',
      'INC-104': 'Repro: request a resend within the cooldown. Two SMS arrive.',
      'INC-105': 'Repro: retry a failed transfer. Balance reflects one attempt, not two.',
      'INC-106': 'Repro: open the profile view, leave it idle, return. Stale data is still shown.'
    };

    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        apply(b.getAttribute('data-filter'));
        discover('filter');
      });
    });

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('.row-t');
      if (!btn) return;
      var tr = btn.closest('tr');
      if (tr) toggleRow(tr);
    });

    if (revealBtn) revealBtn.addEventListener('click', function () {
      if (answered) return;
      answered = true;
      if (answer) answer.hidden = false;
      if (revealBtn) { revealBtn.disabled = true; revealBtn.textContent = 'Defect logged'; }
      if (hint) hint.hidden = true;
      discover('defect');
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      answered = false;
      tries = 0;
      if (answer) answer.hidden = true;
      if (hint) hint.hidden = true;
      if (revealBtn) { revealBtn.disabled = false; revealBtn.textContent = 'Reveal the seeded defect'; }
      $$('tr', tbody).forEach(function (tr) { if (tr.classList.contains('pg-repro')) tr.remove(); });
      $$('.row-t', tbody).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      apply('All');
      var s = $('#pgStatus'); if (s) s.textContent = 'Demo reset. Filter applied: All.';
    });

    /* seed the counts exactly as the (buggy) code computes them */
    filters.forEach(function (b) {
      var f = b.getAttribute('data-filter');
      var el = $('.fcount', b);
      if (el) el.textContent = rawCount(f);
    });

    return {
      reveal: function () { if (revealBtn) revealBtn.click(); },
      counts: function () { return { raw: rawCount(current), trimmed: trimCount(current) }; }
    };
  })();

  /* ══════════════════════════════════════════════════════════════════════
     3. QA mode — annotations for the curious
     ══════════════════════════════════════════════════════════════════════ */
  var qa = (function () {
    var banner = $('#qaBanner'), exit = $('#qaExit'), what = $('#qaWhat');
    var on = false;

    function set(next, why) {
      on = next;
      root.classList.toggle('qa-on', on);
      if (banner) banner.hidden = !on;
      if (what && why) what.textContent = why;
      if (on) discover('qa');
    }

    function toggle() {
      set(!on, on ? 'Annotations hidden.' : 'Every annotation is a real check on this page.');
    }

    if (exit) exit.addEventListener('click', function () { set(false); });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'q' || e.key === 'Q') { toggle(); }
    });

    return { toggle: toggle, isOn: function () { return on; } };
  })();

  /* ══════════════════════════════════════════════════════════════════════
     4. Console — a real interface over a fixed command map. Never evals.
     ══════════════════════════════════════════════════════════════════════ */
  var con = (function () {
    var trigger = $('#conTrigger'), panel = $('#conPanel'), out = $('#conOut');
    var form = $('#conForm'), input = $('#conInput'), close = $('#conClose');
    if (!trigger || !panel || !out || !form || !input) return null;

    var open = false, history = [], hIndex = -1;

    var HANDLERS = {
      help: function () {
        return [
          'available commands —',
          '  help        this list',
          '  about       who is typing this',
          '  projects    jump to the project write-ups',
          '  status      current portfolio status',
          '  coffee      a developer-grade beverage',
          '  bug         look for trouble',
          '  defect      read the write-up of PORT-0001',
          '  qa          toggle QA annotations',
          '  theme       paper / night',
          '  clear       clear this window',
          '  close       close the console'
        ];
      },
      about: function () {
        return [
          'Balaji Yalburgi — Software Test Engineer, Bangalore.',
          'A year testing one fintech application across Android,',
          'iOS, web and USSD. Fifty-odd smoke and integration cases',
          'run as scripts so a human can look at what actually broke.'
        ];
      },
      projects: function () {
        go('#work-samples');
        return ['opening the project write-ups…'];
      },
      status: function () {
        return [
          'portfolio   ' + (found.defect ? 'has one seeded defect' : 'stable'),
          'discoveries ' + Object.keys(found).length + ' of 5',
          'defects     1 seeded, 0 accidental',
          'uptime      ' + (new Date().getFullYear()) + ' and counting'
        ];
      },
      coffee: function () {
        var lines = [
          'brewing…',
          'cup status: empty. bug status: also empty.',
          'honestly the best defect I ever found came from a cold coffee and a wrong assumption.'
        ];
        return lines;
      },
      bug: function () {
        return [
          'scanning for defects…',
          'found ' + (Object.keys(found).length > 1 ? 'several' : 'none') + ' in this page.',
          'one of them is on purpose. look under Break My UI.'
        ];
      },
      defect: function () {
        if (playground) playground.reveal();
        return ['PORT-0001 — filter count disagrees with rendered rows. see Break My UI.'];
      },
      qa: function () {
        qa.toggle();
        return ['QA mode ' + (qa.isOn() ? 'on — look for the rust annotations.' : 'off.')];
      },
      theme: function () {
        var themeBtn = $('#theme');
        if (themeBtn) themeBtn.click();
        return ['switched to ' + root.getAttribute('data-theme') + '.'];
      },
      clear: function () { out.innerHTML = ''; return null; },
      close: function () { toggle(false); return null; }
    };

    function go(sel) {
      var el = document.querySelector(sel);
      if (!el) return;
      var mast = $('#mast');
      var y = el.getBoundingClientRect().top + window.pageYOffset - (mast ? mast.offsetHeight : 60) - 8;
      window.scrollTo({ top: Math.max(0, y), behavior: reduced ? 'auto' : 'smooth' });
    }

    function write(text, cls) {
      var lines = Array.isArray(text) ? text : [text];
      lines.forEach(function (line) {
        var p = document.createElement('p');
        if (cls) p.className = cls;
        p.textContent = line;
        out.appendChild(p);
      });
      out.scrollTop = out.scrollHeight;
    }

    function run(raw) {
      var cmd = raw.trim().toLowerCase();
      if (!cmd) return;
      history.push(cmd); hIndex = history.length;
      write('$ ' + raw, 'con-cmd');
      var parts = cmd.split(/\s+/);
      var name = parts[0];
      if (name === 'clear') { out.innerHTML = ''; return; }
      if (name === 'close') { toggle(false); return; }
      if (!Object.prototype.hasOwnProperty.call(HANDLERS, name)) {
        write('command not found: ' + name, 'con-err');
        write('try ' + (Object.keys(HANDLERS).sort().join(', ')), 'con-dim');
        return;
      }
      try {
        var res = HANDLERS[name](parts.slice(1));
        if (res) write(res, 'con-out');
      } catch (err) {
        write('that command fell over. that feels on brand.', 'con-err');
      }
    }

    function toggle(next) {
      open = typeof next === 'boolean' ? next : !open;
      panel.hidden = !open;
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        if (!out.childNodes.length) write(['type help for the list.'] , 'con-dim');
        discover('console');
        setTimeout(function () { input.focus(); }, 30);
      } else {
        trigger.focus();
      }
    }

    trigger.addEventListener('click', function () { toggle(); });
    if (close) close.addEventListener('click', function () { toggle(false); });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      run(input.value);
      input.value = '';
      hIndex = history.length;
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!history.length) return;
        hIndex = Math.max(0, hIndex - 1);
        input.value = history[hIndex] || '';
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        hIndex = Math.min(history.length, hIndex + 1);
        input.value = history[hIndex] || '';
      }
    });

    document.addEventListener('keydown', function (e) {
      var t = e.target;
      var typing = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.key === 'Escape' && open) { toggle(false); return; }
      if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === '`' || e.key === '~') { e.preventDefault(); toggle(); }
    });

    return { toggle: toggle, run: run, isOpen: function () { return open; } };
  })();

  /* ══════════════════════════════════════════════════════════════════════
     5. Footer — a button that asks not to be clicked
     ══════════════════════════════════════════════════════════════════════ */
  (function footer() {
    var btn = $('#dontClick');
    if (!btn) return;
    var lines = [
      'You clicked it. That is a reproducible, entirely avoidable defect.',
      'Twice. At this point I am logging a ticket against you.',
      'Three times. Closing as wontfix, because honestly you had it coming.',
      'Four. I have stopped counting. This is what exploratory testing looks like.'
    ];
    var n = 0;
    btn.addEventListener('click', function () {
      discover('dont');
      n++;
      btn.textContent = lines[Math.min(n - 1, lines.length - 1)];
    });
  })();

  /* ══════════════════════════════════════════════════════════════════════
     6. Scroll hairline
     ══════════════════════════════════════════════════════════════════════ */
  (function progress() {
    var bar = $('#progBar');
    if (!bar) return;
    var ticking = false;
    function onScroll() {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      var y = window.pageYOffset || 0;
      bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, y / h) : 0) + ')';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  })();

  /* expose a tiny surface for testing — read-only, no behaviour attached */
  window.__by = {
    found: found,
    playground: playground,
    qa: qa,
    con: con
  };
})();