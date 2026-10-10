/* ==========================================================================
   Balaji Yalburgi — Portfolio · console.js
   Interactive QA Automation Simulator
   ========================================================================== */
(function () {
  'use strict';

  var out       = document.getElementById('labOut');
  var runBtn    = document.getElementById('runBtn');
  var fixBtn    = document.getElementById('fixBtn');
  var status    = document.getElementById('labStatus');
  var fill      = document.getElementById('labFill');
  var pct       = document.getElementById('labPct');
  var passEl    = document.getElementById('passCount');
  var failEl    = document.getElementById('failCount');
  var codeState = document.getElementById('codeState');
  var hint      = document.getElementById('labHint');

  if (!out || !runBtn) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fixed   = false;
  var running = false;
  var timers  = [];

  var SUITE = [
    { n: 'auth/login.spec.js',        d: 4, s: 'pass' },
    { n: 'wallet/transfer.spec.js',   d: 7, s: 'pass' },
    { n: 'profile/update.spec.js',    d: 3, s: 'pass' },
    { n: 'ussd/session.spec.js',      d: 5, s: 'pass' },
    { n: 'payments/history.spec.js',  d: 6, s: 'pass' },
    { n: 'api/status-codes.spec.js',  d: 8, s: 'pass' },
    { n: 'api/test_api.py::test_login', d: 2, s: 'FAIL' }
  ];

  function clearTimers() {
    timers.forEach(clearTimeout);
    timers = [];
  }

  function wait(ms) { return new Promise(function (r) { timers.push(setTimeout(r, reduced ? 0 : ms)); }); }

  function line(text, cls) {
    var p = document.createElement('p');
    if (cls) p.className = cls;
    p.textContent = text;
    out.appendChild(p);
    out.scrollTop = out.scrollHeight;
    return p;
  }

  function setStatus(text, cls) {
    if (!status) return;
    status.textContent = text;
    status.className = 'term-badge' + (cls ? ' ' + cls : '');
  }

  function setProgress(p) {
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = Math.round(p) + '%';
  }

  function reset() {
    clearTimers();
    out.innerHTML = '';
    setProgress(0);
    if (passEl) passEl.textContent = '0';
    if (failEl) failEl.textContent = '0';
    if (fixBtn) fixBtn.hidden = true;
    setStatus('idle', '');
    if (codeState) { codeState.textContent = fixed ? 'passing' : 'idle'; codeState.className = 'code-state' + (fixed ? ' pass' : ''); }
  }

  /* ---------- the run ---------- */
  async function runSuite() {
    if (running) return;
    running = true;

    reset();
    runBtn.disabled = true;
    if (fixBtn) fixBtn.hidden = true;
    setStatus('running', 'run');
    if (codeState) { codeState.textContent = 'running'; codeState.className = 'code-state'; }

    line('$ pytest --suite=portfolio -q', 'l-cyan');
    line('[SYSTEM] collecting test items…', 'l-dim');
    await wait(520);

    var passed = 0, failed = 0;

    for (var i = 0; i < SUITE.length; i++) {
      var t = SUITE[i];
      await wait(reduced ? 0 : 430);

      var isFail = (t.s === 'FAIL' && !fixed);

      if (isFail) {
        failed++;
        line('FAIL  ' + t.n, 'l-err');
        line('      AssertionError: expected title "Dashboard", got "Home"', 'l-warn');
        line('      assert response.body.title == "Dashboard"', 'l-dim');
        line('      ✗ 1 failed, 33 passed  (1.' + (2 + i) + 's)', 'l-err');
      } else {
        passed++;
        line('PASS  ' + t.n + '  (' + t.d + ' tests, 0.' + (3 + i) + 's)', 'l-ok');
      }

      if (passEl) passEl.textContent = String(passed);
      if (failEl) failEl.textContent = String(failed);
      setProgress(((i + 1) / SUITE.length) * 100);
    }

    await wait(300);

    if (failed === 0) {
      line('');
      line('✓ 35 passed in 2.41s — suite green, build ready for release sign-off.', 'l-ok');
      setStatus('passing', 'pass');
      if (codeState) { codeState.textContent = 'passing'; codeState.className = 'code-state pass'; }
      runBtn.disabled = false;
      runBtn.innerHTML = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M6 4l14 8-14 8z"/></svg> Re-run Suite';
      if (hint) {
        hint.innerHTML = 'All <strong>7 tests are green</strong>. The assertion now checks the real API ' +
          'response — this is exactly the kind of mismatch I catch before a build ships. Run it again any time.';
      }
    } else {
      line('');
      line('✗ 1 failed, 34 passed — defect FIN-2481 ready to log in Jira.', 'l-err');
      setStatus('failed', 'fail');
      if (codeState) { codeState.textContent = 'failed'; codeState.className = 'code-state fail'; }
      runBtn.disabled = false;
      if (fixBtn) fixBtn.hidden = false;
      if (hint) {
        hint.innerHTML = 'The API returns <code>"Home"</code>, but the test asserts <code>"Dashboard"</code>. ' +
          'A stale expectation — the classic red test. Hit <strong>Fix Assertion Bug</strong> to correct it.';
      }
    }

    running = false;
  }

  /* ---------- the fix ---------- */
  function fixAssertion() {
    if (fixed || running) return;
    fixed = true;

    // update the code panel
    var bad = document.querySelector('.code .bad');
    if (bad) {
      bad.textContent = '"Home"';
      bad.classList.add('fixed');
    }

    if (fixBtn) fixBtn.hidden = true;

    // badge flash on the file label
    if (codeState) { codeState.textContent = 'patched'; codeState.className = 'code-state'; }

    if (out) {
      out.innerHTML = '';
      line('$ patch test_api.py', 'l-cyan');
      line('- assert response.body.title == "Dashboard"', 'l-err');
      line('+ assert response.body.title == "Home"', 'l-ok');
      line('[INFO] Assertion corrected. Re-running failed test…', 'l-dim');
    }

    window.setTimeout(function () { runSuite(); }, reduced ? 0 : 650);
  }

  runBtn.addEventListener('click', runSuite);
  if (fixBtn) fixBtn.addEventListener('click', fixAssertion);

  /* initial state */
  setStatus('idle', '');
  setProgress(0);
})();
