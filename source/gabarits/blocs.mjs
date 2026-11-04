/* Blocs partagés par les pages intérieures : ouverture de page, urgence compacte, appel final,
   chemin d'attaque (tests d'intrusion), frise du cycle de vie. */
import { html, brut } from '../../outils/gabarit.mjs';

/* Ouverture d'une page intérieure : titre, texte, actions, information clé, grand visuel. */
export function tete(c, { surtitre, titre, textes = [], actions = '', info = '', media = '', classe = '' }) {
  return html`<section class="page-tete conteneur ${classe}" id="debut">
  <div class="page-tete-texte">
    <p class="surtitre">${surtitre}</p>
    <h1 data-anime="lignes">${titre}</h1>
    ${textes.map((t) => html`<p class="page-intro" data-anime>${t}</p>`)}
    ${actions ? html`<p class="page-actions" data-anime>${actions}</p>` : ''}
    ${info ? html`<p class="hero-info" data-info-cle data-anime><span class="voyant" aria-hidden="true"></span>${info}</p>` : ''}
  </div>
  ${media}
</section>`;
}

/* Bloc d'urgence compact, sur fond d'encre, avec les deux numéros 24/7. */
export function urgenceCompacte(c, { titre, texte, image, alt = '' }) {
  const u = c.site.urgence;
  return html`<section class="urgence urgence--compacte" id="urgence">
  <div class="conteneur urgence-grille">
    <div class="urgence-texte">
      <p class="surtitre">${c.t('commun.urgenceTitre')}</p>
      <h2 data-anime="lignes">${titre}</h2>
      <p data-anime>${texte}</p>
      <ul class="urgence-numeros" data-anime="cascade">
        <li><span>${c.t('commun.belgique')}</span><a href="tel:${u.belgiqueLien}">${u.belgique}</a></li>
        <li><span>${c.t('commun.luxembourg')}</span><a href="tel:${u.luxembourgLien}">${u.luxembourg}</a></li>
      </ul>
      ${c.page.cle !== 'alerte-cyberattaque' ? html`<p data-anime>${c.lien('alerte-cyberattaque', { classe: 'bouton bouton--signal', texte: c.t('commun.premiersGestes'), attrs: 'data-survol="magnetique"' })}</p>` : ''}
    </div>
    ${c.media({ nom: image, alt, cadrage: '45% 45%', classe: 'urgence-photo', sizes: '(max-width: 860px) 100vw, 45vw', attrs: 'data-anime="rideau"' })}
  </div>
</section>`;
}

/* Appel à l'action final de chaque page. */
export function fin(c, { titre, texte = '', action, image, alt = '', id = 'fin' }) {
  return html`<section class="appel conteneur" id="${id}">
  ${c.media({ nom: image, alt, cadrage: '50% 50%', classe: 'appel-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="appel-texte">
    <h2 data-anime="lignes">${titre}</h2>
    ${texte ? html`<p data-anime>${texte}</p>` : ''}
    <p class="fin-actions" data-anime>
      ${action}
      <a class="lien-fort" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.general')} ${c.site.contact.telephone}</a>
      <a class="lien-fort" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a>
    </p>
  </div>
</section>`;
}

/* Chemin d'attaque d'un test d'intrusion (640 × 600) : trois segments tracés à leur tour, des repères de faille. */
export function planChemin(c) {
  const t = (k) => c.s(`plans.${k}`);
  const boite = (x, y, w, h, texte, cls = '') => html`<g class="noeud ${cls}"><rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="6"/><text x="${x}" y="${y + 8}" text-anchor="middle">${texte}</text></g>`;
  const repere = (x, y, k, n) => html`<g class="faille faille--${k}"><circle cx="${x}" cy="${y}" r="17"/><text x="${x}" y="${y + 7}" text-anchor="middle">${n}</text></g>`;
  return html`<svg class="plan plan--chemin" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
  <g class="zones-chemin">
    <rect x="20" y="20" width="600" height="96" rx="10"/><text x="604" y="48" text-anchor="end">${t('zoneExterne')}</text>
    <rect x="20" y="136" width="600" height="150" rx="10"/><text x="604" y="164" text-anchor="end">${t('zonePerimetre')}</text>
    <rect x="20" y="306" width="600" height="274" rx="10"/><text x="604" y="566" text-anchor="end">${t('zoneInterne')}</text>
  </g>
  <g class="liens">
    <path d="M150 92 V180"/><path d="M150 232 V362"/><path d="M235 206 H330"/><path d="M150 414 V450 H110 V478 M150 450 H300 V478"/><path d="M490 232 V362 M405 388 H235"/>
  </g>
  <g class="attaque">
    <path class="seg seg-1" pathLength="1" d="M120 66 C140 110 230 140 150 180 L150 232 C150 300 120 330 150 362 L150 414 C150 440 290 450 300 478"/>
    <path class="seg seg-2" pathLength="1" d="M150 66 C230 66 330 150 410 180 L410 232 C410 300 470 330 490 362"/>
    <path class="seg seg-3" pathLength="1" d="M300 530 C380 560 560 520 560 440 L560 414"/>
  </g>
  ${boite(150, 66, 170, 52, t('internet'))}
  ${boite(150, 206, 170, 52, t('parefeu'), 'noeud--garde')}
  ${boite(410, 206, 170, 52, t('webapi'))}
  ${boite(150, 388, 170, 52, t('coeur'))}
  ${boite(490, 388, 170, 52, t('donnees'), 'noeud--cible')}
  ${boite(110, 504, 150, 52, t('postes'))}
  ${boite(300, 504, 150, 52, t('wifi'))}
  ${repere(150, 180, 1, '1')}
  ${repere(300, 478, 1, '2')}
  ${repere(410, 180, 2, '3')}
  ${repere(490, 362, 2, '4')}
  ${repere(560, 414, 3, '5')}
  <g class="detection-rt"><circle cx="560" cy="414" r="36"/></g>
</svg>`;
}

