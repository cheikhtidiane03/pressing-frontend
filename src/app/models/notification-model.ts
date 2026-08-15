export interface NotificationModel {
  id: string;
  type: string;
  data: {
    ticket_id: number;
    numero: string;
    client: string;
    montant_total: number;
    message: string;
  };
  read_at: string | null;
  created_at: string;
}
