/* Modèle « Service » : une page par service, construite depuis donnees/fiches.json (textes du site actuel).
   Ouverture (illustration du service), volets du service en planches cotées, contexte (pourquoi maintenant,
   pourquoi SECIA) avec une photo du shooting, autres planches du pôle, appel final avec le service prérempli. */
import { html } from '../../outils/gabarit.mjs';
import { tete, fin, ruban } from './blocs.mjs';

/* Deux photos réelles par service : contexte, appel final (jamais la même deux fois sur une page). */
const PHOTOS = {
  'integration-conseil': ['presentation-ecran', 'conseil-analyse'],
  audits: ['revue-tableau-de-bord', 'relecture-rapport'],
  'securite-managee': ['supervision-postes', 'echange-ordinateur'],
  csoc: ['surveillance-carte', 'plateau-bureaux'],
  csirt: ['cellule-crise', 'alerte-tableau'],
  'reseau-entreprise': ['schema-reseau', 'reunion-equipe'],
  'wan-cloud': ['plateau-bureaux', 'atelier-analyse'],
  sdn: ['revue-securite', 'conseil-analyse'],
  'sans-fil': ['supervision-postes', 'echange-noir-blanc'],
  automatisation: ['revue-tableau-de-bord', 'atelier-analyse'],
  'audits-reseau': ['relecture-rapport', 'schema-reseau'],
  'conception-migration': ['presentation-ecran', 'reunion-equipe'],
  formation: ['reunion-equipe', 'presentation-ecran'],
  'labs-poc': ['schema-reseau', 'echange-ordinateur'],
};

const point = (p) => html`<li>${p.t ? html`<b>${p.t}</b> ` : ''}${p.d}</li>`;

function bloc(c, titre, b) {
  return html`<div class="raison">
    <h3>${titre}</h3>
    ${b.accroche ? html`<p class="raison-accroche">${b.accroche}</p>` : ''}
    <ul class="liste-points" data-anime="cascade">${b.points.map(point)}</ul>
    ${b.conclusion ? html`<p class="raison-conclusion">${b.conclusion}</p>` : ''}
  </div>`;
}

export function pageService(cle, fichier) {
  return {
    page: { cle: fichier, fichier, imagePartage: `grok/service-${{ audits: 'audits', csoc: 'csoc', csirt: 'reponse-incidents' }[cle] || cle}-1168.webp`, service: cle },
    rendu: (c) => {
      const f = c.donnees.fiches[cle];
      const pole = f.pole;
      const liste = c.donnees.services[pole];
      const num = c.site.planches[fichier];
      const polePage = pole === 'cyber' ? 'cybersecurite' : 'reseau';
      const sujet = pole === 'cyber' ? 'cybersecurite' : 'reseau';
      const [photoA, photoB] = PHOTOS[cle];
      const alt = (n) => c.donnees.photos[n];
      /* Ouverture courte (première phrase), suite de l'introduction en tête des volets : le premier écran tient en entier. */
      const [premiere, ...reste] = f.intro.split(/(?<=[.!?])\s+/);
      const contact = (classe, attrs = '') => c.lien('contact', { params: `sujet=${sujet}&service=${cle}`, classe, texte: c.t('commun.rendezVous'), attrs });
      return html`
${tete(c, {
  surtitre: html`${c.t('commun.planche')} ${num} · ${c.t(`service.pole.${pole}`)}`,
  titre: f.titre,
  textes: [premiere],
  classe: 'page-tete--service',
  actions: html`${contact('bouton', 'data-action-principale data-survol="magnetique"')} ${c.lien(polePage, { ancre: 'services', classe: 'bouton bouton--contour', texte: c.t(`service.retour.${pole}`) })}`,
  info: html`${f.familles.length} ${c.t('service.volets')} · ${c.t('service.lieux')}`,
  media: c.media({ nom: f.image, alt: '', cadrage: '55% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="zoom"' }),
})}

${ruban(c, [f.familles.map((x) => x.titre)])}

<section class="familles conteneur" id="volets">
  <div class="section-tete">
    <p class="surtitre">${c.t('service.familles.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('service.familles.titre')}</h2>
    ${reste.length ? html`<p data-anime>${reste.join(' ')}</p>` : ''}
  </div>
  <ol class="familles-grille familles-grille--${f.familles.length}" data-anime="cascade" data-visuel>
    ${f.familles.map((x, k) => html`<li class="famille${x.aCompleter ? ' famille--a-completer' : ''}" id="volet-${k + 1}" data-survol="incline" data-survol-force="4">
      <p class="famille-entete"><span>${c.t('commun.planche')} ${num}.${k + 1}</span><span>${String(k + 1).padStart(2, '0')} / ${String(f.familles.length).padStart(2, '0')}</span></p>
      <svg class="planche-cote" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M1 6 H399 M1 1 V11 M399 1 V11"/></svg>
      <h3>${x.titre}</h3>
      ${x.accroche ? html`<p class="famille-accroche">${x.accroche}</p>` : ''}
      ${x.points.length ? html`<ul class="liste-points">${x.points.map(point)}</ul>` : html`<p class="a-confirmer">${c.t('service.aCompleter')}</p>`}
      ${x.conclusion ? html`<p class="famille-conclusion">${x.conclusion}</p>` : ''}
    </li>`)}
  </ol>
</section>

<section class="raisons conteneur" id="contexte">
  ${c.media({ nom: `photos/${photoA}`, alt: alt(photoA), cadrage: '50% 50%', classe: 'raisons-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
  <div class="raisons-texte">
    <p class="surtitre">${c.t('service.raisons.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('service.raisons.titre')}</h2>
    <div class="raisons-grille">
      ${bloc(c, c.t('service.maintenant'), f.maintenant)}
      ${bloc(c, c.t('service.pourquoi'), f.pourquoi)}
    </div>
  </div>
</section>

<nav class="autres-planches conteneur" aria-label="${c.s(`service.autres.${pole}`)}">
  <p class="surtitre">${c.t(`service.autres.${pole}`)}</p>
  <ul>${liste.filter((s) => s.page && s.cle !== cle).map((s) => html`<li>${c.lien(s.page, { texte: html`<span class="autres-num">${c.site.planches[s.page]}</span> ${s.nom}` })}</li>`)}</ul>
</nav>

${fin(c, {
  titre: c.t(`service.fin.${pole}`),
  texte: c.t('service.finTexte'),
  action: contact('bouton', 'data-survol="magnetique"'),
  image: `photos/${photoB}`, alt: alt(photoB),
})}
`;
    },
  };
}
