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
section numbers, stack lists, tool names and the hero suite output.

No gradients, no glass, no glow, no decorative terminals, no counters. Nothing floats. Nothing
moves unless it is telling you something.

## Stack

Plain **HTML + CSS + vanilla JS**. No build step, no dependencies, no framework.

```
PORTFOLIIO/
├── index.html              # the whole document
├── css/style.css           # design tokens + layout + responsive
├── js/main.js              # theme, nav, drawer, scroll spy, reveal, anchors
├── js/play.js              # project category filters
├── assets/
│   ├── favicon.svg
│   ├── og.png              # 1200x630 social share card
│   ├── surfaces/           # android · ios · web · ussd device illustrations
│   ├── projects/           # library · plant · weather dashboard mockups
│   └── Balaji_Yalburgi_Resume.pdf
├── .nojekyll               # let GitHub Pages serve files as-is
└── README.md
```

## Sections

| | |
|---|---|
| — | Hero — the headline, plus the at a glance panel |
| 01 | About — what I do, and the four surfaces |
| 02 | Experience — two roles, dates set in the margin |
| 03 | Skills — six groups, by what they're for |
| 04 | Projects — three projects from the résumé, filterable |
| 05 | Education & Certifications |
| 06 | Contact |

## The hero

The headline, the supporting line, three calls to action, and the **at a glance** panel: current
role, contract route, the four surfaces, degree and languages. Six facts, no decoration.

## Images and visuals

No stock photography, and nothing that pretends to be a result it isn't.

**Social share card** — `assets/og.png`, a 1200x630 card wired to `og:image` / `twitter:image`.
Without it a shared link renders as a bare URL. To regenerate, edit the layout in a scratch HTML
file, render it at 1200x630 in headless Chrome, and write the PNG over `assets/og.png`.

**Project mockups** — `assets/projects/` holds one 16:9 dashboard per project:

| File | Source | Size |
|---|---|---|
| `library.jpg` | `Neon Library Borrowing Dashboard.png` | 111 KB |
| `plant.jpg` | `Dark Plant Health Detection Dashboard.png` | 96 KB |
| `weather.jpg` | `Weather Forecasting Dashboard.png` | 96 KB |

The originals are 1.4 MB PNGs. Each is cropped to remove the title band, which duplicated the card
heading, then downscaled to 1200px wide and re encoded as JPEG quality 88. That takes 4.2 MB down
to 303 KB, a 14x saving, with no visible loss on flat UI colour.

Each image carries an `INTERFACE MOCKUP` caption, because a fabricated `Confidence: 91%` should
never read as a measurement.

Every freely licensed photo source reachable from this machine was checked and rejected for
decorative use: Pexels 403, Unsplash 401, Wikimedia 429, and Openverse returns phones on white fur
and against cherry blossoms.

To swap in a real screenshot later, replace the `<img>` inside the `<figure class="shot">`, keep
the 16:9 ratio, update the `alt` text, and delete the `shot-cap` figcaption.

**Surface illustrations** — `assets/surfaces/` holds the four devices tested on the same product:
Android, iOS, Web and USSD. Hand rendered in the site palette.

## Typography rules

No hyphens, en dashes or em dashes anywhere in visible copy. Punctuation does the work instead:
parentheses for asides, full stops for beats, commas for continuations.

Identifiers keep their hyphens, because they are correct by convention and changing them would
make them wrong: ticket IDs (`INC-106`), the LinkedIn profile slug (`/in/balaji-yalburgi`), and the
required `viewport-fit=cover` meta value.

## Content honesty

- **Nothing is dressed up as real.** Each project image carries an INTERFACE MOCKUP caption for
- **Nothing is invented.** Missing detail is simply absent, never filled with a plausible number.
  There are no accuracy percentages, coverage figures, API results or benchmarks anywhere.
- **No contact form.** With no backend behind it, a "message sent!" confirmation would be a lie.
  Contact is `mailto:`, LinkedIn, GitHub and X.

### Before publishing

Project 4.3 says "cross browser functional testing of the interface". The résumé only says *cross
browser functional tests*, so confirm the browsers actually tested or narrow the wording.

## Craft details

- Reveal on scroll is gated behind a `.js` class set in `<head>`, so **the page is never blank if
  JavaScript fails**
- `prefers-reduced-motion` respected throughout
- Keyboard: skip link, visible focus rings, `aria-pressed` on filters, `Esc` closes the drawer
- Responsive and audited from **390px to 1440px**, zero horizontal overflow
- **System preference first**, then persisted to `localStorage`, applied before first paint
- Contrast: every text token measured against its real rendered background in **both themes**; all
  clear **WCAG AA (4.5:1)**
- Print stylesheet

## Verification

Three headless Chrome harnesses, all passing:

| Harness | Covers |
|---|---|
| `verify.js` | overflow at 1440 and 390, console errors, theme detection and persistence, nav integrity, section numbering, filters, hero layout, image decoding, drawer |
| `contrast.js` | 54 text targets x 2 themes x 2 viewports, measured from decoded screenshot pixels |
| `night.js` | section captures in the dark theme and on a phone |

## Run locally

```powershell
node C:\Users\balaj\AppData\Local\Temp\opencode\serve.js
```

or just open `index.html`.

## Deploy to GitHub Pages

Pages builds from the **`Balaji11`** branch, not `main`:

```bash
git push origin HEAD Balaji11
```

## Editing

| Change | Where |
|---|---|
| Any copy or section | `index.html` |
| Project categories | `data-cat` on each `.proj` in `index.html` |
| Project image slots | `<figure class="shot">` in each `.proj` |
| The defect life cycle visual | `<svg class="viz">` in About |
| Colours, type, spacing | `:root` / `[data-theme]` at the top of `css/style.css` |
| Résumé | replace `assets/Balaji_Yalburgi_Resume.pdf` |

## Contact

- **Email:** balajiyalburgi003@gmail.com
- **LinkedIn:** [linkedin.com/in/balaji-yalburgi](https://www.linkedin.com/in/balaji-yalburgi/)
- **GitHub:** [github.com/balajibalu003](https://github.com/balajibalu003)

---

© 2026 Balaji Yalburgi. No bugs were harmed in the making of this portfolio.