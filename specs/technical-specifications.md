# Spécifications techniques

## Stack technique

### Génération de site

- **Jekyll 4.4** : layouts, includes, front matter, `_data/`, pages (pas de collections).
- **Ruby 3.3.12** (`.ruby-version`), en plus de Jekyll utilisé pour les scripts de maintenance (voir "Scripts de maintenance locaux" ci‑dessous).
- `webrick` (serveur de développement local), `html-proofer` (vérification de liens morts en CI, voir "Hébergement et déploiement").
- Aucun plugin Jekyll packagé en gem (le `Gemfile` ne déclare que `jekyll`, `webrick`, `html-proofer`) : les deux extensions de build du site sont des fichiers locaux dans `_plugins/`, chargés automatiquement par Jekyll (voir "Architecture").

### CSS / UI

- **LESS**, compilé en CSS par un hook Jekyll (`_plugins/less_compiler.rb`, voir "Scripts de maintenance locaux") plutôt qu'au moment du build : un seul fichier source, `assets/css/hbs.less`, compilé vers `assets/dist/css/hbs.css`.
- **Bootstrap 5** : grille, cartes, modale (lightbox), composants de formulaire. Contrairement à d'autres projets de l'auteur, les fichiers sont **vendored** dans `assets/dist/`, pas chargés depuis un CDN.
- **Font Awesome**, chargé via un Kit distant (`https://kit.fontawesome.com/7dfeb2d2f7.js`), pas via une feuille de style CDN classique.
- **Google Fonts** : Ubuntu (corps de texte) et Raleway (titres), voir `style-guide.md`.
- **BeerSlider** (vendored dans `assets/dist/`) : comparateur avant/après à curseur, utilisé uniquement sur la vue liste des dessins techniques (voir `screens/technical-drawing.md`).
- Les valeurs de design (couleurs, typographie, espacements) sont définies dans `style-guide.md`, pas ici.

### JavaScript

- **Vanilla JS** pour toutes les interactions : la lightbox des galeries photo (`assets/dist/js/gallery.js`, voir "Permaliens" ci‑dessous) et l'initialisation de BeerSlider (script inline dans `technical-drawing.html`).
- Pas de framework JS (pas de React, Vue, Angular), pas de bundler.
- `assets/dist/js/less.min.js` (runtime LESS côté navigateur) est présent dans le dépôt mais n'est référencé par aucune page : fichier résiduel, à ne pas utiliser comme référence pour la compilation LESS réelle du site (voir "Scripts de maintenance locaux").

### Ce qu'on n'utilise pas

- Node.js, bundler JS, framework CSS custom au‑delà de Bootstrap.
- Base de données, backend ou API propre.
- Cookies, tracking, analytics.
- Script de validation des données (voir "Conventions générales" dans `data-model.md`).

---

## Hébergement et déploiement

- **Hébergeur :** GitHub Pages
- **Domaine :** `christophe.heubes.org` (fichier `CNAME` à la racine)
- **Déploiement :** automatique, via GitHub Actions (`.github/workflows/jekyll.yml`), déclenché sur push sur la branche `master`, ou manuellement (`workflow_dispatch`)
- **Build :** `bundle exec jekyll build`, exécuté explicitement dans le workflow plutôt que délégué à l'intégration native GitHub Pages. Cette différence a une conséquence directe sur les plugins : un build GitHub Pages natif tourne en mode *safe*, qui ignore `_plugins/` ; ce workflow custom ne l'est pas, donc `_plugins/gallery_photo_pages.rb` et `_plugins/less_compiler.rb` s'exécutent bien à chaque déploiement (voir "Architecture").
- **Vérification des liens :** `html-proofer` tourne sur `_site/` après le build, en `continue-on-error` (rapporte les liens morts sans faire échouer le déploiement) ; une liste de domaines externes est explicitement ignorée (Google Fonts, Font Awesome Kit, Goodreads).

---

## Scripts de maintenance locaux

Trois mécanismes du site suivent le même principe : générés localement par l'auteur, leur résultat est committé dans le dépôt, rien n'est recalculé au moment du build ni en CI au‑delà de la compilation LESS.

