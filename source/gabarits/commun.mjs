/* Gabarit commun SECIA : head, intro « esquisse » (grille de calque, logo tracé, cartouche),
   voile « cartouche », en-tête, menu, pied de page, barre fixe du téléphone.
   Les conventions data-* sont celles que lisent le socle JavaScript et l'audit (voir le README du socle). */
import { html, brut } from '../../outils/gabarit.mjs';

const navigation = (c, liste = c.site.navigation) => liste.filter((cle) => c.pages[cle] && (c.pages[cle].langues || c.langues).includes(c.l));
const planche = (c, cle) => (c.site.planches && c.site.planches[cle]) || '00';

function tete(c) {
  const p = c.page, cle = p.cle;
  const titre = c.s(`pages.${cle}.titre`), description = c.s(`pages.${cle}.description`);
  const ici = c.abs(c.url(cle));
  const imagePartage = c.abs(`/assets/partage/${p.partage === false ? 'accueil' : cle}-${c.l}.jpg`);
  const autres = c.alternatives(cle);
  const structure = c.donnees.structure ? JSON.stringify(c.donnees.structure).replace(/</g, '\\u003c') : '';
  return html`<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${titre}</title>
<meta name="description" content="${description}">
<meta name="robots" content="noindex, nofollow">
<link rel="canonical" href="${ici}">
${autres.length > 1 ? autres.map((a) => html`<link rel="alternate" hreflang="${a.l}" href="${c.abs(a.url)}">\n`) : ''}${autres.length > 1 ? html`<link rel="alternate" hreflang="x-default" href="${c.abs(c.alternatives(cle)[0].url)}">` : ''}
<style>${brut(c.critique.css)}</style>
<script>${brut(c.critique.js)}</script>
${(c.site.polices || []).map((f) => html`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>\n`)}<link rel="stylesheet" href="${c.asset('css/socle.css')}">
<link rel="stylesheet" href="${c.asset('css/site.css')}">
<link rel="modulepreload" href="${c.asset('js/site.js')}">
<link rel="modulepreload" href="${c.asset('js/socle/index.js')}">
<script src="/assets/vendor/gsap.min.js" defer></script>
<script src="/assets/vendor/ScrollTrigger.min.js" defer></script>
<script src="/assets/vendor/SplitText.min.js" defer></script>
<script type="module" src="${c.asset('js/site.js')}"></script>
<meta name="theme-color" content="${c.site.couleurs.theme || c.site.couleurs.fond}">
<link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/images/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${c.site.nom}">
<meta property="og:locale" content="${c.l === 'fr' ? 'fr_BE' : 'en_GB'}">
<meta property="og:title" content="${titre}">
<meta property="og:description" content="${description}">
<meta property="og:url" content="${ici}">
<meta property="og:image" content="${imagePartage}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${c.s(`pages.${p.partage === false ? 'accueil' : cle}.partageAlt`)}">
<meta name="twitter:card" content="summary_large_image">
${structure ? html`<script type="application/ld+json">${brut(structure)}</script>` : ''}
</head>`;
}

/* Logo vectorisé d'après le fichier du client (donnees/logo.json). */
function logo(c, { classe = '', titre = '' } = {}) {
  const L = c.donnees.logo;
  return html`<svg class="logo-svg ${classe}" viewBox="0 0 ${L.W} ${L.H}" ${brut(titre ? `role="img" aria-label="${titre}"` : 'aria-hidden="true" focusable="false"')}><path class="logo-marque" fill-rule="evenodd" d="${L.marque + L.mot}"/><path class="logo-base" fill-rule="evenodd" d="${L.ligne + L.base}"/></svg>`;
}

/* Cartouche de plan : SECIA · planche · nom de la page · échelle. */
function cartouche(c, cle, { classe = '', libelle } = {}) {
  return html`<div class="cartouche ${classe}" aria-hidden="true"${brut(classe.includes('voile') ? ' data-effet="cartouche"' : '')}>
  <span class="cartouche-case cartouche-nom">SECIA</span>
  <span class="cartouche-case">${c.t('commun.planche')} <b data-planche>${planche(c, cle)}</b></span>
  <span class="cartouche-case cartouche-titre"${brut(classe.includes('voile') ? ' data-voile-libelle' : '')}>${libelle ?? c.libelle(cle)}</span>
  <span class="cartouche-case">${c.t('commun.echelle')}</span>
</div>`;
}

