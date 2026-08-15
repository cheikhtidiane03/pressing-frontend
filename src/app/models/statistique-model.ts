export interface StatistiquesJour {
  tickets_crees: number;
  tickets_recuperes: number;
  recette_du_jour: number;
}

export interface TicketsParMois {
  mois: string; // format "2026-08"
  total: number;
}

export interface CaParService {
  libelle: string;
  mois: string;
  chiffre_affaires: number;
}
