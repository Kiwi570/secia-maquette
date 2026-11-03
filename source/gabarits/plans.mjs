/* Schémas de la direction « Le plan », dessinés en SVG.
   Les libellés font au moins 22 unités : lisibles (12 px et plus) même quand le schéma tient
   dans un téléphone de 320 px. Les traits sont tracés par la bibliothèque (data-fx="trace")
   ou par les effets propres (site.js) ; les impulsions suivent les chemins marqués data-impulsion. */
import { html, brut } from '../../outils/gabarit.mjs';

const boite = (x, y, w, h, texte, classe = '') => html`<g class="noeud ${classe}">
  <rect x="${x - w / 2}" y="${y - h / 2}" width="${w}" height="${h}" rx="6"/>
  <text x="${x}" y="${y + 8}" text-anchor="middle">${texte}</text>
</g>`;

/* Plan de l'ouverture de l'accueil (640 × 600). */
export function planOuverture(c) {
  const t = (k) => c.s(`plans.${k}`);
  return html`<svg class="plan plan--ouverture" viewBox="0 0 640 600" aria-hidden="true" focusable="false">
  <g class="plan-reperes">
    <path d="M20 20 H48 M20 20 V48 M620 20 H592 M620 20 V48 M20 580 H48 M20 580 V552 M620 580 H592 M620 580 V552"/>
  </g>
  <g class="plan-traits" data-fx="trace">
    <path class="lien" d="M125 86 V150"/>
    <path class="lien" d="M125 206 V270"/>
    <path class="lien" d="M210 298 H275"/>
    <path class="lien" d="M125 326 V380 H90 V422"/>
    <path class="lien" d="M125 380 H270 V422"/>
    <path class="lien lien--veille" d="M210 178 H275"/>
    <path class="lien lien--veille" d="M360 206 V270"/>
    <path class="cote-ligne" d="M30 520 H400 M30 510 V530 M400 510 V530"/>
  </g>
  <g class="impulsions">
    <path data-impulsion="5.5" d="M125 86 V150 L125 206 V270 L125 326 V380 H90 V422"/>
    <path data-impulsion="4.6" d="M125 86 V150 L125 206 V270 L125 326 V380 H270 V422"/>
    <path data-impulsion="6.4" d="M125 86 V150 L125 206 V270 L125 298 H275"/>
  </g>
  ${boite(125, 58, 170, 56, t('internet'))}
  ${boite(125, 178, 170, 56, t('parefeu'), 'noeud--garde')}
  ${boite(125, 298, 170, 56, t('coeur'))}
  ${boite(360, 178, 170, 56, t('soc'), 'noeud--veille')}
  ${boite(360, 298, 170, 56, t('cloud'))}
  ${boite(90, 448, 150, 52, t('serveurs'))}
  ${boite(270, 448, 150, 52, t('postes'))}
  <text class="cote-texte" x="215" y="560" text-anchor="middle">${t('coteOuverture')}</text>
</svg>`;
}

/* Plan de la méthode : un même plan en trois états (640 × 560). */
export function planMethode(c) {
  const t = (k) => c.s(`plans.${k}`);
  return html`<svg class="plan plan--methode" viewBox="0 0 640 560" aria-hidden="true" focusable="false">
  <g class="croquis">
    <path d="M20 100 H620 M20 210 H620 M20 345 H620 M60 20 V540 M580 20 V540"/>
    <text x="604" y="92" text-anchor="end">${t('croquis1')}</text>
    <text x="604" y="202" text-anchor="end">${t('croquis2')}</text>
    <text x="604" y="337" text-anchor="end">${t('croquis3')}</text>
  </g>
  <g class="zones">
    <rect x="38" y="384" width="164" height="72" rx="10"/><rect x="238" y="384" width="164" height="72" rx="10"/><rect x="438" y="384" width="164" height="72" rx="10"/>
    <rect class="zone-garde" x="228" y="118" width="184" height="64" rx="10"/>
    <text x="120" y="484" text-anchor="middle">${t('segment')} 1</text><text x="320" y="484" text-anchor="middle">${t('segment')} 2</text><text x="520" y="484" text-anchor="middle">${t('segment')} 3</text>
  </g>
  <g class="liens">
    <path d="M320 76 V124"/><path d="M320 176 V244"/><path d="M185 150 H235"/>
    <path d="M320 296 V350 H120 V394"/><path d="M320 296 V394"/><path d="M320 350 H520 V394"/>
    <path class="lien--veille" d="M405 150 H445"/><path class="lien--veille" d="M530 176 V270 H405"/>
  </g>
  <g class="impulsions">
    <path data-impulsion="5" d="M320 76 V124 L320 176 V244 L320 296 V350 H120 V394"/>
    <path data-impulsion="4.2" d="M320 76 V124 L320 176 V244 L320 296 V394"/>
    <path data-impulsion="5.8" d="M320 76 V124 L320 176 V244 L320 296 V350 H520 V394"/>
    <path data-impulsion="7" d="M445 150 H405 M405 150"/>
  </g>
  <g class="boucliers">
    <path d="M320 130 l14 5 v9 c0 9 -6 14 -14 17 c-8 -3 -14 -8 -14 -17 v-9 z" transform="translate(-64 4) scale(.9)"/>
    <g class="cadenas"><rect x="112" y="356" width="16" height="13" rx="2"/><path d="M115 356 v-4 a5 5 0 0 1 10 0 v4"/></g>
    <g class="cadenas"><rect x="312" y="356" width="16" height="13" rx="2"/><path d="M315 356 v-4 a5 5 0 0 1 10 0 v4"/></g>
    <g class="cadenas"><rect x="512" y="356" width="16" height="13" rx="2"/><path d="M515 356 v-4 a5 5 0 0 1 10 0 v4"/></g>
  </g>
  ${boite(320, 50, 170, 52, t('internet'))}
  ${boite(110, 150, 150, 52, t('cloud'))}
  ${boite(320, 150, 170, 52, t('parefeu'), 'noeud--garde')}
  ${boite(530, 150, 170, 52, t('soc'), 'noeud--veille')}
  ${boite(320, 270, 170, 52, t('coeur'))}
  ${boite(120, 420, 150, 52, t('serveurs'))}
  ${boite(320, 420, 150, 52, t('postes'))}
  ${boite(520, 420, 150, 52, t('wifi'))}
  <g class="voyants">
    <circle cx="398" cy="132" r="6"/><circle cx="608" cy="132" r="6"/><circle cx="398" cy="252" r="6"/>
    <circle cx="188" cy="402" r="6"/><circle cx="388" cy="402" r="6"/><circle cx="588" cy="402" r="6"/>
  </g>
  <text class="horloge" x="530" y="214" text-anchor="middle">${t('veille')}</text>
</svg>`;
}

