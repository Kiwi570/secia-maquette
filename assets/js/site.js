/* Effets propres à SECIA (direction « Le plan »). Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles, les mesures et la bibliothèque d'effets (lignes, mots, cascade, rideau, parallaxe,
   zoom, trace, galerie, onde, magnétique, incline). Ici, seulement les effets du plan d'animation, chacun marqué
   data-effet="nom" dans les pages : esquisse, impulsions, cotes, plan-trois-etats, confinement, verification,
   chemin-attaque, cartouche ; et, sur tout le site, fil, decode, ruban, la grille sous la souris et les photos scannées. Aucune lecture de mise en page pendant le défilement : tout est mesuré au
   rafraîchissement de ScrollTrigger ; les tracés SVG sont échantillonnés une fois au démarrage. */
import { demarrer, boucle, etat, quand } from './socle/index.js?v=4';

const gsap = window.gsap;
const ST = window.ScrollTrigger;
const NS = 'http://www.w3.org/2000/svg';
const calme = () => etat.calme || document.documentElement.classList.contains('secours');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

/* Échantillonne un tracé SVG une fois : la position d'un point se calcule ensuite sans toucher au DOM. */
function echantillonner(chemin, n = 96) {
  const L = chemin.getTotalLength();
  const pts = Array.from({ length: n + 1 }, (_, i) => { const q = chemin.getPointAtLength((L * i) / n); return [q.x, q.y]; });
  return (u) => {
    const f = Math.min(Math.max(u, 0), 1) * n, i = Math.min(Math.floor(f), n - 1), r = f - i;
    return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r];
  };
}

function point(parent, r, classe) {
  const c = document.createElementNS(NS, 'circle');
  c.setAttribute('r', r); c.setAttribute('class', classe);
  parent.appendChild(c);
  return c;
}

/* ---------- impulsions : des points orange circulent dans les liaisons (boucle, pause disponible) ---------- */
function impulsions() {
  $$('[data-impulsions]').forEach((boite) => {
    const items = $$('[data-impulsion]', boite).map((p, k) => ({
      pos: echantillonner(p),
      duree: parseFloat(p.dataset.impulsion) || 5,
      decal: (k * 0.37) % 1,
      halo: point(p.parentNode, 12, 'impulsion-halo'),
      c: point(p.parentNode, 5.5, 'impulsion'),
    }));
    if (!items.length) return;
    const placer = (t) => items.forEach((it) => {
      const u = (t / it.duree + it.decal) % 1;
      const [x, y] = it.pos(u);
      const o = u > 0.9 ? (1 - u) / 0.1 : u < 0.06 ? u / 0.06 : 1;
      it.c.setAttribute('cx', x.toFixed(1)); it.c.setAttribute('cy', y.toFixed(1)); it.c.style.opacity = o;
      it.halo.setAttribute('cx', x.toFixed(1)); it.halo.setAttribute('cy', y.toFixed(1)); it.halo.style.opacity = o * 0.22;
    });
    placer(1.2);
    if (calme()) return;
    boucle(boite, (dt, t) => placer(t));
  });
}

/* ---------- cotes : les lignes de cote s'étirent et mesurent les repères (défilement) ---------- */
function cotes() {
  const s = $('[data-effet="cotes"]');
  if (!s || calme()) return;
  gsap.timeline({ scrollTrigger: { trigger: s, start: 'clamp(top 95%)', end: 'clamp(top 45%)', scrub: 0.5 } })
    .fromTo($$('.cote-trait', s), { scaleX: 0 }, { scaleX: 1, stagger: 0.12, ease: 'none', duration: 0.5 }, 0)
    .fromTo($$('.cote-valeur', s), { yPercent: 12 }, { yPercent: 0, stagger: 0.12, duration: 0.4 }, 0.12);
}

/* ---------- plan-trois-etats : un même plan, esquisse puis plan blindé puis plan vivant ---------- */
/* Étapes lues à côté d'un plan épinglé : sur ordinateur, l'état change quand le texte de l'étape arrive au milieu de l'écran ;
   sur téléphone, le plan occupe le haut de l'écran, l'état change quand le titre de l'étape apparaît sous le plan. */
const telephone = () => window.matchMedia('(max-width: 760px)').matches;
const debutEtape = () => (telephone() ? 'top 70%' : 'center 62%');
const finEtape = () => (telephone() ? 'bottom 70%' : 'center 38%');

