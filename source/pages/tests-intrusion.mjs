/* Service Tests d'intrusion (modèle « Service ») : ouverture (photo réelle en onde WebGL),
   chemin d'attaque en trois familles de tests (effet chemin-attaque), pourquoi maintenant, pourquoi SECIA
   et livrables, FAQ tirée du site, appel final avec le sujet prérempli. */
import { html } from '../../outils/gabarit.mjs';
import { tete, fin, planChemin } from '../gabarits/blocs.mjs';

export const page = { cle: 'tests-intrusion', fichier: 'tests-intrusion', imagePartage: 'photos/tests-intrusion-1280.webp' };

export default (c) => {
  const familles = c.donnees.intrusion.familles;
  return html`
${tete(c, {
  surtitre: c.t('intrusion.surtitre'),
  titre: c.t('intrusion.titre'),
  textes: [c.t('intrusion.intro')],
  actions: html`${c.lien('contact', { params: 'sujet=tests-intrusion', classe: 'bouton', texte: c.t('intrusion.action'), attrs: 'data-action-principale data-survol="magnetique"' })} ${c.lien('alerte-cyberattaque', { classe: 'bouton bouton--contour-signal', texte: c.t('commun.actionEntete') })}`,
  info: c.t('intrusion.info'),
  media: c.media({ nom: 'photos/tests-intrusion', alt: c.s('intrusion.alt'), cadrage: '62% 44%', cadrageMobile: '66% 45%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-fx="onde"' }),
})}

<section class="chemin" id="chemin">
  <div class="conteneur methode-grille">
    <div class="methode-texte">
      <p class="surtitre">${c.t('intrusion.chemin.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('intrusion.chemin.titre')}</h2>
      <p class="methode-intro" data-anime>${c.t('intrusion.chemin.texte')}</p>
      <ol class="methode-etapes">
        ${familles.map((f, i) => html`<li class="methode-etape chemin-etape" data-etape="${i + 1}" id="${f.cle}">
          <p class="etape-num"><span>0${i + 1}</span>${f.nom}</p>
          <h3 data-anime="lignes">${f.titre}</h3>
          <ul class="liste-points" data-anime="cascade">${f.points.map((p) => html`<li><b>${p.t}</b> ${p.d}</li>`)}</ul>
          <p class="etape-conclusion" data-anime>${f.conclusion}</p>
        </li>`)}
      </ol>
    </div>
    <div class="methode-visuel">
      <div class="methode-cadre chemin-cadre etape-3" id="plan-chemin" data-effet="chemin-attaque" data-visuel>
        <p class="methode-etat" aria-hidden="true"><span data-etat-libelle>${familles[2].nom}</span><span class="methode-progres"><i></i><i></i><i></i></span></p>
        ${planChemin(c)}
        <p class="mention-illustratif">${c.t('intrusion.chemin.illustratif')}</p>
      </div>
    </div>
  </div>
</section>

<section class="bloc-photo conteneur" id="pourquoi">
  <div>
    <p class="surtitre">${c.t('intrusion.pourquoi.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('intrusion.pourquoi.titre')}</h2>
    <p data-anime>${c.t('intrusion.pourquoi.texte')}</p>
    <ul class="liste-points liste-points--grande" data-anime="cascade">${c.donnees.intrusion.pourquoi.map((p) => html`<li>${p}</li>`)}</ul>
    <p data-anime>${c.t('intrusion.pourquoi.conclusion')}</p>
  </div>
  ${c.media({ nom: 'grok/service-tests-intrusion', alt: '', cadrage: '70% 50%', classe: 'bloc-photo-media', sizes: '(max-width: 760px) 100vw, 44vw', attrs: 'data-fx="parallaxe"' })}
</section>

<section class="livrables conteneur" id="livrables">
  <div class="livrables-tete">
    ${c.media({ nom: 'photos/relecture-rapport', alt: c.s('intrusion.secia.alt'), cadrage: '55% 50%', classe: 'livrables-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
    <div>
      <p class="surtitre">${c.t('intrusion.secia.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('intrusion.secia.titre')}</h2>
      <p data-anime>${c.t('intrusion.secia.texte')}</p>
      <ul class="liste-points" data-anime="cascade">${c.donnees.intrusion.atouts.map((p) => html`<li>${p}</li>`)}</ul>
    </div>
  </div>
  <h3 class="livrables-titre">${c.t('intrusion.secia.livrables')}</h3>
  <ol class="livrables-liste" data-anime="cascade">
    ${c.donnees.intrusion.livrables.map((l, i) => html`<li><p class="livrable-num">${String(i + 1).padStart(2, '0')} · ${l.famille}</p><h4>${l.titre}</h4><p>${l.texte}</p></li>`)}
  </ol>
</section>

<section class="faq conteneur" id="faq">
  <div>
    <p class="surtitre">${c.t('intrusion.faq.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('intrusion.faq.titre')}</h2>
    <div class="faq-liste" data-anime="cascade">
      ${c.donnees.intrusion.faq.map((f, i) => html`<details class="faq-item" id="question-${i + 1}"><summary>${f.q}</summary><p>${f.r}</p></details>`)}
    </div>
  </div>
  ${c.media({ nom: 'photos/schema-reseau', alt: c.s('intrusion.faq.alt'), cadrage: '62% 50%', classe: 'faq-media', sizes: '(max-width: 760px) 100vw, 36vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
</section>

${fin(c, {
  titre: c.t('intrusion.fin.titre'),
  texte: c.t('intrusion.fin.texte'),
  action: c.lien('contact', { params: 'sujet=tests-intrusion', classe: 'bouton', texte: c.t('intrusion.action'), attrs: 'data-survol="magnetique"' }),
  image: 'photos/echange-ordinateur', alt: c.s('intrusion.fin.alt'),
})}
`;
};
