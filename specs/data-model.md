# Modèle de données

## Vue d'ensemble

Le site porte deux familles de contenu, chacune avec son propre format de données et son propre mécanisme de génération de page (voir "Architecture" dans `technical-specifications.md`) :

- **Galerie photo** (plongée sous‑marine, street art, déambulations) : un écran générique (voir `screens/gallery.md`), une entrée de données par photo.
- **Dessin technique** : un écran dédié à deux vues (voir `screens/technical-drawing.md`), une entrée de données par dessin, chaque dessin représenté par deux images (original et reproduction 2020).

Les deux familles partagent le même modèle de fichier de contenu : chaque page existe en deux fichiers Markdown, un par langue, reliés par un champ `ref` commun (voir "Conventions générales" ci‑dessous).

## Galerie photo

### Données (`_data/<gallery>.yml`)

Une entrée par photo, dans l'ordre où elle doit apparaître dans la grille (voir `screens/gallery.md`) :

```yaml
- file: 2026-07-merou-estartit.jpg
  title-fr: "Mérou, l'Estartit."
  title-en: "Grouper, l'Estartit."
```

| Champ | Description |
|---|---|
| `file` | Nom du fichier image dans `content/<gallery>/`, avec son extension |
| `title-fr` | Légende affichée dans le sélecteur de langue français (lightbox, `alt`, JSON‑LD) |
| `title-en` | Légende affichée dans le sélecteur de langue anglais |

Trois fichiers de données, un par galerie : `_data/under-water.yml`, `_data/street-art.yml`, `_data/deambulations.yml`. Le nom du fichier (sans extension) est le slug de la galerie, réutilisé comme `page.gallery` (voir ci‑dessous) et comme nom du dossier `content/<gallery>/`.

### Images

Pour chaque entrée `file: <slug>.<ext>`, deux fichiers image dans `content/<gallery>/` :

| Fichier | Rôle | Généré par |
|---|---|---|
| `<slug>.<ext>` | Photo originale, affichée dans la lightbox plein écran | Ajoutée manuellement au dépôt |
| `<slug>-thumb.<ext>` | Vignette utilisée dans la grille (voir `screens/gallery.md`) | `scripts/generate_gallery_thumbnails.rb`, voir `technical-specifications.md` |

Chaque dossier `content/<gallery>/` contient en plus un fichier `gallery-band-bg.jpg`, l'image de fond de la bande cinématique de cette section sur l'accueil (voir `screens/home.md`), sans entrée correspondante dans le `.yml` : ce n'est pas une photo de la galerie mais une image d'interface. Dimensions observées (`under-water/gallery-band-bg.jpg`) : 2400 × 800 px (ratio 3:1) ; à reproduire pour les autres galeries.

### Page de galerie (front matter)

