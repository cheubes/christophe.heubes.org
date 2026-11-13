# Technical specifications

## Technical stack

### Site generation

- **Jekyll 4.4**: layouts, includes, front matter, `_data/`, pages (no collections).
- **Ruby 3.3.12** (`.ruby-version`), used for the maintenance scripts in addition to Jekyll (see "Local maintenance scripts" below).
- `webrick` (local development server), `html-proofer` (dead link checking in CI, see "Hosting and deployment").
- No gem-packaged Jekyll plugin (the `Gemfile` only declares `jekyll`, `webrick`, `html-proofer`): the site's two build extensions are local files in `_plugins/`, loaded automatically by Jekyll (see "Architecture").

### CSS / UI

- **LESS**, compiled to CSS by a Jekyll hook (`_plugins/less_compiler.rb`, see "Local maintenance scripts") rather than at build time: a single source file, `assets/css/hbs.less`, compiled to `assets/dist/css/hbs.css`.
- **Bootstrap 5**: grid, cards, modal (lightbox), form components. Unlike other projects by the author, the files are **vendored** in `assets/dist/`, not loaded from a CDN.
- **Font Awesome**, loaded through a remote Kit (`https://kit.fontawesome.com/7dfeb2d2f7.js`), not through a regular CDN stylesheet.
- **Google Fonts**: Ubuntu (body text) and Raleway (headings), see `style-guide.md`.
- **BeerSlider** (vendored in `assets/dist/`): slider-based before/after comparator, used only on the technical drawings list view (see `screens/technical-drawing.md`).
- Design values (colors, typography, spacing) are defined in `style-guide.md`, not here.

### JavaScript

- **Vanilla JS** for all interactions: the photo gallery lightbox (`assets/dist/js/gallery.js`, see "Permalinks" below) and the BeerSlider initialization (inline script in `technical-drawing.html`).
- No JS framework (no React, Vue, Angular), no bundler.
- `assets/dist/js/less.min.js` (browser-side LESS runtime) is present in the repository but referenced by no page: leftover file, not to be used as a reference for the site's actual LESS compilation (see "Local maintenance scripts").

### What we don't use

- Node.js, JS bundler, custom CSS framework beyond Bootstrap.
- Database, backend or own API.
- Cookies, tracking, analytics.
- Data validation script (see "General conventions" in `data-model.md`).

---

## Hosting and deployment

- **Host:** GitHub Pages
- **Domain:** `christophe.heubes.org` (`CNAME` file at the root)
- **Deployment:** automatic, through GitHub Actions (`.github/workflows/jekyll.yml`), triggered on push to the `master` branch, or manually (`workflow_dispatch`)
- **Build:** `bundle exec jekyll build`, run explicitly in the workflow rather than delegated to the native GitHub Pages integration. This difference has a direct consequence on plugins: a native GitHub Pages build runs in *safe* mode, which ignores `_plugins/`; this custom workflow does not, so `_plugins/gallery_photo_pages.rb` and `_plugins/less_compiler.rb` do run on every deployment (see "Architecture").
- **Link checking:** `html-proofer` runs on `_site/` after the build, with `continue-on-error` (reports dead links without failing the deployment); a list of external domains is explicitly ignored (Google Fonts, Font Awesome Kit, Goodreads, Instagram); Instagram consistently answers 429 (rate limiting) to requests coming from CI.

---

## Local maintenance scripts

Three mechanisms of the site follow the same principle: generated locally by the author, their output is committed to the repository, nothing is recomputed at build time or in CI beyond the LESS compilation.

| Mechanism | File | Role | Trigger |
|---|---|---|---|
| Gallery thumbnails | `scripts/generate_gallery_thumbnails.rb` | Generates `<slug>-thumb.<ext>` for each photo listed in `_data/<gallery>.yml`, with `sips` (macOS tool), 800 px on the longest side, quality 75; then copies the original's author/license metadata with `exiftool` (Homebrew, required locally), as `sips` only keeps part of it (see "Image metadata" in `data-model.md`) | Manual, after adding photos |
| Technical drawing detail pages | `scripts/generate_technical_drawing_pages.rb` | Generates the Markdown files `content/technical-drawing/<id>.md` and `<id>-en.md` from `_data/technical-drawing.yml` | Manual, after changing `_data/technical-drawing.yml` |
| LESS → CSS compilation | `_plugins/less_compiler.rb` | Recompiles `assets/dist/css/hbs.css` from `assets/css/hbs.less` if the source is newer than the compiled file | Jekyll hook (`pre_render`), on every local `jekyll serve`/`jekyll build` |

