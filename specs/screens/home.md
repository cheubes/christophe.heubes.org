# Écran : accueil

## Objectif

Présenter l'auteur et donner accès à chacune des sections du site (les trois galeries photo, les dessins techniques) ainsi qu'à ses sites soeurs (voir "Sites soeurs" dans `functional-specifications.md`).

## Contenu et structure

### Hero (plein écran)

- Portrait circulaire de l'auteur, en lien vers l'accueil lui‑même.
- Séparateur, puis navigation par icônes : une par section (plongée, street art, déambulations, dessins techniques), puis les deux liens externes (samettof.org, social-graphs.heubes.io), dans cet ordre (voir `style-guide.md` pour le détail visuel).
- Indicateur de défilement en bas de viewport, invitant à découvrir les bandes cinématiques sous le hero.
- Pas de pied de page ni d'en‑tête compact visible dans le hero : ils apparaissent en défilant (voir "Composants UI de base" dans `style-guide.md`, l'en‑tête compact n'étant de toute façon jamais affiché sur l'accueil).

### Bandes cinématiques

Une bande pleine largeur par section, empilées verticalement, dans l'ordre suivant :

1. Plongée sous‑marine (`under-water`)
2. Street art (`street-art`)
3. Déambulations (`deambulations`)
4. Dessins techniques (`technical-drawing`)
5. samettof.org (lien externe)
6. social-graphs.heubes.io (lien externe)

Chaque bande affiche : une image de fond (`gallery-band-bg.jpg` de la section pour les quatre premières, une image dédiée pour les deux liens externes), une icône suivie du titre de la section, une description, et un texte d'appel à l'action ("Voir la galerie →" pour les quatre sections du site, "Visiter →" pour les deux liens externes).

- Le titre et la description des quatre premières bandes sont repris directement du front matter de la page de la section correspondante (`h1` et `introduction`, voir `data-model.md`) : ils ne sont pas dupliqués dans le front matter de l'accueil.
- Le titre et la description des deux bandes de sites soeurs sont propres à l'accueil (`about-s-t`, `about-social-graphs`, voir `data-model.md`).

### Pied de page

Commun à toutes les pages du site, voir "Pied de page" dans `style-guide.md`.

## Interactions

- Clic sur une icône du hero ou sur une bande : navigue vers la section correspondante, ou ouvre le lien externe dans un nouvel onglet pour les deux dernières bandes.
- Survol d'une bande : léger zoom de l'image de fond, assombrissement réduit du voile, éclaircissement du texte d'appel à l'action (voir `style-guide.md`).
- Changement de langue (pied de page) : bascule vers `/en/` (page distincte, rechargement complet, pas de bascule dynamique).

## États (chargement, erreur, vide)

- Pas d'état vide possible : les quatre sections et les deux bandes de sites soeurs sont fixes, non pilotées par une donnée qui pourrait être absente.
- Pas d'état de chargement propre : page entièrement statique, les images de fond n'étant pas chargées en lazy loading (contrairement aux vignettes de galerie, voir `screens/gallery.md`) puisqu'elles sont visibles dès l'arrivée sur la page ou immédiatement après un court défilement.

## Responsive

- Hero : `background-attachment: fixed` désactivé en dessous de 768 px (voir `style-guide.md`), pour éviter les artefacts de rendu propres à cette propriété sur mobile.
- Bandes cinématiques : hauteur en unités de viewport avec un minimum fixe (300 px), largeur toujours pleine ; titre et texte d'appel à l'action en tailles fluides (`clamp()`) pour rester lisibles sur petit écran.
