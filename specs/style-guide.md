# Style guide

## Colors

### "Dark Cinematic" palette

Unlike other projects by the author, the palette is not exposed as native CSS variables (`--custom-property`) but as LESS variables (`@variable`), defined once at the top of `assets/css/hbs.less`:

| Role | Variable | Hex |
|---|---|---|
| Page background | `@bg` | `#0d0d0d` |
| Footer background | `@surface` | `#161616` |
| Body text, headings | `@text` | `#f0ece4` |
| Secondary text, navigation icons at rest | `@text-muted` | `#8a8278` |
| Accent, links, active elements | `@gold` | `#C7B299` |
| Hover accent | `@gold-bright` | `#e8d5b7` |

```less
@bg:           #0d0d0d;
@surface:      #161616;
@text:         #f0ece4;
@text-muted:   #8a8278;
@gold:         #C7B299;
@gold-bright:  #e8d5b7;
```

Two additional variables are declared in the source file (`@blue: #2C374C`, `@light-grey: #ACB2B8`), with a comment presenting them as "BeerSlider / technical-drawing compatibility": in practice, they are referenced nowhere else in `hbs.less`. The before/after comparator (see "Before/after comparator" below) actually keeps the default, unthemed look of the BeerSlider library. Do not assume these two variables drive an existing component: treat them as reserved, not active.

### Usage

`@bg` background on `html`/`body`. Headings and body text in `@text`. Links are `@gold` by default, `@gold-bright` on hover (`color 0.2s ease` transition). Navigation icons (header, hero) are `@text-muted` at rest, `@gold` on hover.

## Typography

- **Body text**: Ubuntu (Google Fonts), `font-family: Ubuntu, sans-serif` on `html`/`body`.
- **Headings** (`h1`-`h3`): Raleway (Google Fonts), weight 600, `letter-spacing: 0.05em`.

| Usage | Font | Weight | Notes |
|---|---|---|---|
| Section titles, hero (`h1`) | Raleway | 600 | Uppercase, wide `letter-spacing` on the hero and the cinematic bands (see below) |
| Body text, introductions | Ubuntu | 400 | |
| Secondary text (captions, metadata) | Ubuntu | 400 | `@text-muted` color |

Fonts loaded through Google Fonts with `rel="preconnect"` (see `technical-specifications.md`), weights 300/400/500/600 (Raleway) and 400/700 (Ubuntu).

## Spacing and grid

No custom spacing scale: Bootstrap 5's grid and utility classes (`container-fluid`, `row`/`col-*`, `g-*`) are used as-is.

## Core UI components

### Hero (home only)

- Full screen (`100vh`, minimum 500 px), background image `assets/img/bg.jpg` (1920 × 1080 px) with a dark overlay (`rgba(0, 0, 0, 0.62)`) on top, `background-attachment: fixed` (disabled on mobile, ≤ 768 px, to avoid rendering artifacts).
- Circular portrait (`assets/img/photo.jpg`, 512 × 512 px), `@gold` border, link to the home page.
- Thin horizontal separator, `@gold`, 80 px wide.
- Hero navigation: inline icons, one per section plus the three external links (see "Sister sites" in `functional-specifications.md`), `@text-muted` at rest, `@gold` and slight enlargement on hover.
- Scroll indicator (animated chevron, continuous vertical bounce) at the bottom of the viewport.

### Cinematic bands (home)

- One band per section (galleries, technical drawings, sister sites), full width, 50% of the viewport height (minimum 300 px), background image with `object-fit: cover` (see "Images" below for the recommended ratio).
- Semi-transparent dark overlay (`rgba(0, 0, 0, 0.50)`), slightly darkened on hover for external links.
- Centered content: uppercase title (Raleway 600, `letter-spacing: 0.15em`), description (Ubuntu, `@text`, max width 600 px), call-to-action text in `@gold` ("Voir la galerie →" / "Visiter →" for external links, and their English equivalents).
- On hover: slight zoom of the background image (`scale(1.04)`), lighter overlay darkening.

### Compact header (non-home pages)

