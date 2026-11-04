# Maquette SECIA — v4

Maquette du site de SECIA (membre de NPS Consult Group), direction « Le plan », en français et en anglais.
Adresse prévue : https://secia-maquette.vercel.app (noindex : la maquette n'est pas référencée).

## Pages

| Page | Français | Anglais |
|---|---|---|
| Accueil | `/` | `/en/` |
| Pôle cybersécurité | `/cybersecurite` | `/en/cybersecurite` |
| Services cybersécurité (6) | `/integration-conseil`, `/audits-securite`, `/tests-intrusion`, `/securite-managee`, `/surveillance-csoc`, `/reponse-incidents` | mêmes adresses sous `/en/` |
| Conformité NIS2 | `/nis2` | `/en/nis2` |
| Pôle réseau | `/reseau` | `/en/reseau` |
| Services réseau (9) | `/reseau-entreprise`, `/connectivite-wan-cloud`, `/sdn`, `/sans-fil`, `/automatisation-surveillance`, `/audits-reseau`, `/conception-migration`, `/formation`, `/laboratoires-poc` | mêmes adresses sous `/en/` |
| Urgence cyberattaque | `/alerte-cyberattaque` | `/en/alerte-cyberattaque` |
| SECIA (à propos) | `/secia` | `/en/secia` |
| Carrières | `/carrieres` | `/en/carrieres` |
| Contact | `/contact` | `/en/contact` |
| Mentions légales, confidentialité, conditions générales | `/mentions-legales`, `/confidentialite`, `/conditions-generales` | mêmes adresses sous `/en/` |

Le site (v4) est plus vivant sur toutes les pages : fil de lecture orange dans la marge (ordinateur), grille du calque qui s'allume sous la souris, surtitres et chiffres qui se décodent, photos scannées à leur arrivée, rubans de mots au défilement et cartes en relief. Tout est dans `assets/js/site.js` (fonctions `fil`, `grilleSouris`, `decode`, `scan`, `rubans`) et `assets/css/site.css` (bloc v4) ; le mode calme coupe ces mouvements.

L'accueil (v3) montre davantage de photos réelles dès le début : l'ouverture pose le plan animé sur une photo de l'équipe, vue comme à travers une feuille de calque ; chaque repère chiffré et chaque temps de la méthode a sa photo. Les noms des photos sont dans `source/pages/accueil.mjs` (`REPERES`, `METHODE`).

Les pages de services sont produites par un seul modèle (`source/gabarits/service.mjs`) à partir de `donnees/fiches.json`, lui-même tiré des textes du site actuel. Les corrections apportées au texte source sont listées dans `donnees/fiches.json` (`_corrections`).

## À fournir par SECIA

