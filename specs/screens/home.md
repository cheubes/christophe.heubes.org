# Screen: home

## Goal

Introduce the author and give access to each section of the site (the three photo galleries, the technical drawings) as well as to the sister sites (see "Sister sites" in `functional-specifications.md`).

## Content and structure

### Hero (full screen)

- Circular portrait of the author, linking to the home page itself.
- Separator, then icon navigation: one per section (diving, street art, wanderings, technical drawings), then the three external links (samettof.org, dataviz.heubes.io, social-graphs.heubes.io), in that order (see `style-guide.md` for the visual details).
- Scroll indicator at the bottom of the viewport, inviting the visitor to discover the cinematic bands below the hero.
- No footer or compact header visible in the hero: they appear on scroll (see "Core UI components" in `style-guide.md`, the compact header never being displayed on the home page anyway).

### Cinematic bands

One full-width band per section, stacked vertically, in the following order:

1. Scuba diving (`under-water`)
2. Street art (`street-art`)
3. Wanderings (`deambulations`)
4. Technical drawings (`technical-drawing`)
5. samettof.org (external link)
6. dataviz.heubes.io (external link)
7. social-graphs.heubes.io (external link)

Each band shows: a background image (the section's `gallery-band-bg.jpg` for the first four, a dedicated image for the three external links), an icon followed by the section title, a description, and a call-to-action text ("Voir la galerie →" / "View gallery →" for the four site sections, "Visiter →" / "Visit →" for the three external links).

- The title and description of the first four bands are taken directly from the front matter of the matching section page (`h1` and `introduction`, see `data-model.md`): they are not duplicated in the home page front matter.
- The title and description of the three sister-site bands are specific to the home page (`about-s-t`, `about-dataviz`, `about-social-graphs`, see `data-model.md`).

### Footer

Shared by every page of the site, see "Footer" in `style-guide.md`.

## Interactions

- Click on a hero icon or on a band: navigates to the matching section, or opens the external link in a new tab for the last three bands.
- Hover on a band: slight zoom of the background image, lighter overlay darkening, brighter call-to-action text (see `style-guide.md`).
- Language change (footer): switches to `/en/` (separate page, full reload, no dynamic switch).

## States (loading, error, empty)

- No empty state possible: the four sections and the three sister-site bands are fixed, not driven by data that could be missing.
- No dedicated loading state: fully static page, background images are not lazy-loaded (unlike gallery thumbnails, see `screens/gallery.md`) since they are visible as soon as the page loads or right after a short scroll.

## Responsive

- Hero: `background-attachment: fixed` disabled below 768 px (see `style-guide.md`), to avoid the rendering artifacts this property causes on mobile.
- Cinematic bands: height in viewport units with a fixed minimum (300 px), always full width; title and call-to-action text in fluid sizes (`clamp()`) to stay readable on small screens.