| Mécanisme | Fichier | Rôle | Déclenchement |
|---|---|---|---|
| Vignettes de galerie | `scripts/generate_gallery_thumbnails.rb` | Génère `<slug>-thumb.<ext>` pour chaque photo listée dans `_data/<gallery>.yml`, via `sips` (outil macOS, aucune dépendance ajoutée), 800 px de plus grande dimension, qualité 75 | Manuel, après ajout de photos |
| Pages de détail des dessins techniques | `scripts/generate_technical_drawing_pages.rb` | Génère les fichiers Markdown `content/technical-drawing/<id>.md` et `<id>-en.md` à partir de `_data/technical-drawing.yml` | Manuel, après modification de `_data/technical-drawing.yml` |
| Compilation LESS → CSS | `_plugins/less_compiler.rb` | Recompile `assets/dist/css/hbs.css` depuis `assets/css/hbs.less` si la source est plus récente que le fichier compilé | Hook Jekyll (`pre_render`), à chaque `jekyll serve`/`jekyll build` local |

Point d'attention pour la compilation LESS : c'est le seul des trois mécanismes qui n'est *pas* un script à exécuter explicitement, mais un hook Jekyll qui s'exécute silencieusement à chaque build. Il dépend du binaire `lessc`, qui n'est installé que sur la machine de développement (pas dans l'environnement CI du workflow de déploiement) : en CI, le hook échoue silencieusement (`system(...)` sans vérification du code de sortie) et le build continue avec le `hbs.css` déjà committé. Toute modification de `assets/css/hbs.less` doit donc être compilée localement (`bundle exec jekyll build` ou `jekyll serve` avec `lessc` installé) et son résultat committé avant de pousser, sans quoi le site déployé ne reflète pas la modification.

---

## Architecture (génération des pages, routage)

### Rendu

Le site est entièrement statique, généré au build par Jekyll. Aucun rendu dynamique côté serveur, aucune API propre.

### Deux mécanismes de génération de page

Les deux familles de contenu du site (voir `data-model.md`) ne génèrent pas leurs pages individuelles de la même façon :

- **Galeries photo** : les pages de grille (`content/<gallery>.md`) sont des pages Jekyll classiques ; les pages individuelles par photo sont générées **en mémoire à chaque build**, par `_plugins/gallery_photo_pages.rb` (`Jekyll::Generator`), à partir de `_data/<gallery>.yml`. Elles n'existent comme fichiers nulle part dans le dépôt.
- **Dessins techniques** : la page de liste (`content/technical-drawing.md`) est une page Jekyll classique ; les pages de détail sont des **fichiers Markdown committés**, régénérés localement par `scripts/generate_technical_drawing_pages.rb` (voir ci‑dessus) plutôt qu'au build.

Cette asymétrie découle du commentaire du script de génération des dessins techniques, qui suppose un build GitHub Pages en mode *safe* (où `_plugins/` est ignoré). Le workflow de déploiement actuel n'est pas en mode *safe* (voir "Hébergement et déploiement") : la génération des pages de dessins techniques pourrait donc, en théorie, suivre le même mécanisme de plugin que les galeries photo. À vérifier avant toute évolution de ce point : soit cette hypothèse d'origine est encore justifiée pour une autre raison, soit les deux mécanismes pourraient être unifiés.

### Structure des URLs

| URL | Contenu |
|---|---|
| `/` | Accueil (français, langue par défaut) |
| `/en/` | Accueil (anglais) |
| `/<gallery>/` | Grille d'une galerie photo (FR) ; `<gallery>` ∈ `under-water`, `street-art`, `deambulations` |
| `/en/<gallery>/` | Grille d'une galerie photo (EN) |
| `/<gallery>/<slug>/` | Grille avec lightbox ouverte sur une photo précise (FR) |
| `/en/<gallery>/<slug>/` | Idem (EN) |
| `/technical-drawing/` | Liste des dessins techniques (FR) |
| `/en/technical-drawing/` | Liste des dessins techniques (EN) |
| `/technical-drawing/<id>/` | Détail d'un dessin (FR) |
| `/en/technical-drawing/<id>/` | Détail d'un dessin (EN) |
| `/404.html` | Page non trouvée, commune aux deux langues (voir `data-model.md`) |

