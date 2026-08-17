export interface Salle {
  id: number;
  nom: string;
  localisation: string;
  capacite: number;
}

export interface Affectation {
  id: number;
  candidature: { id: number; candidat: { nom: string; prenom: string; username: string } };
  salle: Salle;
  numeroPlace: number;
}
