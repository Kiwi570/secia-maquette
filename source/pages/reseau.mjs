/* Pôle Réseau (modèle « Pôle ») : ouverture, les neuf services en galerie horizontale épinglée,
   lecture du pôle en frise (de la conception au support), appel final. */
import { html } from '../../outils/gabarit.mjs';
import { tete, fin, frise } from '../gabarits/blocs.mjs';

export const page = { cle: 'reseau', fichier: 'reseau', imagePartage: 'grok/reseau-ouverture-1168.webp' };

export default (c) => {
  const services = c.donnees.services.reseau;
  return html`
${tete(c, {
  surtitre: c.t('reseau.surtitre'),
  titre: c.t('reseau.titre'),
  textes: [c.t('reseau.intro1'), c.t('reseau.intro2')],
  actions: html`${c.lien('contact', { params: 'sujet=reseau', classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="bouton bouton--contour" href="#services">${c.t('reseau.voir')}</a>`,
  info: c.t('reseau.info'),
  media: c.media({ nom: 'grok/reseau-ouverture', alt: '', cadrage: '55% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="zoom"' }),
})}

<section class="services ecran epingle" id="services" data-entete-cache data-fx="galerie" data-plein-ecran>
  <div class="conteneur services-tete">
    <h2 data-anime="lignes">${c.t('reseau.services.titre')}</h2>
    <p>${c.t('reseau.services.texte')}</p>
  </div>
  <div class="piste services-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('reseau.services.region')}">
    ${services.map((s, i) => html`<article class="fiche" id="service-${s.cle}">
      <p class="fiche-entete"><span>${c.t('commun.planche')} 03.${i + 1}</span><span>${c.t('reseau.services.service')}</span></p>
      ${c.media({ nom: s.image, alt: '', cadrage: '50% 50%', classe: 'fiche-media', sizes: '(max-width: 760px) 82vw, 30vw' })}
      <h3>${s.nom}</h3>
      <p class="fiche-resume">${s.resume}</p>
      <ul class="fiche-points">${s.points.map((x) => html`<li>${x}</li>`)}</ul>
      <p class="fiche-lien">${c.lien(s.page, { classe: 'bouton', texte: c.t('cyber.services.voir') })}</p>
    </article>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="cycle conteneur" id="cycle">
  <div class="section-tete">
    <p class="surtitre">${c.t('reseau.cycle.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('reseau.cycle.titre')}</h2>
    <p data-anime>${c.t('reseau.cycle.texte')}</p>
  </div>
  ${frise(c, c.donnees['cycle-reseau'], { classe: 'frise--4' })}
</section>

${fin(c, {
  titre: c.t('reseau.fin.titre'),
  texte: c.t('reseau.fin.texte'),
  action: c.lien('contact', { params: 'sujet=reseau', classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-survol="magnetique"' }),
  image: 'photos/plateau-bureaux', alt: c.s('reseau.fin.alt'),
})}
`;
};
