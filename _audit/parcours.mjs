/* Parcours propres à la maquette SECIA :
   1. demande de rendez-vous en quatre étapes (contact) : étape bloquée tant qu'elle est incomplète, retour arrière,
      e-mail vérifié, récapitulatif, préremplissage par ?sujet= et ?service=, double clic sur l'envoi ;
   2. formulaire d'alerte (urgence) : champs obligatoires, double clic sur l'envoi ;
   3. autodiagnostic NIS2 (accueil) : la jauge suit les mesures cochées, dans les deux sens ;
   4. galerie des services (cybersécurité) : chaque fiche atteignable et son bouton présent ;
   5. chemin d'attaque (tests d'intrusion) : chaque étape allume ses failles.
   Chaque problème s'ajoute au rapport avec R.echec(controle, detail, { page, taille }). */
export default async function ({ contexte, attendrePret, attendre, BASE, R, T }) {
  const tailles = [T('390×844'), T('1366×768')];

  /* ---------- 1. Demande de rendez-vous en étapes ---------- */
  for (const taille of tailles) {
    const ou = { page: '/contact', taille: taille.nom };
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/contact', { waitUntil: 'load' });
      await attendrePret(page);
      const visible = () => page.evaluate(() => [...document.querySelectorAll('[data-etape]')].findIndex((e) => !e.hidden));
      const cliquer = async (sel) => { await page.locator(sel).scrollIntoViewIfNeeded(); await page.locator(sel).click(); await attendre(450); };

      await cliquer('[data-suivant]');
      if ((await visible()) !== 0) R.echec('rendez-vous en étapes', 'on passe l’étape 1 sans choisir de sujet', ou);
      if (!(await page.locator('#formulaire .champ-erreur:not(:empty)').count())) R.echec('rendez-vous en étapes', 'aucun message quand le sujet manque', ou);

      await page.locator('input[name="sujet"][value="tests-intrusion"]').check({ force: true });
      await cliquer('[data-suivant]');
      if ((await visible()) !== 1) R.echec('rendez-vous en étapes', 'l’étape 2 ne s’affiche pas après le choix du sujet', ou);

      await cliquer('[data-suivant]');
      if ((await visible()) !== 1) R.echec('rendez-vous en étapes', 'on passe l’étape 2 sans organisation', ou);
      await page.fill('#c-organisation', 'Organisation test');
      await cliquer('[data-suivant]');

      await page.fill('#c-nom', 'Camille Test');
      await page.fill('#c-email', 'camille@exemple');
      await page.fill('#c-message', 'Demande de test.');
      await cliquer('[data-suivant]');
      if ((await visible()) !== 2) R.echec('rendez-vous en étapes', 'une adresse e-mail incomplète est acceptée', ou);
      await page.fill('#c-email', 'camille@exemple.be');

      await cliquer('[data-precedent]');
      if ((await visible()) !== 1) R.echec('rendez-vous en étapes', 'le bouton Précédent ne revient pas à l’étape 2', ou);
      if ((await page.inputValue('#c-organisation')) !== 'Organisation test') R.echec('rendez-vous en étapes', 'le retour arrière efface la saisie', ou);
      await cliquer('[data-suivant]');
      await cliquer('[data-suivant]');
      if ((await visible()) !== 3) R.echec('rendez-vous en étapes', 'le récapitulatif ne s’affiche pas', ou);

      const recap = await page.evaluate(() => Object.fromEntries([...document.querySelectorAll('[data-recap]')].map((d) => [d.dataset.recap, d.textContent.trim()])));
      if (!/intrusion/i.test(recap.sujet) || recap.organisation !== 'Organisation test' || recap.nom !== 'Camille Test' || recap.email !== 'camille@exemple.be')
        R.echec('rendez-vous en étapes', `récapitulatif incomplet : ${JSON.stringify(recap)}`, ou);

      await page.locator('[data-envoyer]').scrollIntoViewIfNeeded();
      await page.locator('[data-envoyer]').click();
      await attendre(300);
      if (await page.locator('[data-message-envoi]').isVisible()) R.echec('rendez-vous en étapes', 'envoi accepté sans la case d’accord', ou);
      await page.locator('#c-accord').check({ force: true });
      const url = page.url();
      await page.locator('[data-envoyer]').dblclick();
      await attendre(500);
      const fin = await page.evaluate(() => ({
        messages: [...document.querySelectorAll('[data-message-envoi]')].filter((m) => !m.hidden && m.textContent.trim()).length,
        desactive: document.querySelector('[data-envoyer]').disabled,
      }));
      if (fin.messages !== 1) R.echec('rendez-vous en étapes', `${fin.messages} message(s) d’envoi après un double clic (1 attendu)`, ou);
      if (!fin.desactive) R.echec('rendez-vous en étapes', 'le bouton d’envoi reste actif après l’envoi (double envoi possible)', ou);
      if (page.url() !== url) R.echec('rendez-vous en étapes', 'l’envoi simulé change de page', ou);
    } finally { await ctx.close(); }
  }

  /* Préremplissage depuis une fiche de service (?sujet=cybersecurite&service=audits). */
  {
    const taille = T('390×844');
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/contact?sujet=cybersecurite&service=audits#formulaire', { waitUntil: 'load' });
      await attendrePret(page);
      const r = await page.evaluate(() => ({
        sujet: (document.querySelector('input[name="sujet"]:checked') || {}).value,
        service: document.querySelector('input[name="service"]').value,
        recap: document.querySelector('[data-recap="sujet"]').textContent,
      }));
      if (r.sujet !== 'cybersecurite' || r.service !== 'audits' || !/audit/i.test(r.recap))
        R.echec('rendez-vous en étapes', `préremplissage par l’adresse incomplet : ${JSON.stringify(r)}`, { page: '/contact?sujet=cybersecurite&service=audits', taille: taille.nom });
    } finally { await ctx.close(); }
  }

  /* ---------- 2. Formulaire d'alerte ---------- */
  for (const taille of tailles) {
    const ou = { page: '/alerte-cyberattaque', taille: taille.nom };
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/alerte-cyberattaque', { waitUntil: 'load' });
      await attendrePret(page);
      const envoi = page.locator('#formulaire button[type="submit"]');
      await envoi.scrollIntoViewIfNeeded();
      await envoi.click();
      await attendre(300);
      const erreurs = await page.locator('#formulaire .champ-erreur:not(:empty)').count();
      if (erreurs < 7) R.echec('formulaire d’alerte', `${erreurs} champ(s) signalé(s) sur 7 obligatoires`, ou);
      await page.fill('#a-entreprise', 'Entreprise test');
      await page.fill('#a-tva', 'BE0123456789');
      await page.fill('#a-contact', 'Camille Test');
      await page.fill('#a-tel', '+32 470 00 00 00');
      await page.fill('#a-email', 'camille@exemple.be');
      await page.selectOption('#a-pays', 'be');
      await page.fill('#a-description', 'Test de parcours.');
      await envoi.dblclick();
      await attendre(500);
      const r = await page.evaluate(() => ({
        messages: [...document.querySelectorAll('#formulaire [data-message-envoi]')].filter((m) => !m.hidden && m.textContent.trim()).length,
        desactive: document.querySelector('#formulaire button[type="submit"]').disabled,
      }));
      if (r.messages !== 1 || !r.desactive) R.echec('formulaire d’alerte', `après un double clic : ${r.messages} message(s), bouton ${r.desactive ? 'désactivé' : 'actif'}`, ou);
    } finally { await ctx.close(); }
  }

  /* ---------- 3. Autodiagnostic NIS2 ---------- */
  for (const taille of tailles) {
    const ou = { page: '/', taille: taille.nom };
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/', { waitUntil: 'load' });
      await attendrePret(page);
      const b = page.locator('[data-mesure]');
      const n = await b.count();
      if (n !== 10) R.echec('autodiagnostic NIS2', `${n} mesures au lieu de 10`, ou);
      for (const i of [0, 3, 7]) { await b.nth(i).scrollIntoViewIfNeeded(); await b.nth(i).click(); await attendre(120); }
      let v = await page.locator('[data-jauge]').textContent();
      if (v.trim() !== '3') R.echec('autodiagnostic NIS2', `jauge à ${v} après 3 mesures cochées`, ou);
      await b.nth(3).click(); await attendre(120);
      v = await page.locator('[data-jauge]').textContent();
      const pleins = await page.locator('[data-segment].plein').count();
      if (v.trim() !== '2' || pleins !== 2) R.echec('autodiagnostic NIS2', `après avoir décoché : jauge ${v}, ${pleins} segment(s) pleins (2 attendus)`, ou);
      const presse = await b.nth(3).getAttribute('aria-pressed');
      if (presse !== 'false') R.echec('autodiagnostic NIS2', 'aria-pressed ne suit pas l’état du bouton', ou);
    } finally { await ctx.close(); }
  }

  /* ---------- 4. Galerie des services ---------- */
  for (const taille of tailles) {
    const ou = { page: '/cybersecurite', taille: taille.nom };
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/cybersecurite', { waitUntil: 'load' });
      await attendrePret(page);
      const fiches = await page.evaluate(() => [...document.querySelectorAll('.fiche')].map((f) => ({ id: f.id, lien: !!f.querySelector('.fiche-lien a[href]') })));
      if (fiches.length !== 7) R.echec('galerie des services', `${fiches.length} fiches au lieu de 7`, ou);
      fiches.filter((f) => !f.lien).forEach((f) => R.echec('galerie des services', `fiche ${f.id} sans lien`, ou));
      /* Au clavier : chaque bouton de fiche reçoit le focus et devient visible. */
      for (const f of fiches) {
        await page.locator(`#${f.id} .fiche-lien a`).focus();
        await attendre(500);
        const dans = await page.evaluate((id) => { const r = document.querySelector(`#${id} .fiche-lien a`).getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth + 1 && r.top >= 0 && r.bottom <= innerHeight + 1; }, f.id);
        if (!dans && taille.w >= 761) R.echec('galerie des services', `le bouton de ${f.id} reste hors de l’écran quand il reçoit le focus`, ou);
      }
    } finally { await ctx.close(); }
  }

  /* ---------- 5. Chemin d'attaque ---------- */
  for (const taille of tailles) {
    const ou = { page: '/tests-intrusion', taille: taille.nom };
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/tests-intrusion', { waitUntil: 'load' });
      await attendrePret(page);
      for (let k = 1; k <= 3; k++) {
        /* Ordinateur : texte de l'étape au milieu de l'écran ; téléphone : titre de l'étape juste sous le plan épinglé. */
        await page.evaluate((k) => {
          const el = document.querySelector(`.chemin-etape[data-etape="${k}"]`), r = el.getBoundingClientRect();
          const y = innerWidth <= 760 ? r.top - innerHeight * 0.6 : r.top + r.height / 2 - innerHeight * 0.5;
          window.scrollTo({ top: y + scrollY, behavior: 'instant' });
        }, k);
        await attendre(1700);
        const r = await page.evaluate(() => ({
          classe: [...document.querySelector('#plan-chemin').classList].find((c) => c.startsWith('etape-')),
          failles: [...document.querySelectorAll('#plan-chemin .faille')].filter((f) => getComputedStyle(f).opacity > 0.9).length,
        }));
        const attendu = [0, 2, 4, 5][k];
        if (r.classe !== `etape-${k}` || r.failles !== attendu) R.echec('chemin d’attaque', `étape ${k} : ${r.classe}, ${r.failles} faille(s) visibles (${attendu} attendues)`, ou);
      }
    } finally { await ctx.close(); }
  }

  /* ---------- 6. Candidature (carrières) : poste prérempli depuis une offre, champs obligatoires, CV, double clic ---------- */
  for (const taille of tailles) {
    const ou = { page: '/carrieres', taille: taille.nom };
    const { ctx, page } = await contexte({ taille });
    try {
      await page.goto(BASE + '/carrieres', { waitUntil: 'load' });
      await attendrePret(page);
      const href = await page.getAttribute('.offre a.bouton', 'href');
      await page.goto(BASE + href, { waitUntil: 'load' });
      await attendrePret(page);
      const poste = await page.inputValue('#j-poste');
      if (!href.includes(`poste=${poste}`) || poste === 'spontanee') R.echec('candidature', `le bouton Postuler ne préremplit pas le poste (${poste})`, ou);
      const envoi = page.locator('#candidature button[type="submit"]');
      await envoi.scrollIntoViewIfNeeded();
      await envoi.click();
      await attendre(300);
      const erreurs = await page.locator('#candidature .champ-erreur:not(:empty)').count();
      if (erreurs < 5) R.echec('candidature', `${erreurs} champ(s) signalé(s) sur 5 obligatoires (prénom, nom, e-mail, CV, accord)`, ou);
      await page.fill('#j-prenom', 'Camille');
      await page.fill('#j-nom', 'Test');
      await page.fill('#j-email', 'camille@exemple.be');
      await page.locator('input[name="langues"][value="fr"]').check({ force: true });
      await page.setInputFiles('#j-cv', { name: 'cv.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 essai') });
      await page.locator('#j-accord').check({ force: true });
      await envoi.dblclick();
      await attendre(500);
      const r = await page.evaluate(() => ({
        messages: [...document.querySelectorAll('#candidature [data-message-envoi]')].filter((m) => !m.hidden && m.textContent.trim()).length,
        desactive: document.querySelector('#candidature button[type="submit"]').disabled,
      }));
      if (r.messages !== 1 || !r.desactive) R.echec('candidature', `après un double clic : ${r.messages} message(s), bouton ${r.desactive ? 'désactivé' : 'actif'}`, ou);
    } finally { await ctx.close(); }
  }

  /* ---------- 7. Pages de services : chaque fiche des pôles mène à sa page, chaque page renvoie au formulaire prérempli ---------- */
  {
    const taille = T('1366×768');
    const { ctx, page } = await contexte({ taille });
    try {
      for (const pole of ['/cybersecurite', '/reseau']) {
        await page.goto(BASE + pole, { waitUntil: 'load' });
        await attendrePret(page);
        const liens = await page.evaluate(() => [...document.querySelectorAll('.fiche .fiche-lien a')].map((a) => a.getAttribute('href')));
        for (const h of liens) {
          const rep = await page.request.get(BASE + h.split('#')[0]);
          if (rep.status() !== 200) R.echec('pages de services', `la fiche mène à ${h} (${rep.status()})`, { page: pole, taille: taille.nom });
        }
      }
      await page.goto(BASE + '/sdn', { waitUntil: 'load' });
      await attendrePret(page);
      const h = await page.getAttribute('[data-action-principale]', 'href');
      await page.goto(BASE + h, { waitUntil: 'load' });
      await attendrePret(page);
      const r = await page.evaluate(() => ({ sujet: (document.querySelector('input[name="sujet"]:checked') || {}).value, service: document.querySelector('input[name="service"]').value, recap: document.querySelector('[data-recap="sujet"]').textContent }));
      if (r.sujet !== 'reseau' || r.service !== 'sdn' || !/SDN/.test(r.recap)) R.echec('pages de services', `demande depuis la page SDN mal préremplie : ${JSON.stringify(r)}`, { page: '/sdn', taille: taille.nom });
    } finally { await ctx.close(); }
  }
}
