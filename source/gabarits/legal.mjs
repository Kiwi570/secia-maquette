/* Pages légales tirées du site actuel (politique de confidentialité, conditions générales) :
   sommaire qui suit la lecture, avertissement « texte du groupe à adapter », sections du texte source. */
import { html } from '../../outils/gabarit.mjs';

export function pageLegale(cle, { donnee, notes = [] }) {
  return {
    page: { cle, fichier: cle, imagePartage: 'grok/legal-ouverture-1168.webp', sansAction: true, sansEffet: true },
    rendu: (c) => {
      const sections = c.donnees.legal[donnee];
      const titre = (s) => s.titre || c.s('legal.preambule');
      return html`
<div data-barre-lecture aria-hidden="true"></div>
<section class="page-tete page-tete--court conteneur" id="debut">
  <div>
    <p class="surtitre">${c.t(`legal.${donnee}.surtitre`)}</p>
    <h1>${c.t(`legal.${donnee}.titre`)}</h1>
    <nav data-sommaire aria-label="${c.s('commun.sommaire')}"><ul>${sections.map((s, i) => html`<li><a href="#partie-${i + 1}">${titre(s)}</a></li>`)}</ul></nav>
  </div>
  ${c.media({ nom: 'grok/legal-ouverture', alt: '', cadrage: '60% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 40vw' })}
</section>
<div class="texte-long conteneur" data-sans-visuel>
  <div class="note-legale">${[c.t('legal.note'), ...notes.map((k) => c.t(k))].map((n) => html`<p>${n}</p>`)}</div>
  ${sections.map((s, i) => html`<section id="partie-${i + 1}" data-sans-visuel><h2>${titre(s)}</h2>${s.blocs.map((b) => b.h ? html`<h3>${b.h}</h3>` : b.ul ? html`<ul>${b.ul.map((x) => html`<li>${x}</li>`)}</ul>` : html`<p>${b.p}</p>`)}</section>`)}
</div>
`;
    },
  };
}
