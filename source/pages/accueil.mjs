/* Accueil SECIA, direction « Le plan ».
   Ordre de lecture d'un DSI ou d'un RSSI : qui et quoi (ouverture), repères vérifiables, méthode,
   les deux pôles, l'urgence, les preuves (certifications), NIS2, l'équipe, le groupe et le rendez-vous.
   Chaque section a au moins un effet au défilement, visible aussi sur téléphone. */
import { html, brut } from '../../outils/gabarit.mjs';
import { planOuverture, planMethode, planConfinement, carte } from '../gabarits/plans.mjs';
import { diagnosticNis2 } from '../gabarits/blocs.mjs';

/* Photos réelles des repères (fondation, support, certifications, services) et des trois temps de la méthode. */
const REPERES = ['duo-direction', 'supervision-postes', 'atelier-analyse', 'presentation-ecran'];
const METHODE = ['schema-reseau', 'revue-tableau-de-bord', 'surveillance-carte'];

export const page = { cle: 'accueil', fichier: 'index', imagePartage: 'photos/bureaux-secia-1280.webp' };

const EDITEURS = ['cisco', 'checkpoint', 'extreme', 'sentinelone', 'isc2'];

export default (c) => {
  const u = c.site.urgence;
  const certifs = c.donnees.certifications;
  return html`
<section class="hero ecran" id="debut">
  <div class="hero-grille">
    <div class="hero-texte">
      <p class="surtitre" data-anime="gsap">${c.t('accueil.hero.surtitre')}</p>
      <h1 class="hero-titre" data-superpose>
        <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre1')}</span></span>
        <span class="ligne-masque"><span class="hero-ligne" data-anime="gsap">${c.t('accueil.hero.titre2')}</span></span>
        <span class="ligne-masque"><span class="hero-ligne hero-ligne--signal" data-anime="gsap">${c.t('accueil.hero.titre3')}</span></span>
      </h1>
      <p class="hero-intro" data-anime="gsap">${c.t('accueil.hero.intro')}</p>
      <p class="hero-actions" data-anime="gsap">
        ${c.lien('contact', { classe: 'bouton', texte: c.t('accueil.hero.action'), attrs: 'data-action-principale data-survol="magnetique"' })}
        <a class="bouton bouton--contour-signal" href="tel:${u.belgiqueLien}" data-survol="magnetique">${c.t('accueil.hero.urgence')} <span class="tel">${u.belgique}</span></a>
      </p>
      <p class="hero-info" data-info-cle data-anime="gsap"><span class="voyant" aria-hidden="true"></span>${c.t('accueil.hero.info')}</p>
    </div>
    <div class="hero-plan" id="plan-ouverture" data-effet="impulsions" data-impulsions data-visuel>
      ${c.media({ nom: 'photos/cellule-crise', alt: c.donnees.photos['cellule-crise'], cadrage: '42% 50%', cadrageMobile: '40% 50%', priorite: true, classe: 'hero-photo', sizes: '(max-width: 760px) 100vw, 48vw', attrs: 'data-superpose' })}
      <div class="hero-calque" aria-hidden="true"></div>
      ${planOuverture(c)}
      ${c.media({ nom: 'photos/bureaux-secia', alt: c.s('accueil.hero.tirageAlt'), cadrage: '46% 42%', priorite: true, classe: 'tirage hero-tirage', sizes: '(max-width: 760px) 40vw, 18vw', legende: c.t('accueil.hero.tirageLegende'), attrs: 'data-superpose' })}
      <button type="button" class="plan-pause" data-pause-pour="plan-ouverture" data-libelle-pause="${c.s('commun.pauseImpulsions')}" data-libelle-lecture="${c.s('commun.lectureImpulsions')}"><span data-libelle-bouton>${c.t('commun.pauseImpulsions')}</span></button>
    </div>
  </div>
</section>

<section class="reperes" id="reperes" aria-labelledby="reperes-titre">
  <h2 id="reperes-titre" class="visuellement-cache">${c.t('accueil.reperes.titre')}</h2>
  <ul class="cotes conteneur" data-effet="cotes" data-visuel>
    ${['r1', 'r2', 'r3', 'r4'].map((r, i) => html`<li class="cote">
      ${c.media({ nom: `photos/${REPERES[i]}`, alt: REPERES[i] === 'duo-direction' ? c.s('secia.fin.alt') : c.donnees.photos[REPERES[i]], cadrage: '50% 45%', classe: 'cote-media', sizes: '(max-width: 760px) 46vw, 22vw', attrs: 'data-anime="rideau"' })}
      <svg class="cote-trait" viewBox="0 0 200 20" preserveAspectRatio="none" aria-hidden="true"><path d="M1 10 H199"/><path d="M1 2 V18 M199 2 V18"/><path d="M1 10 l8 -5 M1 10 l8 5 M199 10 l-8 -5 M199 10 l-8 5"/></svg>
      <strong class="cote-valeur">${c.t(`accueil.reperes.${r}v`)}</strong>
      <span class="cote-libelle">${c.t(`accueil.reperes.${r}l`)}</span>
    </li>`)}
  </ul>
</section>

<section class="methode" id="methode">
  <div class="conteneur methode-grille">
    <div class="methode-texte">
      <p class="surtitre">${c.t('accueil.methode.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.methode.titre')}</h2>
      <p class="methode-intro" data-anime>${c.t('accueil.methode.intro')}</p>
      <ol class="methode-etapes">
        ${[1, 2, 3].map((i) => html`<li class="methode-etape" data-etape="${i}">
          <p class="etape-num"><span>0${i}</span>${c.t(`accueil.methode.e${i}.nom`)}</p>
          <h3 data-anime="lignes">${c.t(`accueil.methode.e${i}.titre`)}</h3>
          <p data-anime>${c.t(`accueil.methode.e${i}.texte`)}</p>
          ${c.media({ nom: `photos/${METHODE[i - 1]}`, alt: c.donnees.photos[METHODE[i - 1]], cadrage: '50% 50%', classe: 'etape-media', sizes: '(max-width: 760px) 100vw, 36vw', attrs: 'data-anime="rideau"' })}
          <p class="etiquettes" data-anime>${c.s(`accueil.methode.e${i}.services`).split(' · ').map((x) => html`<span>${x}</span>`)}</p>
        </li>`)}
      </ol>
    </div>
    <div class="methode-visuel">
      <div class="methode-cadre etat-3" id="plan-methode" data-effet="plan-trois-etats" data-impulsions data-boucle-css data-visuel>
        <p class="methode-etat" aria-hidden="true"><span data-etat-libelle>${c.t('accueil.methode.e3.nom')}</span><span class="methode-progres"><i></i><i></i><i></i></span></p>
        ${planMethode(c)}
        <button type="button" class="plan-pause" data-pause-pour="plan-methode" data-libelle-pause="${c.s('commun.pauseImpulsions')}" data-libelle-lecture="${c.s('commun.lectureImpulsions')}"><span data-libelle-bouton>${c.t('commun.pauseImpulsions')}</span></button>
      </div>
    </div>
  </div>
</section>

<section class="poles conteneur" id="poles">
  <div class="section-tete">
    <p class="surtitre">${c.t('accueil.poles.surtitre')}</p>
    <h2 data-anime="lignes">${c.t('accueil.poles.titre')}</h2>
  </div>
  <div class="poles-grille">
    ${['cyber', 'reseau'].map((p, i) => {
      const liste = c.donnees.services[p];
      return html`<article class="planche" id="pole-${p}">
      <p class="planche-entete"><span>${c.t('commun.planche')} 0${i + 2}</span><span>${c.t(`accueil.poles.${p}.compte`)}</span></p>
      <svg class="planche-cote" viewBox="0 0 400 12" preserveAspectRatio="none" aria-hidden="true" data-fx="trace"><path d="M1 6 H399 M1 1 V11 M399 1 V11"/></svg>
      ${c.media({ nom: p === 'cyber' ? 'grok/accueil-cyber' : 'grok/accueil-reseau', alt: c.s(`accueil.poles.${p}.alt`), cadrage: '50% 45%', classe: 'planche-media', sizes: '(max-width: 760px) 100vw, 30vw', attrs: 'data-anime="rideau"' })}
      <div class="planche-texte">
        <h3>${c.t(`accueil.poles.${p}.titre`)}</h3>
        <p>${c.t(`accueil.poles.${p}.texte`)}</p>
        <ul class="planche-services" data-anime="cascade">
          ${liste.map((s, k) => html`<li><span class="num">${String(k + 1).padStart(2, '0')}</span>${s.page ? c.lien(s.page, { texte: s.nom }) : html`<span>${s.nom}</span>`}</li>`)}
        </ul>
        <p>${p === 'cyber'
          ? c.lien('cybersecurite', { classe: 'bouton', texte: c.t('accueil.poles.cyber.lien'), attrs: 'data-survol="magnetique"' })
          : c.lien('contact', { params: 'sujet=reseau', classe: 'bouton bouton--contour', texte: c.t('accueil.poles.reseau.lien'), attrs: 'data-survol="magnetique"' })}</p>
      </div>
    </article>`;
    })}
  </div>
</section>

<section class="urgence" id="urgence" data-gouttiere="#152452">
  ${c.media({ nom: 'grok/accueil-attaque', alt: '', cadrage: '60% 50%', classe: 'urgence-fond', sizes: '100vw', attrs: 'data-fx="parallaxe" data-fx-force="8"' })}
  <div class="conteneur urgence-grille">
    <div class="urgence-texte">
      <p class="surtitre">${c.t('accueil.urgence.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.urgence.titre')}</h2>
      <p data-anime>${c.t('accueil.urgence.texte')}</p>
      <ul class="urgence-numeros" data-anime="cascade">
        <li><span>${c.t('commun.belgique')}</span><a href="tel:${u.belgiqueLien}">${u.belgique}</a></li>
        <li><span>${c.t('commun.luxembourg')}</span><a href="tel:${u.luxembourgLien}">${u.luxembourg}</a></li>
      </ul>
      <p data-anime>${c.lien('alerte-cyberattaque', { classe: 'bouton bouton--signal', texte: c.t('accueil.urgence.lien'), attrs: 'data-survol="magnetique"' })}</p>
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

<section class="certifs conteneur" id="certifications">
  <div class="certifs-tete">
    <div>
      <p class="surtitre">${c.t('accueil.certifs.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.certifs.titre')}</h2>
    </div>
    <div>
      <p data-anime>${c.t('accueil.certifs.texte')}</p>
      <p class="certifs-compteur" aria-hidden="true"><b data-verifiees>0</b> / ${certifs.length} ${c.t('accueil.certifs.verifiees')}</p>
      <p class="mention-illustratif">${c.t('accueil.certifs.source')}</p>
    </div>
  </div>
  <div class="mur" data-effet="verification">
    <span class="mur-balayage" aria-hidden="true"></span>
    ${EDITEURS.map((ed) => {
      const lot = certifs.filter((x) => x.editeur === ed);
      return html`<div class="mur-rangee">
        <p class="mur-editeur"><b>${c.t(`accueil.certifs.editeurs.${ed}`)}</b><span>${lot.length}</span></p>
        <ul class="mur-badges">${lot.map((x) => html`<li class="badge">${c.media({ nom: `certif/${x.cle}`, alt: x.nom, classe: 'badge-media', sizes: '88px' })}<span class="badge-coche" aria-hidden="true"></span></li>`)}</ul>
      </div>`;
    })}
  </div>
</section>

${diagnosticNis2(c, { id: 'nis2', surtitre: c.t('accueil.nis2.surtitre'), titre: c.t('accueil.nis2.titre'), texte: c.t('accueil.nis2.texte'), loi: c.t('accueil.nis2.loi') })}

<section class="equipe conteneur" id="equipe">
  <div class="equipe-tete">
    <div>
      <p class="surtitre">${c.t('accueil.equipe.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.equipe.titre')}</h2>
      <p data-anime>${c.t('accueil.equipe.texte')}</p>
      <p data-anime>${c.lien('secia', { classe: 'bouton bouton--contour', texte: c.t('accueil.equipe.lien'), attrs: 'data-survol="magnetique"' })}</p>
    </div>
    ${c.media({ nom: 'photos/reunion-equipe', alt: c.s('accueil.equipe.alt'), cadrage: '54% 46%', classe: 'equipe-photo', sizes: '(max-width: 760px) 100vw, 55vw', attrs: 'data-fx="onde"' })}
  </div>
  <ul class="valeurs" data-anime="cascade">
    ${c.donnees.valeurs.map((v, i) => html`<li class="valeur" data-survol="incline" data-survol-force="4">
      ${c.media({ nom: `photos/${v.image}`, alt: v.alt, cadrage: v.cadrage, classe: 'valeur-media', sizes: '(max-width: 760px) 50vw, 15vw', attrs: 'data-fx="parallaxe" data-fx-force="6"' })}
      <p class="valeur-num">0${i + 1}</p>
      <h3>${v.titre}</h3>
      <p>${v.court}</p>
    </li>`)}
  </ul>
</section>

<section class="groupe" id="groupe">
  <div class="conteneur groupe-grille">
    ${carte(c, { classe: 'groupe-carte' })}
    <div class="groupe-texte">
      <p class="surtitre">${c.t('accueil.groupe.surtitre')}</p>
      <h2 data-anime="lignes">${c.t('accueil.groupe.titre')}</h2>
      <p data-anime>${c.t('accueil.groupe.texte')}</p>
      <dl class="chiffres" data-anime="cascade">
        ${c.donnees.chiffres.map((x) => html`<div><dt>${x.libelle}</dt><dd><span${x.compteur != null ? brut(` data-compteur="${x.compteur}"`) : ''}>${x.valeur}</span>${x.suffixe ? html`<small>${x.suffixe}</small>` : ''}</dd></div>`)}
      </dl>
      <p class="mention-illustratif">${c.t('accueil.groupe.source')}</p>
    </div>
  </div>
  <div class="conteneur fin">
    <h2 data-anime="lignes">${c.t('accueil.fin.titre')}</h2>
    <p class="fin-actions" data-anime>
      ${c.lien('contact', { classe: 'bouton', texte: c.t('commun.rendezVous'), attrs: 'data-survol="magnetique"' })}
      <a class="lien-fort" href="tel:${c.site.contact.telephoneLien}">${c.t('commun.general')} ${c.site.contact.telephone}</a>
      <a class="lien-fort" href="mailto:${c.site.contact.email}">${c.site.contact.email}</a>
    </p>
  </div>
</section>
`;
};
