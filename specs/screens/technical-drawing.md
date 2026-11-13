# Screen: technical drawings

Two distinct views, each with its own layout (see `technical-specifications.md`): a list with a before/after comparator, and a detail page per drawing. Documented here together rather than in two separate files, as their respective complexity does not justify splitting them.

## Goal

Showcase Claude Heubès's original technical drawings (1939-1942) by comparing them with their digital reproduction by Christophe Heubès (2020), and let visitors view each drawing in full size.

## List view (`/technical-drawing/`)

### Content and structure

- Compact header shared by the whole site (see `style-guide.md`).
- Title (`h1`) with icon, followed by "par"/"by" Claude and Christophe Heubès (both authors, unlike the photo galleries which only credit Christophe, see `screens/gallery.md`), then the section's `introduction` (which may contain a raw HTML link, see `data-model.md`).
- One entry per drawing of `_data/technical-drawing.yml` (see `data-model.md`), in file order, separated by a horizontal rule:
  - The before/after comparator (see "Before/after comparator" in `style-guide.md`), slider centered by default.
  - The drawing title below the comparator, linking to its detail page.

### Interactions

- **Moving the comparator slider**: progressively reveals the original drawing (`<id>-org.jpg`) over the 2020 reproduction (`<id>-2020.jpg`), with the mouse, touch or keyboard (native `<input type="range">` slider).
- **Click on a drawing title**: navigates to its detail page.
- **Language change** (footer): switches to the list in the other language; each drawing's title changes (`fr-title`/`en-title`), the slider position of each comparator is not preserved (new page, slider reset to the center).

### States

- **Empty**: no defined behavior, `_data/technical-drawing.yml` never being empty in practice.
- **Image loading**: unlike photo gallery thumbnails, the comparator images (`loading="lazy"`) are full resolution right from the list, as no resized version exists for technical drawings (see `data-model.md`).

### Responsive

Centered single-column layout (Bootstrap `col-md-1`/`col-md-2` margins on each side), whatever the screen width: unlike the photo galleries, no multi-column grid, each drawing taking up the full available width.

## Detail view (`/technical-drawing/<id>/`)

### Content and structure

- Compact header, back link to the list (icon + text) repeated at the top and bottom of the page (see "Detail page" in `style-guide.md`).
- Drawing title (`drawing-title`, see `data-model.md`).
- Both images stacked vertically, each full width with its caption (`figcaption`):
  1. Original drawing (`<id>-org.jpg`), captioned "Dessin original réalisé par Claude Heubès lors de ses études à l'ENSAM" / equivalent English translation.
  2. Digital reproduction (`<id>-2020.jpg`), captioned "Reproduction numérique réalisée par Christophe Heubès en 2020" / English equivalent.

Unlike the list view, the two images are not compared with a slider here: they are viewed one after the other, in full resolution, for a detailed examination of each.

### Interactions

- **Click on a back link**: navigates to the list (`/technical-drawing/` or `/en/technical-drawing/` depending on the page language).
- **Language change** (footer): switches to the detail of the same drawing (shared `ref`, see `data-model.md`) in the other language.

### States

No particular state: static page, content always present (a technical drawing only exists together with its two images and its two language pages, see "General conventions" in `data-model.md`).

### Responsive

Single centered column (same Bootstrap margins as the list view), images at full available width at every screen size.