### Permaliens et synchronisation d'URL de la lightbox

Chaque photo d'une galerie a une URL propre et permanente (`/<gallery>/<slug>/`, voir ci‑dessus), déjà générée statiquement : ce n'est pas une URL synthétique construite en JavaScript. Le clic sur une vignette (voir `screens/gallery.md`) ouvre la lightbox sur cette photo et met à jour l'URL du navigateur vers son URL dédiée via `history.pushState`, sans rechargement de page ; la navigation précédent/suivant dans la lightbox met à jour l'URL de la même façon (`history.replaceState`). La fermeture de la lightbox restaure l'URL de la grille sous‑jacente. Les boutons précédent/suivant du navigateur (`popstate`) sont gérés symétriquement : ouverture, changement de photo ou fermeture de la lightbox selon l'URL restaurée.

L'accès direct à l'URL d'une photo (lien partagé, ou rechargement de la page) charge la page générée pour cette photo, qui affiche la grille avec la lightbox déjà ouverte au chargement (`data-open-slug` sur l'élément de la modale, lu par `gallery.js`).

### Textes d'interface

Contrairement à d'autres projets de l'auteur, il n'existe pas de fichier centralisé de textes d'interface par langue : chaque libellé conditionnel (ex. "Retour aux dessins techniques" / "Back to technical drawings") est écrit directement dans les layouts et includes, sous la forme `{% if page.lang == 'fr' %}...{% else %}...{% endif %}`.

---

## Performance

- Vignettes de galerie et images de dessins techniques en lazy loading (`loading="lazy"` natif).
- Vignettes générées à 800 px de plus grande dimension, qualité JPEG 75 (voir "Scripts de maintenance locaux") : la grille ne charge jamais les photos en pleine résolution, réservées à la lightbox.
- JavaScript non bloquant (`defer` sur les scripts chargés en `<head>`).
- Pas de cookies, pas de tracking, pas d'analytics.

---

## Accessibilité

- **Navigateurs cibles :** non explicitement documentés dans le code ; à défaut d'exigence connue, dernières versions stables des navigateurs évergreens (Chrome, Firefox, Safari, Edge).
- `aria-label` explicite sur chaque lien de navigation ne portant qu'une icône (en‑tête, hero, pied de page), les icônes Font Awesome et emoji n'étant pas systématiquement annoncées de façon fiable par un lecteur d'écran.
- Texte alternatif sur les images (photos, dessins techniques, portrait).
- Fermeture de la lightbox : bouton de fermeture standard Bootstrap (`btn-close`), navigation clavier gauche/droite pour la photo précédente/suivante (voir `screens/gallery.md`).
- Limite connue : le comparateur avant/après (BeerSlider) repose sur un `<input type="range">`, navigable au clavier, mais son affichage superposé des deux images n'a pas d'alternative textuelle décrivant la comparaison elle‑même au‑delà du texte alternatif de chaque image.

---

## SEO

