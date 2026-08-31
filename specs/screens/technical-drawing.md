# Écran : dessins techniques

Deux vues distinctes, chacune avec son propre layout (voir `technical-specifications.md`) : une liste avec comparateur avant/après, et une page de détail par dessin. Documentées ici ensemble plutôt que dans deux fichiers séparés, leur complexité respective ne justifiant pas la fragmentation.

## Objectif

Mettre en valeur les dessins techniques originaux de Claude Heubès (1939-1942) en les comparant à leur reproduction numérique par Christophe Heubès (2020), et permettre de consulter chaque dessin en plein format.

## Vue liste (`/technical-drawing/`)

### Contenu et structure

- En‑tête compact commun à tout le site (voir `style-guide.md`).
- Titre (`h1`) avec icône, suivi de "par"/"by" Claude et Christophe Heubès (les deux auteurs, contrairement aux galeries photo qui ne créditent que Christophe, voir `screens/gallery.md`), puis l'`introduction` de la section (qui peut contenir un lien HTML brut, voir `data-model.md`).
- Une entrée par dessin de `_data/technical-drawing.yml` (voir `data-model.md`), dans l'ordre du fichier, séparées par un filet horizontal :
  - Le comparateur avant/après (voir "Comparateur avant/après" dans `style-guide.md`), curseur positionné par défaut au centre.
  - Le titre du dessin sous le comparateur, en lien vers sa page de détail.

### Interactions

- **Déplacement du curseur du comparateur** : révèle progressivement le dessin original (`<id>-org.jpg`) par‑dessus la reproduction 2020 (`<id>-2020.jpg`), à la souris, au toucher ou au clavier (curseur natif `<input type="range">`).
- **Clic sur le titre d'un dessin** : navigue vers sa page de détail.
- **Changement de langue** (pied de page) : bascule vers la liste dans l'autre langue ; le titre de chaque dessin change (`fr-title`/`en-title`), la position du curseur de chaque comparateur n'est pas conservée (nouvelle page, curseur réinitialisé au centre).

### États

- **Vide** : pas de comportement défini, `_data/technical-drawing.yml` n'étant jamais vide en pratique.
- **Chargement des images** : contrairement aux vignettes des galeries photo, les images du comparateur (`loading="lazy"`) sont à pleine résolution dès la liste, aucune version redimensionnée n'existant pour les dessins techniques (voir `data-model.md`).

### Responsive

Disposition centrée sur une seule colonne (marges Bootstrap `col-md-1`/`col-md-2` de part et d'autre), quelle que soit la largeur d'écran : contrairement aux galeries photo, pas de grille à plusieurs colonnes, chaque dessin occupant toute la largeur utile disponible.

## Vue détail (`/technical-drawing/<id>/`)

### Contenu et structure

- En‑tête compact, lien de retour vers la liste (icône + texte) répété en haut et en bas de page (voir "Page de détail" dans `style-guide.md`).
- Titre du dessin (`drawing-title`, voir `data-model.md`).
- Les deux images empilées verticalement, chacune en pleine largeur avec sa légende (`figcaption`) :
  1. Dessin original (`<id>-org.jpg`), légendé "Dessin original réalisé par Claude Heubès lors de ses études à l'ENSAM" / traduction anglaise équivalente.
  2. Reproduction numérique (`<id>-2020.jpg`), légendé "Reproduction numérique réalisée par Christophe Heubès en 2020" / équivalent anglais.

Contrairement à la vue liste, les deux images ne sont pas comparées par curseur ici : consultées l'une après l'autre, en pleine résolution, pour un examen détaillé de chacune.

### Interactions

- **Clic sur un lien de retour** : navigue vers la liste (`/technical-drawing/` ou `/en/technical-drawing/` selon la langue de la page).
- **Changement de langue** (pied de page) : bascule vers le détail du même dessin (`ref` commun, voir `data-model.md`) dans l'autre langue.

### États

Aucun état particulier : page statique, contenu toujours présent (un dessin technique n'existe qu'accompagné de ses deux images et de ses deux pages de langue, voir "Conventions générales" dans `data-model.md`).

### Responsive

Une seule colonne centrée (mêmes marges Bootstrap que la vue liste), images en pleine largeur utile à toute taille d'écran.
