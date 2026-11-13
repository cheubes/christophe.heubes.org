# christophe.heubes.org

Personal site of Christophe Heubès: photo galleries (scuba diving, street art, urban wanderings) and technical drawings made by his grandfather and then reproduced by him. Static, multilingual site (French / English), generated with Jekyll and hosted on GitHub Pages.

## Role of `specs/`

`specs/` documents the design decisions. `specs/` is the source of truth for any change: before writing or modifying code, read the spec files relevant to the task.

## Structure of `specs/`

- **`functional-specifications.md`**: site scope, target visitors, user journeys, cross-cutting rules (multilingual, navigation, links to sister sites), out of scope.
- **`data-model.md`**: the two content families (generic photo gallery, technical drawing), their data files (`_data/*.yml`), page front matter, page generation mechanisms, naming conventions.
- **`technical-specifications.md`**: technical stack, hosting/deployment, architecture (page generation, routing, lightbox URL synchronization), performance, accessibility, SEO.
- **`style-guide.md`**: visual identity (colors, typography, spacing), core UI components (header, footer, hero, tiles, lightbox, before/after comparator), iconography.
- **`screens/`**: one functional specification per screen (goal, content, interactions, states, responsive):
  - `home.md`: site home page (hero + cinematic bands)
  - `gallery.md`: generic screen of the three photo galleries (diving, street art, wanderings) and its lightbox
  - `technical-drawing.md`: technical drawings (list view with before/after comparator, detail view)

## When and how to use these specs

- **Before any implementation**, read the file(s) relevant to the task. The four cross-cutting specs (`functional-specifications.md`, `data-model.md`, `technical-specifications.md`, `style-guide.md`) apply to the whole site; each file in `screens/` adds what is specific to that screen.
- **The files constantly reference each other** ("see `X.md`") rather than duplicating information. Follow these references rather than guessing: if a screen mentions a rule defined elsewhere (multilingual behavior, a style guide color...), the source of truth is the referenced file, not the screen citing it.
- **When modifying a spec**, look for the other files referencing it (`grep` the file name in `specs/`) and check they stay consistent with the change.
- **When in doubt, or when the specs are silent** on a point needed for the implementation, ask rather than assume: these are design decisions, not free implementation details.
- **When the existing code and a spec diverge**: these specs were written after the fact, from the code in place. A divergence spotted during a task therefore has two possible origins, to be told apart before acting: either the spec misdescribes an intended behavior (fix the spec), or the code contains an oversight or a bug that writing the specs brought to light (report it to the user, do not fix it silently as part of an unrelated task). Once a spec is confirmed correct, it is authoritative: if a later implementation must depart from it, update the spec and explain why rather than silently diverging in the code.

## Before each commit

- **Check all the files in `specs/`** for consistency, not only those directly modified by this commit.
- **If one or more specs need adjusting**, block the commit: propose the necessary updates and wait for approval before applying them, then commit.
- **Update `README.md`** if needed.

## Established conventions

- Everything in the repository is written in English: specs (`specs/`), this file, `README.md`, code, comments. The only French text is the site's own French-language content, which is part of the bilingual site and must stay in French: French pages (`index.md`, `content/<gallery>.md`, `content/technical-drawing/<id>.md`...), the `title-fr`/`fr-title` fields of `_data/*.yml`, the French branch of interface strings in layouts and includes, and the French image metadata values (see "Image metadata" in `data-model.md`). Specs may quote such French strings verbatim.
- File names, folders, slugs and technical identifiers are in kebab-case (e.g. `under-water`, `attelage-pour-crochet-de-traction`), except Ruby scripts, which follow snake_case like the rest of the Ruby ecosystem (`generate_gallery_thumbnails.rb`). Technical identifiers are in English; content slugs keep their original French name where they have one: technical drawing slugs reuse the French drawing title (`attelage-pour-crochet-de-traction`) and the `deambulations` gallery keeps its French name. These slugs are part of published URLs: do not rename them.
- No mandatory prefix on CSS classes (unlike other projects by the author): identifiers and classes are simple semantic names (`#site-header`, `.gallery-band`, `.gallery-thumb`), see `technical-specifications.md`.
- Style guide colors and components are defined once, in `style-guide.md`: do not introduce new color values or new component styles elsewhere without adding them there first.
