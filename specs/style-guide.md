# Charte graphique

## Couleurs

### Palette "Dark Cinematic"

Contrairement à d'autres projets de l'auteur, la palette n'est pas exposée en variables CSS natives (`--custom-property`) mais en variables LESS (`@variable`), définies une seule fois en tête de `assets/css/hbs.less` :

| Rôle | Variable | Hex |
|---|---|---|
| Fond général des pages | `@bg` | `#0d0d0d` |
| Fond du pied de page | `@surface` | `#161616` |
| Texte courant, titres | `@text` | `#f0ece4` |
| Texte secondaire, icônes de navigation au repos | `@text-muted` | `#8a8278` |
| Accent, liens, éléments actifs | `@gold` | `#C7B299` |
| Accent au survol | `@gold-bright` | `#e8d5b7` |

```less
@bg:           #0d0d0d;
@surface:      #161616;
@text:         #f0ece4;
@text-muted:   #8a8278;
@gold:         #C7B299;
@gold-bright:  #e8d5b7;
```

Deux variables supplémentaires sont déclarées dans le fichier source (`@blue: #2C374C`, `@light-grey: #ACB2B8`), avec un commentaire les présentant comme une "compatibilité BeerSlider / technical-drawing" : à l'usage, elles ne sont référencées nulle part ailleurs dans `hbs.less`. Le comparateur avant/après (voir "Comparateur avant/après" ci‑dessous) garde en réalité l'habillage par défaut, non thémé, de la bibliothèque BeerSlider. Ne pas supposer que ces deux variables pilotent un composant existant : les traiter comme réservées, pas comme actives.

### Utilisation

Fond `@bg` sur `html`/`body`. Titres et corps de texte en `@text`. Les liens sont en `@gold` par défaut, `@gold-bright` au survol (transition `color 0.2s ease`). Les icônes de navigation (en‑tête, hero) sont en `@text-muted` au repos, `@gold` au survol.

## Typographie

- **Corps de texte** : Ubuntu (Google Fonts), `font-family: Ubuntu, sans-serif` sur `html`/`body`.
- **Titres** (`h1`-`h3`) : Raleway (Google Fonts), graisse 600, `letter-spacing: 0.05em`.

| Usage | Police | Graisse | Notes |
|---|---|---|---|
| Titres de section, hero (`h1`) | Raleway | 600 | Majuscules, `letter-spacing` large sur le hero et les bandes cinématiques (voir ci‑dessous) |
| Corps de texte, introductions | Ubuntu | 400 | |
| Texte secondaire (légendes, métadonnées) | Ubuntu | 400 | Couleur `@text-muted` |

Polices chargées via Google Fonts avec `rel="preconnect"` (voir `technical-specifications.md`), graisses 300/400/500/600 (Raleway) et 400/700 (Ubuntu).

## Espacements et grille

Pas d'échelle d'espacement custom : la grille et les classes utilitaires de Bootstrap 5 (`container-fluid`, `row`/`col-*`, `g-*`) sont utilisées telles quelles.

## Composants UI de base

### Hero (accueil uniquement)

- Plein écran (`100vh`, minimum 500 px), image de fond `assets/img/bg.jpg` (1920 × 1080 px) avec un voile sombre (`rgba(0, 0, 0, 0.62)`) par‑dessus, `background-attachment: fixed` (désactivé sur mobile, ≤ 768 px, pour éviter les artefacts de rendu).
- Portrait circulaire (`assets/img/photo.jpg`, 512 × 512 px), bordure `@gold`, lien vers l'accueil.
- Séparateur horizontal fin, `@gold`, 80 px de large.
- Navigation du hero : icônes en ligne, une par section plus les deux liens externes (voir "Sites soeurs" dans `functional-specifications.md`), `@text-muted` au repos, `@gold` et léger agrandissement au survol.
- Indicateur de défilement (chevron animé, rebond vertical continu) en bas de viewport.

### Bandes cinématiques (accueil)

- Une bande par section (galeries, dessins techniques, sites soeurs), pleine largeur, 50 % de la hauteur de viewport (minimum 300 px), image de fond en `object-fit: cover` (voir "Images" ci‑dessous pour le ratio recommandé).
- Voile sombre semi‑transparent (`rgba(0, 0, 0, 0.50)`), assombri légèrement au survol pour les liens externes.
- Contenu centré : titre en majuscules (Raleway 600, `letter-spacing: 0.15em`), description (Ubuntu, `@text`, largeur max 600 px), texte d'appel à l'action en `@gold` ("Voir la galerie →" / "Visiter →" pour les liens externes).
- Au survol : léger zoom de l'image de fond (`scale(1.04)`), assombrissement réduit du voile.

### En‑tête compact (pages hors accueil)

