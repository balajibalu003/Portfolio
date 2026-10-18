/* ==========================================================================
   Balaji Yalburgi — portfolio · play.js
   Everything interactive:
     · hero demonstration panel
     · QA Lab A — Break My UI (seeded defect, isolated)
     · QA Lab B — deterministic test runner (live / simulated / skipped)
     · QA Lab C — edge-case challenge
     · project filters

   Deterministic. No network. No eval. No arbitrary input.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wait = function (ms) { return new Promise(function (r) { setTimeout(r, reduced ? 0 : ms); }); };

  /* ══════════════════════════════════════════════════════════════════
     HERO — demonstration panel
     ══════════════════════════════════════════════════════════════════ */
  (function heroPanel() {
    var out = $('#heroOut'), btn = $('#heroRun'), tally = $('#heroTally');
    if (!out || !btn) return;

    var SUITE = [
      ['auth/login.spec.js', 'pass', '(4 checks)'],
      ['api/payload.spec.js', 'pass', '(6 checks)'],
      ['regression/core.spec.js', 'pass', '(11 checks)'],
      ['platform/ios-usd.spec.js', 'warn', '(2 skipped — no device farm)']
    ];

    btn.addEventListener('click', async function () {
      btn.disabled = true;
      out.innerHTML = '';
      var line = function (t, c) { var li = document.createElement('li'); if (c) li.className = c; li.textContent = t; out.appendChild(li); };

      line('$ run-suite --demo', 'r-cmd');
      line('[system] executing 4 predefined scenarios', 'r-dim');
      await wait(340);

      var pass = 0, skipped = 0;
      for (var i = 0; i < SUITE.length; i++) {
        var s = SUITE[i];
        await wait(380);
        if (s[1] === 'pass') { pass++; line('PASS  ' + s[0] + '  ' + s[2], 'r-ok'); }
        else { skipped++; line('SKIP  ' + s[0] + '  ' + s[2], 'r-warn'); }
      }
      await wait(220);
      line('', 'r-dim');
      line('Demonstration only. These are scripted outputs, not production metrics.', 'r-dim');
      tally.textContent = pass + ' passed · ' + skipped + ' skipped · ' + SUITE.length + ' scenarios';
      btn.disabled = false;
    });
  })();

  /* ══════════════════════════════════════════════════════════════════
     LAB — tab switching (roving focus, arrow keys)
     ══════════════════════════════════════════════════════════════════ */
  (function labTabs() {
    var tabs = $$('.lab-tab');
    if (!tabs.length) return;
    var panels = { 'tab-a': $('#labA'), 'tab-b': $('#labB'), 'tab-c': $('#labC') };

    function select(idx, focus) {
      tabs.forEach(function (t, i) {
        var on = i === idx;
        t.classList.toggle('is-on', on);
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        var p = panels[t.id];
        if (p) p.hidden = !on;
      });
      if (focus) tabs[idx].focus();
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () { select(i); });
      t.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'Home' && k !== 'End') return;
        e.preventDefault();
        var next = k === 'Home' ? 0 : k === 'End' ? tabs.length - 1
                 : k === 'ArrowRight' ? (i + 1) % tabs.length
                 : (i - 1 + tabs.length) % tabs.length;
        select(next, true);
      });
    });
  })();

  /* ══════════════════════════════════════════════════════════════════
     LAB A — Break My UI
     The seeded defect: INC-106 is stored as "Closed " (trailing space).
     The count compares raw, the table renders trimmed. Strictly local.
     ══════════════════════════════════════════════════════════════════ */
  (function defectDemo() {
    var wrap = $('#labA');
    if (!wrap) return;

    var tbody = $('#defectRows');
    var status = $('#defectStatus');
    var hint = $('#defectHint');
    var answer = $('#defectAnswer');
    var revealBtn = $('#defectReveal');
    var resetBtn = $('#defectReset');
    var filters = $$('.filters-sm .filter', wrap);
    if (!tbody) return;

    /* the seed: a trailing space that the count and the table disagree about */
    var RAW = { 'INC-106': 'Closed ' };

    var REPRO = {
      'INC-101': 'Repro: sign in, fail MFA once, retry. The challenge re-renders instead of clearing.',
      'INC-102': 'Repro: open the USSD menu, pause past the session timer, continue. Menu state is lost.',
      'INC-103': 'Repro: complete a transfer below the receipt threshold. The template renders empty.',
      'INC-104': 'Repro: request an SMS resend inside the cooldown. Two messages arrive.',
      'INC-105': 'Repro: retry a failed transfer. Balance reflects one attempt, not two.',
      'INC-106': 'Repro: open the profile view, leave it idle, return. Stale data is still shown.'
    };

    var answered = false, tries = 0;

    function rawOf(tr) {
      var id = $('th', tr);
      var key = id ? id.textContent.replace(/\s+/g, '') : '';
      var cell = $('.mono-c', tr);
      return RAW[key] || (cell ? cell.textContent : '');
    }

    function apply(f) {
      filters.forEach(function (b) {
        var on = b.getAttribute('data-filter') === f;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });

      $$('tr', tbody).forEach(function (tr) {
        var v = rawOf(tr).trim();
        var show = (f === 'All' || v === f);
        tr.hidden = !show;
        if (!show) collapse(tr);
      });

      if (status) status.innerHTML = 'Filter applied: <b>' + f + '</b>.';
      tries++;
      if (!answered && tries >= 3 && hint) hint.hidden = false;
    }

    function collapse(tr) {
      var btn = $('.link-btn', tr);
      if (btn) btn.setAttribute('aria-expanded', 'false');
      var extra = tr.nextElementSibling;
      if (extra && extra.classList.contains('repro-row')) extra.remove();
    }

    filters.forEach(function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });

    tbody.addEventListener('click', function (e) {
      var btn = e.target.closest('.link-btn');
      if (!btn) return;
      var tr = btn.closest('tr');
      if (!tr) return;

      var open = btn.getAttribute('aria-expanded') === 'true';
      if (open) { collapse(tr); return; }

      btn.setAttribute('aria-expanded', 'true');
      var extra = document.createElement('tr');
      extra.className = 'repro-row';
      var td = document.createElement('td');
      td.colSpan = 4;
      td.className = 'mono-s';
      td.textContent = REPRO[btn.textContent.trim()] || 'No reproduction notes recorded for this demo row.';
      extra.appendChild(td);
      tr.parentNode.insertBefore(extra, tr.nextSibling);
    });

    if (revealBtn) revealBtn.addEventListener('click', function () {
      if (answered) return;
      answered = true;
      if (answer) answer.hidden = false;
      revealBtn.disabled = true;
      revealBtn.textContent = 'Defect logged';
      if (hint) hint.hidden = true;
    });

    if (resetBtn) resetBtn.addEventListener('click', function () {
      answered = false; tries = 0;
      if (answer) answer.hidden = true;
      if (hint) hint.hidden = true;
      if (revealBtn) { revealBtn.disabled = false; revealBtn.textContent = 'Reveal the seeded defect'; }
      $$('tr', tbody).forEach(function (tr) { if (tr.classList.contains('repro-row')) tr.remove(); });
      $$('.link-btn', tbody).forEach(function (b) { b.setAttribute('aria-expanded', 'false'); });
      apply('All');
      if (status) status.textContent = 'Demo reset. Filter applied: All.';
    });
  })();

  /* ══════════════════════════════════════════════════════════════════
     LAB B — deterministic test runner
     Five checks run against this page in your browser. One is simulated
     against a hard-coded payload. One is skipped: there is no backend.
     ══════════════════════════════════════════════════════════════════ */
  (function runner() {
    var wrap = $('#labB');
    if (!wrap) return;

    var out = $('#runnerOut'), go = $('#runnerGo'), tally = $('#runnerTally'), state = $('#runnerState');
    var table = $('#runnerTable');

    /* --- the checks --------------------------------------------- */
    var CHECKS = [
      { key: 'anchors', label: 'navigation integrity',
        kind: 'live',
        why: 'Every in-page anchor must resolve to a real element, or a visitor lands nowhere.',
        run: function () {
          var bad = [];
          $$('a[href^="#"]').forEach(function (a) {
            var id = a.getAttribute('href');
            if (id.length < 2) return;
            if (!document.querySelector(id)) bad.push(id);
          });
          return bad.length ? { ok: false, note: 'unresolved: ' + bad.join(', ') }
                           : { ok: true, note: 'all in-page anchors resolve' };
        } },

      { key: 'email', label: 'email format',
        kind: 'live',
        why: 'Required-field validation should reject a malformed address before it reaches the server.',
        cases: [
          ['balajiyalburgi003@gmail.com', true],
          ['balaji@@gmail.com', false],
          ['balaji@gmail', false],
          ['balaji yalburgi@gmail.com', false]
        ],
        run: function () {
          var re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          var wrong = this.cases.filter(function (c) { return re.test(c[0]) !== c[1]; });
          return wrong.length ? { ok: false, note: wrong.length + ' case(s) misclassified' }
                              : { ok: true, note: this.cases.length + ' cases classified correctly' };
        } },

      { key: 'contrast', label: 'body text contrast',
        kind: 'live',
        why: 'Body copy must clear 4.5:1 against the page background or it is unreadable for some readers.',
        run: function () {
          var f = function (c) { var m = c.match(/[\d.]+/g).map(Number);
            return (0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]) / 255; };
          var cs = getComputedStyle(document.body);
          var L1 = f(cs.color), L2 = f(cs.backgroundColor);
          var ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
          return ratio >= 4.5 ? { ok: true, note: ratio.toFixed(2) + ':1' }
                               : { ok: false, note: ratio.toFixed(2) + ':1 — below 4.5' };
        } },

      { key: 'viewport', label: 'responsive breakpoint',
        kind: 'live',
        why: 'The responsive layout has to actually engage, not just exist in the stylesheet.',
        run: function () {
          var wide = window.matchMedia('(min-width: 1041px)').matches;
          var navHidden = getComputedStyle($('#nav')).display === 'none';
          var burgerShown = getComputedStyle($('#burger')).display !== 'none';
          var consistent = wide ? !navHidden : (navHidden && burgerShown);
          return consistent ? { ok: true, note: wide ? 'desktop layout active' : 'compact layout active' }
                            : { ok: false, note: 'breakpoint and nav disagree' };
        } },

      { key: 'defect', label: 'seeded defect still present',
        kind: 'live',
        why: 'A demo that quietly stops being broken is a demo nobody can learn from.',
        run: function () {
          var tr = $$('#defectRows tr').filter(function (r) { return /INC-106/.test(r.textContent); })[0];
          if (!tr) return { ok: false, note: 'seed row missing' };
          $('#fClosed').click();
          var shown = $$('#defectRows tr').filter(function (r) { return !r.hidden; }).length;
          var label = Number($('#fClosed .fc').textContent);
          $('#fAll').click();
          return (shown !== label) ? { ok: true, note: 'defect intact — ' + shown + ' rows vs label ' + label }
                                    : { ok: false, note: 'defect no longer reproduces' };
        } },

      { key: 'payload', label: 'api response shape',
        kind: 'simulated',
        why: 'A 200 does not mean success — the body still has to match the schema the UI expects.',
        run: function () {
          /* hard-coded payload, nothing is fetched */
          var payload = { status: 200, data: { temp: 21.4, unit: 'C', city: 'Bengaluru' } };
          var need = ['status', 'data'];
          var needDeep = ['temp', 'unit', 'city'];
          var ok = need.every(function (k) { return k in payload; }) &&
                   needDeep.every(function (k) { return k in payload.data; });
          return ok ? { ok: true, note: 'schema matched (simulated payload)' }
                    : { ok: false, note: 'schema mismatch' };
        } },

      { key: 'timeout', label: 'network timeout handling',
        kind: 'skipped',
        why: 'Timeouts need a real endpoint to fail.',
        run: function () { return { ok: null, note: 'no backend to test against' }; } }
    ];

    go.addEventListener('click', async function () {
      go.disabled = true;
      out.innerHTML = '';
      var line = function (t, c) { var li = document.createElement('li'); if (c) li.className = c; li.textContent = t; out.appendChild(li); };

      var pass = 0, fail = 0, skip = 0;

      for (var i = 0; i < CHECKS.length; i++) {
        var c = CHECKS[i];
        await wait(300);

        var res, err = null;
        try { res = c.run(); } catch (e) { err = e; res = { ok: false, note: 'check threw' }; }

        var tag, cls, rowCls;
        if (err || res.ok === false) { fail++; tag = 'FAIL'; cls = 'r-err'; rowCls = 'r-fail'; }
        else if (res.ok === null) { skip++; tag = 'SKIP'; cls = 'r-warn'; rowCls = 'r-skip'; }
        else { pass++; tag = 'PASS'; cls = 'r-ok'; rowCls = 'r-pass'; }

        line(tag + '  ' + c.label + ' — ' + res.note, cls);

        var row = table.querySelector('tr[data-key="' + c.key + '"]');
        if (row) {
          row.classList.remove('r-pass', 'r-fail', 'r-skip');
          row.classList.add(rowCls);
        }
      }

      await wait(200);
      line('', 'r-dim');
      line('5 live checks ran in your browser · 1 simulated · 1 skipped · no network calls', 'r-dim');

      tally.textContent = pass + ' passed · ' + fail + ' failed · ' + skip + ' skipped';
      state.textContent = fail ? 'failed' : 'passed';
      go.disabled = false;
    });
  })();

  /* ══════════════════════════════════════════════════════════════════
     LAB C — edge-case challenge
     ══════════════════════════════════════════════════════════════════ */
  (function challenge() {
    var list = $('#chList');
    if (!list) return;

    var SCENARIOS = [
      {
        q: 'A user taps <em>Pay</em> twice on a slow connection. What should the app do?',
        ctx: 'mobile · payments',
        opts: [
          'Let both requests through — the server will reject the duplicate',
          'Disable the action and show a pending state, and make the request idempotent',
          'Show an error asking the user to try again'
        ],
        right: 1,
        verdict: {
          why: 'The client cannot know whether the first request succeeded. Two requests can become two charges.',
          expect: 'The action is disabled immediately, a pending state is shown, and the server keys on an idempotency token so a repeat returns the original result rather than creating a second one.',
          bonus: 'What if the first request actually timed out at the network layer but the charge went through?'
        }
      },
      {
        q: 'The connection drops <em>after</em> the user submits an order but before the confirmation arrives. What should the UI show?',
        ctx: 'web · checkout',
        opts: [
          'An error — the order did not go through',
          'Nothing; let the user decide whether to submit again',
          'An explicit pending or unknown state that makes retrying safe'
        ],
        right: 2,
        verdict: {
          why: 'A dropped connection is ambiguous, not a failure. Treating it as a failure causes duplicate orders when the user retries.',
          expect: 'Show an unambiguous "we are not sure yet" state, let the user retry safely, and reconcile against the order id when the connection returns.',
          bonus: 'What does the page do if the user refreshes while that state is showing?'
        }
      },
      {
        q: 'Which of these is a <em>valid</em> email address?',
        ctx: 'validation',
        opts: [
          'balaji@@gmail.com',
          'balaji@gmail',
          'B@X.CO',
          'balaji yalburgi@gmail.com'
        ],
        right: 2,
        verdict: {
          why: 'Over-eager validation rejects real users; under-eager validation queues garbage into your system.',
          expect: 'A pragmatic check — no spaces, exactly one @, and a dot in the domain. B@X.CO passes; the others do not.',
          bonus: 'Should you reject balaji+test@gmail.com? It is valid, and over-validating it costs you real signups.'
        }
      },
      {
        q: 'A USSD menu times out <em>mid-flow</em>, while the user has already selected an option. What is correct?',
        ctx: 'mobile · USSD',
        opts: [
          'Silently drop the session and restart at the top menu',
          'Resume the session where it left off',
          'Show an error and force the user to call the helpline'
        ],
        right: 1,
        verdict: {
          why: 'USSD has no browser back button and no scroll. Restarting silently throws away everything the user entered.',
          expect: 'The session is resumed at the same step with state intact, or it is cleanly reset with an explicit message — never a silent drop.',
          bonus: 'What happens if the timeout fires immediately after a debit confirmation — is the money taken?'
        }
      },
      {
        q: 'An API returns <em>200 OK</em> but with an empty body. The client shows a spinner forever. What is the bug?',
        ctx: 'api · frontend',
        opts: [
          'The API returned the wrong status code',
          'The client trusted the status code instead of validating the payload shape',
          'The network dropped mid-response'
        ],
        right: 1,
        verdict: {
          why: 'This is the most common real API defect: a 200 with no usable body. The status code was never a contract.',
          expect: 'Validate the payload shape as well as the status. A missing or empty body should surface as a handled error state, not an indefinite spinner.',
          bonus: 'How would you test it? A mock returning 200 with an empty body, asserted against a schema — not a happy-path fixture.'
        }
      },
      {
        q: 'On a short landscape phone, the on-screen keyboard covers the <em>Submit</em> button. What should you fix first?',
        ctx: 'mobile · responsive',
        opts: [
          'Increase the button size',
          'Make sure the focused field and its action stay visible above the keyboard',
          'Switch the layout to a full-screen wizard'
        ],
        right: 1,
        verdict: {
          why: 'A button the user cannot see is a button they cannot use. This is a functional defect, not a cosmetic one.',
          expect: 'The focused field scrolls into view, the action is reflowed or sticky above the keyboard, and enterkeyhint tells the platform which action the key triggers.',
          bonus: 'What do you check at the shortest supported viewport in both orientations?'
        }
      }
    ];

    var answered = 0;

    function render() {
      list.innerHTML = '';
      answered = 0;
      updateProgress();

      SCENARIOS.forEach(function (sc, si) {
        var wrap = document.createElement('div');
        wrap.className = 'challenge';

        var q = document.createElement('p');
        q.className = 'ch-q';
        q.innerHTML = sc.q;

        var ctx = document.createElement('p');
        ctx.className = 'ch-context';
        ctx.textContent = sc.ctx;

        var opts = document.createElement('div');
        opts.className = 'ch-opts';

        var verdictBox = document.createElement('div');

        sc.opts.forEach(function (label, oi) {
          var b = document.createElement('button');
          b.type = 'button';
          b.className = 'ch-opt';
          b.textContent = label;
          b.addEventListener('click', function () {
            if (wrap.dataset.done === '1') return;

            Array.prototype.forEach.call(opts.children, function (el, i) {
              el.disabled = true;
              if (i === sc.right) el.classList.add('is-right');
              else if (i === oi) el.classList.add('is-wrong');
            });

            wrap.dataset.done = '1';
            wrap.classList.add('is-done');
            answered++;
            updateProgress();

            verdictBox.innerHTML =
              '<div class="ch-verdict">' +
              '<p class="' + (oi === sc.right ? 'good' : '') + '"><b>' +
              (oi === sc.right ? 'Correct.' : 'Not quite.') + '</b> ' +
              (oi === sc.right ? '' : 'The best answer is “' + sc.opts[sc.right] + '”. ') +
              '</p>' +
              '<h4>Why it matters</h4><p>' + sc.verdict.why + '</p>' +
              '<h4>Expected behaviour</h4><p>' + sc.verdict.expect + '</p>' +
              '<h4>Worth considering</h4><p class="ch-bonus">' + sc.verdict.bonus + '</p>' +
              '</div>';
          });
          opts.appendChild(b);
        });

        wrap.appendChild(q);
        wrap.appendChild(ctx);
        wrap.appendChild(opts);
        wrap.appendChild(verdictBox);
        list.appendChild(wrap);
      });
    }

    function updateProgress() {
      var p = $('#chProgress');
      if (!p) return;
      p.textContent = answered + ' of ' + SCENARIOS.length + ' answered';
      var existing = $('#chDone');
      if (existing) existing.remove();
      if (answered === SCENARIOS.length) {
        var note = document.createElement('p');
        note.className = 'ch-done-note';
        note.id = 'chDone';
        note.textContent = 'All six answered. You found the same failure modes I look for first: ambiguous state, duplicate submission, and trusting a status code. If you spot one I missed in the QA Lab above, tell me — that is exactly the conversation I want on a call.';
        list.appendChild(note);
      }
    }

    var reset = $('#chReset');
    if (reset) reset.addEventListener('click', render);

    render();
  })();

  /* ══════════════════════════════════════════════════════════════════
     Project filters
     ══════════════════════════════════════════════════════════════════ */
  (function filters() {
    var grid = $('#projGrid');
    if (!grid) return;
    var buttons = $$('#projFilters .filter');
    var empty = $('#filterEmpty');
    var cards = $$('.proj', grid);

    buttons.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-filter');

        buttons.forEach(function (o) {
          var on = o === b;
          o.classList.toggle('is-on', on);
          o.setAttribute('aria-pressed', on ? 'true' : 'false');
        });

        var shown = 0;
        cards.forEach(function (c) {
          var match = f === 'all' || (' ' + c.getAttribute('data-cat') + ' ').indexOf(' ' + f + ' ') > -1;
          c.hidden = !match;
          if (match) shown++;
        });

        if (empty) empty.hidden = shown > 0;
      });
    });
  })();

})();