Point of attention for the LESS compilation: it is the only one of the three mechanisms that is *not* a script to run explicitly, but a Jekyll hook that runs silently on every build. It depends on the `lessc` binary, which is only installed on the development machine (not in the deployment workflow's CI environment): in CI, the hook fails silently (`system(...)` without exit code check) and the build goes on with the already committed `hbs.css`. Any change to `assets/css/hbs.less` must therefore be compiled locally (`bundle exec jekyll build` or `jekyll serve` with `lessc` installed) and its output committed before pushing, otherwise the deployed site does not reflect the change.

---

## Architecture (page generation, routing)

### Rendering

The site is fully static, generated at build time by Jekyll. No dynamic server-side rendering, no own API.

### Two page generation mechanisms

The site's two content families (see `data-model.md`) do not generate their individual pages the same way:

- **Photo galleries**: the grid pages (`content/<gallery>.md`) are regular Jekyll pages; the individual photo pages are generated **in memory on every build**, by `_plugins/gallery_photo_pages.rb` (`Jekyll::Generator`), from `_data/<gallery>.yml`. They do not exist as files anywhere in the repository.
- **Technical drawings**: the list page (`content/technical-drawing.md`) is a regular Jekyll page; the detail pages are **committed Markdown files**, regenerated locally by `scripts/generate_technical_drawing_pages.rb` (see above) rather than at build time.

This asymmetry stems from the comment in the technical drawing generation script, which assumes a GitHub Pages build in *safe* mode (where `_plugins/` is ignored). The current deployment workflow is not in *safe* mode (see "Hosting and deployment"): the technical drawing page generation could therefore, in theory, follow the same plugin mechanism as the photo galleries. To be checked before any change on this point: either this original assumption is still justified for another reason, or the two mechanisms could be unified.

### URL structure

| URL | Content |
|---|---|
| `/` | Home (French, default language) |
| `/en/` | Home (English) |
| `/<gallery>/` | Photo gallery grid (FR); `<gallery>` ∈ `under-water`, `street-art`, `deambulations` |
| `/en/<gallery>/` | Photo gallery grid (EN) |
| `/<gallery>/<slug>/` | Grid with the lightbox open on a specific photo (FR) |
| `/en/<gallery>/<slug>/` | Same (EN) |
| `/technical-drawing/` | Technical drawings list (FR) |
| `/en/technical-drawing/` | Technical drawings list (EN) |
| `/technical-drawing/<id>/` | Drawing detail (FR) |
| `/en/technical-drawing/<id>/` | Drawing detail (EN) |
| `/404.html` | Page not found, shared by both languages (see `data-model.md`) |

### Permalinks and lightbox URL synchronization

Each photo of a gallery has its own permanent URL (`/<gallery>/<slug>/`, see above), already generated statically: it is not a synthetic URL built in JavaScript. Clicking a thumbnail (see `screens/gallery.md`) opens the lightbox on that photo and updates the browser URL to its dedicated URL through `history.pushState`, without reloading the page; previous/next navigation in the lightbox updates the URL the same way (`history.replaceState`). Closing the lightbox restores the underlying grid URL. The browser back/forward buttons (`popstate`) are handled symmetrically: opening, changing photo or closing the lightbox depending on the restored URL.

Direct access to a photo's URL (shared link, or page reload) loads the page generated for that photo, which displays the grid with the lightbox already open on load (`data-open-slug` on the modal element, read by `gallery.js`).

### Interface strings

Unlike other projects by the author, there is no centralized file of interface strings per language: each conditional label (e.g. "Retour aux dessins techniques" / "Back to technical drawings") is written directly in the layouts and includes, as `{% if page.lang == 'fr' %}...{% else %}...{% endif %}`.

---

## Performance

- Gallery thumbnails and technical drawing images lazy-loaded (native `loading="lazy"`).
- Thumbnails generated at 800 px on the longest side, JPEG quality 75 (see "Local maintenance scripts"): the grid never loads full-resolution photos, which are reserved for the lightbox.
- Non-blocking JavaScript (`defer` on scripts loaded in `<head>`).
- No cookies, no tracking, no analytics.

---

## Accessibility

- **Target browsers:** not explicitly documented in the code; absent any known requirement, latest stable versions of evergreen browsers (Chrome, Firefox, Safari, Edge).
- Explicit `aria-label` on every navigation link that only holds an icon (header, hero, footer), as Font Awesome icons and emoji are not always reliably announced by screen readers.
- Alternative text on images (photos, technical drawings, portrait).
- Closing the lightbox: standard Bootstrap close button (`btn-close`), left/right keyboard navigation for the previous/next photo (see `screens/gallery.md`).
- Known limitation: the before/after comparator (BeerSlider) relies on an `<input type="range">`, keyboard-navigable, but its overlaid display of the two images has no text alternative describing the comparison itself beyond each image's alternative text.

---

## SEO

- Static rendering: every page exists independently at crawl time.
- Basic Open Graph tags (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale` + `og:locale:alternate`) and canonical link, generated manually in `_includes/head.html` (no `jekyll-seo-tag` plugin).
- `hreflang` alternates between the FR and EN versions of a same page (shared `ref`, see `data-model.md`), in `<head>` and in `sitemap.xml`.
- **`sitemap.xml`**: unlike a `jekyll-sitemap` plugin, it is a Jekyll page like any other (`sitemap.xml` at the root, `layout: null`, Liquid loop over `site.pages`), which generates itself at build time. It lists one entry per `ref` (only one of the two languages, deduplicated by filtering on `page.lang == "fr"`, the `hreflang` alternate of the other language being added in the same `<url>` entry), and includes `image:image` extensions for the photos of a gallery and the two images of a technical drawing.
  - The `sitemap.priority` front matter field (see `data-model.md`) is currently read by no code of the site: `sitemap.xml` only relies on `sitemap.lastmod` and `sitemap.exclude`. Keep this in mind if `sitemap.xml` is changed: this field currently has informational value only.
- A JSON-LD `ImageObject` block (author, credit line, CC license, `acquireLicensePage` pointing to the same CC deed as `license`, required by Google Images for the "Licensable" badge) is added on gallery and technical drawing pages, independently of any plugin.
- `robots.txt` allows indexing of the site, excludes `/404.html`, references `sitemap.xml`.
- A Google Search Console verification file (`googlecd7d75cfc4cbdf0c.html`) is present at the root.

### Content Security Policy

A CSP is declared as a `<meta>` tag in `_includes/head.html`, restricting `script-src`/`style-src`/`font-src`/`img-src`/`connect-src` to the origins actually used by the site (self, Font Awesome Kit, Google Fonts, Creative Commons). Any new external dependency (font, script, remote image) must be added to this policy so it is not blocked by the browser.

---

## File structure

```
/
├── _config.yml
├── CNAME
├── 404.md
├── index.md / index-en.md          # home (FR / EN)
├── robots.txt
├── sitemap.xml                      # self-generated Jekyll page, not a static file
│
├── _layouts/
│   ├── index.html                  # home: hero + cinematic bands
│   ├── gallery.html                # photo gallery grid + lightbox
│   ├── technical-drawing.html      # drawings list + before/after comparator
│   ├── technical-drawing-detail.html
│   └── 404.html
│
├── _includes/
│   ├── head.html                   # <head>: meta, OG, CSP, hreflang, fonts, CSS
│   ├── header.html                 # compact header (non-home pages)
│   ├── footer.html                 # fixed footer: social networks, license, language
│   └── scripts.html                # currently empty, extension point
│
├── _plugins/
│   ├── gallery_photo_pages.rb      # generates the individual photo pages at build time
│   └── less_compiler.rb            # recompiles hbs.less -> hbs.css on local builds
│
├── scripts/                         # maintenance scripts, run manually and locally
│   ├── generate_gallery_thumbnails.rb
│   └── generate_technical_drawing_pages.rb
│
├── _data/
│   ├── under-water.yml
│   ├── street-art.yml
│   ├── deambulations.yml
│   └── technical-drawing.yml
│
├── content/
│   ├── <gallery>.md / <gallery>-en.md          # grid page, one pair per gallery
│   ├── <gallery>/
│   │   ├── <slug>.<ext>                        # original photo
│   │   ├── <slug>-thumb.<ext>                  # generated thumbnail
│   │   └── gallery-band-bg.jpg                 # cinematic band background (home)
│   ├── technical-drawing.md / technical-drawing-en.md
│   └── technical-drawing/
│       ├── <id>-org.jpg
│       ├── <id>-2020.jpg
│       ├── <id>.md / <id>-en.md                # detail pages, committed
│       └── gallery-band-bg.jpg
│
└── assets/
    ├── css/hbs.less                 # single source of custom styles
    ├── dist/css/                    # Bootstrap, BeerSlider, hbs.css (compiled)
    ├── dist/js/                     # Bootstrap, BeerSlider, gallery.js (lightbox)
    └── img/                         # bg.jpg (hero/404), photo.jpg (portrait), com.jpg
```

### Configuration (`_config.yml`)

```yaml
url:         "https://christophe.heubes.org"
title:       "Christophe Heubès"
author:      "Christophe Heubès"
description: "Christophe Heubès - Photos, Musique, Plongée, Voyages"
```

No plugin declared (see "Site generation" above). `exclude:` removes `specs/`, `scripts/` and `CLAUDE.md` from the build: they are repository working files, not site content, and Jekyll would otherwise publish them as-is under `_site/`.

---

## Naming conventions

| Element | Convention | Example |
|---|---|---|
| Slugs (gallery, technical drawing) | kebab-case; technical drawing slugs reuse the French drawing title, `deambulations` keeps its French name (published URLs, not to be renamed) | `under-water`, `deambulations`, `attelage-pour-crochet-de-traction` |
| Markdown/YAML/LESS files | kebab-case | `technical-drawing.yml`, `hbs.less` |
| Ruby scripts and plugins | snake_case | `generate_gallery_thumbnails.rb` |
| CSS identifiers/classes | simple semantic names, no mandatory prefix | `#site-header`, `.gallery-band`, `.gallery-thumb` |
| JS variables | camelCase | `showModal()`, `lightboxEl` |
