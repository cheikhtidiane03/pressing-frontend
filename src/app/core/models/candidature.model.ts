export type StatutCandidature =
  | 'EN_ATTENTE'
  | 'DOSSIER_COMPLET'
  | 'EN_ATTENTE_DELIBERATION'
  | 'ADMIS'
  | 'REFUSE';

export interface PieceJustificative {
  id: number;
  type: string;
  cheminFichier: string;
}

export interface Note {
  id: number;
  valeur: number;
  epreuve?: { id: number; nom: string; coefficient: number };
}

export interface Candidature {
  id: number;
  candidat: { id: number; nom: string; prenom: string; username: string };
  concours: { id: number; titre: string };
  statut: StatutCandidature;
  dateDepot: string;
  piecesJustificatives: PieceJustificative[];
  notes: Note[];
  moyenneGenerale: number | null;
  mentionResultat: string | null;
}
