# Ce qui a changé

Chaque version ajoute sa partie en tête de ce fichier, construite en comparant l'archive précédente et la nouvelle, jamais de mémoire.

## v3 — plus de photos au début de l'accueil

Comparaison faite fichier par fichier avec l'archive secia-maquette-v2.zip : aucun fichier ajouté ni retiré, 75 modifiés. Hors accueil, les changements se limitent au numéro de version des fichiers (?v=3).

**Accueil (français et anglais)**
- Ouverture : le plan animé est désormais dessiné sur une grande photo réelle de l'équipe en réunion, vue à travers une feuille de calque. La photo des bureaux reste posée dessus comme un tirage.
- Les textes du plan gardent leur case pleine ; la cote « Infrastructure résiliente » reçoit un liseré clair pour rester lisible sur la photo.
- Repères chiffrés : une photo réelle au-dessus de chaque chiffre (2009, 24/7, 42, 15), dévoilée au défilement.
- Méthode : une photo réelle par temps (concevoir, sécuriser, exploiter), dévoilée au défilement sous le texte de l'étape.
- Toutes ces photos viennent du shooting déjà fourni ; aucune image générée en plus.

**Fichiers touchés**
- `source/pages/accueil.mjs` : photos de l'ouverture, des repères et de la méthode (listes `REPERES` et `METHODE`).
- `assets/css/site.css` : calque de l'ouverture, textes du plan, formats des nouvelles photos.
- `donnees/site.json` et `_audit/version-livree.txt` : version 3. `README.md` : note sur l'accueil.

**Audit (accueil, français et anglais)**
- 0 échec. À regarder, déjà connus en v2 : 4 à 6 % d'images lentes au défilement avec le processeur ralenti 4 fois, et la ligne de cote tracée qui ne compte pas comme effet de section.

## v2 — les pages des services, NIS2, Carrières et les pages légales

Comparaison faite fichier par fichier avec l'archive secia-maquette-v1.zip : 141 fichiers ajoutés, 45 modifiés, aucun retiré.

**Nouvelles pages (français et anglais, 38 pages de plus, 53 au total)**
- Pôle réseau (`/reseau`) : les neuf services en galerie épinglée, et une frise qui les regroupe de la conception au support.
- Quatorze pages de services, toutes construites sur un seul modèle à partir des textes du site actuel :
  - cybersécurité : intégration et conseil, audits, sécurité managée, CSOC, CSIRT ;
  - réseau : réseau d'entreprise, WAN et cloud, SDN, sans fil, automatisation, audits réseau, conception et migration, formation, laboratoires PoC.
  - Chaque page présente ses volets en planches cotées (planche 02.x ou 03.x), puis « Pourquoi maintenant » et « Pourquoi SECIA », les autres planches du pôle et un rendez-vous où le service est déjà rempli.
- Conformité NIS2 (`/nis2`) : champ d'application, seuils de taille, les 18 secteurs des annexes I et II, l'autodiagnostic des dix mesures (le même que sur l'accueil) et les sanctions.
- Carrières (`/carrieres`) : les quatre offres du site actuel et une candidature spontanée simulée. Le bouton « Postuler » remplit déjà le poste.
- Politique de confidentialité et conditions générales : le texte actuel du groupe, avec un avertissement « à adapter pour SECIA ».

**Changements sur les pages existantes**
- Menu : « Tests d'intrusion » cède sa place à Réseau, Conformité NIS2 et Carrières. L'en-tête affiche Cybersécurité, Réseau, SECIA et Contact.
- Pied de page : liens vers la confidentialité et les conditions générales.
- Les fiches de la galerie Cybersécurité et les listes des pôles de l'accueil mènent désormais aux pages des services.
- Contact : le récapitulatif reconnaît aussi les services réseau. La case d'accord est entièrement cliquable.
- Le lien « Politique de confidentialité » des formulaires mène à la nouvelle page.
- Numéro de version des fichiers : ?v=2.

**Corrections du texte source (listées dans `donnees/fiches.json`)**
- Sécurité managée : le bloc Web/API recopié par erreur est retiré, et le volet « Surveillance externe » est marqué « à compléter ».
- Laboratoires PoC : l'introduction et les titres, en anglais sur la page française, sont traduits.
- Sans fil : « Levés topographiques » devient « Étude de site et planification ».
- Audits réseau et Formation : un titre en anglais et des fautes de frappe sont corrigés.
- NIS2 :
  - les dates, le nombre de secteurs (18) et la référence à l'article 21 (points a à j) sont corrigés ;
  - la loi belge du 26 avril 2024 (en vigueur depuis le 18 octobre 2024) est vérifiée.

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