function entete(c) {
  const autreLangue = c.alternatives(c.page.cle).filter((a) => a.l !== c.l);
  const a = c.site.actionEntete;
  return html`<header data-entete>
  <div class="entete-rangee">
    <a class="entete-logo" href="${c.url('accueil')}" aria-label="${c.s('commun.logoAlt')}" data-libelle="${c.libelle('accueil')}"${c.page.cle === 'accueil' ? brut(' aria-current="page"') : ''}>
      ${logo(c)}
    </a>
    <nav data-nav aria-label="${c.s('commun.navigation')}">
      <ul>${navigation(c, c.site.navigationEntete).map((k) => html`<li>${c.lien(k)}</li>`)}</ul>
    </nav>
    <div class="entete-actions">
      ${autreLangue.map((x) => html`<a class="entete-langue" href="${x.url}" hreflang="${x.l}" lang="${x.l}" data-langue="${x.l}" aria-label="${c.s('commun.langueAutre')}">${x.l}</a>`)}
      <a class="bouton bouton--signal entete-urgence" href="${c.url(a.page)}" data-libelle="${c.libelle(a.page)}"${c.page.cle === a.page ? brut(' aria-current="page"') : ''}><span class="voyant" aria-hidden="true"></span><span class="lib-long">${c.t('commun.actionEntete')}</span><span class="lib-court" aria-hidden="true">${c.t('commun.urgenceCourt')}</span></a>
      <button type="button" data-menu-bouton aria-controls="menu" aria-expanded="false" data-libelle-ouvrir="${c.s('commun.menu')}" data-libelle-fermer="${c.s('commun.fermer')}"><span class="menu-icone" aria-hidden="true"></span><span data-libelle-bouton>${c.t('commun.menu')}</span></button>
    </div>
  </div>
</header>
<div id="menu" data-menu role="dialog" aria-modal="true" aria-label="${c.s('commun.menu')}">
  <div class="menu-grille">
    <ul>${navigation(c).map((k, i) => html`<li style="--i:${i}"><span class="menu-num" aria-hidden="true">${planche(c, k)}</span>${c.lien(k, { classe: 'menu-lien' })}</li>`)}</ul>
    <div class="menu-cote">
      <p class="surtitre">${c.t('commun.urgenceTitre')}</p>
      <p><a class="bouton bouton--signal" href="tel:${c.site.urgence.belgiqueLien}">${c.t('commun.urgenceBelgique')} ${c.site.urgence.belgique}</a></p>
      <p><a class="lien-fort" href="tel:${c.site.urgence.luxembourgLien}">${c.t('commun.urgenceLuxembourg')} ${c.site.urgence.luxembourg}</a></p>
      <p>${c.lien('contact', { classe: 'bouton', texte: c.t('commun.rendezVous') })}</p>
      ${autreLangue.map((x) => html`<p><a class="lien-fort" href="${x.url}" hreflang="${x.l}" lang="${x.l}" data-langue="${x.l}">${c.s('commun.langueAutre')}</a></p>`)}
      <p><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></p>
    </div>
  </div>
</div>`;
}

function pied(c) {
  const k = c.site.contact, u = c.site.urgence, g = c.site.groupe;
  return html`<footer class="pied" id="pied" data-masque-barre>
  <div class="conteneur">
    <div class="pied-tete">
      ${logo(c, { classe: 'pied-logo', titre: c.s('commun.logoAlt') })}
      <p class="pied-accroche">${c.t('commun.piedAccroche')}</p>
    </div>
    <div class="pied-grille">
      <div>
        <p class="surtitre">SECIA</p>
        <p>${k.rue}<br>${k.ville}<br>${c.loc(k.pays)}</p>
        <p><a href="tel:${k.telephoneLien}">${c.t('commun.general')} ${k.telephone}</a><br><a href="mailto:${k.email}">${k.email}</a><br><a href="${g.linkedin}" target="_blank" rel="noopener">${c.t('commun.linkedin')}</a></p>
      </div>
      <div>
        <p class="surtitre">${c.t('commun.urgenceTitre')}</p>
        <p><a class="lien-fort" href="tel:${u.belgiqueLien}">${c.t('commun.urgenceBelgique')} ${u.belgique}</a><br><a class="lien-fort" href="tel:${u.luxembourgLien}">${c.t('commun.urgenceLuxembourg')} ${u.luxembourg}</a></p>
        <p>${c.lien('alerte-cyberattaque', { texte: c.t('commun.premiersGestes') })}</p>
      </div>
      <nav aria-label="${c.s('commun.sommaire')}">
        <p class="surtitre">${c.t('commun.sommaire')}</p>
        <ul>${navigation(c).map((x) => html`<li>${c.lien(x)}</li>`)}<li>${c.lien('mentions-legales')}</li></ul>
      </nav>
      <div>
        <p class="surtitre">${c.t('commun.confort')}</p>
        <ul>
          <li><button type="button" class="lien" data-calme-bascule data-libelle-reduire="${c.s('commun.calmeReduire')}" data-libelle-retablir="${c.s('commun.calmeRetablir')}" data-libelle-systeme="${c.s('commun.calmeSysteme')}"><span data-libelle-bouton>${c.t('commun.calmeReduire')}</span></button></li>
          <li><a href="#haut" data-sans-transition>${c.t('commun.retourHaut')}</a></li>
        </ul>
      </div>
    </div>
    ${cartouche(c, c.page.cle, { classe: 'cartouche--pied' })}
    <div class="pied-bas"><p>${c.t('commun.membre')}</p><p>${c.t('commun.maquette')}</p></div>
  </div>
</footer>`;
}

