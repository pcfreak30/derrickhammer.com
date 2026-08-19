# DerrickHammer.com

Personal website for a senior software/systems engineer and technical founder.

Built with [Astro](https://astro.build) — fully static, minimal dependencies, no client-side framework.

## Quick Start

```sh
npm install      # install dependencies
npm run dev      # start dev server at localhost:4321
npm run build    # build production site to ./dist/
npm run preview  # preview the production build locally
npm run check    # run astro check (types + diagnostics)
```

## SEO & Metadata

- **Sitemap:** [@astrojs/sitemap](https://www.npmjs.com/package/@astrojs/sitemap) generates `sitemap-index.xml` at build.
- **robots.txt:** `public/robots.txt` points to the generated sitemap index.
- **Open Graph / Twitter:** `og:*` and `twitter:*` meta tags pointing at a 1200×630 card generated at build time with `satori` + `@resvg/resvg-js` in `src/lib/og-template.ts` (prerendered to `/images/og/default.png`).
- **Structured data:** JSON-LD `Person` / `WebSite` / `WebPage` graph in `BaseLayout.astro`.

## Project Structure

```text
/
├── public/
│   └── images/          # pinner.png (featured work screenshot)
├── src/
│   ├── components/
│   │   ├── About.astro
│   │   ├── CapabilityList.astro
│   │   ├── Contact.astro
│   │   ├── ExternalLink.astro
│   │   ├── FeaturedProject.astro
│   │   ├── Hero.astro
│   │   ├── OpenSourceItem.astro
│   │   ├── Section.astro
│   │   ├── SectionHeading.astro
│   │   ├── SiteFooter.astro
│   │   ├── SiteHeader.astro
│   │   └── TechStack.astro
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── lib/
│   │   └── og-template.ts   # build-time OG image generation
│   ├── pages/
│   │   ├── images/og/default.png.ts
│   │   └── index.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs
├── tsconfig.json
└── package.json
```

## Design System

- **Palette:** warm neutral background, near-black text, single terracotta accent
- **Dark mode:** automatic via `prefers-color-scheme`, manual toggle in the header
- **Typography:** system font stacks (sans + mono), fluid `clamp()` scale
- **Layout:** 1240px max-width shell, 760px prose column, generous vertical rhythm
- **Motion:** subtle opacity/translate reveals via IntersectionObserver, respects `prefers-reduced-motion`

## Deployment

The build output in `./dist/` is fully static and suitable for any static host, including IPFS-based content-addressed hosting. No proprietary runtime, server functions, or database required. The Open Graph image is rendered during `npm run build`, so no runtime image service is needed either.
