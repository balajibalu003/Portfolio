# Balaji Yalburgi — Portfolio

Personal site for **Balaji Yalburgi**, Software Test Engineer (QA automation, manual & API/mobile testing), Bangalore, India.

> **Live:** https://balajibalu003.github.io/Portfolio/

---

## The idea

The page is set as **an engineer's spec sheet** — the document a tester actually lives in.
**Night by default**: a near-black canvas with a drafting-instrument schematic behind the
hero, a single vermilion accent, hairline rules, dotted leaders and margin-set metadata.
Paper is one click away via the `Aa` toggle in the masthead.

Type does the work: **Instrument Serif** for editorial moments, **IBM Plex Sans** for
reading, **IBM Plex Mono** for anything a machine would print.

No gradients, no glass, no glow, no decorative terminals, no counters. Section numbers sit in
the left margin like a printed document.

## Stack

Plain **HTML + CSS + vanilla JS**. No build step, no dependencies, no framework.

```
PORTFOLIIO/
├── index.html              # the whole document
├── css/style.css           # design system + responsive + interactive layer
├── js/main.js              # nav, theme, scroll spy, reveal, anchors
├── js/play.js              # the interactive layer (see below)
├── assets/
│   ├── favicon.svg
│   └── Balaji_Yalburgi_Resume.pdf
├── .nojekyll               # let GitHub Pages serve files as-is
└── README.md
```

## Sections

| | |
|---|---|
| 01 | Context — the year, and how a defect actually gets closed |
| 02 | Testing — every test type, what it involves, where it runs |
| 03 | Toolkit — dotted-leader ledger of tools and practice |
| 04 | Work — two roles, dates set in the margin |
| 05 | Projects — three case studies, three different layouts |
| 06 | Break My UI — an isolated demo with one seeded defect |
| 07 | Credentials — degree, certifications, languages |
| 08 | Contact |

### Projects get three different layouts

They are three different problems, so they are three different pages:

- **Library Management System** → a *ledger*: modules, operations and the layer each is tested at
- **AI-Powered Plant Health Detection** → a real *coverage matrix*, vertical column labels, filled cells
- **Weather Forecasting Web App** → a *contract*: request/response blocks with what was checked

Each also carries a `<details>` "How I approached this" note — progressive disclosure, no JS.

## The interactive layer (`js/play.js`)

Five things, each earning its place. None of them are required to read the page, and all of
them degrade to plain content if the script fails to load.

**Pointer inspector** *(hero, desktop only)* — a small readout showing live pointer
coordinates and what sits under the cursor. It reads the page the way a tester inspects one.

**Break My UI** *(section 06)* — a demo incident filter with **one deliberately seeded
defect**: `INC-106` is stored as `"Closed "` with a trailing space, so the count beside the
filter and the rows it renders disagree. You have to count the rows to notice — which is the
point. It has a reveal, a full reset, expandable reproduction notes, and is completely isolated
from real navigation. Rows render statically, so it still reads correctly without JS.

**Console** *(click the button, or press `~`)* — a real interface over a fixed command map.
It never evaluates anything.

```
help        this list          qa       toggle QA annotations
about       who is typing this theme    paper / night
projects    jump to projects   defect   read the PORT-0001 write-up
status      portfolio status   bug      look for trouble
coffee      a developer-grade beverage
clear / close
```

**QA mode** *(press `q`)* — annotates the page with what was actually checked on it
("sticky offset", "dotted leaders, not chips", "1 seeded defect, fully isolated").

**Do not click** *(footer)* — a button that asks not to be clicked. It escalates.

Hidden touches: the footer reveals *"Exploratory testing completed — you found the human."*
once three discoveries are made, and a 2px hairline tracks scroll at the very top.

## Craft details

- Reveal-on-scroll is gated behind a `.js` class set in `<head>`, so **the page is never blank
  if JavaScript fails**
- `prefers-reduced-motion` respected throughout; the inspector hides itself on touch devices
- Keyboard: skip link, visible focus rings, `aria-pressed` on filters, `aria-expanded` on row
  toggles, focus returned to the console trigger on close, `~` / `q` / `Esc` shortcuts
- Responsive and hand-checked from **320px to 1920px**, zero horizontal overflow
- **Night by default**, paper as the alternate; either choice is persisted to `localStorage`
  and applies before first paint, so there is no flash of the wrong theme
- Print stylesheet

## Run locally

Open `index.html`, or serve it:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

```bash
git remote add origin https://github.com/balajibalu003/Portfolio.git
git push -u origin main --force
```

Then **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/(root)`**.

`.nojekyll` is already included so GitHub Pages serves every file untouched.

## Editing

| Change | Where |
|---|---|
| Any copy or section | `index.html` |
| Seeded defect (the trailing space) | `INC-106` in `RAW` in `js/play.js` |
| Console commands | `HANDLERS` in `js/play.js` |
| QA-mode annotations | `data-qa="…"` attributes in `index.html` |
| Colours, type, spacing | `:root` / `[data-theme]` at the top of `css/style.css` |
| Résumé | replace `assets/Balaji_Yalburgi_Resume.pdf` |

### Content honesty

Everything is drawn from the résumé and the previous site. The one place to check before
publishing: section 05.3 lists Chrome / Firefox / Safari under "cross-browser" — the résumé
only says *cross-browser functional tests*, so confirm those are the browsers actually tested,
or edit that list.

## Contact

- **Email:** balajiyalburgi003@gmail.com
- **Phone:** +91 82962 07282
- **LinkedIn:** [linkedin.com/in/balaji-yalburgi](https://www.linkedin.com/in/balaji-yalburgi/)
- **GitHub:** [github.com/balajibalu003](https://github.com/balajibalu003)

---

© 2026 Balaji Yalburgi. No bugs were harmed in the making of this portfolio. One was documented.