christophe.heubes.org
=====================

Personal web site of Christophe Heubès: photo galleries (scuba diving, street
art, urban wanderings) and a collection of technical drawings originally made
by his grandfather Claude Heubès between 1939 and 1942, reproduced digitally
in 2020. Static site built with Jekyll, hosted on GitHub Pages at
https://christophe.heubes.org.

See [`specs/`](specs/) for the site's design decisions (functional scope,
data model, technical stack, style guide, screens) and
[`CLAUDE.md`](CLAUDE.md) for how to use them.

## Local development

Requires Ruby (see `.ruby-version`).

    bundle install
    bundle exec jekyll serve

The site is served at http://localhost:4000. CSS is compiled from
`assets/css/hbs.less` to `assets/dist/css/hbs.css` automatically on each
build; this requires `lessc` to be installed locally (see
`specs/technical-specifications.md`).

To check for broken links, as CI does:

    bundle exec htmlproofer ./_site

## Adding content

- **Photo galleries** (diving, street art, wanderings): add the image file
  under `content/<gallery>/` and a matching entry in `_data/<gallery>.yml`,
  then run `ruby scripts/generate_gallery_thumbnails.rb` to generate the grid
  thumbnail.
- **Technical drawings**: add the original and 2020 reproduction images
  under `content/technical-drawing/` and a matching entry in
  `_data/technical-drawing.yml`, then run
  `ruby scripts/generate_technical_drawing_pages.rb` to generate the detail
  pages.

Commit the generated files (thumbnails, detail pages) along with the source
changes. See `specs/data-model.md` for the exact file formats.

## Deployment

Automatic, via GitHub Actions (`.github/workflows/jekyll.yml`) on every push
to `master`.

## License

Content (photos, drawings) is licensed under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
