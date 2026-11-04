/* Conformité NIS2 (modèle « Service », variante réglementation) : ouverture, champ d'application (seuils et
   secteurs des annexes I et II), autodiagnostic des dix mesures, sanctions, appel final.
   Faits corrigés par rapport au site actuel : dates, nombre de secteurs, références de l'article 21. */
import { html } from '../../outils/gabarit.mjs';
import { tete, fin, diagnosticNis2 } from '../gabarits/blocs.mjs';

export const page = { cle: 'nis2', fichier: 'nis2', imagePartage: 'grok/service-nis2-1168.webp' };

export default (c) => {
  const s = c.donnees['nis2-secteurs'];
  const contact = (attrs = '') => c.lien('contact', { params: 'sujet=nis2', classe: 'bouton', texte: c.t('accueil.nis2.action'), attrs });
  return html`
${tete(c, {
  surtitre: c.t('nis2p.surtitre'),
  titre: c.t('nis2p.titre'),
  textes: [c.t('nis2p.intro1'), c.t('accueil.nis2.loi')],
  actions: html`${contact('data-action-principale data-survol="magnetique"')} <a class="bouton bouton--contour" href="#mesures">${c.t('nis2p.voir')}</a>`,
  info: c.t('nis2p.info'),
  media: c.media({ nom: 'grok/service-nis2', alt: '', cadrage: '60% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="zoom"' }),
})}

<section class="nis2-champ conteneur" id="champ">
  <div class="section-tete">
    <p class="surtitre">${c.t('nis2p.concerne.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('nis2p.concerne.titre')}</h2>
    <p data-anime>${c.t('nis2p.concerne.texte')}</p>
  </div>
  <div class="nis2-champ-grille">
    <figure class="seuils" data-visuel data-anime>
      <figcaption class="surtitre">${c.t('nis2p.concerne.seuils')}</figcaption>
      <svg class="planche-cote" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M1 6 H399 M1 1 V11 M399 1 V11"/></svg>
      <table>
        <thead><tr><th scope="col">${c.t('nis2p.concerne.categorie')}</th><th scope="col">${c.t('nis2p.concerne.employes')}</th><th scope="col">${c.t('nis2p.concerne.ca')}</th></tr></thead>
        <tbody>
          <tr><th scope="row">${c.t('nis2p.concerne.moyenne')}</th><td>≥ 50</td><td>≥ 10 M€</td></tr>
          <tr><th scope="row">${c.t('nis2p.concerne.grande')}</th><td>≥ 250</td><td>≥ 50 M€</td></tr>
        </tbody>
      </table>
      <p class="mention-illustratif">${c.t('nis2p.concerne.seuilsNote')}</p>
      <p class="nis2-exceptions">${c.t('nis2p.concerne.exceptions')}</p>
    </figure>
    <div class="secteurs">
      <h3>${c.t('nis2p.concerne.annexe1')} <span>${s.annexe1.length}</span></h3>
      <ol class="secteurs-liste" data-anime="cascade">${s.annexe1.map((x) => html`<li>${x}</li>`)}</ol>
      <h3>${c.t('nis2p.concerne.annexe2')} <span>${s.annexe2.length}</span></h3>
      <ol class="secteurs-liste" data-anime="cascade">${s.annexe2.map((x) => html`<li>${x}</li>`)}</ol>
    </div>
  </div>
</section>

${diagnosticNis2(c, { id: 'mesures', surtitre: c.t('accueil.nis2.liste'), titre: c.t('accueil.nis2.titre'), texte: c.t('nis2p.mesures.texte') })}

<section class="sanctions conteneur" id="sanctions">
  <div class="section-tete">
    <p class="surtitre">${c.t('nis2p.sanctions.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('nis2p.sanctions.titre')}</h2>
  </div>
  <div class="sanctions-grille" data-visuel data-anime="cascade">
    <div class="sanction" data-survol="incline" data-survol-force="3"><svg class="planche-cote" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M1 6 H399 M1 1 V11 M399 1 V11"/></svg><p class="sanction-cat">${c.t('nis2p.sanctions.essentielles')}</p><p class="sanction-montant">${c.t('nis2p.sanctions.montant1')}</p><p>${c.t('nis2p.sanctions.part1')}</p></div>
    <div class="sanction" data-survol="incline" data-survol-force="3"><svg class="planche-cote" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M1 6 H399 M1 1 V11 M399 1 V11"/></svg><p class="sanction-cat">${c.t('nis2p.sanctions.importantes')}</p><p class="sanction-montant">${c.t('nis2p.sanctions.montant2')}</p><p>${c.t('nis2p.sanctions.part2')}</p></div>
    <div class="sanction sanction--texte">
      <h3>${c.t('nis2p.sanctions.juridiction')}</h3>
      <ul class="liste-points"><li>${c.t('nis2p.sanctions.j1')}</li><li>${c.t('nis2p.sanctions.j2')}</li><li>${c.t('nis2p.sanctions.j3')}</li></ul>
    </div>
  </div>
  <p class="mention-illustratif">${c.t('nis2p.sanctions.retenu')}</p>
</section>

${fin(c, {
  titre: c.t('nis2p.fin.titre'),
  texte: c.t('nis2p.fin.texte'),
  action: contact('data-survol="magnetique"'),
  image: 'photos/relecture-rapport', alt: c.s('nis2p.fin.alt'),
})}
`;
};
