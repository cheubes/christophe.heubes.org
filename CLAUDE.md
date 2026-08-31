# christophe.heubes.org

Site personnel de Christophe Heubès : galeries photo (plongée sous‑marine, street art, déambulations urbaines) et dessins techniques réalisés par son grand‑père puis reproduits par lui. Site statique, multilingue (français / anglais), généré avec Jekyll et hébergé sur GitHub Pages.

## Rôle de `specs/`

`specs/` documente les choix de conception. `specs/` est la source de vérité pour toute évolution : avant d'écrire ou de modifier du code, lire les fichiers de specs concernés par la tâche.

## Structure de `specs/`

- **`functional-specifications.md`** : périmètre du site, visiteurs cibles, parcours utilisateurs, règles transverses (multilingue, navigation, liens vers les sites soeurs), hors périmètre.
- **`data-model.md`** : les deux familles de contenu (galerie photo générique, dessin technique), leurs fichiers de données (`_data/*.yml`), le front matter des pages, les mécanismes de génération de page, les conventions de nommage.
- **`technical-specifications.md`** : stack technique, hébergement/déploiement, architecture (génération des pages, routage, synchronisation d'URL de la lightbox), performance, accessibilité, SEO.
- **`style-guide.md`** : charte graphique (couleurs, typographie, espacements), composants UI de base (en‑tête, pied de page, hero, tuiles, lightbox, comparateur avant/après), iconographie.
- **`screens/`** : une spécification fonctionnelle par écran (objectif, contenu, interactions, états, responsive) :
  - `home.md` — accueil du site (hero + bandes cinématiques)
  - `gallery.md` — écran générique des trois galeries photo (plongée, street art, déambulations) et de sa lightbox
  - `technical-drawing.md` — dessins techniques (vue liste avec comparateur avant/après, vue détail)

## Quand et comment utiliser ces specs

- **Avant toute implémentation**, lire le ou les fichiers concernés par la tâche. Les quatre specs transverses (`functional-specifications.md`, `data-model.md`, `technical-specifications.md`, `style-guide.md`) s'appliquent à tout le site ; chaque fichier de `screens/` complète avec ce qui est propre à cet écran.
- **Les fichiers se référencent constamment entre eux** ("voir `X.md`") plutôt que de dupliquer l'information. Suivre ces renvois plutôt que de deviner : si un écran mentionne une règle définie ailleurs (le comportement multilingue, une couleur de la charte...), la source de vérité est le fichier référencé, pas l'écran qui le cite.
- **En cas de modification d'une spec**, chercher les autres fichiers qui la référencent (`grep` du nom de fichier dans `specs/`) et vérifier qu'ils restent cohérents avec le changement.
- **En cas de doute ou de silence des specs** sur un point nécessaire à l'implémentation, demander plutôt que de supposer : ce sont des choix de conception, pas des détails d'implémentation libres.
- **En cas d'écart entre le code existant et une spec** : ces specs ont été écrites après coup, à partir du code en place. Un écart repéré pendant une tâche a donc deux origines possibles, à distinguer avant d'agir : soit la spec décrit mal un comportement volontaire (corriger la spec), soit le code contient un oubli ou un bug que la rédaction des specs a mis en lumière (signaler à l'utilisateur, ne pas corriger silencieusement à l'occasion d'une tâche sans rapport). Une fois qu'une spec est confirmée correcte, elle fait foi : si une implémentation ultérieure doit s'en écarter, mettre à jour la spec et expliquer pourquoi plutôt que de diverger silencieusement dans le code.

## Avant chaque commit

- **Vérifier l'ensemble des fichiers de `specs/`** pour cohérence, pas seulement ceux directement modifiés par ce commit.
- **Si une ou plusieurs specs doivent être ajustées**, bloquer le commit : proposer les mises à jour nécessaires et attendre validation avant de les appliquer, puis de committer.
- **Mettre à jour `README.md`** si nécessaire.

## Conventions établies

- Le contenu des specs (`specs/`, ce fichier) est en français : ce sont des documents de conception, pas de la documentation au sens des règles globales. Le code, les commentaires et `README.md` restent en anglais, comme le reste du dépôt.
- Les noms de fichiers, dossiers, slugs et identifiants techniques sont en anglais, en kebab‑case (ex : `under-water`, `attelage-pour-crochet-de-traction`, `generate_gallery_thumbnails.rb` pour les scripts Ruby, qui suivent snake_case comme le reste de l'écosystème Ruby).
- Pas de préfixe imposé sur les classes CSS (contrairement à d'autres projets de l'auteur) : les identifiants et classes sont des noms sémantiques simples (`#site-header`, `.gallery-band`, `.gallery-thumb`), voir `technical-specifications.md`.
- Les couleurs et composants de la charte graphique sont définis une seule fois, dans `style-guide.md` : ne pas introduire de nouvelles valeurs de couleur ou de nouveaux styles de composants ailleurs sans les y ajouter d'abord.
