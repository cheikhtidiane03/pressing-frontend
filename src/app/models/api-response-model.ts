export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface ServicesResponse {
  services: import('./service-model').ServiceModel[];
  meta: PaginationMeta;
  message: string;
}

export interface TicketsResponse {
  tickets: import('./ticket-model').TicketModel[];
  meta: PaginationMeta;
  message: string;
}

// Forme générique des erreurs de validation renvoyées par le handler Laravel :
// { message: string, errors?: { [champ: string]: string[] } }
export interface ApiErrorResponse {
  message: string;
  errors?: { [champ: string]: string[] };
}
