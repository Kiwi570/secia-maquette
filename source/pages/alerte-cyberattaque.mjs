/* Urgence cyberattaque (modèle « Urgence ») : numéros dans le premier écran, premiers gestes
   (texte du client, l'étape « éteindre » marquée à confirmer), déroulé de l'intervention (confinement),
   formulaire d'alerte simulé. Aucun clignotement. */
import { html, brut } from '../../outils/gabarit.mjs';
import { planConfinement } from '../gabarits/plans.mjs';

export const page = { cle: 'alerte-cyberattaque', fichier: 'alerte-cyberattaque', imagePartage: 'grok/urgence-ouverture-1168.webp' };

export default (c) => {
  const u = c.site.urgence;
  return html`
<section class="page-tete page-tete--urgence" id="debut" data-gouttiere="#152452">
  ${c.media({ nom: 'grok/urgence-ouverture', alt: '', cadrage: '62% 50%', priorite: true, classe: 'urgence-fond', sizes: '100vw', attrs: 'data-fx="zoom" data-fx-force="10"' })}
  <div class="conteneur urgence-tete">
    <div>
      <p class="surtitre">${c.t('alerte.surtitre')}</p>
      <h1 data-anime="lignes">${c.t('alerte.titre')}</h1>
      <p class="page-intro" data-anime>${c.t('alerte.intro')}</p>
    </div>
    <div class="urgence-appel" data-info-cle>
      <a class="bouton bouton--signal bouton--grand" href="tel:${u.belgiqueLien}" data-action-principale><span class="voyant" aria-hidden="true"></span>${c.t('commun.belgique')} <span class="tel">${u.belgique}</span></a>
      <a class="bouton bouton--contour-clair bouton--grand" href="tel:${u.luxembourgLien}">${c.t('commun.luxembourg')} <span class="tel">${u.luxembourg}</span></a>
      <p class="urgence-dispo"><span class="voyant" aria-hidden="true"></span>${c.t('alerte.dispo')}</p>
    </div>
  </div>
</section>

<section class="gestes conteneur" id="gestes">
  <div class="gestes-texte">
    <p class="surtitre">${c.t('alerte.gestes.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('alerte.gestes.titre')}</h2>
    <p data-anime>${c.t('alerte.gestes.texte')}</p>
    <ol class="gestes-liste" data-anime="cascade">
      ${c.donnees.gestes.map((g, i) => html`<li class="geste${g.aConfirmer ? ' geste--a-confirmer' : ''}">
        <span class="geste-num">${String(i + 1).padStart(2, '0')}</span>
        <div><h3>${g.titre}</h3><p>${g.texte}</p>${g.aConfirmer ? html`<p class="a-confirmer">${c.t('alerte.gestes.aConfirmer')}</p>` : ''}</div>
      </li>`)}
    </ol>
  </div>
  <div class="gestes-visuel">
    <svg class="gestes-trait" viewBox="0 0 24 400" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M12 2 V398"/></svg>
    ${c.media({ nom: 'photos/alerte-tableau', alt: c.s('alerte.gestes.alt'), cadrage: '44% 42%', classe: 'gestes-media', sizes: '(max-width: 760px) 100vw, 40vw', attrs: 'data-anime="rideau"' })}
  </div>
</section>

<section class="urgence urgence--intervention" id="intervention">
  <div class="conteneur urgence-grille">
    <div class="urgence-texte">
      <p class="surtitre">${c.t('alerte.intervention.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('alerte.intervention.titre')}</h2>
      <p data-anime>${c.t('alerte.intervention.texte')}</p>
      <ul class="liste-points liste-points--clair" data-anime="cascade">${c.donnees.csirt.map((p) => html`<li><b>${p.t}</b> ${p.d}</li>`)}</ul>
    </div>
    <div class="urgence-visuel" data-effet="confinement" data-visuel>
      <ol class="phases" aria-label="${c.s('accueil.urgence.phases')}">
        <li data-phase="1"><span>01</span>${c.t('plans.detecter')}</li>
        <li data-phase="2"><span>02</span>${c.t('plans.contenir')}</li>
        <li data-phase="3"><span>03</span>${c.t('plans.restaurer')}</li>
      </ol>
      ${planConfinement(c)}
      <p class="mention-illustratif">${c.t('commun.schemaIllustratif')}</p>
    </div>
  </div>
</section>

<section class="alerte-form conteneur" id="formulaire">
  <div class="alerte-form-cote">
    <p class="surtitre">${c.t('alerte.form.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('alerte.form.titre')}</h2>
    <p data-anime>${c.t('alerte.form.texte')}</p>
    <p class="rappel-appel" data-anime><a class="bouton bouton--signal" href="tel:${u.belgiqueLien}"><span class="voyant" aria-hidden="true"></span>${c.t('commun.belgique')} <span class="tel">${u.belgique}</span></a></p>
    ${c.media({ nom: 'grok/urgence-intervention', alt: '', cadrage: '50% 45%', classe: 'alerte-form-media', sizes: '(max-width: 760px) 100vw, 34vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
  </div>
  <form class="formulaire" data-formulaire action="#" novalidate data-anime>
    <p class="mention-simule">${c.t('commun.formSimule')}</p>
    <div class="champs-deux">
      <div class="champ"><label for="a-entreprise">${c.t('alerte.form.entreprise')}</label><input id="a-entreprise" name="entreprise" autocomplete="organization" required></div>
      <div class="champ"><label for="a-tva">${c.t('alerte.form.tva')}</label><input id="a-tva" name="tva" required></div>
      <div class="champ"><label for="a-contact">${c.t('alerte.form.contact')}</label><input id="a-contact" name="contact" autocomplete="name" required></div>
      <div class="champ"><label for="a-tel">${c.t('alerte.form.tel')}</label><input id="a-tel" name="tel" type="tel" autocomplete="tel" required></div>
      <div class="champ"><label for="a-email">${c.t('alerte.form.email')}</label><input id="a-email" name="email" type="email" autocomplete="email" required></div>
      <div class="champ"><label for="a-pays">${c.t('alerte.form.pays')}</label>
        <select id="a-pays" name="pays" required><option value="">${c.t('alerte.form.choisir')}</option><option value="be">${c.t('commun.belgique')}</option><option value="lu">${c.t('commun.luxembourg')}</option><option value="autre">${c.t('alerte.form.autrePays')}</option></select></div>
    </div>
    <div class="champ"><label for="a-description">${c.t('alerte.form.description')}</label><textarea id="a-description" name="description" rows="5" required></textarea></div>
    <p class="mention-donnees">${c.tb('commun.mentionDonnees')}</p>
    <button type="submit" class="bouton">${c.t('alerte.form.envoyer')}</button>
    <p data-message-envoi role="status" tabindex="-1" hidden></p>
  </form>
</section>
`;
};
