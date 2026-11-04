/* Effets propres à SECIA (direction « Le plan »). Le socle gère l'ouverture, les transitions, l'en-tête, le menu,
   le mode calme, les boucles, les mesures et la bibliothèque d'effets (lignes, mots, cascade, rideau, parallaxe,
   zoom, trace, galerie, onde, magnétique, incline). Ici, seulement les effets du plan d'animation, chacun marqué
   data-effet="nom" dans les pages : esquisse, impulsions, cotes, plan-trois-etats, confinement, verification,
   chemin-attaque, cartouche. Aucune lecture de mise en page pendant le défilement : tout est mesuré au
   rafraîchissement de ScrollTrigger ; les tracés SVG sont échantillonnés une fois au démarrage. */
import { demarrer, boucle, etat } from './socle/index.js?v=3';

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
