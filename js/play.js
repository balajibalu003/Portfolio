/* ==========================================================================
   Balaji Yalburgi - portfolio · play.js
   Everything interactive:
     · project category filters

   Deterministic. No network. No eval. No arbitrary input.
   ========================================================================== */
(function () {
  'use strict';

  var $  = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ══════════════════════════════════════════════════════════════════
     Project filters

     Categories come from data-cat on each .proj. A card matches when its
     list contains the active filter, e.g. data-cat="api web" matches both.
     ========================================================================== */
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
          var cats = c.getAttribute('data-cat') || '';
          var match = f === 'all' || (' ' + cats + ' ').indexOf(' ' + f + ' ') > -1;
          c.hidden = !match;
          if (match) shown++;
        });

        if (empty) empty.hidden = shown > 0;
      });
    });
  })();

})();