function methode() {
  const cadre = $('#plan-methode');
  if (!cadre) return;
  const lib = $('[data-etat-libelle]', cadre);
  const etapes = $$('.methode-etape');
  const noms = etapes.map((e) => ($('.etape-num', e).lastChild.textContent || '').trim());
  const poser = (i) => {
    if (cadre.classList.contains(`etat-${i}`)) return;
    cadre.classList.remove('etat-1', 'etat-2', 'etat-3');
    cadre.classList.add(`etat-${i}`);
    const nom = noms[Math.max(0, i - 1)];
    if (lib && nom) lib.textContent = nom;
  };
  if (calme() || !ST) { poser(3); return; }
  poser(1);
  etapes.forEach((el, k) => ST.create({
    trigger: el, start: debutEtape, end: finEtape,
    onToggle: (st) => { if (st.isActive) poser(k + 1); },
  }));
}

/* ---------- confinement : une intrusion avance, est détectée, son segment s'isole, puis il est rétabli ---------- */
function confinement() {
  $$('[data-effet="confinement"]').forEach((v) => {
    const svg = $('.plan--confinement', v);
    if (!svg) return;
    const chemin = $('.intrusion-chemin', svg), pt = $('.intrusion', svg), det = $('.detection', svg), iso = $('.isolement', svg);
    const coupe = $$('.coupure path, .bus-coupe', svg), zoneA = $('.zone--a', svg), phases = $$('[data-phase]', v);
    [chemin, iso].forEach((t) => t.setAttribute('pathLength', '1'));
    const pos = echantillonner(chemin);
    const placer = (u) => { const [x, y] = pos(u); pt.setAttribute('cx', x.toFixed(1)); pt.setAttribute('cy', y.toFixed(1)); };
    if (calme() || !ST) {
      phases.forEach((p) => p.classList.add('actif'));
      pt.style.opacity = 0;
      return;
    }
    const o = { u: 0 };
    const seuils = [0.04, 0.42, 0.78];
    gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: v, start: 'clamp(top 80%)', end: 'clamp(bottom 35%)', scrub: 0.6,
        onUpdate: (st) => {
          phases.forEach((p, i) => p.classList.toggle('actif', st.progress >= seuils[i]));
          zoneA.classList.toggle('atteinte', st.progress > 0.3 && st.progress < 0.8);
        },
      },
    })
      .to(chemin, { strokeDashoffset: 0, duration: 0.3 }, 0)
      .to(o, { u: 1, duration: 0.3, onUpdate: () => placer(o.u) }, 0)
      .fromTo(det, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1.6, duration: 0.14 }, 0.3)
      .to(det, { opacity: 0, duration: 0.08 }, 0.46)
      .to(iso, { strokeDashoffset: 0, duration: 0.18 }, 0.44)
      .to(coupe, { opacity: 1, duration: 0.05 }, 0.56)
      .to(pt, { opacity: 0, duration: 0.08 }, 0.74)
      .to(chemin, { opacity: 0.2, duration: 0.1 }, 0.78)
      .to(coupe, { opacity: 0, duration: 0.08 }, 0.88)
      .to(iso, { opacity: 0.35, duration: 0.12 }, 0.88);
  });
}

/* ---------- verification : une ligne de balayage parcourt le mur, chaque badge reçoit sa coche ---------- */
function verification() {
  $$('[data-effet="verification"]').forEach((mur) => {
    const badges = $$('.badge', mur), ligne = $('.mur-balayage', mur);
    const compteur = $('[data-verifiees]', mur.closest('section') || document);
    const tout = () => { badges.forEach((b) => b.classList.add('verifie')); if (compteur) compteur.textContent = badges.length; };
    if (calme() || !ST) { tout(); return; }
    let ys = [], H = 1, n = -1, max = 0;
    const mesurer = () => { H = mur.offsetHeight; ys = badges.map((b) => b.offsetTop + b.offsetHeight * 0.5); };
    const setY = gsap.quickSetter(ligne, 'y', 'px');
    mesurer();
    ST.create({
      trigger: mur, start: 'top 72%', end: 'bottom 48%',
      onRefresh: mesurer,
      onUpdate: (st) => {
        /* Le balayage ne remonte jamais : une coche posée reste posée (aucun aller-retour de couleur). */
        if (st.progress <= max) return;
        max = st.progress;
        const y = max * H;
        setY(y);
        ligne.style.opacity = st.progress > 0.001 && st.progress < 0.999 ? 1 : 0;
        let k = 0;
        badges.forEach((b, i) => {
          const ok = ys[i] <= y + 2;
          if (ok) k++;
          if (b.__ok !== ok) { b.__ok = ok; b.classList.toggle('verifie', ok); }
        });
        if (k !== n && compteur) { n = k; compteur.textContent = k; }
      },
    });
  });
}

