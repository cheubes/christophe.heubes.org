# Écran : galerie photo

Écran générique, partagé par les trois galeries du site (plongée sous‑marine, street art, déambulations, voir `data-model.md`) : ce document ne décrit pas une galerie en particulier, mais le comportement commun aux trois, piloté par `page.gallery`. Toute différence entre galeries se limite au contenu (`_data/<gallery>.yml`, textes du front matter), jamais au comportement.

## Objectif

Permettre au visiteur de parcourir l'ensemble des photos d'une section en grille, puis de les consulter en plein écran, dans l'ordre, sans quitter la page.

## Contenu et structure

- En‑tête compact commun à tout le site hors accueil (voir `style-guide.md`).
- Titre (`h1`) avec icône de la section, suivi de "par"/"by" Christophe Heubès (voir `data-model.md`), puis l'`introduction` de la section.
- Grille de vignettes, une par entrée de `_data/<gallery>.yml`, dans l'ordre du fichier (voir `data-model.md`) : pas de tri ni de réorganisation calculée, l'ordre d'affichage est l'ordre éditorial choisi dans le fichier de données.
- Chaque vignette affiche l'image redimensionnée (`<slug>-thumb.<ext>`, voir `data-model.md`), en lazy loading.
- Lightbox (modale plein écran), présente sur la page mais masquée par défaut, sauf si la page est celle d'une photo précise (voir "États" ci‑dessous).

## Interactions

- **Clic sur une vignette** : ouvre la lightbox sur cette photo (image en pleine résolution, légende, mention de crédit), met à jour l'URL vers le permalien de cette photo (voir "Permaliens et synchronisation d'URL de la lightbox" dans `technical-specifications.md`), sans rechargement de page.
  - Un clic modifié (bouton du milieu, `Ctrl`/`Cmd`/`Maj`/`Alt` enfoncé) n'est pas intercepté : le comportement natif du navigateur s'applique (ex. ouverture dans un nouvel onglet), la vignette restant un lien `<a>` classique vers le permalien de la photo.
- **Navigation précédent/suivant** dans la lightbox : au clic sur les boutons dédiés, ou aux flèches gauche/droite du clavier. Change la photo affichée et met à jour l'URL (`history.replaceState`, pas d'entrée d'historique supplémentaire par photo parcourue).
  - Premier élément de la galerie : bouton précédent masqué. Dernier élément : bouton suivant masqué. Pas de bouclage.
- **Fermeture de la lightbox** : bouton de fermeture, touche `Échap` (comportement natif de la modale Bootstrap), ou navigation arrière du navigateur. Restaure l'URL de la grille.
- **Boutons précédent/suivant du navigateur** : rouvrent, changent ou ferment la lightbox selon l'URL restaurée (voir `technical-specifications.md`), pour rester cohérents avec la navigation au clic.
- **Changement de langue** (pied de page) : bascule vers la grille de la même galerie dans l'autre langue ; si une photo était ouverte, la lightbox n'est pas rouverte automatiquement sur cette même photo après le changement de langue (l'URL cible est celle de la grille de la section, pas celle de la photo).

## États (chargement, erreur, vide)

- **Page d'une photo précise** (`/<gallery>/<slug>/`, voir `data-model.md`) : au chargement, la lightbox s'ouvre directement sur cette photo, sans action de l'utilisateur (voir "Permaliens" dans `technical-specifications.md`).
- **Vignette active** : sur la page d'une photo précise, la vignette correspondante dans la grille est visuellement mise en évidence (bordure dorée, voir `style-guide.md`) et porte `aria-current="page"`.
- **Vide** : pas de comportement défini, la grille étant toujours alimentée par un fichier de données non vide en pratique (voir "Conventions générales" dans `data-model.md`, une galerie sans aucune entrée n'étant pas un cas prévu par le site).
- **Erreur de chargement d'image** : pas de comportement de repli défini (pas d'image de remplacement générique) ; une vignette ou une image de lightbox dont le fichier serait manquant s'afficherait cassée.

## Responsive

Grille en colonnes Bootstrap (`col-4`, trois vignettes par ligne) à toutes les largeurs d'écran : contrairement à d'autres projets de l'auteur, le nombre de colonnes n'est pas réduit sur mobile via une classe responsive dédiée.
