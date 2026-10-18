# Balaji Yalburgi — Portfolio

Personal site for **Balaji Yalburgi**, Software Test Engineer (QA automation, manual & API/mobile testing), Bangalore, India.

> **Live:** https://balajibalu003.github.io/Portfolio/

---

## The idea

The page is set as **an engineer's spec sheet** — the document a tester actually lives in.
Hairline rules, dotted leaders, section numbers in the left margin, a single vermilion accent.

**Two themes, and the visitor picks first.** On a first visit the site honours the operating
system's `prefers-color-scheme`. After that, whatever they choose is remembered. The choice is
applied before first paint, so there is no flash of the wrong theme.

Type does the work: **Inter** for reading, **IBM Plex Mono** for anything a machine would print —
section numbers, stack lists, tool names, the QA Lab's console output.

No gradients, no glass, no glow, no decorative terminals, no counters. Nothing floats. Nothing
moves unless it is telling you something.

## Stack

Plain **HTML + CSS + vanilla JS**. No build step, no dependencies, no framework.

```
PORTFOLIIO/
├── index.html              # the whole document
├── css/style.css           # design tokens + layout + responsive
├── js/main.js              # theme, nav, drawer, scroll spy, reveal, anchors
├── js/play.js              # hero panel, QA Lab, project filters
├── assets/
│   ├── favicon.svg
│   └── Balaji_Yalburgi_Resume.pdf
├── .nojekyll               # let GitHub Pages serve files as-is
└── README.md
```

## Sections

| | |
|---|---|
| — | Hero — the headline, and a demonstration suite you can actually run |
| 01 | About — what I do, and how a defect gets closed |
| 02 | Experience — two roles, dates set in the margin |
| 03 | Skills — six groups, by what they're for |
| 04 | Projects — three projects from the résumé, filterable |
| 05 | QA Lab — three features, all deterministic |
| 06 | Education & Certifications |
| 07 | Contact |

## The QA Lab

Three features under one tab strip. Everything is deterministic, self-contained, and makes no
network request. If the script fails to load, the page still reads.

**A · Break My UI** — a demo incident filter with **one deliberately seeded defect**: `INC-106`
is stored as `"Closed "` with a trailing space, so the count beside the filter and the rows it
renders disagree (three rows, label says two). You have to count the rows to notice — which is
the point. Rows expand to reproduction notes, there's a reveal and a full reset, and it is
completely isolated from the rest of the page.

**B · Test Runner** — seven predefined checks that actually run in your browser:

| Check | Kind |
|---|---|
| Navigation integrity | live |
| Email format | live |
| Body text contrast | live |
| Responsive breakpoint | live |
| Seeded defect still present | live |
| API response shape | *simulated* — hard-coded payload |
| Network timeout handling | *skipped* — no backend exists |

Simulated results are labelled simulated, and one check is deliberately skipped rather than faked.
Nothing here executes arbitrary input or touches a server.

**C · Edge-Case Challenge** — six scenarios (duplicate payment, dropped connection mid-checkout,
email validation, USSD session timeout, `200 OK` with an empty body, keyboard covering the submit
button). Pick what the app should do, then see why it matters, what the expected behaviour is,
and the edge case most people miss. Progress and a completion note track your answers.

## Content honesty

Everything here is drawn from the résumé. Two rules the site holds itself to:

- **Simulated is never dressed up as real.** The hero panel and the API check both say so on
  screen, not in a footnote.
- **Missing detail is visible, not invented.** Each project ends with a `To complete:` line
  listing what is genuinely still missing (repository links, screenshots, browsers tested) rather
  than a fabricated number.

There is **no contact form** — with no backend behind it, a "message sent!" confirmation would be
a lie. Contact is `mailto:`, LinkedIn, GitHub and X.

### Before publishing

Project 4.3 says "cross-browser functional testing of the front end" and its `To complete:` line
asks for the browsers actually tested. The résumé only says *cross-browser functional tests*, so
fill that in or leave the placeholder. No accuracy percentages, coverage figures, API results or
benchmarks are claimed anywhere.

## Craft details

- Reveal-on-scroll is gated behind a `.js` class set in `<head>`, so **the page is never blank
  if JavaScript fails**
- `prefers-reduced-motion` respected throughout
- Keyboard: skip link, visible focus rings, arrow-key tab navigation in the QA Lab, `aria-pressed`
  on filters, `aria-expanded` on row toggles, `Esc` closes the mobile drawer
- Responsive and audited from **390px to 1440px**, zero horizontal overflow
- **System preference first**, then persisted to `localStorage`, applied before first paint
- Contrast: every text token measured against its real rendered background in **both themes**;
  all clear **WCAG AA (4.5:1)**
- Print stylesheet

## Verification

Four headless-Chrome harnesses were used to check this build, all passing:

| Harness | Covers |
|---|---|
| `verify.js` | overflow @1440 + @390, console errors, theme detection & persistence, filters, the seeded defect, all three QA Lab features, drawer |
| `contrast.js` | 64 text targets × 2 themes × 2 viewports, measured from decoded screenshot pixels |
| `night.js` | section captures in the dark theme, including every QA Lab tab in its interacted state |

## Run locally

Open `index.html`, or serve it:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

Pages builds from the **`Balaji11`** branch, not `main`:

```bash
git push origin HEAD Balaji11
```

## Editing

| Change | Where |
|---|---|
| Any copy or section | `index.html` |
| Seeded defect (the trailing space) | `RAW` in `js/play.js` |
| QA Lab checks | `CHECKS` in `js/play.js` |
| Edge-case scenarios | `SCENARIOS` in `js/play.js` |
| Project categories | `data-cat` on each `.proj` in `index.html` |
| Colours, type, spacing | `:root` / `[data-theme]` at the top of `css/style.css` |
| Résumé | replace `assets/Balaji_Yalburgi_Resume.pdf` |

## Contact

- **Email:** balajiyalburgi003@gmail.com
- **LinkedIn:** [linkedin.com/in/balaji-yalburgi](https://www.linkedin.com/in/balaji-yalburgi/)
- **GitHub:** [github.com/balajibalu003](https://github.com/balajibalu003)

---

© 2026 Balaji Yalburgi. No bugs were harmed in the making of this portfolio. One was documented.