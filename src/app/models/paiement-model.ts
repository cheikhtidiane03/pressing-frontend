export interface PaiementModel {
  id: number;
  ticket_id: number;
  gestionnaire_id: number;
  montant: number;
  mode: string;
  date_paiement: string;
}