/* ---------- carte : l'impulsion relie Mont-Saint-Guibert à Dalheim au défilement ---------- */
function carte() {
  $$('.carte').forEach((f) => {
    const p = $('[data-impulsion]', f);
    if (!p) return;
    const pos = echantillonner(p);
    const halo = point(p.parentNode, 18, 'impulsion-halo'), c = point(p.parentNode, 9, 'impulsion');
    const placer = (u) => { const [x, y] = pos(u); [c, halo].forEach((e) => { e.setAttribute('cx', x.toFixed(1)); e.setAttribute('cy', y.toFixed(1)); }); };
    if (calme() || !ST) { placer(1); return; }
    placer(0);
    ST.create({ trigger: f, start: 'top 80%', end: 'bottom 40%', scrub: 0.6, onUpdate: (st) => placer(st.progress) });
  });
}

/* ---------- jauge NIS2 : chaque mesure cochée allume un segment (interaction, illustratif) ---------- */
function nis2() {
  const boutons = $$('[data-mesure]');
  if (!boutons.length) return;
  const segs = $$('[data-segment]'), val = $('[data-jauge]');
  const maj = () => {
    const n = boutons.filter((b) => b.getAttribute('aria-pressed') === 'true').length;
    segs.forEach((s, i) => s.classList.toggle('plein', i < n));
    if (val) val.textContent = n;
  };
  boutons.forEach((b) => b.addEventListener('click', () => {
    b.setAttribute('aria-pressed', b.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
    maj();
  }));
}

/* ---------- cartouche : sur le voile, le numéro de planche défile jusqu'à celui de la page d'arrivée ---------- */
function cartouche() {
  const v = $('[data-voile]');
  const num = v && $('[data-planche]', v);
  if (!num) return;
  let carte = {};
  try { carte = JSON.parse(v.dataset.planches || '{}'); } catch {}
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[data-libelle]');
    if (!a || calme() || e.button !== 0 || e.metaKey || e.ctrlKey) return;
    const lib = a.dataset.libelle || '';
    const cible = carte[lib] || carte[lib.replace(/’/g, "'")];
    if (!cible) return;
    const fin = String(cible);
    const o = { v: parseFloat(num.textContent) || 0 };
    gsap.to(o, { v: parseFloat(fin), duration: 0.45, ease: 'power2.out', onUpdate: () => { num.textContent = String(Math.round(o.v)).padStart(2, '0'); }, onComplete: () => { num.textContent = fin; } });
  }, true);
}

/* ---------- grille de calque qui glisse plus lentement que la page (décor) ---------- */
function grille() {
  const g = $('.calque-grille');
  if (!g || calme()) return;
  let raf = 0;
  const maj = () => { raf = 0; g.style.transform = `translate3d(0, ${(-(window.scrollY * 0.12) % 48).toFixed(1)}px, 0)`; };
  window.addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(maj); }, { passive: true });
}

/* ---------- réticule : coordonnées de dessinateur sous le curseur (souris seulement) ---------- */
function reticule() {
  const c = $('.curseur');
  if (!c) return;
  const s = document.createElement('span');
  s.className = 'curseur-coord';
  c.appendChild(s);
  let raf = 0, x = 0, y = 0;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX; y = e.clientY;
    if (!raf) raf = requestAnimationFrame(() => { raf = 0; s.textContent = `X ${String(Math.round(x)).padStart(4, '0')} · Y ${String(Math.round(y)).padStart(4, '0')}`; });
  }, { passive: true });
}

