# Balaji Yalburgi — Portfolio

Personal site for **Balaji Yalburgi**, Software Test Engineer (QA automation, manual & API/mobile testing), Bengaluru, India.

> **Live:** https://balajibalu003.github.io/Portfolio/

---

## The idea

**Acid editorial.** Bone paper by day, near black by night, one orange accent used sparingly
and always at full weight. Bricolage Grotesque for display, Inter for reading, JetBrains Mono for
labels. A film grain overlay sits over the solid colour so flat surfaces never look flat.

**Two themes, and the visitor picks first.** On a first visit the site honours the operating
system's `prefers-color-scheme`. After that, whatever they choose is remembered. The choice is
applied before first paint, so there is no flash of the wrong theme.

The accent rules: orange carries black text on fills (buttons, the wordmark tile, the
education card, the active nav pill), but it is never used for small text on the paper theme.
Small accent labels use the vermilion from the first version of this site, which measures 5.5:1 on paper.

The Gen Z layer sits on top of that restraint: sticker chips with hard offset shadows (class of 2025,
built and tested, no forms, open to work), a skill marquee that alternates filled and outlined words,
an orange halftone dot grid behind the hero, and a tilted highlighter on the word not in the headline.

## Recruiter snapshot

Instead of a separate "recruiter view", the résumé facts live in a **snapshot card** on the right
of the hero, visible from the first paint: four counted numbers (50+ automated cases, 10+ sprints,
4 surfaces, 7 certifications) and six facts (role, current employer, contract route, location,
degree and CGPA, languages). A recruiter gets the who, where and what in one glance.

## Stack

Plain **HTML + CSS + vanilla JS**. No build step, no dependencies, no framework, no animation
library.

```
PORTFOLIIO/
├── index.html              # the whole document
├── css/style.css           # design tokens + grain + layout + responsive ladder
├── js/main.js              # theme, drawer, reveal, scroll spy, filters, counters, motion
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
| — | Hero — headline plus the snapshot card |
| — | Skill marquee — between hero and About, pausable on hover |
| 01 | About — what I do, and the four surfaces |
| 02 | Experience — two roles, dates sticky in the margin |
| 03 | Skills — six cards in a bento grid |
| 04 | Projects — three projects from the résumé, filterable |
| 05 | Education & Certifications |
| 06 | Contact |

## Motion

Additive, never load bearing. Everything under `prefers-reduced-motion` reduced is simply off.

- staggered reveal on scroll (IntersectionObserver, one pass each)
- hero headline line rise
- skill marquee (duplicated group + `translateX(-50%)`, pauses on hover)
- counted numbers in the snapshot
- card tilt plus a spotlight that follows the pointer (fine pointers only)
- magnetic pull on primary buttons
- sliding accent pill in the nav, animated to the active section from real measurements
- View Transitions API cross fade on the theme toggle, where supported

## Responsive ladder

Audited at 360, 390, 768, 1024, 1440, 1920 and 2560 with zero horizontal overflow.

| Range | Behaviour |
|---|---|
| 360–479 | single column, full width buttons, surfaces become a snap scroll rail |
| 480–899 | single column, two up bento skills |
| 900–1439 | two column hero, sticky experience dates, full bento |
| 1440–1799 | full layout, 1200px measure |
| 1800+ (TV) | 1560px measure, type steps up, hero fills the screen vertically, 52px minimum targets, 3px focus rings |
| 2560+ | independent clamp ceiling |

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

The originals are 1.4 MB PNGs, cropped to remove the title band, downscaled to 1200px and re
encoded as JPEG quality 88: 4.2 MB down to 303 KB, with no visible loss on flat UI colour.

Each image carries an `INTERFACE MOCKUP` caption, because a fabricated `Confidence: 91%` should
never read as a measurement.

To swap in a real screenshot later, replace the `<img>` inside the `<figure class="shot">`, keep
the 16:9 ratio, update the `alt` text, and delete the `shot-cap` figcaption.

**Surface illustrations** — `assets/surfaces/` holds the four devices tested on the same product:
Android, iOS, Web and USSD. Hand rendered in the site palette.

## Typography rules

No hyphens, en dashes or em dashes anywhere in visible copy. Punctuation does the work instead:
parentheses for asides, full stops for beats, commas for continuations.

Identifiers keep their hyphens, because they are correct by convention and changing them would
make them wrong: the LinkedIn profile slug (`/in/balaji-yalburgi`), and the required
`viewport-fit=cover` meta value.

## Content honesty

- **Nothing is dressed up as real.** Each project image carries an INTERFACE MOCKUP caption.
- **Nothing is invented.** Missing detail is simply absent, never filled with a plausible number.
  There are no accuracy percentages, coverage figures, API results or benchmarks anywhere.
- **No contact form.** With no backend behind it, a "message sent!" confirmation would be a lie.
  Contact is `mailto:`, LinkedIn, GitHub and X.

## Craft details

- Reveal on scroll is gated behind a `.js` class set in `<head>`, so **the page is never blank if
  JavaScript fails**
- `prefers-reduced-motion` respected throughout; tilt and magnet only on fine pointers
- Keyboard: skip link, visible focus rings, `aria-pressed` on filters, `Esc` closes the drawer
- **System preference first**, then persisted to `localStorage`, applied before first paint
- Contrast: 51 text targets measured against their real rendered backgrounds by decoding
  screenshot pixels, in both themes at 1440 and 390; 204 measurements, **all clear WCAG AA 4.5:1**
- Print stylesheet

## Verification

Headless Chrome harnesses driven over the DevTools protocol, all passing:

| Harness | Covers |
|---|---|
| functional suite | theme detection, persistence and toggle; anchor integrity; section numbering; counts of nav links, stats, facts, projects, certs, surfaces; removed features stay removed; webfonts loaded; masthead, progress bar, reveal, nav pill, counters; all five filter states; no overflow at 360 to 2560; drawer open and escape; reduced motion; copy button and mailto; résumé links; no console errors; no stray hyphens in copy |
| contrast suite | 51 text targets x 2 themes x 2 viewports, measured from decoded screenshot pixels |
| capture suite | section and viewport screenshots at 360, 390, 768, 1440, 1920 and TV, both themes |

## Run locally

```powershell
node C:\Users\balaj\AppData\Local\Temp\opencode\serve.js
```

or just open `index.html`.

## Deploy to GitHub Pages

Pages builds from the **`Balaji11`** branch, not `main`. Nothing is pushed without a look at local
first:

```bash
git push origin HEAD:Balaji11
```

## Editing

| Change | Where |
|---|---|
| Any copy or section | `index.html` |
| Project categories | `data-cat` on each `.proj` in `index.html` |
| Project image slots | `<figure class="shot">` in each `.proj` |
| Colours, type, spacing, TV steps | `:root` / `[data-theme]` and the media queries at the bottom of `css/style.css` |
| Motion intensity | the reveal, counters, tilt and magnet blocks in `js/main.js` |
| Résumé | replace `assets/Balaji_Yalburgi_Resume.pdf` |

## Contact

- **Email:** balajiyalburgi003@gmail.com
- **LinkedIn:** [linkedin.com/in/balaji-yalburgi](https://www.linkedin.com/in/balaji-yalburgi/)
- **GitHub:** [github.com/balajibalu003](https://github.com/balajibalu003)

---

© 2026 Balaji Yalburgi. Every bug has a story. Let's find it.
