/* Carrières : ouverture, offres en cours (site actuel ; descriptions à compléter), candidature spontanée simulée,
   préremplie par ?poste= depuis chaque offre. */
import { html } from '../../outils/gabarit.mjs';
import { tete } from '../gabarits/blocs.mjs';

export const page = { cle: 'carrieres', fichier: 'carrieres', imagePartage: 'grok/carrieres-ouverture-1168.webp' };

export default (c) => {
  const offres = c.donnees.offres;
  const t = (k) => c.t(`carrieres.form.${k}`);
  return html`
${tete(c, {
  surtitre: c.t('carrieres.surtitre'),
  titre: c.t('carrieres.titre'),
  textes: [c.t('carrieres.intro')],
  actions: html`<a class="bouton" href="#offres" data-action-principale data-survol="magnetique">${c.t('carrieres.voir')}</a> <a class="bouton bouton--contour" href="#candidature">${c.t('carrieres.spontanee')}</a>`,
  info: c.t('carrieres.info'),
  media: c.media({ nom: 'grok/carrieres-ouverture', alt: '', cadrage: '55% 50%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="zoom"' }),
})}

<section class="offres conteneur" id="offres">
  <div class="offres-tete">
    <div>
      <p class="surtitre">${c.t('carrieres.offres.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('carrieres.offres.titre')}</h2>
    </div>
    ${c.media({ nom: 'photos/plateau-bureaux', alt: c.s('carrieres.offres.alt'), cadrage: '50% 55%', classe: 'offres-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
  </div>
  <ol class="offres-liste" data-anime="cascade">
    ${offres.map((o, i) => html`<li class="offre">
      <p class="famille-entete"><span>${c.t('commun.planche')} 08.${i + 1}</span><span>${String(i + 1).padStart(2, '0')} / ${String(offres.length).padStart(2, '0')}</span></p>
      <h3>${o.titre}</h3>
      <p class="offre-lieu">${o.lieu}</p>
      <p class="a-confirmer">${c.t('carrieres.offres.detail')}</p>
      <p><a class="bouton bouton--contour" href="${c.url('carrieres', 'candidature', `poste=${o.cle}`)}">${c.t('carrieres.offres.postuler')}</a></p>
    </li>`)}
  </ol>
</section>

<section class="candidature conteneur" id="candidature">
  <div class="candidature-cote">
    <p class="surtitre">${t('surtitre')}</p>
    <h2 data-anime="lignes">${t('titre')}</h2>
    <p data-anime>${t('texte')}</p>
    ${c.media({ nom: 'photos/echange-noir-blanc', alt: c.s('carrieres.form.alt'), cadrage: '50% 45%', classe: 'candidature-media', sizes: '(max-width: 760px) 100vw, 34vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  </div>
  <form class="formulaire" data-formulaire action="#" novalidate data-anime>
    <p class="mention-simule">${c.t('commun.formSimule')}</p>
    <div class="champ"><label for="j-poste">${t('poste')}</label>
      <select id="j-poste" name="poste"><option value="spontanee">${c.t('carrieres.spontanee')}</option>${offres.map((o) => html`<option value="${o.cle}">${o.titre} · ${o.lieu}</option>`)}</select></div>
    <div class="champs-deux">
      <div class="champ"><label for="j-prenom">${t('prenom')}</label><input id="j-prenom" name="prenom" autocomplete="given-name" required></div>
      <div class="champ"><label for="j-nom">${t('nom')}</label><input id="j-nom" name="nom" autocomplete="family-name" required></div>
      <div class="champ"><label for="j-email">${t('email')}</label><input id="j-email" name="email" type="email" autocomplete="email" required></div>
      <div class="champ"><label for="j-tel">${t('tel')}</label><input id="j-tel" name="tel" type="tel" autocomplete="tel"></div>
    </div>
    <fieldset class="champ champ--groupe"><legend>${t('langues')}</legend>
      <div class="cases">${['en', 'fr', 'de', 'nl', 'lb'].map((l) => html`<label class="case"><input type="checkbox" name="langues" value="${l}"> <span>${c.t(`carrieres.form.listeLangues.${l}`)}</span></label>`)}</div>
    </fieldset>
    <div class="champs-deux">
      <div class="champ"><label for="j-contrat">${t('contrat')}</label>
        <select id="j-contrat" name="contrat"><option value="">${t('choisir')}</option>${['employe', 'freelance', 'stagiaire', 'etudiant'].map((k) => html`<option value="${k}">${c.t(`carrieres.form.contrats.${k}`)}</option>`)}</select></div>
      <div class="champ"><label for="j-experience">${t('experience')}</label><input id="j-experience" name="experience" type="number" min="0" max="50" inputmode="numeric"></div>
      <div class="champ"><label for="j-cv">${t('cv')}</label><input id="j-cv" name="cv" type="file" accept=".pdf,.doc,.docx" required></div>
      <div class="champ"><label for="j-lettre">${t('lettre')}</label><input id="j-lettre" name="lettre" type="file" accept=".pdf,.doc,.docx"></div>
    </div>
    <div class="champ champ--case"><label class="case-accord" for="j-accord"><input id="j-accord" name="accord" type="checkbox" value="oui" required><span>${t('accord')}</span></label></div>
    <p class="mention-donnees">${c.tb('commun.mentionDonnees')}</p>
    <button type="submit" class="bouton">${t('envoyer')}</button>
    <p data-message-envoi role="status" tabindex="-1" hidden></p>
  </form>
</section>
`;
};