/* ---------- chemin-attaque : chaque famille de tests trace son chemin et pose ses repères de faille ---------- */
function chemin() {
  const cadre = $('#plan-chemin');
  if (!cadre) return;
  const lib = $('[data-etat-libelle]', cadre);
  const etapes = $$('.chemin-etape');
  const noms = etapes.map((e) => ($('.etape-num', e).lastChild.textContent || '').trim());
  const poser = (i) => {
    if (cadre.classList.contains(`etape-${i}`)) return;
    ['etape-0', 'etape-1', 'etape-2', 'etape-3'].forEach((k) => cadre.classList.remove(k));
    cadre.classList.add(`etape-${i}`);
    const nom = noms[Math.max(0, i - 1)];
    if (lib && nom) lib.textContent = nom;
  };
  if (calme() || !ST) { poser(3); return; }
  poser(0);
  etapes.forEach((el, k) => ST.create({
    trigger: el, start: debutEtape, end: finEtape,
    onToggle: (st) => { if (st.isActive) poser(k + 1); },
  }));
}

/* ---------- decode : surtitres, numéros de planche et chiffres se décodent comme un terminal à leur arrivée ----------
   Le vrai texte reste en place (transparent) : la mise en page ne bouge pas d'un pixel et les lecteurs d'écran le lisent.
   Les signes tirés au sort sont posés par-dessus ; à la fin, le texte d'origine est remis tel quel. */
const GLYPHES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/<>*+=';
const A_DECODER = '.surtitre, .planche-entete > span, .fiche-entete > span, .famille-entete > span, .cote-valeur, .cote-libelle, .valeur-num';
function decode() {
  if (calme() || !('IntersectionObserver' in window)) return;
  const cibles = $$(A_DECODER).filter((el) => !el.closest('[data-ouverture], [data-voile], [data-menu], .pied')
    && el.childNodes.length && [...el.childNodes].every((n) => n.nodeType === 3) && el.textContent.trim().length > 1);
  const lancer = (el) => {
    const fin = el.textContent;
    const chiffres = el.matches('.cote-valeur, .valeur-num');
    const lot = chiffres ? '0123456789' : GLYPHES;
    const fixe = (ch) => (chiffres ? !/\d/.test(ch) : !/[A-Za-zÀ-ÿ0-9]/.test(ch));
    const reel = document.createElement('span');
    reel.className = 'decode-reel';
    reel.textContent = fin;
    el.textContent = '';
    el.append(reel);
    const rb = el.getBoundingClientRect(), rr = reel.getBoundingClientRect();
    if (!rr.width || !rr.height) { el.textContent = fin; return; }
    const statique = getComputedStyle(el).position === 'static';
    if (statique) el.style.position = 'relative';
    const vu = document.createElement('span');
    vu.className = 'decode-vu';
    vu.setAttribute('aria-hidden', 'true');
    vu.setAttribute('data-audit-ignorer', '');
    vu.style.cssText = `left:${(rr.left - rb.left - el.clientLeft).toFixed(2)}px;top:${(rr.top - rb.top - el.clientTop).toFixed(2)}px;width:${Math.ceil(rr.width + 1)}px;height:${Math.ceil(rr.height)}px`;
    vu.textContent = fin;
    el.append(vu);
    el.classList.add('decodage');
    const n = fin.length, duree = Math.min(950, 420 + n * 16), t0 = performance.now();
    let derniere = -1;
    const image = (t) => {
      const p = Math.min(1, (t - t0) / duree);
      if (p >= 1) { el.textContent = fin; if (statique) el.style.position = ''; return; }
      if (t - derniere >= 40) {
        derniere = t;
        const net = Math.floor((1 - (1 - p) * (1 - p)) * n);
        let txt = fin.slice(0, net);
        for (let i = net; i < n; i++) txt += fixe(fin[i]) ? fin[i] : lot[(Math.random() * lot.length) | 0];
        vu.textContent = txt;
      }
      requestAnimationFrame(image);
    };
    requestAnimationFrame(image);
  };
  const attente = [];
  const io = new IntersectionObserver((entrees) => entrees.forEach((e) => {
    if (!e.isIntersecting) return;
    io.unobserve(e.target);
    if (etat.pret) lancer(e.target); else attente.push(e.target);
  }), { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });
  quand('pret', () => attente.splice(0).forEach(lancer));
  /* Dans une galerie (défilement horizontal sur téléphone), le décodage a lieu mais n'est pas compté comme effet de section. */
  cibles.forEach((el) => { if (!el.dataset.effet && !el.closest('[data-fx="galerie"]')) el.dataset.effet = 'decode'; io.observe(el); });
}