/* Frise du cycle de vie : de la conception à la réponse (trait tracé au défilement). */
export function frise(c, etapes, { classe = '' } = {}) {
  return html`<div class="frise ${classe}" data-visuel>
  <svg class="frise-trait" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M2 12 H998"/><path d="M2 4 V20 M998 4 V20"/></svg>
  <ol class="frise-etapes" data-anime="cascade">
    ${etapes.map((e, i) => html`<li><span class="frise-point" aria-hidden="true"></span><p class="frise-phase">${e.phase}</p><p class="frise-num">${String(i + 1).padStart(2, '0')}</p><h3>${e.titre}</h3><p>${e.texte}</p></li>`)}
  </ol>
</div>`;
}

/* Autodiagnostic NIS2 : les dix mesures de l'article 21 à cocher, jauge, appel (accueil et page NIS2). */
export function diagnosticNis2(c, { id = 'nis2', surtitre, titre, texte, loi = '' }) {
  return html`<section class="nis2" id="${id}">
  <div class="conteneur nis2-grille">
    <div class="nis2-texte">
      <p class="surtitre">${surtitre}</p>
      <h2 data-anime="lignes">${titre}</h2>
      <p data-anime>${texte}</p>
      ${loi ? html`<p class="nis2-loi" data-anime>${loi}</p>` : ''}
      <ul class="nis2-mesures" data-anime="cascade" aria-label="${c.s('accueil.nis2.liste')}">
        ${c.donnees.nis2.map((m, i) => html`<li><button type="button" class="mesure" aria-pressed="false" data-mesure="${i}"><span class="mesure-lettre">${m.lettre}</span><span class="mesure-nom">${m.nom}</span><span class="mesure-etat" aria-hidden="true"></span></button></li>`)}
      </ul>
    </div>
    <div class="nis2-visuel">
      ${c.media({ nom: 'grok/accueil-nis2', alt: '', cadrage: '70% 50%', classe: 'nis2-fond', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}
      <div class="jauge" data-visuel>
        <svg viewBox="0 0 240 240" aria-hidden="true">
          <g class="jauge-cadre" data-fx="trace"><circle cx="120" cy="120" r="104"/><path d="M120 6 V22 M120 218 V234 M6 120 H22 M218 120 H234"/></g>
          <g class="jauge-segments">${Array.from({ length: 10 }, (_, i) => {
            const a0 = (-90 + i * 36 + 3) * Math.PI / 180, a1 = (-90 + (i + 1) * 36 - 3) * Math.PI / 180, r = 86;
            return html`<path data-segment="${i}" d="M${(120 + r * Math.cos(a0)).toFixed(1)} ${(120 + r * Math.sin(a0)).toFixed(1)} A${r} ${r} 0 0 1 ${(120 + r * Math.cos(a1)).toFixed(1)} ${(120 + r * Math.sin(a1)).toFixed(1)}"/>`;
          })}</g>
        </svg>
        <p class="jauge-valeur" aria-live="polite"><b data-jauge>0</b><span>/10</span><small>${c.t('accueil.nis2.enPlace')}</small></p>
      </div>
      <p class="mention-illustratif">${c.t('accueil.nis2.avertissement')}</p>
      <p>${c.lien('contact', { params: 'sujet=nis2', classe: 'bouton', texte: c.t('accueil.nis2.action'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
  </div>
</section>`;
}

/* Ruban : une ou deux lignes de mots qui glissent en sens contraire au défilement (site.js, rubans).
   Décor : la liste réelle est ailleurs sur la page, d'où aria-hidden. La deuxième ligne est en chasse fixe. */
export function ruban(c, rangees) {
  /* Au moins six mots par passage, pour que la piste couvre toujours l'écran pendant son glissement d'un quart. */
  const serie = (mots) => { let s = mots; while (s.length < 6) s = s.concat(mots); return s; };
  const piste = (mots, k) => html`<div class="ruban-piste${k ? ' ruban-piste--mono' : ''}">${[0, 1, 2, 3].flatMap(() => serie(mots).map((m) => html`<span class="ruban-mot">${m}</span><i class="ruban-sep"></i>`))}</div>`;
  return html`<div class="ruban" data-ruban data-effet="ruban" aria-hidden="true">${rangees.map(piste)}</div>`;
}