/* Confinement d'une intrusion : détecter, contenir, restaurer (600 × 440). */
export function planConfinement(c) {
  const t = (k) => c.s(`plans.${k}`);
  const zone = (x, nom, cls) => html`<g class="zone ${cls}">
    <rect x="${x}" y="116" width="160" height="290" rx="12"/>
    <text x="${x + 80}" y="394" text-anchor="middle">${nom}</text>
    <circle class="hote" cx="${x + 80}" cy="170" r="15"/><circle class="hote" cx="${x + 80}" cy="248" r="15"/><circle class="hote" cx="${x + 80}" cy="326" r="15"/>
    <path class="lien" d="M${x + 80} 185 V233 M${x + 80} 263 V311"/>
  </g>`;
  return html`<svg class="plan plan--confinement" viewBox="0 0 600 440" aria-hidden="true" focusable="false">
  <path class="bus" d="M110 116 V86 H490 V116 M300 86 V116"/>
  <path class="bus-coupe" d="M110 116 V86 H170"/>
  ${zone(30, t('zoneA'), 'zone--a')}
  ${zone(220, t('zoneB'), 'zone--b')}
  ${zone(410, t('zoneC'), 'zone--c')}
  <g class="noeud noeud--exterieur"><rect x="20" y="14" width="180" height="44" rx="6"/><text x="110" y="44" text-anchor="middle">${t('exterieur')}</text></g>
  <path class="intrusion-chemin" d="M110 58 V86 L110 116 V155 M110 185 V233"/>
  <circle class="intrusion" cx="110" cy="58" r="10"/>
  <circle class="detection" cx="110" cy="248" r="22"/>
  <rect class="isolement" x="22" y="108" width="176" height="306" rx="16"/>
  <g class="coupure"><path d="M150 76 l20 20 M170 76 l-20 20"/></g>
</svg>`;
}

/* Carte Belgique et Luxembourg (Natural Earth, domaine public), sites réels. */
export function carte(c, { classe = '' } = {}) {
  const C = c.donnees.carte;
  const [ax, ay] = C.points['mont-saint-guibert'];
  const [bx, by] = C.points.dalheim;
  const mx = (ax + bx) / 2 + 60, my = (ay + by) / 2 - 40;
  return html`<figure class="carte ${classe}" data-visuel>
  <svg viewBox="0 0 ${C.W} ${C.H}" aria-hidden="true" focusable="false" data-fx="trace">
    <path class="pays" d="${C.belgique}"/>
    <path class="pays" d="${C.luxembourg}"/>
    <path class="liaison" d="M${ax} ${ay} Q${mx} ${my} ${bx} ${by}" data-fx-trait/>
  </svg>
  <svg class="carte-impulsion" viewBox="0 0 ${C.W} ${C.H}" aria-hidden="true" focusable="false"><g class="impulsions"><path data-impulsion="3.4" d="M${ax} ${ay} Q${mx} ${my} ${bx} ${by}"/></g></svg>
  <span class="carte-point" style="left:${(ax / C.W) * 100}%;top:${(ay / C.H) * 100}%" data-repere></span>
  <span class="carte-point carte-point--groupe" style="left:${(bx / C.W) * 100}%;top:${(by / C.H) * 100}%" data-repere></span>
  <span class="carte-etiquette" style="left:${(ax / C.W) * 100}%;top:${(ay / C.H) * 100}%"><b>SECIA</b> ${c.t('plans.siteSecia')}</span>
  <span class="carte-etiquette carte-etiquette--groupe" style="left:${(bx / C.W) * 100}%;top:${(by / C.H) * 100}%"><b>NPS Consult Group</b> ${c.t('plans.siteGroupe')}</span>
  <figcaption class="carte-legende">${c.t('plans.carteLegende')}</figcaption>
</figure>`;
}