- Rendu statique : chaque page existe indépendamment au moment du crawl.
- Balises Open Graph de base (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:locale` + `og:locale:alternate`) et lien canonique, générés manuellement dans `_includes/head.html` (pas de plugin `jekyll-seo-tag`).
- Alternates `hreflang` entre les versions FR et EN d'une même page (`ref` commun, voir `data-model.md`), dans `<head>` et dans `sitemap.xml`.
- **`sitemap.xml`** : contrairement à un plugin `jekyll-sitemap`, c'est une page Jekyll comme une autre (`sitemap.xml` à la racine, `layout: null`, boucle Liquid sur `site.pages`), qui se génère elle‑même au build. Elle liste une entrée par `ref` (une seule des deux langues, dédupliquée en filtrant `page.lang == "fr"`, l'alternate `hreflang` de l'autre langue étant ajouté dans la même entrée `<url>`), et inclut des extensions `image:image` pour les photos d'une galerie et les deux images d'un dessin technique.
  - Le champ de front matter `sitemap.priority` (voir `data-model.md`) n'est actuellement lu par aucun code du site : `sitemap.xml` ne s'appuie que sur `sitemap.lastmod` et `sitemap.exclude`. À garder à l'esprit si `sitemap.xml` est modifié : ce champ n'a aujourd'hui qu'une valeur indicative.
- Un bloc JSON‑LD `ImageObject` (auteur, mention de crédit, licence CC) est ajouté sur les pages de galerie et de dessin technique, distinct de tout plugin.
- `robots.txt` autorise l'indexation du site, exclut `/404.html`, référence `sitemap.xml`.
- Un fichier de vérification Google Search Console (`googlecd7d75cfc4cbdf0c.html`) est présent à la racine.

### Content Security Policy

Une CSP est déclarée en balise `<meta>` dans `_includes/head.html`, restreignant `script-src`/`style-src`/`font-src`/`img-src`/`connect-src` aux origines effectivement utilisées par le site (soi‑même, Font Awesome Kit, Google Fonts, Creative Commons). Toute nouvelle dépendance externe (police, script, image distante) devra être ajoutée à cette policy pour ne pas être bloquée par le navigateur.

---

## Structure des fichiers

```
/
├── _config.yml
├── CNAME
├── 404.md
├── index.md / index-en.md          # accueil (FR / EN)
├── robots.txt
├── sitemap.xml                      # page Jekyll auto-générée, pas un fichier statique
│
├── _layouts/
│   ├── index.html                  # accueil : hero + bandes cinématiques
│   ├── gallery.html                # grille de galerie photo + lightbox
│   ├── technical-drawing.html      # liste des dessins + comparateur avant/après
│   ├── technical-drawing-detail.html
│   └── 404.html
│
├── _includes/
│   ├── head.html                   # <head> : meta, OG, CSP, hreflang, fonts, CSS
│   ├── header.html                 # en-tête compact (pages hors accueil)
│   ├── footer.html                 # pied de page fixe : réseaux, licence, langue
│   └── scripts.html                # actuellement vide, point d'extension
│
├── _plugins/
│   ├── gallery_photo_pages.rb      # génère les pages photo individuelles au build
│   └── less_compiler.rb            # recompile hbs.less -> hbs.css au build local
│
├── scripts/                         # scripts de maintenance, exécution manuelle locale
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
│   ├── <gallery>.md / <gallery>-en.md          # page de grille, une paire par galerie
│   ├── <gallery>/
│   │   ├── <slug>.<ext>                        # photo originale
│   │   ├── <slug>-thumb.<ext>                  # vignette générée
│   │   └── gallery-band-bg.jpg                 # fond de bande cinématique (accueil)
│   ├── technical-drawing.md / technical-drawing-en.md
│   └── technical-drawing/
│       ├── <id>-org.jpg
│       ├── <id>-2020.jpg
│       ├── <id>.md / <id>-en.md                # pages de détail, committées
│       └── gallery-band-bg.jpg
│
└── assets/
    ├── css/hbs.less                 # source unique de styles custom
    ├── dist/css/                    # Bootstrap, BeerSlider, hbs.css (compilé)
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

Aucun plugin déclaré (voir "Génération de site" ci‑dessus). `exclude:` retire `specs/`, `scripts/` et `CLAUDE.md` du build : ce sont des fichiers de travail du dépôt, pas du contenu du site, et Jekyll les publierait sinon tels quels sous `_site/`.

---

## Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Slugs (galerie, dessin technique) | kebab‑case anglais | `under-water`, `attelage-pour-crochet-de-traction` |
| Fichiers Markdown/YAML/LESS | kebab‑case | `technical-drawing.yml`, `hbs.less` |
| Scripts et plugins Ruby | snake_case | `generate_gallery_thumbnails.rb` |
| Identifiants/classes CSS | noms sémantiques simples, pas de préfixe imposé | `#site-header`, `.gallery-band`, `.gallery-thumb` |
| Variables JS | camelCase | `showModal()`, `lightboxEl` |
