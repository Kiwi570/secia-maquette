# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v1 — la base

Première version de la maquette SECIA, en français et en anglais.

**Pages**
- Accueil, Cybersécurité, Tests d'intrusion, Urgence cyberattaque, SECIA (à propos), Contact, Mentions légales et page 404, chacune en français et en anglais (15 pages).

**Direction « Le plan »**
- Le site se lit comme un dossier d'ingénieur : fond calque bleuté, encre marine, orange signal réservé aux urgences et aux failles, polices Geist et Geist Mono.
- Chaque page porte un cartouche de plan (SECIA · Planche 01 à 07 · nom de la page · Éch. 1:1), repris sur le voile de transition et en pied de page.

**Effets propres à SECIA**
- esquisse : l'intro trace la grille puis le logo, du croquis au trait plein.
- impulsions : des impulsions lumineuses parcourent les liaisons du plan d'infrastructure.
- cotes : les repères chiffrés se posent comme des cotes de plan au défilement.
- plan-trois-etats : la méthode passe de l'esquisse au plan blindé puis au plan vivant.
- confinement : une intrusion est détectée, isolée puis contenue dans sa zone.
- verification : le mur des 42 certifications se coche au passage d'un balayage.
- chemin-attaque : sur la page Tests d'intrusion, chaque famille de tests trace son chemin et ses failles.
- cartouche : sur le voile, le numéro de planche défile jusqu'à celui de la page d'arrivée.

**Fonctionnalités**
- Ligne d'urgence visible partout : bouton « Sous attaque ? » dans l'en-tête et barre fixe Urgence / Rendez-vous sur téléphone.
- Autodiagnostic NIS2 en dix mesures avec jauge (accueil).
- Galerie épinglée des six services et de NIS2 (Cybersécurité), frise du cycle de vie.
- Formulaire d'alerte et demande de rendez-vous en quatre étapes avec récapitulatif, préremplie depuis chaque fiche de service. Les deux formulaires sont simulés.
- Carte Belgique-Luxembourg des implantations, FAQ, nomenclature des certifications et des partenaires.
- Mode calme, navigation au clavier, version sans JavaScript lisible.

**Images**
- 34 photos du site actuel, 8 portraits, 42 badges de certification, et des illustrations générées marquées « Illustration générée ».

**Mise en ligne**
- Site statique pour Vercel, adresses sans « .html », noindex, image de partage pour chaque page, audit automatique fourni dans `_audit/`.