- Position collante (`sticky`) en haut de page, fond `#111111`, bordure basse fine `@gold` à 15 % d'opacité.
- Répartition : icônes de navigation (mêmes que le hero, sans les liens externes vers les sites soeurs dans l'ordre... voir note ci‑dessous) à gauche, portrait circulaire cliquable vers l'accueil à droite.
- Absent sur l'accueil (`page.ref != "home"`), qui a son propre hero.

Note : l'en‑tête inclut en réalité les six mêmes liens que le hero (quatre sections plus les deux sites soeurs), dans le même ordre. Ne pas réduire cette liste sans vérifier `functional-specifications.md` (section "Sites soeurs").

### Pied de page

- Fixe (`position: fixed`, bas de l'écran), fond `@surface`, bordure haute fine `@gold` à 20 % d'opacité.
- **Gauche** : liens réseaux sociaux (portrait circulaire vers `christophe.heubes.com`, icônes Font Awesome Instagram ×2, Goodreads).
- **Centre** : licence Creative Commons (quatre icônes Font Awesome Brands : `fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa`, suivies du texte "CC BY-NC-SA 4.0"), lien vers `deed.fr` ou `deed.en` selon la langue courante.
- **Droite** : sélecteur de langue, un lien par langue disponible pour la page courante (`ref` commun, voir `data-model.md`), affiché sous forme d'emoji drapeau (🇫🇷/🇬🇧) avec `aria-label` explicite.

### Grille de galerie photo (tuiles)

Voir `screens/gallery.md` pour le comportement complet. Éléments de style :

- Chaque vignette (`.gallery-thumb`) a un ratio fixe 3:4 (`aspect-ratio: 3 / 4`), quel que soit le ratio de la photo source, via `object-fit: cover` sur l'image.
- Bordure transparente 1 px par défaut, `@gold` au survol ou si la vignette est celle actuellement ouverte dans la lightbox (`.gallery-thumb-active`) ; léger zoom de l'image au survol.
- Titre de la galerie (`h1`) avec une icône Font Awesome (voir "Iconographie") suivie du texte "par"/"by" Christophe Heubès.

### Lightbox (galeries photo)

- Modale Bootstrap standard, fond noir (`#000`), bordure fine `@gold` à 15 % d'opacité.
- Image affichée en hauteur maximale 82 % du viewport (`max-height: 82vh`).
- Légende sous l'image : texte secondaire italique (`@text-muted`), suivie systématiquement de la mention "Photo par Christophe Heubès" / "Photo by Christophe Heubès".
- Bouton de fermeture : composant natif Bootstrap (`btn-close btn-close-white`), pas une icône Font Awesome.
- Navigation précédent/suivant : deux boutons superposés aux bords gauche/droite de l'image, fond semi‑transparent (`rgba(0, 0, 0, 0.5)`), masqués (`visibility: hidden`, pas retirés du DOM) sur le premier/dernier élément plutôt que désactivés.

### Comparateur avant/après (dessins techniques)

- Bibliothèque BeerSlider, avec son habillage visuel par défaut (poignée circulaire semi‑transparente blanche, étiquettes en chip blanc semi‑transparent) : ce composant n'est **pas** thémé aux couleurs "Dark Cinematic" du reste du site (voir "Palette" ci‑dessus).
- Étiquette de gauche : année de la reproduction numérique ("2020", fixe). Étiquette de droite : `org-year` du dessin (voir `data-model.md`), l'année de réalisation de l'original.
- Titre du dessin sous le comparateur, en lien vers sa page de détail, avec une icône de loupe (voir "Iconographie").

### Page de détail (dessin technique)

- Lien de retour vers la liste (icône flèche gauche + texte), répété en haut et en bas de page.
- Les deux images (original, reproduction) empilées verticalement plutôt que comparées par curseur, chacune avec sa légende en `figcaption` (texte secondaire italique).

### Page 404

- Image de fond `assets/img/bg.jpg`, même traitement que le hero (voile sombre, `background-attachment: fixed`).
- "404" en grand, message en majuscules, gras, centrés verticalement.

## Images

| Image | Ratio observé | Dimensions observées |
|---|---|---|
| Photo de galerie (originale) | Variable (portrait ou paysage selon la photo) | Variable |
| Vignette de galerie (générée) | Identique à l'original (redimensionnement sans recadrage), affichée en 3:4 via `object-fit: cover` | Plus grande dimension ramenée à 800 px |
| Fond de bande cinématique (`gallery-band-bg.jpg`) | ~3:1 | 2400 × 800 px (mesuré sur `under-water`) |
| Fond du hero / page 404 (`bg.jpg`) | 16:9 | 1920 × 1080 px |
| Portrait de profil (`photo.jpg`) | 1:1 | 512 × 512 px |
| Dessin technique (original et reproduction) | ~4:3, quasi identique entre les deux versions d'un même dessin | ~2048 px de large |

`object-fit: cover` en CSS absorbe les écarts de ratio à l'affichage plutôt que d'imposer un recadrage strict à l'ajout de contenu, à l'exception des vignettes de galerie qui sont pré‑redimensionnées par script (voir "Scripts de maintenance locaux" dans `technical-specifications.md`).

## Iconographie

Font Awesome, chargé via Kit distant (voir `technical-specifications.md`), pas de version figée par CDN explicite.

| Usage | Icône |
|---|---|
| Plongée sous‑marine | `fa-water` |
| Street art | `fa-palette` |
| Déambulations | `fa-person-walking` |
| Dessins techniques | `fa-compass-drafting` |
| Lien vers samettof.org | `fa-earth-asia` |
| Lien vers social-graphs.heubes.io | `fa-diagram-project` |
| Instagram | `fa-instagram` (Brands) |
| Goodreads | `fa-book-open` |
| Licence Creative Commons | `fa-creative-commons`, `fa-creative-commons-by`, `fa-creative-commons-nc-eu`, `fa-creative-commons-sa` (Brands) |
| Indicateur de défilement (hero) | `fa-chevron-down` |
| Retour à la liste des dessins techniques | `fa-arrow-left` |
| Accès au détail d'un dessin technique | `fa-magnifying-glass-plus` |
| Fermeture de la lightbox | composant natif Bootstrap (`btn-close`), pas une icône Font Awesome |
| Sélecteur de langue | emoji drapeaux 🇫🇷/🇬🇧, pas d'icône Font Awesome |
