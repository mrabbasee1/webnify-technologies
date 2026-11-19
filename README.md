# Webnify Technologies — Website

Marketing website for **Webnify Technologies** — a full-service studio for web
development, CMS platforms, online stores and SEO.

**Live site:** https://www.webnifytechnologies.com/ (English) and
https://www.webnifytechnologies.com/hu/ (Hungarian).

## What's here

- `index.html` — the English homepage (CSS and the page script are inline)
- `hu/index.html` — the Hungarian homepage, same layout and code
- `assets/` — shared by both pages, so the second page loads from cache:
  - `img/` — WebP images (hero and portfolio captures, About photo), SVG logos,
    favicon and apple-touch-icon
  - `fonts/` — Poppins and Sora (woff2, Latin and Latin Extended subsets)
  - `js/vendor/` — GSAP 3.15 (core, ScrollTrigger, SplitText) and Lenis 1.1.14
  - `js/motion.js` — the scroll animations
- `.htaccess` — compression and browser caching for Hostinger
- `og.jpg`, `robots.txt`, `sitemap.xml`

## Sections

Hero (connected-dots animated background + interactive project showcase) ·
Trust strip · Stats · Services · Selected work · Process · About · Team ·
Testimonials · Contact · "Request a quote" modal.

## Tech / features

- **Interactive hero showcase** — a browser frame cycling through live client
  sites: clickable project tabs, 5-second auto-rotate, and a hover interaction
  that smoothly scrolls the preview to reveal the full page
- Responsive (desktop, tablet, mobile) with a mobile menu
- **Motion (GSAP):** the hero enters word by word (pure CSS, so it never waits
  for JavaScript); every section heading rises word by word out of a mask as it
  scrolls in; cards, stats, steps, reviews, form fields and footer columns
  stagger in; the About photo opens with a clip-path reveal; the process line
  draws itself; desktop adds parallax depth, a hero that drifts away on scroll
  and magnetic buttons; a thin green reading-progress bar sits on top.
  Respects `prefers-reduced-motion` (no GSAP is even downloaded then) and falls
  back to the original CSS reveals if the scripts cannot load.
- Count-up stats, sticky header, connected-dots canvas network in the hero
- Uniquely designed "Request a quote" modal
- SEO: meta description, canonical, Open Graph, Twitter cards, JSON-LD
  Organization schema, semantic `<main>`, descriptive alt text
- Speed: ~210 KB HTML (was 4 MB with base64 images), images and fonts as
  cached files, first hero capture preloaded on desktop with a 720 px version
  for phones, portfolio captures loaded only when the Work section is near,
  GSAP fetched after the page has loaded, canvases and marquees pause off
  screen, smooth scrolling (Lenis) only on mouse/trackpad devices
- Brand: Deep Navy `#0B2D5B`, Tech Green `#76E000`, Sora headings, Poppins body

## Deploy

The live site is served by GitHub Pages from the `main` branch: every push to
`main` is live on https://www.webnifytechnologies.com/ within a few minutes. The
`CNAME` file holds the custom domain: the www address, which GitHub recommends
for Pages (the bare domain redirects to it). The domain is registered at Hostinger,
and its DNS (Hostinger nameservers) points to GitHub Pages: four `A` records
for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153)
and a `CNAME` record for `www` to `mrabbasee1.github.io`.

To move to Hostinger hosting (or any static host) instead, upload
`index.html`, the `hu/` and `assets/` folders, `.htaccess`, `og.jpg`,
`robots.txt` and `sitemap.xml` to the web root (`public_html/`) and point the
DNS there. No build or server needed.

After editing `assets/js/motion.js`, raise its `?v=` number in both pages. To
replace an image or font straight away for returning visitors, give it a new
file name (on Hostinger, `.htaccess` lets browsers keep assets for 30 days).

## Roadmap

- Separate pages: Services, Work, About, Contact
- Real team photos and names
- Wire the contact / quote forms to an email or form endpoint
- Final contact details

---

© 2026 Webnify Technologies. Code scaffolded with Claude.
