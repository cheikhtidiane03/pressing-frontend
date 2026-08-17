export interface Epreuve {
  id: number;
  nom: string;
  coefficient: number;
  dureeMinutes: number;
  concours?: Concours;
}

export interface Concours {
  id: number;
  titre: string;
  description: string;
  dateLimiteCandidature: string;
  dateDeliberation: string;
  resultatsPublies: boolean;
  epreuves: Epreuve[];
}
