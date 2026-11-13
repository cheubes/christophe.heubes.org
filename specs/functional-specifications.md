# General functional specifications

## Context and goals

The site presents Christophe Heubès's visual work: three photo galleries (scuba diving, street art, urban wanderings) and a collection of technical drawings made by his grandfather Claude Heubès between 1939 and 1942 during his studies, which Christophe set out to reproduce digitally in 2020.

The goal is to let visitors discover this work in an immersive way: browse the photos in large format, compare the original technical drawings with their digital reproduction, and easily reach the author's other projects.

## Site scope

In scope:

- Home page introducing the author and giving access to each section (see `screens/home.md`).
- Browsing each of the three photo galleries (diving, street art, wanderings) as a grid, with a full-screen view per photo (see `screens/gallery.md`).
- Browsing the technical drawing collection as a list with a before/after comparator, and a detail page per drawing (see `screens/technical-drawing.md`).
- Multilingual site (French, English).
- Links to the author's other sites (see "Sister sites" below).

See also "Out of scope" below.

## Target users

The site is aimed at visitors discovering the author's photographic work or the family collection of technical drawings: family, professional contacts, curious visitors coming from a search engine or a social network. There is no role distinction on the visitor side: no account, no personal space, no personalized content.

Content (photos, drawings, texts) is produced by the author directly in the repository's source files (see `data-model.md`), not through an admin interface.

## Main user journeys

1. A visitor lands on the home page, discovers the author through the full-screen hero, and picks a section either from the hero navigation or by scrolling down to the matching cinematic band.
2. If they pick a photo gallery (diving, street art, wanderings), they land on a thumbnail grid, click a photo that interests them, and browse the next/previous photos full screen without leaving the grid.
3. If they pick the technical drawings, they land on a list where each drawing can be compared with a before/after slider (original ink drawing / 2020 digital reproduction), and can open a detail page dedicated to one drawing to see both images in full size.
4. From any page (other than home), they can go back to the home page or navigate directly to another section through the header.
5. A visitor can also land directly on a specific photo or drawing through a shared link, without going through the home page or the grid (see "Permalinks" in `technical-specifications.md`).

## Cross-cutting rules

### Multilingual

- The site is available in French and English.
- French is the default language: its pages are served at the site root, without a prefix (`/`, `/technical-drawing/`...). English is prefixed with `/en/`.
- Each page exists as two separate source files (one per language), linked by a shared identifier (`ref`, see `data-model.md`) rather than by dynamic translation.
- A language switcher, in the footer (see `style-guide.md`), switches to the other-language version of the current page.
- There is currently no mechanism to automatically detect the browser language nor to remember a language choice: each page is static and serves the language of its URL.
- There is no partially translated content on this site: every section (gallery or drawing collection) and every item it contains always exist in both languages, produced together (see `data-model.md`). There is therefore no fallback mechanism and no "content not available in this language" message: a URL that matches no generated page simply triggers the site's generic 404 (see "404 page" in `data-model.md`), with no language detection from the requested URL's prefix.

### Navigation

- Home page: icon navigation in the hero, one per section, plus three external links to the sister sites (see below).
- Any other page: compact header, sticky at the top of the page, with the same navigation icons, plus a link to the home page (profile picture).
- Fixed footer, present on every page: links to the author's social networks, Creative Commons license, language switcher (see `style-guide.md`).

### Sister sites

The author maintains several sites, each documented by its own `specs/`: this site does not contain them, it points to them with external links (new tab) from the home hero, the home cinematic bands and the footer.

| Site | Content | Link location |
|---|---|---|
| `samettof.org` | Diving travel logs of the author and his two companions | Hero, home cinematic band, compact header |
| `dataviz.heubes.io` | Interactive visual explorations of open data | Hero, home cinematic band, compact header |
| `social-graphs.heubes.io` | Social relationship graph exploration tool | Hero, home cinematic band, compact header |
| `christophe.heubes.com` | The author's professional site | Icon in the footer |
| Instagram (`@christophe.uw`, `@christophe.hbs`), Goodreads | Personal social networks | Footer |

## Out of scope

- User accounts, authentication.
- Content editing through a web interface: content is created and edited directly in the source files (see `data-model.md`).
- Visitor-generated content (comments, ratings, contributions).
- Search or filtering: unlike other projects by the author, none of the galleries offers search or filters, as the amount of content per section does not justify it so far.
- Automatic detection or remembering of the visitor's language (see "Multilingual" above).
