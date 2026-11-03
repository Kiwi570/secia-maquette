/* Mentions légales : fiche récapitulative à compléter, éditeur, hébergeur, crédits, confidentialité.
   Barre de lecture et sommaire qui suit la lecture. sansEffet : page de texte. */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: 'mentions-legales', fichier: 'mentions-legales', imagePartage: 'grok/legal-ouverture-1168.webp', sansAction: true, sansEffet: true };

const sections = ['fiche', 'editeur', 'hebergeur', 'credits', 'confidentialite'];

export default (c) => html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court conteneur" id="debut">
  <div>
    <p class="surtitre">${c.t('commun.planche')} ${c.site.planches['mentions-legales']} · ${c.t('mentions.surtitre')}</p>
    <h1>${c.t('mentions.titre')}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s) => html`<li><a href="#${s}">${c.t(`mentions.${s}.titre`)}</a></li>`)}</ul></nav>
  </div>
  ${c.media({ nom: 'grok/legal-ouverture', alt: '', cadrage: '60% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
</section>
<div class="texte-long conteneur" data-sans-visuel>
  ${sections.map((s) => html`<section id="${s}" data-sans-visuel><h2>${c.t(`mentions.${s}.titre`)}</h2><p>${c.t(`mentions.${s}.texte`)}</p></section>`)}
</div>
`;
