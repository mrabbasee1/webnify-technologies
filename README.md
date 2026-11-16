# Webnify Technologies — Website

Marketing website for **Webnify Technologies** — a full-service studio for web
development, CMS platforms, online stores and SEO.

**Live preview (private, in progress):** built and iterated via Claude.

## What's here

- `index.html` — the full homepage. It is a single, self-contained file: all
  CSS, JavaScript, fonts reference and images (base64) are inline, so it can be
  dropped onto any static host with no build step.

## Sections

Hero (connected-dots animated background + interactive project showcase) ·
Trust strip · Stats · Services · Selected work · Process · About · Team ·
Testimonials · Contact · "Request a quote" modal.

## Tech / features

- **Interactive hero showcase** — a browser frame cycling through live client
  sites: clickable project tabs, 5-second auto-rotate, and a hover interaction
  that smoothly scrolls the preview to reveal the full page
- Responsive (desktop, tablet, mobile) with a mobile menu
- Scroll-reveal animations, count-up stats, sticky header
- Connected-dots canvas network in the hero (respects `prefers-reduced-motion`)
- Uniquely designed "Request a quote" modal
- SEO: meta description, canonical, Open Graph, Twitter cards, JSON-LD
  Organization schema, semantic `<main>`, descriptive alt text
- Speed: single file / single request, no framework, compressed assets,
  lazy-loaded below-the-fold images, font preconnect
- Brand: Deep Navy `#0B2D5B`, Tech Green `#76E000`, Montserrat typeface

## Deploy (Hostinger or any static host)

Upload `index.html` to the web root (`public_html/`). No build or server needed.

## Roadmap

- Separate pages: Services, Work, About, Contact
- Real team photos and names
- Wire the contact / quote forms to an email or form endpoint
- Final contact details and production domain

---

© 2026 Webnify Technologies. Code scaffolded with Claude.