- Sticky position at the top of the page, `#111111` background, thin bottom border in `@gold` at 15% opacity.
- Layout: navigation icons (identical to the hero's, sister sites included, see note below) on the left, circular portrait linking to the home page on the right.
- Absent on the home page (`page.ref != "home"`), which has its own hero.

Note: the header actually includes the same seven links as the hero (four sections plus the three sister sites), in the same order. Do not shorten this list without checking `functional-specifications.md` ("Sister sites" section).

### Footer

- Fixed (`position: fixed`, bottom of the screen), `@surface` background, thin top border in `@gold` at 20% opacity.
- **Left**: social network links (circular portrait to `christophe.heubes.com`, Font Awesome icons Instagram ×2, Goodreads).
- **Center**: Creative Commons license (four Font Awesome Brands icons: `fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa`, followed by the text "CC BY-NC-SA 4.0"), linking to `deed.fr` or `deed.en` depending on the current language.
- **Right**: language switcher, one link per language available for the current page (shared `ref`, see `data-model.md`), displayed as a flag emoji (🇫🇷/🇬🇧) with an explicit `aria-label`.

### Photo gallery grid (tiles)

See `screens/gallery.md` for the full behavior. Style elements:

- Each thumbnail (`.gallery-thumb`) has a fixed 3:4 ratio (`aspect-ratio: 3 / 4`), whatever the source photo's ratio, through `object-fit: cover` on the image.
- Transparent 1 px border by default, `@gold` on hover or if the thumbnail is the one currently open in the lightbox (`.gallery-thumb-active`); slight image zoom on hover.
- Gallery title (`h1`) with a Font Awesome icon (see "Iconography") followed by the text "par"/"by" Christophe Heubès.

### Lightbox (photo galleries)

- Standard Bootstrap modal, black background (`#000`), thin `@gold` border at 15% opacity.
- Image displayed at a maximum height of 82% of the viewport (`max-height: 82vh`).
- Caption below the image: italic secondary text (`@text-muted`), always followed by the credit "Photo par Christophe Heubès" / "Photo by Christophe Heubès".
- Close button: native Bootstrap component (`btn-close btn-close-white`), not a Font Awesome icon.
- Previous/next navigation: two buttons overlaid on the left/right edges of the image, semi-transparent background (`rgba(0, 0, 0, 0.5)`), hidden (`visibility: hidden`, not removed from the DOM) on the first/last item rather than disabled.

### Before/after comparator (technical drawings)

- BeerSlider library, with its default look (semi-transparent white circular handle, semi-transparent white chip labels): this component is **not** themed with the "Dark Cinematic" colors of the rest of the site (see "Palette" above).
- Left label: year of the digital reproduction ("2020", fixed). Right label: the drawing's `org-year` (see `data-model.md`), the year the original was made.
- Drawing title below the comparator, linking to its detail page, with a magnifying glass icon (see "Iconography").

### Detail page (technical drawing)

- Back link to the list (left arrow icon + text), repeated at the top and bottom of the page.
- The two images (original, reproduction) stacked vertically rather than compared with a slider, each with its caption as `figcaption` (italic secondary text).

### 404 page

- Background image `assets/img/bg.jpg`, same treatment as the hero (dark overlay, `background-attachment: fixed`).
- Large "404", uppercase bold message, vertically centered.

## Images

| Image | Observed ratio | Observed dimensions |
|---|---|---|
| Gallery photo (original) | Variable (portrait or landscape depending on the photo) | Variable |
| Gallery thumbnail (generated) | Same as the original (resized without cropping), displayed as 3:4 through `object-fit: cover` | Longest side reduced to 800 px |
| Cinematic band background (`gallery-band-bg.jpg`) | ~3:1 | 2400 × 800 px (measured on `under-water`) |
| Hero / 404 page background (`bg.jpg`) | 16:9 | 1920 × 1080 px |
| Profile portrait (`photo.jpg`) | 1:1 | 512 × 512 px |
| Technical drawing (original and reproduction) | ~4:3, nearly identical between the two versions of a same drawing | ~2048 px wide |

CSS `object-fit: cover` absorbs ratio differences at display time rather than enforcing strict cropping when adding content, except for gallery thumbnails which are pre-resized by script (see "Local maintenance scripts" in `technical-specifications.md`).

## Iconography

Font Awesome, loaded through a remote Kit (see `technical-specifications.md`), no version pinned through an explicit CDN.

| Usage | Icon |
|---|---|
| Scuba diving | `fa-water` |
| Street art | `fa-palette` |
| Wanderings | `fa-person-walking` |
| Technical drawings | `fa-compass-drafting` |
| Link to samettof.org | `fa-earth-asia` |
| Link to dataviz.heubes.io | `fa-chart-simple` |
| Link to social-graphs.heubes.io | `fa-diagram-project` |
| Instagram | `fa-instagram` (Brands) |
| Goodreads | `fa-book-open` |
| Creative Commons license | `fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa` (Brands) |
| Scroll indicator (hero) | `fa-chevron-down` |
| Back to the technical drawings list | `fa-arrow-left` |
| Access to a technical drawing's detail | `fa-magnifying-glass-plus` |
| Closing the lightbox | native Bootstrap component (`btn-close`), not a Font Awesome icon |
| Language switcher | flag emoji 🇫🇷/🇬🇧, not a Font Awesome icon |
