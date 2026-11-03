/* Politique de confidentialité : texte actuel du groupe, à adapter pour SECIA. */
import { pageLegale } from '../gabarits/legal.mjs';

const s = pageLegale('confidentialite', { donnee: 'confidentialite' });
export const page = s.page;
export default s.rendu;
