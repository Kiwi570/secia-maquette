/* Contact (modèle « Contact ») : ouverture, demande de rendez-vous en quatre étapes (simulée, préremplie
   par ?sujet= et ?service=, récapitulatif en direct), implantations sur la carte, urgence compacte. */
import { html } from '../../outils/gabarit.mjs';
import { tete, urgenceCompacte } from '../gabarits/blocs.mjs';
import { carte } from '../gabarits/plans.mjs';

export const page = { cle: 'contact', fichier: 'contact', imagePartage: 'photos/contact-telephone-1280.webp' };

const SUJETS = ['cybersecurite', 'tests-intrusion', 'reseau', 'nis2', 'autre'];

export default (c) => {
  const k = c.site.contact, g = c.site.groupe;
  const etapes = ['sujet', 'organisation', 'coordonnees', 'recap'];
  return html`
${tete(c, {
  surtitre: c.t('contact.surtitre'),
  titre: c.t('contact.titre'),
  textes: [c.t('contact.intro')],
  actions: html`<a class="bouton" href="#formulaire" data-action-principale data-survol="magnetique">${c.t('contact.action')}</a> <a class="lien-fort" href="tel:${k.telephoneLien}">${c.t('commun.general')} ${k.telephone}</a>`,
  info: c.t('contact.info'),
  media: c.media({ nom: 'photos/contact-telephone', alt: c.s('contact.alt'), cadrage: '68% 42%', cadrageMobile: '72% 40%', priorite: true, classe: 'page-tete-media', sizes: '(max-width: 760px) 100vw, 46vw', attrs: 'data-fx="zoom"' }),
})}

<section class="demande conteneur" id="formulaire">
  <div class="section-tete">
    <p class="surtitre">${c.t('contact.form.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('contact.form.titre')}</h2>
    <p data-anime>${c.t('contact.form.texte')}</p>
  </div>
  <div class="demande-grille">
    <form class="formulaire etapes-form" data-formulaire data-etapes action="#" novalidate data-services="${JSON.stringify(Object.fromEntries([...c.donnees.services.cyber, ...c.donnees.services.reseau, c.donnees.services.nis2].map((s) => [s.cle, s.nom])))}">
      <ol class="etapes-fil" aria-label="${c.s('contact.form.fil')}">
        ${etapes.map((e, i) => html`<li data-fil="${i}"${i === 0 ? ' aria-current="step"' : ''}><span>${String(i + 1).padStart(2, '0')}</span>${c.t(`contact.form.etapes.${e}`)}</li>`)}
      </ol>
      <p class="mention-simule">${c.t('commun.formSimule')}</p>
      <div class="etapes-cadre" data-etapes-cadre>
        <fieldset class="etape" data-etape="0">
          <legend>${c.t('contact.form.etapes.sujet')}</legend>
          <div class="choix" role="radiogroup">
            ${SUJETS.map((s, i) => html`<label class="choix-item"><input type="radio" name="sujet" value="${s}"${i === 0 ? ' required' : ''}><span>${c.t(`contact.form.sujets.${s}`)}</span></label>`)}
          </div>
          <input type="hidden" name="service" value="">
          <p class="note-urgence">${c.t('contact.form.urgence')} <a href="tel:${c.site.urgence.belgiqueLien}">${c.site.urgence.belgique}</a></p>
        </fieldset>
        <fieldset class="etape" data-etape="1" hidden>
          <legend>${c.t('contact.form.etapes.organisation')}</legend>
          <div class="champ"><label for="c-organisation">${c.t('contact.form.organisation')}</label><input id="c-organisation" name="organisation" autocomplete="organization" required></div>
          <div class="champs-deux">
            <div class="champ"><label for="c-secteur">${c.t('contact.form.secteur')}</label><select id="c-secteur" name="secteur">${['', 'public', 'sante', 'finance', 'industrie', 'services', 'autre'].map((s) => html`<option value="${s}">${c.t(`contact.form.secteurs.${s || 'choisir'}`)}</option>`)}</select></div>
            <div class="champ"><label for="c-taille">${c.t('contact.form.taille')}</label><select id="c-taille" name="taille">${['', 'moins-50', '50-249', '250-plus'].map((s) => html`<option value="${s}">${c.t(`contact.form.tailles.${s || 'choisir'}`)}</option>`)}</select></div>
          </div>
        </fieldset>
        <fieldset class="etape" data-etape="2" hidden>
          <legend>${c.t('contact.form.etapes.coordonnees')}</legend>
          <div class="champs-deux">
            <div class="champ"><label for="c-nom">${c.t('contact.form.nom')}</label><input id="c-nom" name="nom" autocomplete="name" required></div>
            <div class="champ"><label for="c-email">${c.t('contact.form.email')}</label><input id="c-email" name="email" type="email" autocomplete="email" required></div>
            <div class="champ"><label for="c-tel">${c.t('contact.form.tel')}</label><input id="c-tel" name="tel" type="tel" autocomplete="tel"></div>
          </div>
          <div class="champ"><label for="c-message">${c.t('contact.form.message')}</label><textarea id="c-message" name="message" rows="4" required></textarea></div>
        </fieldset>
        <fieldset class="etape" data-etape="3" hidden>
          <legend>${c.t('contact.form.etapes.recap')}</legend>
          <p>${c.t('contact.form.relire')}</p>
          <div class="champ champ--case"><label class="case-accord" for="c-accord"><input id="c-accord" name="accord" type="checkbox" value="oui" required><span>${c.t('contact.form.accord')}</span></label></div>
          <p class="mention-donnees">${c.tb('commun.mentionDonnees')}</p>
        </fieldset>
      </div>
      <div class="etapes-actions">
        <button type="button" class="bouton bouton--contour" data-precedent hidden>${c.t('contact.form.precedent')}</button>
        <button type="button" class="bouton" data-suivant>${c.t('contact.form.suivant')}</button>
        <button type="submit" class="bouton" data-envoyer hidden>${c.t('contact.form.envoyer')}</button>
      </div>
      <p data-message-envoi role="status" tabindex="-1" hidden></p>
    </form>
    <aside class="recap" aria-live="polite" aria-label="${c.s('contact.form.etapes.recap')}">
      ${c.media({ nom: 'photos/signature-document', alt: c.s('contact.form.recapAlt'), cadrage: '55% 50%', classe: 'recap-media', sizes: '(max-width: 760px) 100vw, 30vw' })}
      <p class="surtitre">${c.t('contact.form.etapes.recap')}</p>
      <dl>
        <div><dt>${c.t('contact.form.etapes.sujet')}</dt><dd data-recap="sujet">—</dd></div>
        <div><dt>${c.t('contact.form.organisation')}</dt><dd data-recap="organisation">—</dd></div>
        <div><dt>${c.t('contact.form.nom')}</dt><dd data-recap="nom">—</dd></div>
        <div><dt>${c.t('contact.form.email')}</dt><dd data-recap="email">—</dd></div>
      </dl>
      <p class="recap-suite">${c.t('contact.form.suite')}</p>
    </aside>
  </div>
</section>

<section class="implantations conteneur" id="implantations">
  <div class="section-tete">
    <p class="surtitre">${c.t('contact.lieux.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('contact.lieux.titre')}</h2>
  </div>
  <div class="implantations-grille">
    ${carte(c, { classe: 'implantations-carte' })}
    <div class="lieux" data-anime="cascade">
      <article class="lieu">
        <p class="surtitre">${c.t('contact.lieux.belgique')}</p>
        <h3>SECIA</h3>
        <p>${c.t('commun.membre')}<br>${k.rue}<br>${k.ville}, ${c.loc(k.pays)}</p>
        <dl>
          <div><dt>${c.t('commun.general')}</dt><dd><a href="tel:${k.telephoneLien}">${k.telephone}</a></dd></div>
          <div><dt>${c.t('contact.lieux.ventes')}</dt><dd><a href="tel:${k.ventesLien}">${k.ventes}</a></dd></div>
          <div><dt>${c.t('commun.urgenceCourt')}</dt><dd><a href="tel:${c.site.urgence.belgiqueLien}">${c.site.urgence.belgique}</a></dd></div>
          <div><dt>${c.t('contact.form.email')}</dt><dd><a href="mailto:${k.email}">${k.email}</a></dd></div>
        </dl>
        <p><a class="lien-fort" href="https://www.google.com/maps/search/?api=1&amp;query=Rue+des+Sabli%C3%A8res+45+1435+Mont-Saint-Guibert" target="_blank" rel="noopener">${c.t('contact.lieux.itineraire')}</a></p>
      </article>
      <article class="lieu">
        <p class="surtitre">${c.t('contact.lieux.luxembourg')}</p>
        <h3>${g.nom}</h3>
        <p>${g.rue}<br>${g.ville}, ${g.pays}</p>
        <dl>
          <div><dt>${c.t('commun.general')}</dt><dd><a href="tel:${g.telephoneLien}">${g.telephone}</a></dd></div>
          <div><dt>${c.t('contact.lieux.ventes')}</dt><dd><a href="tel:${g.ventesLien}">${g.ventes}</a></dd></div>
          <div><dt>${c.t('commun.urgenceCourt')}</dt><dd><a href="tel:${c.site.urgence.luxembourgLien}">${c.site.urgence.luxembourg}</a></dd></div>
          <div><dt>${c.t('contact.form.email')}</dt><dd><a href="mailto:${g.email}">${g.email}</a></dd></div>
        </dl>
        <p><a class="lien-fort" href="https://www.google.com/maps/search/?api=1&amp;query=25+Hossegaass+5687+Dalheim+Luxembourg" target="_blank" rel="noopener">${c.t('contact.lieux.itineraire')}</a></p>
      </article>
    </div>
  </div>
</section>

${urgenceCompacte(c, { titre: c.t('contact.urgence.titre'), texte: c.t('contact.urgence.texte'), image: 'photos/plateau-bureaux', alt: c.s('contact.urgence.alt') })}
`;
};
