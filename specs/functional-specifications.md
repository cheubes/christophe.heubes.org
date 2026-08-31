# Spécifications fonctionnelles générales

## Contexte et objectifs

Le site présente le travail visuel de Christophe Heubès : trois galeries de photographies (plongée sous‑marine, street art, déambulations urbaines) et une collection de dessins techniques réalisés par son grand‑père Claude Heubès entre 1939 et 1942 lors de ses études, que Christophe a entrepris de reproduire au format numérique en 2020.

L'objectif est de permettre à un visiteur de découvrir ce travail de façon immersive : parcourir les photos en grand format, comparer les dessins techniques originaux à leur reproduction numérique, et accéder facilement aux autres projets de l'auteur.

## Périmètre du site

Dans le périmètre :

- Page d'accueil présentant l'auteur et donnant accès à chaque section (voir `screens/home.md`).
- Consultation de chacune des trois galeries photo (plongée, street art, déambulations) sous forme de grille, avec une vue plein écran par photo (voir `screens/gallery.md`).
- Consultation de la collection de dessins techniques sous forme de liste avec comparateur avant/après, et d'une page de détail par dessin (voir `screens/technical-drawing.md`).
- Site multilingue (français, anglais).
- Liens vers les autres sites de l'auteur (voir "Sites soeurs" ci‑dessous).

Voir aussi "Hors périmètre" ci‑dessous.

## Utilisateurs cibles

Le site s'adresse à des visiteurs qui découvrent le travail photographique ou le fonds familial de dessins techniques de l'auteur : famille, relations professionnelles, curieux arrivés depuis un moteur de recherche ou un réseau social. Il n'y a pas de distinction de rôle côté visiteur : pas de compte, pas d'espace personnel, pas de contenu personnalisé.

Le contenu (photos, dessins, textes) est produit par l'auteur directement dans les fichiers sources du dépôt (voir `data-model.md`), pas via une interface d'administration.

## Parcours utilisateurs principaux

1. Un visiteur arrive sur la page d'accueil, découvre l'auteur via le hero plein écran, et choisit une section soit depuis la navigation du hero, soit en défilant jusqu'à la bande cinématique correspondante.
2. S'il choisit une galerie photo (plongée, street art, déambulations), il arrive sur une grille de vignettes, clique sur une photo qui l'intéresse, et parcourt les photos suivantes/précédentes en plein écran sans quitter la grille.
3. S'il choisit les dessins techniques, il arrive sur une liste où chaque dessin se compare par un curseur avant/après (original à l'encre / reproduction numérique 2020), et peut ouvrir une page de détail dédiée à un dessin pour voir les deux images en plein format.
4. Depuis n'importe quelle page (hors accueil), il peut revenir à l'accueil ou naviguer directement vers une autre section via l'en‑tête.
5. Un visiteur peut aussi arriver directement sur une photo ou un dessin précis via un lien partagé, sans passer par l'accueil ni par la grille (voir "Permaliens" dans `technical-specifications.md`).

## Règles transverses

### Multilingue

- Le site est disponible en français et en anglais.
- Le français est la langue par défaut : ses pages sont servies à la racine du site, sans préfixe (`/`, `/technical-drawing/`...). L'anglais est préfixé par `/en/`.
- Chaque page existe en deux fichiers sources distincts (un par langue), reliés entre eux par un identifiant commun (`ref`, voir `data-model.md`) plutôt que par une traduction dynamique.
- Un sélecteur de langue, dans le pied de page (voir `style-guide.md`), permet de basculer vers la version dans l'autre langue de la page courante.
- Il n'existe actuellement aucun mécanisme de détection automatique de la langue du navigateur ni de mémorisation d'un choix de langue : chaque page est statique et sert la langue de son URL.
- Il n'y a pas de contenu partiellement traduit dans ce site : chaque section (galerie ou collection de dessins) et chaque élément qu'elle contient existent systématiquement dans les deux langues, produits ensemble (voir `data-model.md`). Il n'existe donc pas de mécanisme de repli ni de message "contenu non disponible dans cette langue" : une URL qui ne correspond à aucune page générée déclenche simplement le 404 générique du site (voir "Page non trouvée" ci‑dessous), sans détection de la langue depuis le préfixe de l'URL demandée.

### Navigation

- Page d'accueil : navigation par icônes dans le hero, une par section, plus deux liens externes vers les sites soeurs (voir ci‑dessous).
- Toute autre page : en‑tête compact et collant en haut de page, avec les mêmes icônes de navigation, plus un lien vers l'accueil (photo de profil).
- Pied de page fixe, présent sur toutes les pages : liens vers les réseaux sociaux de l'auteur, licence Creative Commons, sélecteur de langue (voir `style-guide.md`).

### Sites soeurs

L'auteur maintient plusieurs sites, chacun documenté par son propre `specs/` : ce site les referme pas, il y renvoie par des liens externes (nouvel onglet) depuis le hero de l'accueil, les bandes cinématiques de l'accueil et le pied de page.

| Site | Contenu | Emplacement du lien |
|---|---|---|
| `samettof.org` | Carnets de voyage de plongée de l'auteur et de ses deux comparses | Hero, bande cinématique accueil |
| `social-graphs.heubes.io` | Outil d'exploration de graphes de relations sociales | Hero, bande cinématique accueil |
| `christophe.heubes.com` | Site professionnel de l'auteur | Icône dans le pied de page |
| Instagram (`@christophe.uw`, `@christophe.hbs`), Goodreads | Réseaux sociaux personnels | Pied de page |

## Hors périmètre

- Comptes utilisateurs, authentification.
- Édition de contenu via une interface web : le contenu est créé et modifié directement dans les fichiers sources (voir `data-model.md`).
- Contenu généré par les visiteurs (commentaires, notes, contributions).
- Recherche ou filtrage : contrairement à d'autres projets de l'auteur, aucune des galeries n'offre de recherche ni de filtre, le volume de contenu par section ne le justifiant pas à ce jour.
- Détection ou mémorisation automatique de la langue du visiteur (voir "Multilingue" ci‑dessus).