- Forme juridique, numéro d'entreprise (BCE), responsable de la publication, politique de confidentialité.
- Noms des personnes sur les portraits (seul Christophe Celio est identifié), nom du photographe.
- Confirmation de la consigne « Éteignez les systèmes compromis » (premiers gestes, page Urgence).
- Effectif du groupe (« à confirmer »), et validation des chiffres attribués à NPS Consult Group.
- Liste des 42 badges de certification, reprise du site du groupe (elle mêle badges techniques et commerciaux) : à confirmer pour l'équipe SECIA.
- Services de sécurité managés : le contenu du volet « Surveillance externe » (absent du site actuel).
- Description des quatre offres d'emploi (seuls l'intitulé et le lieu figurent sur le site actuel).
- Politique de confidentialité et conditions générales : textes actuels de NPS Consult Group S.A., à adapter pour SECIA et à faire valider (code postal L-5787, numéro sans indicatif).
- Mention « Hackers éthiques certifiés (CEH, OSCP) » (page Tests d'intrusion, reprise du site du groupe) : à confirmer, ces certifications ne figurent pas parmi les badges.

## À la mise en ligne définitive

- Retirer : `noindex` (balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`), les deux formulaires simulés (à brancher sur un vrai envoi), les mentions « à compléter » et « à confirmer » une fois les informations fournies. Les schémas gardent leur mention « illustratif ».
- Garder : la mention « Illustration générée » sur chaque image créée par IA, et les crédits des mentions légales.
- Ne jamais modifier les pages `.html` à la main : elles sont regénérées par `node outils/generer.mjs` depuis `donnees/` et `source/`.

---

# Base de départ des maquettes (socle)

Base testée, commune à toutes les maquettes : chaque projet part d'une copie de ce dossier au lieu de tout réécrire.
Les pages d'exemple (accueil, à propos, mentions légales, 404) et leurs images sont à remplacer par le contenu du client.

## Démarrer un projet

1. Copier le contenu de `socle/` à la racine du projet `[client]-maquette/`, et le dossier `audit/` de la skill dans `_audit/`. Les fichiers cachés (`.vercelignore`, `assets/partage/.gitkeep`) peuvent manquer dans la copie de la skill reçue dans une conversation : le générateur (étape 5) recrée `.vercelignore` s'il manque et le complète s'il lui manque une ligne, et `outils/images-partage.mjs` crée `assets/partage/`. Sans `.vercelignore`, `_audit/`, `source/`, `outils/` et `donnees/` seraient mis en ligne ; l'audit le vérifie.
2. Remplir `donnees/site.json` (nom, adresse Vercel prévue, langues, couleurs — `fond`, `texte`, `voile`, et si besoin `ouverture` pour le panneau de l'intro et `menu` pour le fond du menu —, contact, site actuel), puis `donnees/textes/<langue>.json` et les autres données (`donnees/*.json`).
3. Écrire les pages dans `source/pages/*.mjs`, le style dans `assets/css/site.css`, les effets dans `assets/js/site.js`.
4. Convertir les images reçues : `python3 outils/images.py recu/lot.json` (modèle : `outils/lot.exemple.json`).
5. Générer les pages : `node outils/generer.mjs`, puis les images de partage : `node outils/images-partage.mjs`.
6. Copier `_audit/config.exemple.json` en `_audit/config.json` et le remplir (pages types, effets du plan, site actuel), puis auditer : `node _audit/audit.mjs` (standard), `--rapide` pendant la construction, `--complet` pour la version finale.

Ne jamais modifier à la main les pages générées (`index.html`, `en/index.html`…) : elles sont réécrites par `generer.mjs`.

## Dossiers

| Dossier | Contenu |
|---|---|
| `donnees/` | Source unique des textes et des données : `site.json`, `textes/<langue>.json`, `*.json` (champs traduits sous la forme `{ "fr": …, "en": … }`), `structure.json` (données schema.org réelles). |
| `source/critique/` | Style et script critiques, copiés en ligne dans chaque page : couleur de fond dès la première image, mode d'arrivée (intro, voile, retour), délai de secours. |
| `source/gabarits/` | `commun.mjs` (head, en-tête, menu, pied de page, barre du téléphone, voile, panneau d'ouverture), `partage.mjs` (image de partage 1200×630). |
| `source/pages/` | Une page par fichier : `export const page = { cle, fichier }` et `export default (c) => html\`…\``. |
| `assets/js/socle/` | Comportements communs (voir plus bas). Le projet ne les modifie pas : il les règle depuis `site.js`. |
| `assets/vendor/` | GSAP 3.15 (gsap, ScrollTrigger, SplitText), sans numéro de version. |
| `outils/` | `generer.mjs`, `images-partage.mjs`, `images.py`, `gabarit.mjs`, `dimensions.mjs`. |

## Ce que fait le socle

- **Ouverture** : l'intro complète se joue à chaque arrivée sur le site et à chaque rechargement. Elle se termine moins de 3 s après le premier octet, attente comprise (le socle l'accélère si l'attente l'a retardée). Une première action l'accélère, une seconde la passe (clic, touche, molette, glissement ; un geste continu compte pour une action). Défilement bloqué dès le premier affichage. Au retour arrière ou avant, la page revient directement dans son état final. Les changements de page internes passent par le voile, jamais par l'intro. En mode calme, et au rechargement dû au bouton du mode calme : état final directement. Une attente qui échoue ne bloque jamais l'écran.
- **Voile de transition** : couvre l'écran, navigation, la page d'arrivée démarre couverte (style critique), se prépare dessous, puis le voile se retire et les animations d'arrivée démarrent à mesure que la page se découvre. Délai de secours 2 s. Page suivante préchargée à l'approche du lien. Grands sauts dans une même page sous le voile. Défilement bloqué tant que le voile couvre l'écran, au départ comme à l'arrivée. Le voile est placé en tête de `<body>` pour être là dès la première image.
- **Bande de la barre de défilement** (`gouttiere.js`) : sur un ordinateur à barre de défilement classique (Windows, Mac avec une souris), `scrollbar-gutter: stable` réserve une bande d'environ 15 px à droite ; défilement bloqué, le navigateur la peint avec la couleur de fond de `<html>`, qu'aucun panneau fixe ne peut recouvrir, et il n'y peint ni image ni dégradé. Le style critique donne donc à `<html>` la couleur du voile ou de l'intro dès la première image, puis le socle suit le panneau qui couvre l'écran (intro, voile, menu) : la bande prend la couleur de ce qui en couvre la plus grande partie, mélangée selon l'opacité pendant un fondu. Pour une fenêtre plein écran propre au projet : `suivre(el)` à l'ouverture, `lacher(el)` à la fermeture (exportés par `socle/index.js`), et `data-recouvrement` pour que l'audit la contrôle. Un panneau à fond d'image ou de dégradé indique la couleur de la bande avec `data-gouttiere="#…"`.
- **En-tête** : opaque, se cache en descendant et revient en remontant avec un seuil, bouton Menu dès que les liens ne tiennent plus (mesure réelle), menu avec Échap, focus gardé, page bloquée, libellé qui revient à « Menu ».
- **Mode calme** : réglage de l'appareil respecté, bouton `[data-calme-bascule]`, retour à la section après rechargement, boucles et défilement adouci coupés.
- **Défilement** : natif sur Mac, iPhone, iPad et écrans tactiles ; adouci à la molette sous Windows et Linux seulement.
- **Mesures** : `--entete-h` et `--barres-h` réelles, `ScrollTrigger.refresh()` regroupé quand la hauteur de la page change.
- **Boucles** : `boucle(element, (dt, t) => …)` ne tourne qu'à l'écran, onglet visible, jamais en mode calme (une image fixe est dessinée).
- **Formulaires** `[data-formulaire]` : préremplis par l'adresse (`?sujet=visite`), erreurs à côté du champ, pas de double envoi, message « simulé ».
- **Compteurs** `[data-compteur]`, **barre de lecture** `[data-barre-lecture]`, **sommaire** `[data-sommaire]`, **curseur** (attribut `data-curseur` sur `<html>`, souris seulement).

## Bibliothèque d'effets (`assets/js/socle/effets.js`, `onde.js`)

Effets génériques testés (mode calme, retour arrière, téléphone, audit) : on les pose par attributs, on ne les réécrit pas.

| Attribut | Effet | Remarques |
|---|---|---|
| `data-anime="lignes"` | Titre découpé en lignes qui montent de leur masque | Accents jamais coupés ; redevient du texte normal après l'arrivée |
| `data-anime="mots"` | Texte qui arrive mot par mot | |
| `data-anime="cascade"` | Enfants directs (cartes, liste) qui arrivent l'un après l'autre | Ne pas mettre `data-anime` sur les enfants |
| `data-anime="rideau"` | Image révélée par un rideau, qui se resserre | Sur une figure `.media` (`c.media({ attrs: 'data-anime="rideau"' })`) |
| `data-fx="parallaxe"` | Image qui glisse dans son cadre au défilement | `data-fx-force` : déplacement en % (10) ; agrandie d'office, bords jamais visibles |
| `data-fx="zoom"` | Image qui se resserre en entrant dans l'écran | `data-fx-force` : agrandissement de départ en % (18) |
| `data-fx="trace"` | Traits SVG qui se dessinent au défilement | Tous les traits du SVG, ou ceux marqués `data-fx-trait` ; finissent tracés en entier |
| `data-fx="galerie"` | Section épinglée, piste `[data-galerie]` qui défile à l'horizontale | Ordinateur et tablette (761 px et plus) ; barre `[data-fx-progres]` ou `.galerie-progres span` |
| `data-fx="onde"` | Image WebGL qui ondule selon la vitesse de défilement, loupe douce sous la souris | Canvas visible seulement pendant le mouvement ; image d'origine dessous ; 6 par page au plus ; `data-fx-force` (1) |
| `data-survol="magnetique"` | Bouton attiré par la souris | Souris seulement ; ne compte pas comme effet de section |
| `data-survol="incline"` | Carte qui s'incline en 3D | Souris seulement ; `data-survol-force` en degrés (7) |

Règles :
- un seul `data-fx` par élément ; `rideau` ne se combine pas avec un `data-fx` sur la même figure ;
- un texte `lignes` ou `mots` qui contient un lien, un bouton, un compteur ou un autre effet n'est pas découpé (simple fondu) : découper le texte autour, pas le bloc entier ;
- les textes sont découpés à l'avance, pendant les temps morts, et redeviennent du texte normal quand le défilement s'arrête ; la découpe ne change pas la hauteur du bloc ;
- un trait ou une image en `zoom` déjà dans le premier écran se joue juste après l'ouverture ; au retour arrière, tout est dans son état final ;
- `galerie` n'épingle qu'à partir de 761 px : sur téléphone la piste défile au doigt, donc la section a besoin d'un autre effet (titre en `lignes`, cartes en `cascade`…) ;
- au premier survol, un élément `data-survol` reçoit la classe `fx-survol` : GSAP prend la main sur sa transformation, sans transition CSS sur transform ;
- `onde` : le canvas est calé sur l'image (pas sur la figure), respecte `object-fit` (cover ou contain) et `object-position`, et l'ouverture attend sa texture (dans son délai maximal).
Les apparitions et les `data-fx` reçoivent `data-effet` s'il manque (l'audit les compte) ; les effets à la souris reçoivent `data-souris` (l'audit vérifie qu'ils ne dérivent pas).
Effets propres au projet (dans `site.js`) : marquer leur élément `data-effet="nom-du-plan"`, et `data-souris` s'ils suivent la souris.

## API du projet (`assets/js/site.js`)

```js
import { demarrer, boucle, etat } from './socle/index.js?v=1';
demarrer({
  preparer() { /* ScrollTrigger, SplitText, boucles : états de départ posés ici */ },
  jouer() { return gsap.timeline() /* intro complète, environ 2 s */; },
  etatFinal() { /* éléments animés par le projet dans leur état final */ },
  arrivee() { /* animations d'arrivée pendant que le voile se retire (facultatif) */ },
  pret: [/* promesses en plus : shaders, scènes ; un échec ne bloque rien */],
});
```

## Conventions lues par le socle et par l'audit

| Attribut | Rôle |
|---|---|
| `data-ouverture` | Élément d'ouverture, visible et entier dès la première image (panneau du gabarit commun). |
| `data-anime` | Caché jusqu'à son apparition (`.vu`). `data-anime="gsap"` : animé par le projet. |
| `data-voile`, `data-voile-libelle` | Voile de transition et nom de la page d'arrivée. |
| `data-gouttiere` | Sur un panneau qui couvre l'écran : couleur de la bande de la barre de défilement quand son fond est une image ou un dégradé. |
| `data-recouvrement` | Fenêtre plein écran du projet (visionneuse, panier) : l'audit contrôle les bords de l'écran pendant qu'elle est ouverte. |
| `data-entete`, `data-nav`, `data-menu`, `data-menu-bouton` | En-tête, navigation, menu, bouton Menu. |
| `data-barre-fixe` | Barre fixe du bas (téléphone). `data-masque-barre` : zone où elle se masque. |
| `data-action-principale`, `data-info-cle` | Bouton principal et information clé du premier écran. |
| `data-entete-cache` | Scène épinglée pendant laquelle l'en-tête se cache. |
| `data-plein-ecran` | Section plein écran vérifiée par le test « tient dans l'écran ». |
| `data-galerie` | Galerie horizontale (ses cartes au bord de l'écran ne sont pas des « textes coupés »). |
| `data-boucle-css`, `data-pause-pour` | Animation CSS en boucle et son bouton pause. |
| `data-superpose` | Superposition voulue (exclue du contrôle des chevauchements). |
| `data-audit-ignorer` | Élément décoratif ignoré par l'audit (curseur, particules). |
| `data-ephemere` | Élément qui doit disparaître après son animation. |
| `data-prix`, `data-repere`, `data-indicateur` | Prix, repère de schéma ou de carte, indicateur : jamais recouverts ni coupés (audit). |
| `data-sans-visuel` | Bloc dispensé d'image par section (sections de texte des pages légales). |
| `data-sans-action` | Sur `<main>` : page sans bouton principal (pages légales ; posé par `page.sansAction`). |
| `data-sans-effet` | Sur `<main>` (posé par `page.sansEffet`) ou une section : dispensée du contrôle « un effet par section » (pages de texte). |
| `data-effet="nom"` | Effet compté par l'audit pour sa section ; nom du plan d'animation (liste `effets` de `_audit/config.json`). |
| `data-souris` | Effet qui suit la souris : l'audit vérifie qu'il se stabilise quand elle s'arrête. |
| `data-anime="lignes|mots|cascade|rideau"`, `data-fx`, `data-survol` | Bibliothèque d'effets (voir plus haut). |
| `data-visuel`, `data-section` | Visuel dessiné autrement qu'en image ; section qui n'est pas une balise `<section>`. |
| `data-ruban` | Bandeau défilant (ignoré par le contrôle des textes coupés). |
| `data-typo-ignorer` | Texte exclu du contrôle de typographie française (code, citation en langue étrangère). |
| `data-sans-transition` | Lien interne sans voile (ancre « retour en haut », téléchargement). |
| `data-defilement-natif` | Sur `<html>` : défilement natif partout, choix du projet. |
| `data-langue` | Lien vers une autre langue : le choix est mémorisé. |
| `data-formulaire`, `data-message-envoi` | Formulaire simulé et zone du message « rien n'a été envoyé ». |
| `data-compteur`, `data-barre-lecture`, `data-sommaire` | Compteur animé, barre de lecture, sommaire qui suit la lecture. |
| `data-calme-bascule` | Bouton « Réduire les animations ». |
| `data-libelle` | Nom de la page d'arrivée affiché sur le voile (posé par `c.lien`). |
| Dossier `assets/images/grok/` | Image générée : `c.media()` ajoute la mention « Illustration générée ». |

## Gabarits (`c` dans les pages)

`c.t('cle')` texte échappé avec typographie française · `c.tb('cle')` fragment HTML de confiance · `c.s('cle')` texte brut ·
`c.lien('page', { ancre, params, texte, classe })` lien avec `data-libelle` et `aria-current` · `c.url('page', ancre, params)` ·
`c.media({ nom, alt, cadrage, cadrageMobile, sizes, priorite, classe, ratio, legende, attrs })` image en plusieurs tailles, version téléphone, largeur et hauteur réelles ; `attrs` : attributs en plus sur la figure (`'data-fx="parallaxe"'`) ·
`c.donnees.<fichier>` données localisées · `c.l` langue · `c.site` réglages.

En français, la typographie est appliquée automatiquement : espaces insécables avant `: ; ? ! »`, après `«`, entre un nombre et son unité, dans les milliers.

## À la mise en ligne définitive

- Retirer : `noindex` (balise robots dans `source/gabarits/commun.mjs` et en-tête X-Robots-Tag dans `vercel.json`), données de démonstration, formulaires, panier et réservations simulés, mentions « à compléter ».
- Garder : la mention « Illustration générée » sur les images créées par IA.