Un fichier Markdown par langue à la racine de `content/` (`content/<gallery>.md` pour le français, `content/<gallery>-en.md` pour l'anglais), qui génère la vue grille de cette galerie :

```yaml
---
sitemap:
  priority: 0.7
  lastmod: 2026-08-12

layout: gallery
gallery: under-water
ref: under-water
permalink: /under-water/

lang: fr
flag: 🇫🇷

title: Christophe Heubès - Photos sous-marines
description: Christophe Heubès - Photos sous-marines
h1: Photos sous-marines
icon: fa-water
introduction: Sous la surface, un autre monde. Voici quelques images remontées de mes plongées.
---
```

| Champ | Rôle |
|---|---|
| `sitemap.priority` | Porté par le front matter mais non lu par le `sitemap.xml` actuel du site (voir "SEO" dans `technical-specifications.md`) ; conservé à titre indicatif |
| `sitemap.lastmod` | Date de dernière modification du contenu, utilisée par `sitemap.xml` |
| `layout` | Toujours `gallery` pour les trois galeries photo (voir `screens/gallery.md`) |
| `gallery` | Slug de la galerie, clé vers `site.data[page.gallery]` |
| `ref` | Identifiant partagé entre les deux langues de cette page, voir "Conventions générales" |
| `permalink` | `/<gallery>/` en français, `/en/<gallery>/` en anglais (voir "Multilingue" dans `functional-specifications.md`) |
| `icon` | Classe Font Awesome (voir "Iconographie" dans `style-guide.md`) |
| `introduction` | Texte affiché sous le titre de la grille et repris comme description dans la bande cinématique de l'accueil |

### Pages photo individuelles (générées)

Pour chaque photo de `_data/<gallery>.yml`, une page est générée à `/<gallery>/<slug>/` (et son équivalent `/en/<gallery>/<slug>/`) : même contenu que la grille, avec la lightbox ouverte directement sur cette photo (voir "Permaliens" dans `technical-specifications.md`). Ces pages n'existent pas comme fichiers sources : elles sont produites en mémoire au moment du build par `_plugins/gallery_photo_pages.rb` (voir `technical-specifications.md`), à partir de la page de galerie de la langue correspondante dont elles héritent tout le front matter, en plus des champs suivants :

| Champ | Valeur |
|---|---|
| `ref` | `<gallery>-<slug>` |
| `photo_slug` | `<slug>` |
| `photo_caption` | `title-fr` ou `title-en` de l'entrée, selon la langue de la page de base |
| `title`, `description` | `Christophe Heubès - <photo_caption>` |
| `image` | `/content/<gallery>/<file>`, utilisé pour l'Open Graph et le JSON‑LD de cette page |

## Dessin technique

### Données (`_data/technical-drawing.yml`)

Une entrée par dessin, dans l'ordre où il doit apparaître dans la liste (voir `screens/technical-drawing.md`) :

```yaml
- id: etude-came
  org-year: 1941
  fr-title: Etude d'une came - Schéma et diagramme - Détails de la came et du levier
  en-title: Study of a cam - Diagram and schematic - Details of the cam and lever
```

| Champ | Description |
|---|---|
| `id` | Slug du dessin, réutilisé pour le nom des fichiers image et l'URL de la page de détail |
| `org-year` | Année de réalisation du dessin original (1939 à 1942), affichée comme étiquette du comparateur avant/après |
| `fr-title` | Titre du dessin en français |
| `en-title` | Titre du dessin en anglais |

### Images

Pour chaque entrée `id: <id>`, deux fichiers image dans `content/technical-drawing/` :

| Fichier | Rôle |
|---|---|
| `<id>-org.jpg` | Dessin original à l'encre sur calque, réalisé par Claude Heubès entre 1939 et 1942 |
| `<id>-2020.jpg` | Reproduction numérique réalisée par Christophe Heubès en 2020 |

Les deux images d'un même dessin ont des dimensions quasi identiques (ex. 2048 × 1536 px et 2048 × 1537 px pour `etude-came`), condition nécessaire au bon alignement du comparateur avant/après (voir "Comparateur avant/après" dans `style-guide.md`). Comme pour les galeries photo, `content/technical-drawing/gallery-band-bg.jpg` est l'image de fond de la bande cinématique de l'accueil, sans entrée dans le `.yml`.

### Page de liste (front matter)

Un fichier par langue à la racine de `content/` (`content/technical-drawing.md`, `content/technical-drawing-en.md`), même structure que les pages de galerie ci‑dessus (`layout: technical-drawing`, `ref: technical-drawing`, `permalink: /technical-drawing/` ou `/en/technical-drawing/`, `icon: fa-compass-drafting`), avec une `introduction` qui peut contenir du HTML brut (lien vers la page Wikipédia de l'ENSAM dans le texte).

### Pages de détail

Contrairement aux pages photo individuelles des galeries, les pages de détail des dessins techniques sont des **fichiers Markdown réels**, committés dans `content/technical-drawing/` : `<id>.md` (français) et `<id>-en.md` (anglais). Elles ne sont pas générées au moment du build, mais par le script de maintenance `scripts/generate_technical_drawing_pages.rb` (voir `technical-specifications.md`), à exécuter après toute modification de `_data/technical-drawing.yml` puis à committer.

```yaml
---
sitemap:
  lastmod: 2026-08-04

layout: technical-drawing-detail
ref: technical-drawing-attelage-pour-crochet-de-traction
permalink: /technical-drawing/attelage-pour-crochet-de-traction/

lang: fr
flag: 🇫🇷

title: Attelage pour crochet de traction - Christophe Heubès
description: Attelage pour crochet de traction
image: /content/technical-drawing/attelage-pour-crochet-de-traction-2020.jpg

drawing-id: attelage-pour-crochet-de-traction
drawing-title: Attelage pour crochet de traction
---
```

| Champ | Rôle |
|---|---|
| `ref` | `technical-drawing-<id>`, unique par dessin, partagé entre les deux langues |
| `drawing-id` | `<id>`, clé vers les deux fichiers image et vers l'entrée de `_data/technical-drawing.yml` |
| `drawing-title` | Titre du dessin dans la langue de la page (recopié depuis `fr-title`/`en-title`) |

## Métadonnées des images

Chaque image de contenu (photo de galerie, sa vignette, les deux images d'un dessin technique) porte dans le fichier lui‑même l'auteur et la licence du site, en EXIF, IPTC et XMP, en plus du JSON‑LD de la page (voir "SEO" dans `technical-specifications.md`) : ces métadonnées suivent l'image quand elle est téléchargée ou indexée seule. Les images d'interface (`gallery-band-bg.jpg`, fonds de bande de `content/`, `assets/img/`) ne sont pas concernées.

### Champs communs

| Champ | Valeur |
|---|---|
| EXIF `Copyright` | `CC BY-NC-SA 4.0` |
| IPTC `CodedCharacterSet` | `UTF8`, toujours requis (le nom de l'auteur est accentué) ; sans lui, les lecteurs supposent du Latin‑1 et affichent `Heubès` ou `Œuvre` corrompus |
| IPTC `By-line`, XMP `dc:creator`, XMP `photoshop:Credit` | `Christophe Heubès` |
| IPTC `CopyrightNotice` | `CC Christophe Heubès` (même valeur que `copyrightNotice` dans le JSON‑LD) |
| XMP `dc:rights` | `Christophe Heubès - CC BY-NC-SA 4.0` |
| XMP `xmpRights:Marked` | `True` |
| XMP `xmpRights:UsageTerms` | `CC BY-NC-SA 4.0` |
| XMP `xmpRights:WebStatement` | `https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr` |

### Champs propres à chaque famille

| Champ | Photo de galerie | Dessin technique |
|---|---|---|
| IPTC `Caption-Abstract`, XMP `dc:description` | `title-fr` de l'entrée | `fr-title` de l'entrée |
| XMP `dc:title` | Titre court libre, sans point final (pas dérivé du `.yml`) | `fr-title` |
| IPTC `ObjectName` | Absent | `fr-title`, raccourci à une coupure lisible s'il dépasse 64 octets (limite du champ IPTC) |
| EXIF `Artist` | Absent | `Christophe Heubès` |
| XMP `photoshop:Source` | `christophe.heubes.org` | `Dessin original de Claude Heubès, ENSAM, <org-year>.` pour `-org.jpg`, `Reproduction numérique 2020, d'après le dessin original de Claude Heubès, ENSAM, <org-year>.` pour `-2020.jpg` |

Les vignettes portent exactement les métadonnées de leur original, recopiées par `scripts/generate_gallery_thumbnails.rb` (voir `technical-specifications.md`).

### Règles d'écriture

- Écrire les métadonnées avec exiftool, en écrivant IPTC et XMP dans la même commande pour qu'ils restent identiques.
- Ne pas remplir `photoshop:AuthorsPosition` ni son équivalent IPTC `By-lineTitle` : ce champ désigne la fonction de l'auteur, pas le titre de l'image.
- Déclarer `CodedCharacterSet=UTF8` dès la première écriture IPTC. L'ajouter après coup sur un fichier qui n'en a pas amène exiftool à réencoder les textes IPTC existants en Windows‑1252 : il faut alors réécrire ces champs (par exemple depuis leurs équivalents XMP).
- Après toute modification IPTC d'un fichier passé par Photoshop, le champ `Photoshop:IPTCDigest` doit correspondre au nouveau contenu (`-Photoshop:IPTCDigest=new`), sans quoi les lecteurs qui suivent les recommandations MWG considèrent IPTC et XMP comme potentiellement désynchronisés.

## Page d'accueil (front matter)

`index.md` (français, `permalink: /`) et `index-en.md` (anglais, `permalink: /en/`), `layout: index`, `ref: home`. En plus des champs communs (`lang`, `flag`, `title`, `description`), deux champs propres à l'accueil :

| Champ | Rôle |
|---|---|
| `h1` | Nom affiché dans le hero |
| `about-s-t` | Texte de la bande cinématique vers `samettof.org` (voir "Sites soeurs" dans `functional-specifications.md`) |
| `about-dataviz` | Texte de la bande cinématique vers `dataviz.heubes.io` |
| `about-social-graphs` | Texte de la bande cinématique vers `social-graphs.heubes.io` |

## Page 404

`404.md`, `layout: 404`, `ref: 404`, `permalink: /404.html`, `sitemap.exclude: 'yes'`. Contrairement aux autres pages du site, il n'existe qu'**une seule page 404** pour les deux langues (`flag: 🇫🇷 🇬🇧`, `lang: fr`) : son champ `message` est un texte fixe ("Page not found"), non localisé selon le préfixe de l'URL demandée (voir "Multilingue" dans `functional-specifications.md`).

## Conventions générales

- **Slugs** : minuscules ASCII et tirets (kebab‑case), ex. `under-water`, `attelage-pour-crochet-de-traction`.
- **`ref` commun aux deux langues d'une même page** : c'est le mécanisme qui relie les deux versions linguistiques d'une page (utilisé par le sélecteur de langue du pied de page, les alternates `hreflang` de `<head>`, et le `sitemap.xml`, voir `technical-specifications.md`). Deux pages qui documentent le même contenu dans les deux langues doivent porter le même `ref` ; deux pages de contenus différents ne doivent jamais partager un `ref`.
- **Un contenu ajouté existe dans les deux langues** : une entrée de `_data/<gallery>.yml` porte toujours `title-fr` et `title-en` dans la même entrée (pas de fichier séparé par langue) ; un dessin technique génère toujours ses deux pages de détail (`<id>.md` et `<id>-en.md`) via le script de génération. Il n'existe donc pas, en pratique, de contenu publié dans une seule langue (voir "Multilingue" dans `functional-specifications.md`).
- **Pas de script de validation** : contrairement à d'autres projets de l'auteur, ce site ne dispose d'aucun script vérifiant automatiquement la cohérence des données (unicité des slugs, présence des deux fichiers de langue, correspondance entre `_data/technical-drawing.yml` et les pages générées...). Ces règles sont respectées par convention, pas vérifiées mécaniquement.
