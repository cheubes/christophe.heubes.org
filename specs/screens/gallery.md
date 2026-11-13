# Screen: photo gallery

Generic screen, shared by the site's three galleries (scuba diving, street art, wanderings, see `data-model.md`): this document does not describe a specific gallery, but the behavior common to all three, driven by `page.gallery`. Any difference between galleries is limited to content (`_data/<gallery>.yml`, front matter texts), never behavior.

## Goal

Let the visitor browse all the photos of a section as a grid, then view them full screen, in order, without leaving the page.

## Content and structure

- Compact header shared by every page except home (see `style-guide.md`).
- Title (`h1`) with the section icon, followed by "par"/"by" Christophe Heubès (see `data-model.md`), then the section's `introduction`.
- Thumbnail grid, one per entry of `_data/<gallery>.yml`, in file order (see `data-model.md`): no computed sorting or reordering, the display order is the editorial order chosen in the data file.
- Each thumbnail shows the resized image (`<slug>-thumb.<ext>`, see `data-model.md`), lazy-loaded.
- Lightbox (full-screen modal), present on the page but hidden by default, unless the page is a specific photo's page (see "States" below).

## Interactions

- **Click on a thumbnail**: opens the lightbox on that photo (full-resolution image, caption, credit line), updates the URL to that photo's permalink (see "Permalinks and lightbox URL synchronization" in `technical-specifications.md`), without reloading the page.
  - A modified click (middle button, `Ctrl`/`Cmd`/`Shift`/`Alt` held) is not intercepted: the browser's native behavior applies (e.g. opening in a new tab), the thumbnail remaining a regular `<a>` link to the photo's permalink.
- **Previous/next navigation** in the lightbox: through the dedicated buttons, or the left/right keyboard arrows. Changes the displayed photo and updates the URL (`history.replaceState`, no extra history entry per browsed photo).
  - First item of the gallery: previous button hidden. Last item: next button hidden. No wrap-around.
- **Closing the lightbox**: close button, `Escape` key (native Bootstrap modal behavior), or browser back navigation. Restores the grid URL.
- **Browser back/forward buttons**: reopen, change or close the lightbox depending on the restored URL (see `technical-specifications.md`), to stay consistent with click navigation.
- **Language change** (footer): switches to the grid of the same gallery in the other language; if a photo was open, the lightbox is not automatically reopened on that photo after the language change (the target URL is the section's grid, not the photo).

## States (loading, error, empty)

- **Specific photo page** (`/<gallery>/<slug>/`, see `data-model.md`): on load, the lightbox opens directly on that photo, without user action (see "Permalinks" in `technical-specifications.md`).
- **Active thumbnail**: on a specific photo page, the matching thumbnail in the grid is visually highlighted (gold border, see `style-guide.md`) and carries `aria-current="page"`.
- **Empty**: no defined behavior, the grid always being fed by a non-empty data file in practice (see "General conventions" in `data-model.md`, a gallery with no entries not being a case the site supports).
- **Image loading error**: no defined fallback behavior (no generic placeholder image); a thumbnail or lightbox image whose file is missing would display broken.

## Responsive

Bootstrap column grid (`col-4`, three thumbnails per row) at every screen width: unlike other projects by the author, the number of columns is not reduced on mobile through a dedicated responsive class.
