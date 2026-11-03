/* Conditions générales : texte actuel du groupe, sans le texte d'aide du modèle de l'éditeur de site. */
import { pageLegale } from '../gabarits/legal.mjs';

const s = pageLegale('conditions-generales', { donnee: 'conditions', notes: ['legal.noteConditions'] });
export const page = s.page;
export default s.rendu;