/* ---------- fil : un trait orange relie les sections et se trace au fil de la lecture (ordinateur, 1100 px et plus) ----------
   Positions mesurées au rafraîchissement de ScrollTrigger ; au défilement, seulement des transformations. */
function fil() {
  const main = $('main');
  if (!main || !ST || !gsap) return;
  const boite = document.createElement('div');
  boite.className = 'fil';
  boite.setAttribute('aria-hidden', 'true');
  boite.setAttribute('data-audit-ignorer', '');
  boite.dataset.effet = 'fil';
  boite.innerHTML = '<span class="fil-rail"></span><span class="fil-trace"></span><span class="fil-tete"></span>';
  document.body.appendChild(boite);
  const trace = $('.fil-trace', boite), tete = $('.fil-tete', boite);
  const grand = window.matchMedia('(min-width: 1100px)');
  let noeuds = [], y0 = 0, y1 = 1, haut = 0;
  const maj = (defile) => {
    const y = defile + window.innerHeight * 0.62 - haut;
    const p = gsap.utils.clamp(0, 1, (y - y0) / (y1 - y0));
    trace.style.transform = `scaleY(${p.toFixed(4)})`;
    tete.style.transform = `translate3d(0, ${(y0 + p * (y1 - y0)).toFixed(1)}px, 0)`;
    tete.style.opacity = p > 0 && p < 1 ? '1' : '0';
    noeuds.forEach((n) => { const a = y >= n.y - 2; if (a !== n.a) { n.a = a; n.el.classList.toggle('atteint', a); } });
  };
  const mesurer = () => {
    noeuds.forEach((n) => n.el.remove());
    noeuds = [];
    if (!grand.matches) { boite.hidden = true; return; }
    const sy = window.scrollY;
    haut = main.getBoundingClientRect().top + sy;
    const cont = $('.conteneur', main);
    const x = Math.max(14, Math.round((cont ? cont.getBoundingClientRect().left : 48) - 28));
    const pts = [];
    [...main.children].forEach((bloc) => {
      const sec = bloc.classList.contains('pin-spacer') ? bloc.firstElementChild : bloc;
      if (!sec || !sec.matches('section, [data-section]')) return;
      const cible = $('.surtitre', sec) || $('h1, h2', sec);
      if (!cible) return;
      const r = cible.getBoundingClientRect(), rs = sec.getBoundingClientRect(), rb = bloc.getBoundingClientRect();
      if (!r.height) return;
      const branche = cible.classList.contains('surtitre') && r.left > x && r.left - x < 160 ? Math.round(r.left - x) : 0;
      pts.push({ y: Math.round(rb.top + sy - haut + (r.top - rs.top) + r.height / 2), branche });
    });
    if (pts.length < 2) { boite.hidden = true; return; }
    boite.hidden = false;
    y0 = pts[0].y; y1 = pts[pts.length - 1].y;
    boite.style.top = `${haut}px`;
    boite.style.left = `${x}px`;
    boite.style.setProperty('--y0', `${y0}px`);
    boite.style.setProperty('--h', `${y1 - y0}px`);
    noeuds = pts.map((p) => {
      const el = document.createElement('span');
      el.className = 'fil-noeud';
      el.style.top = `${p.y}px`;
      if (p.branche) el.style.setProperty('--branche', `${p.branche}px`);
      boite.appendChild(el);
      return { el, y: p.y, a: false };
    });
    if (calme()) { trace.style.transform = 'scaleY(1)'; noeuds.forEach((n) => n.el.classList.add('atteint')); return; }
    maj(sy);
  };
  ST.addEventListener('refresh', mesurer);
  mesurer();
  if (!calme()) ST.create({ start: 0, end: 'max', onUpdate: (st) => maj(st.scroll()) });
  grand.addEventListener('change', () => ST.refresh());
}

/* ---------- grille sous la souris : la grille du calque s'allume autour du curseur (souris seulement) ----------
   Un petit canvas qui suit le curseur, derrière le contenu, calé sur la grille de 48 px ;
   il s'éteint et sort de l'affichage dès que la souris s'arrête (rien à composer pendant le défilement). */
