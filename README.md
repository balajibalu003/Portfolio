# Balaji Yalburgi — Portfolio

Personal portfolio site for **Balaji Yalburgi**, Software Test Engineer (QA Automation, Manual & API/Mobile Testing), Bangalore, India.

> **Live:** https://balajibalu003.github.io/Portfolio/

---

## Stack

Plain **HTML + CSS + vanilla JS** — no build step, no dependencies, no framework.

```
PORTFOLIIO/
├── index.html              # single page, all sections
├── css/style.css           # design system + full responsive layer
├── js/main.js              # nav, theme, scroll reveal, counters, typing, skills
├── js/console.js           # interactive QA Automation Simulator
├── assets/
│   ├── favicon.svg
│   └── Balaji_Yalburgi_Resume.pdf
├── .nojekyll               # lets GitHub Pages serve files as-is
└── README.md
```

## Sections

Hero · Stats · About · Skills · QA Automation Simulator · Experience · Projects · Education & Certifications · Contact

## Features

- **Refined QA/terminal theme** — dark mode by default, full light mode, theme persisted to `localStorage`
- **Fully responsive** — verified layout from 320px phones through tablets, laptops and ≥1700px wide screens
- **Interactive QA Automation Simulator** — run a 7-test suite, catch the red assertion, patch it, watch the suite go green
- **Animated stat counters** that tick up when scrolled into view
- **Skill explorer** — hover/tap any skill for a description of how it's used
- **Typing effect, scroll-reveal, scroll progress bar, scroll-spy nav, back-to-top**
- **Accessible** — skip link, semantic HTML, ARIA labels, keyboard support, `prefers-reduced-motion` respected
- **SEO** — meta description, canonical, Open Graph and Twitter card tags
- **Print-friendly** stylesheet

## Run locally

Just open `index.html` in a browser. Or serve it:

```bash
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Create a repository named **`Portfolio`** (or push to your existing one).
2. Push these files to the branch you want to serve (e.g. `main`):

   ```bash
   git init
   git add .
   git commit -m "Portfolio site"
   git branch -M main
   git remote add origin https://github.com/balajibalu003/Portfolio.git
   git push -u origin main --force
   ```

3. On GitHub: **Settings → Pages → Build and deployment**
   - Source: **Deploy from a branch**
   - Branch: **`main`** / **`/ (root)`** → **Save**

4. Your site goes live at `https://balajibalu003.github.io/Portfolio/`

> `.nojekyll` is already included so GitHub Pages serves every file untouched.

## Updating content

All content lives in `index.html`. Common edits:

| Change | Where |
|---|---|
| Stats numbers | `data-count` on `.stat-num` in the `stats` block |
| Skills | `.chip` buttons — label is the text, description goes in `data-detail` |
| Experience bullets | `.tl-list` items under `#experience` |
| Projects | `.proj` cards under `#projects` |
| Certifications | `.cert` cards under `#certs` |
| Colors / theme | `:root` and `[data-theme]` variables at the top of `css/style.css` |
| Resume file | replace `assets/Balaji_Yalburgi_Resume.pdf` |

## Contact

- **Email:** balajiyalburgi003@gmail.com
- **Phone:** +91 82962 07282
- **LinkedIn:** [linkedin.com/in/balaji-yalburgi](https://www.linkedin.com/in/balaji-yalburgi/)
- **GitHub:** [github.com/balajibalu003](https://github.com/balajibalu003)

---

© 2026 Balaji Yalburgi. All rights reserved.
