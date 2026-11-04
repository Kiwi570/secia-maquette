/* SECIA (modèle « À propos ») : ouverture, histoire en frise (2009, 2014, 2025), six valeurs,
   équipe d'après le site du groupe (portraits sans nom tant que la correspondance n'est pas fournie),
   nomenclature des certifications et des partenaires, groupe NPS Consult Group. */
import { html } from '../../outils/gabarit.mjs';
import { tete, fin, ruban } from '../gabarits/blocs.mjs';

export const page = { cle: 'secia', fichier: 'secia', imagePartage: 'photos/bureaux-secia-1280.webp' };

const EDITEURS = ['cisco', 'checkpoint', 'extreme', 'sentinelone', 'isc2'];

export default (c) => {
  const certifs = c.donnees.certifications;
  const eq = c.donnees.equipe;
  return html`
${tete(c, {
  surtitre: c.t('secia.surtitre'),
  titre: c.t('secia.titre'),
  textes: [c.t('secia.intro1'), c.t('secia.intro2')],
  actions: html`${c.lien('contact', { classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-action-principale data-survol="magnetique"' })} <a class="bouton bouton--contour" href="#equipe">${c.t('secia.voirEquipe')}</a>`,
  info: c.t('secia.info'),
  media: c.media({ nom: 'photos/bureaux-secia', alt: c.s('accueil.hero.tirageAlt'), cadrage: '46% 42%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 44vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' }),
})}

${ruban(c, [c.donnees.valeurs.map((v) => v.titre)])}

<section class="histoire conteneur" id="histoire">
  <div class="histoire-grille">
    <div>
      <p class="surtitre">${c.t('secia.histoire.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('secia.histoire.titre')}</h2>
      <p data-anime>${c.t('secia.histoire.texte')}</p>
    </div>
    ${c.media({ nom: 'photos/echange-noir-blanc', alt: c.s('secia.histoire.alt'), cadrage: '52% 40%', classe: 'histoire-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-anime="rideau"' })}
  </div>
  <div class="frise frise--dates" data-visuel>
    <svg class="frise-trait" viewBox="0 0 1000 24" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M2 12 H998"/><path d="M2 4 V20 M998 4 V20"/></svg>
    <ol class="frise-etapes" data-anime="cascade">
      ${c.donnees.histoire.map((h) => html`<li><span class="frise-point" aria-hidden="true"></span><p class="frise-annee">${h.annee}</p><h3>${h.titre}</h3><p>${h.texte}</p></li>`)}
    </ol>
  </div>
</section>

<section class="valeurs-page conteneur" id="valeurs">
  <div class="section-tete">
    <p class="surtitre">${c.t('secia.valeurs.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('secia.valeurs.titre')}</h2>
  </div>
  <ol class="valeurs-liste" data-anime="cascade">
    ${c.donnees.valeurs.map((v, i) => html`<li class="valeur-ligne" id="valeur-${v.cle}">
      ${c.media({ nom: `photos/${v.image}`, alt: v.alt, cadrage: v.cadrage, classe: 'valeur-ligne-media', sizes: '(max-width: 760px) 100vw, 26vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
      <div><p class="valeur-num">${String(i + 1).padStart(2, '0')}</p><h3>${v.titre}</h3><p>${v.texte}</p></div>
    </li>`)}
  </ol>
</section>

<section class="equipe-page conteneur" id="equipe">
  <div class="equipe-page-grille">
    <div>
      <p class="surtitre">${c.t('secia.equipe.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('secia.equipe.titre')}</h2>
      <p data-anime>${c.t('secia.equipe.texte')}</p>
      <dl class="roles" data-anime="cascade">
        ${eq.groupes.map((g) => html`<div><dt>${g.role}</dt><dd>${g.noms.join(' · ')}</dd></div>`)}
      </dl>
      <p class="mention-illustratif">${c.t('secia.equipe.source')}</p>
    </div>
    <ul class="portraits" data-anime="cascade">
      ${eq.portraits.map((p) => html`<li class="portrait">${c.media({ nom: `portraits/${p.image}`, alt: p.nom || c.s('secia.equipe.portraitAlt'), cadrage: '50% 24%', classe: 'portrait-media', sizes: '(max-width: 760px) 45vw, 14vw' })}<p class="portrait-nom">${p.nom || c.t('secia.equipe.nomACompleter')}</p></li>`)}
    </ul>
  </div>
</section>

<section class="nomenclature conteneur" id="certifications">
  <div class="section-tete">
    <p class="surtitre">${c.t('secia.nomenclature.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('secia.nomenclature.titre')}</h2>
    <p class="mention-illustratif">${c.t('accueil.certifs.source')}</p>
  </div>
  <div class="mur mur--compact" data-effet="verification" data-visuel>
    <span class="mur-balayage" aria-hidden="true"></span>
    <ul class="mur-badges">${certifs.map((x) => html`<li class="badge">${c.media({ nom: `certif/${x.cle}`, alt: x.nom, classe: 'badge-media', sizes: '64px' })}<span class="badge-coche" aria-hidden="true"></span></li>`)}</ul>
    <p class="certifs-compteur" aria-hidden="true"><b data-verifiees>0</b> / ${certifs.length} ${c.t('accueil.certifs.verifiees')}</p>
  </div>
  <div class="nomenclature-grille">
    <div>
      <h3>${c.t('secia.nomenclature.certifs')}</h3>
      <dl class="nomenclature-liste" data-anime="cascade">
        ${EDITEURS.map((ed) => {
          const lot = certifs.filter((x) => x.editeur === ed);
          return html`<div><dt>${c.t(`accueil.certifs.editeurs.${ed}`)} <span>${lot.length}</span></dt><dd>${lot.map((x) => x.nom.replace(/^(Cisco|Check Point|Extreme Networks|SentinelOne|ISC2) /, '')).join(' · ')}</dd></div>`;
        })}
      </dl>
    </div>
    <div>
      <h3>${c.t('secia.nomenclature.partenaires')}</h3>
      <ul class="partenaires" data-anime="cascade">${c.donnees.partenaires.map((p) => html`<li>${p}</li>`)}</ul>
      <p class="mention-illustratif">${c.t('secia.nomenclature.source')}</p>
    </div>
  </div>
</section>

<section class="groupe-page conteneur" id="groupe">
  ${c.media({ nom: 'photos/signaletique-nps', alt: c.s('secia.groupe.alt'), cadrage: '55% 45%', classe: 'groupe-page-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}
  <div>
    <p class="surtitre">${c.t('accueil.groupe.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('secia.groupe.titre')}</h2>
    <p data-anime>${c.t('secia.groupe.texte1')}</p>
    <p data-anime>${c.t('secia.groupe.texte2')}</p>
    <p data-anime><a class="lien-fort" href="${c.site.groupe.linkedin}" target="_blank" rel="noopener">${c.t('commun.linkedin')}</a></p>
  </div>
</section>

${fin(c, {
  titre: c.t('secia.fin.titre'),
  action: c.lien('contact', { classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-survol="magnetique"' }),
  image: 'photos/duo-direction', alt: c.s('secia.fin.alt'),
})}
`;
};