function barre(c) {
  return html`<div data-barre-fixe>
  <a class="bouton bouton--signal" href="tel:${c.site.urgence.belgiqueLien}"><span class="voyant" aria-hidden="true"></span>${c.t('commun.barreAppel')}</a>
  ${c.lien('contact', { classe: 'bouton', texte: c.t('commun.rendezVousCourt') })}
</div>`;
}

/* Voile de transition : un calque d'encre qui porte le cartouche de la page d'arrivée. */
function voile(c) {
  return html`<div data-voile aria-hidden="true" data-planches='${brut(JSON.stringify(Object.fromEntries(Object.keys(c.site.planches).map((k) => [c.pages[k] ? c.libelle(k) : k, c.site.planches[k]]))).replace(/'/g, '&#39;'))}'>
  <div class="voile-grille"></div>
  <div class="voile-contenu">
    <img src="/assets/images/logo-clair.svg" alt="" width="180" height="43">
  </div>
  ${cartouche(c, c.page.cle, { classe: 'cartouche--voile' })}
</div>`;
}

/* Intro « esquisse » : grille de calque, repères de cote, logo tracé puis rempli, cartouche. */
function ouverture(c) {
  const L = c.donnees.logo;
  const lignes = [];
  for (let i = 1; i < 12; i++) lignes.push(`<line class="ouv-l ouv-v" x1="${(i * 100) / 12}" y1="0" x2="${(i * 100) / 12}" y2="100" pathLength="1"/>`);
  for (let i = 1; i < 8; i++) lignes.push(`<line class="ouv-l ouv-h" x1="0" y1="${(i * 100) / 8}" x2="100" y2="${(i * 100) / 8}" pathLength="1"/>`);
  return html`<div class="ouverture-panneau" data-ouverture data-effet="esquisse" aria-hidden="true">
  <svg class="ouv-grille" viewBox="0 0 100 100" preserveAspectRatio="none">${brut(lignes.join(''))}</svg>
  <span class="ouv-coin ouv-coin--hg"></span><span class="ouv-coin ouv-coin--hd"></span><span class="ouv-coin ouv-coin--bg"></span><span class="ouv-coin ouv-coin--bd"></span>
  <div class="ouv-centre">
    <svg class="ouv-logo" viewBox="0 0 ${L.W} ${L.H}">
      <path class="ouv-fantome" fill-rule="evenodd" d="${L.marque + L.mot}"/>
      <path class="ouv-remplissage" fill-rule="evenodd" d="${L.marque + L.mot}"/>
      <path class="ouv-base" fill-rule="evenodd" d="${L.ligne + L.base}"/>
      <g class="ouv-traits">${L.traits.map((d) => html`<path d="${d}" pathLength="1"/>`)}</g>
    </svg>
    <p class="ouv-cote"><span class="ouv-cote-trait"></span><span class="ouv-cote-texte">${c.t('commun.introCote')}</span><span class="ouv-cote-trait"></span></p>
  </div>
  ${cartouche(c, c.page.cle, { classe: 'cartouche--ouverture', libelle: c.s('commun.introLigne') })}
</div>`;
}

export function page(c, contenu) {
  return html`<!doctype html>
<html lang="${c.l}" data-v="${c.v}"${c.site.curseur ? brut(' data-curseur') : ''} data-page="${c.page.cle}">
${tete(c)}
<body id="haut">
${voile(c)}
${ouverture(c)}
<a class="evitement" href="#contenu">${c.t('commun.evitement')}</a>
${entete(c)}
<div class="calque-grille" aria-hidden="true" data-audit-ignorer></div>
<main id="contenu" tabindex="-1"${c.page.sansAction ? brut(' data-sans-action') : ''}${c.page.sansEffet ? brut(' data-sans-effet') : ''}>
${contenu}
</main>
${pied(c)}
${barre(c)}
</body>
</html>`;
}

/* Petits gabarits partagés par les pages. */
export const g = { logo, cartouche, planche };