function grilleSouris() {
  if (calme() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const R = 200, PAS = 48, COTE = R * 2 + 24;
  const cv = document.createElement('canvas');
  cv.className = 'grille-souris';
  cv.setAttribute('aria-hidden', 'true');
  cv.setAttribute('data-audit-ignorer', '');
  cv.setAttribute('data-souris', '');
  cv.hidden = true;
  document.body.appendChild(cv);
  const ctx = cv.getContext('2d');
  const signal = (getComputedStyle(document.documentElement).getPropertyValue('--signal') || '#FF5A1F').trim();
  const rgb = /^#([0-9a-f]{6})$/i.test(signal) ? [1, 3, 5].map((i) => parseInt(signal.slice(i, i + 2), 16)).join(',') : '255,90,31';
  let mx = 0, my = 0, cx = 0, cy = 0, force = 0, derniere = 0, raf = 0, place = false, dpr = 1;
  const taille = () => {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = cv.height = Math.round(COTE * dpr);
    cv.style.width = cv.style.height = `${COTE}px`;
  };
  taille();
  window.addEventListener('resize', taille);
  const dessiner = (t) => {
    raf = 0;
    const actif = t - derniere < 200;
    force += ((actif ? 1 : 0) - force) * (actif ? 0.2 : 0.12);
    cx += (mx - cx) * 0.32;
    cy += (my - cy) * 0.32;
    if (!actif && force < 0.02) { force = 0; cv.hidden = true; return; }
    cv.hidden = false;
    const x0 = Math.round(cx) - COTE / 2, y0 = Math.round(cy) - COTE / 2;
    cv.style.transform = `translate3d(${x0}px, ${y0}px, 0)`;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.setTransform(dpr, 0, 0, dpr, -x0 * dpr, -y0 * dpr);
    const W = document.documentElement.clientWidth;
    const ox = (((W - PAS) / 2) % PAS + PAS) % PAS;
    const oy = ((-(window.scrollY * 0.12) % PAS) + PAS) % PAS;
    const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R);
    g.addColorStop(0, `rgba(${rgb},${(0.75 * force).toFixed(3)})`);
    g.addColorStop(0.5, `rgba(${rgb},${(0.3 * force).toFixed(3)})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    const xa = Math.floor((cx - R - ox) / PAS) * PAS + ox, ya = Math.floor((cy - R - oy) / PAS) * PAS + oy;
    ctx.strokeStyle = g;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = xa; x <= cx + R; x += PAS) { ctx.moveTo(x + 0.5, cy - R); ctx.lineTo(x + 0.5, cy + R); }
    for (let y = ya; y <= cy + R; y += PAS) { ctx.moveTo(cx - R, y + 0.5); ctx.lineTo(cx + R, y + 0.5); }
    ctx.stroke();
    ctx.fillStyle = g;
    for (let x = xa; x <= cx + R; x += PAS) {
      for (let y = ya; y <= cy + R; y += PAS) {
        const k = 1 - Math.hypot(x - cx, y - cy) / R;
        if (k <= 0) continue;
        const b = 2 + 7 * k * force;
        ctx.fillRect(x + 0.5 - b, y - 0.25, b * 2, 1.5);
        ctx.fillRect(x - 0.25, y + 0.5 - b, 1.5, b * 2);
      }
    }
    raf = requestAnimationFrame(dessiner);
  };
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    mx = e.clientX; my = e.clientY;
    if (!place) { cx = mx; cy = my; place = true; }
    derniere = performance.now();
    if (!raf) raf = requestAnimationFrame(dessiner);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', () => { derniere = 0; place = false; });
}

/* ---------- photos scannées : à leur arrivée, une ligne orange balaie l'image et des repères de visée se posent ---------- */
function scan() {
  if (calme() || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entrees) => entrees.forEach((e) => {
    if (!e.isIntersecting) return;
    const f = e.target;
    io.unobserve(f);
    f.style.setProperty('--scan-h', `${f.offsetHeight}px`);
    f.classList.add('scanne');
    setTimeout(() => { f.classList.remove('scanne'); f.classList.add('scan-fait'); }, 2600);
  }), { threshold: 0.45 });
  $$('figure.media').filter((f) => !f.matches('.tirage, .hero-photo, .badge-media, .urgence-fond, .nis2-fond')
    && !f.closest('[data-ouverture], [data-voile], [data-menu], .mur') && f.offsetWidth >= 160).forEach((f) => {
    f.classList.add('scan');
    if (f.dataset.anime === 'rideau') f.style.setProperty('--scan-delai', '.6s');
    io.observe(f);
  });
}

/* ---------- rubans : les mots glissent en sens contraire au défilement et s'inclinent selon sa vitesse ---------- */
function rubans() {
  if (calme() || !ST) return;
  $$('[data-ruban]').forEach((r) => {
    const pistes = $$('.ruban-piste', r);
    pistes.forEach((p, i) => {
      const gauche = i % 2 === 0;
      gsap.fromTo(p, { xPercent: gauche ? 0 : -25 }, { xPercent: gauche ? -25 : 0, ease: 'none', scrollTrigger: { trigger: r, start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    });
    const pencher = gsap.quickTo(pistes, 'skewX', { duration: 0.5, ease: 'power3' });
    const redresser = gsap.delayedCall(0.14, () => pencher(0)).pause();
    ST.create({
      trigger: r, start: 'top bottom', end: 'bottom top',
      onUpdate: (st) => { pencher(gsap.utils.clamp(-7, 7, st.getVelocity() / -260)); redresser.restart(true); },
    });
  });
}

/* ---------- Demande de rendez-vous en étapes (contact) : validation par étape, hauteur animée, récapitulatif ---------- */
function demande() {
  const f = $('[data-etapes]');
  if (!f) return;
  const etapes = $$('.etape', f), cadre = $('[data-etapes-cadre]', f), fil = $$('[data-fil]', f);
  const prec = $('[data-precedent]', f), suiv = $('[data-suivant]', f), env = $('[data-envoyer]', f);
  let services = {};
  try { services = JSON.parse(f.dataset.services || '{}'); } catch {}
  const en = (document.documentElement.lang || '').startsWith('en');
  const m = en
    ? { requis: 'Please fill in this field.', choix: 'Please choose a topic.', email: 'Please check this e-mail address (e.g. name@domain.com).' }
    : { requis: 'Ce champ est à remplir.', choix: 'Choisissez un sujet.', email: 'Adresse e-mail à vérifier (exemple : nom@domaine.be).' };
  let n = 0;

  const erreur = (cible, champ, message) => {
    const id = 'erreur-' + (champ.id || champ.name);
    let p = document.getElementById(id);
    if (!message) { if (p) p.textContent = ''; champ.removeAttribute('aria-invalid'); return; }
    if (!p) {
      p = document.createElement('p');
      p.id = id; p.className = 'champ-erreur'; p.setAttribute('aria-live', 'polite');
      cible.appendChild(p);
      champ.setAttribute('aria-describedby', [champ.getAttribute('aria-describedby'), id].filter(Boolean).join(' '));
    }
    p.textContent = message;
    champ.setAttribute('aria-invalid', 'true');
  };
  const valider = (i) => {
    let premier = null;
    const radios = $$('input[type="radio"]', etapes[i]);
    if (radios.length) {
      const ok = radios.some((r) => r.checked);
      erreur($('.choix', etapes[i]), radios[0], ok ? '' : m.choix);
      if (!ok) premier = radios[0];
    }
    $$('input:not([type="radio"]):not([type="hidden"]), select, textarea', etapes[i]).forEach((c) => {
      const v = (c.value || '').trim();
      let msg = '';
      if (c.required && (c.type === 'checkbox' ? !c.checked : !v)) msg = m.requis;
      else if (v && c.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) msg = m.email;
      erreur(c.closest('.champ') || c.parentElement, c, msg);
      if (msg && !premier) premier = c;
    });
    if (premier) premier.focus();
    return !premier;
  };
  const recap = () => {
    const r = $('input[name="sujet"]:checked', f);
    const service = services[$('input[name="service"]', f).value];
    const sujet = r ? r.closest('label').textContent.trim() : '';
    const vals = { sujet: [sujet, service].filter(Boolean).join(' · '), organisation: $('[name="organisation"]', f).value, nom: $('[name="nom"]', f).value, email: $('[name="email"]', f).value };
    Object.entries(vals).forEach(([k, v]) => { const d = $(`[data-recap="${k}"]`); if (d) d.textContent = v.trim() || '—'; });
  };
  const afficher = (i) => {
    const avant = cadre.offsetHeight;
    etapes.forEach((e, k) => { e.hidden = k !== i; });
    fil.forEach((li, k) => { li.classList.toggle('fait', k < i); if (k === i) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current'); });
    prec.hidden = i === 0;
    suiv.hidden = i === etapes.length - 1;
    env.hidden = i !== etapes.length - 1;
    n = i;
    recap();
    if (!calme()) {
      const apres = etapes[i].offsetHeight;
      cadre.style.height = avant + 'px';
      requestAnimationFrame(() => { cadre.style.height = apres + 'px'; });
      const fini = () => { cadre.style.height = ''; cadre.removeEventListener('transitionend', fini); };
      cadre.addEventListener('transitionend', fini);
      setTimeout(fini, 700);
    }
    const premier = $('input:not([type="hidden"]), select, textarea', etapes[i]);
    if (premier) premier.focus({ preventScroll: true });
  };

  /* Service venu d'une page (?service=audits) : sujet Cybersécurité choisi s'il manque. */
  const params = new URLSearchParams(location.search);
  if (params.get('service') && !$('input[name="sujet"]:checked', f)) { const c = $('input[name="sujet"][value="cybersecurite"]', f); if (c) c.checked = true; }
  suiv.addEventListener('click', () => { if (valider(n)) afficher(n + 1); });
  prec.addEventListener('click', () => afficher(n - 1));
  f.addEventListener('input', recap);
  f.addEventListener('change', recap);
  /* Entrée dans un champ avant la dernière étape : étape suivante, pas d'envoi. */
  document.addEventListener('submit', (e) => {
    if (e.target !== f || n === etapes.length - 1) return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (valider(n)) afficher(n + 1);
  }, true);
  recap();
}

/* ---------- Ouverture ---------- */
const HERO = '.hero-ligne';
const HERO_SUITE = '.hero .surtitre, .hero-intro, .hero-actions, .hero-info';

function arriveeHero(tl, t0) {
  if (!$(HERO)) return;
  tl.fromTo(HERO, { yPercent: 125, opacity: 1 }, { yPercent: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'power3.out' }, t0)
    .fromTo(HERO_SUITE, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: 'power3.out' }, t0 + 0.12);
}

demarrer({
  preparer() {
    impulsions();
    cotes();
    methode();
    confinement();
    verification();
    carte();
    nis2();
    chemin();
    demande();
    cartouche();
    grille();
    reticule();
    rubans();
    decode();
    scan();
    grilleSouris();
    fil();
  },
  /* Intro « esquisse », environ 2,6 s : la grille se trace, un trait orange dessine le logo, il se remplit,
     le cartouche s'écrit, puis la feuille se replie vers le haut et découvre le premier écran. */
  jouer() {
    if (!gsap) return null;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to('.ouv-l', { strokeDashoffset: 0, duration: 0.7, stagger: { each: 0.018, from: 'center' }, ease: 'power2.inOut' }, 0)
      .to('.ouv-coin', { opacity: 1, duration: 0.25, stagger: 0.05 }, 0.2)
      .to('.ouv-traits path', { strokeDashoffset: 0, duration: 0.8, stagger: 0.035, ease: 'power2.inOut' }, 0.3)
      .to('.ouv-remplissage', { opacity: 1, duration: 0.4 }, 1.08)
      .to('.ouv-base', { opacity: 1, duration: 0.35 }, 1.14)
      .to('.ouv-traits path', { opacity: 0, duration: 0.3 }, 1.25)
      .fromTo('.ouv-cote', { opacity: 0 }, { opacity: 1, duration: 0.3 }, 1.18)
      .fromTo('.ouv-cote-trait', { scaleX: 0 }, { scaleX: 1, duration: 0.45 }, 1.18)
      .to('.cartouche--ouverture', { opacity: 1, duration: 0.25 }, 1.22)
      .fromTo('.ouverture-panneau', { clipPath: 'inset(0 0 0% 0)' }, { clipPath: 'inset(0 0 100% 0)', duration: 0.64, ease: 'power4.inOut' }, 1.5);
    arriveeHero(tl, 1.72);
    return tl;
  },
  etatFinal() {
    if (!gsap) return;
    gsap.set([HERO, HERO_SUITE].join(','), { clearProps: 'transform,opacity' });
  },
  arrivee() {
    if (!gsap) return;
    arriveeHero(gsap.timeline(), 0.12);
  },
});
