/* Page 404 « Liaison introuvable » : une liaison du plan se rompt, l'impulsion s'arrête net.
   Une seule version (langue par défaut). */
import { html } from '../../outils/gabarit.mjs';

export const page = { cle: '404', fichier: '404', langues: ['fr'], partage: false };

export default (c) => html`
<section class="page-tete conteneur introuvable" id="debut">
  <div>
    <p class="surtitre">${c.t('commun.planche')} 00 · 404</p>
    <h1 data-anime="lignes">${c.t('introuvable.titre')}</h1>
    <svg class="rupture" viewBox="0 0 420 60" aria-hidden="true" data-fx="trace" data-visuel>
      <path class="rupture-a" d="M4 30 H170 l12 -14"/><path class="rupture-b" d="M238 44 l12 -14 H416"/>
      <circle class="rupture-point" cx="4" cy="30" r="5"/><circle class="rupture-point" cx="416" cy="30" r="5"/>
    </svg>
    <p data-anime>${c.t('introuvable.texte')}</p>
    <p data-anime>${c.lien('accueil', { classe: 'bouton', texte: c.t('introuvable.retour'), attrs: 'data-action-principale' })}</p>
  </div>
  ${c.media({ nom: 'grok/404-ouverture', alt: '', cadrage: '62% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 45vw', attrs: 'data-fx="zoom"' })}
</section>
`;
