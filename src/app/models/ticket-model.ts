import { AuthUser } from './auth-model';
import { PaiementModel } from './paiement-model';
import { ServiceModel } from './service-model';

export type TicketStatut = 'recu' | 'en_traitement' | 'pret' | 'recupere' | 'annule';

export interface TicketServiceLigne extends ServiceModel {
  pivot: {
    ticket_id: number;
    service_id: number;
    quantite: number;
    prix_unitaire: number;
    sous_total: number;
  };
}

export interface TicketModel {
  id: number;
  numero: string;
  user_id: number;
  statut: TicketStatut;
  montant_total: number;
  paye: boolean;
  date_pret?: string | null;
  date_recupere?: string | null;
  created_at?: string;
  updated_at?: string;
  client?: AuthUser;
  services?: TicketServiceLigne[];
  paiement?: PaiementModel | null;
}

// Payload envoyé à POST /api/tickets
export interface CreateTicketRequest {
  services: { service_id: number; quantite: number }[];
}
