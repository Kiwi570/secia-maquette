/* Pôle Cybersécurité (modèle « Pôle ») : ouverture, les six services et NIS2 en galerie horizontale épinglée,
   cycle de vie en frise, urgence compacte, appel final.
   Les services dont la page arrive en v2 ouvrent le contact prérempli : aucun lien mort. */
import { html } from '../../outils/gabarit.mjs';
import { tete, urgenceCompacte, fin, frise } from '../gabarits/blocs.mjs';

export const page = { cle: 'cybersecurite', fichier: 'cybersecurite', imagePartage: 'photos/revue-securite-1280.webp' };

export default (c) => {
  const services = [...c.donnees.services.cyber, c.donnees.services.nis2];
  return html`
${tete(c, {
  surtitre: c.t('cyber.surtitre'),
  titre: c.t('cyber.titre'),
  textes: [c.t('cyber.intro1'), c.t('cyber.intro2')],
  actions: html`${c.lien('contact', { params: 'sujet=cybersecurite', classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-action-principale data-survol="magnetique"' })} ${c.lien('alerte-cyberattaque', { classe: 'bouton bouton--contour-signal', texte: c.t('commun.actionEntete') })}`,
  info: c.t('cyber.info'),
  media: c.media({ nom: 'photos/revue-securite', alt: c.s('cyber.alt'), cadrage: '42% 50%', cadrageMobile: '40% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="zoom"' }),
})}

<section class="services ecran epingle" id="services" data-entete-cache data-fx="galerie" data-plein-ecran>
  <div class="conteneur services-tete">
    <h2 data-anime="lignes">${c.t('cyber.services.titre')}</h2>
    <p>${c.t('cyber.services.texte')}</p>
  </div>
  <div class="piste services-piste" data-galerie tabindex="0" role="region" aria-label="${c.s('cyber.services.region')}">
    ${services.map((s, i) => html`<article class="fiche" id="service-${s.cle}">
      <p class="fiche-entete"><span>${c.t('commun.planche')} 02.${i + 1}</span><span>${s.cle === 'nis2' ? c.t('cyber.services.reglementation') : c.t('cyber.services.service')}</span></p>
      ${c.media({ nom: s.image, alt: '', cadrage: '50% 50%', classe: 'fiche-media', sizes: '(max-width: 760px) 82vw, 30vw' })}
      <h3>${s.nom}</h3>
      <p class="fiche-resume">${s.resume}</p>
      <ul class="fiche-points">${s.points.map((x) => html`<li>${x}</li>`)}</ul>
      <p class="fiche-lien">${s.page
        ? c.lien(s.page, { classe: 'bouton', texte: c.t('cyber.services.voir') })
        : c.lien('contact', { params: `sujet=${s.cle === 'nis2' ? 'nis2' : 'cybersecurite'}&service=${s.cle}`, classe: 'bouton bouton--contour', texte: c.t('cyber.services.parler') })}</p>
    </article>`)}
  </div>
  <div class="galerie-progres" aria-hidden="true"><span></span></div>
</section>

<section class="cycle conteneur" id="cycle">
  <div class="section-tete">
    <p class="surtitre">${c.t('cyber.cycle.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('cyber.cycle.titre')}</h2>
    <p data-anime>${c.t('cyber.cycle.texte')}</p>
  </div>
  ${frise(c, c.donnees.cycle)}
</section>

${urgenceCompacte(c, { titre: c.t('cyber.urgence.titre'), texte: c.t('cyber.urgence.texte'), image: 'photos/surveillance-carte', alt: c.s('cyber.urgence.alt') })}

${fin(c, {
  titre: c.t('cyber.fin.titre'),
  texte: c.t('cyber.fin.texte'),
  action: c.lien('contact', { params: 'sujet=cybersecurite', classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-survol="magnetique"' }),
  image: 'photos/cellule-crise', alt: c.s('cyber.fin.alt'),
})}
`;
};
