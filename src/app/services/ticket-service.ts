import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CreateTicketRequest, TicketModel, TicketStatut } from '../models/ticket-model';
import { TicketsResponse } from '../models/api-response-model';

@Injectable({ providedIn: 'root' })
export class TicketService {
  private httpClient = inject(HttpClient);

  API_URL = `${environment.apiUrl}/tickets`;

  getAll(params?: { statut?: TicketStatut; per_page?: number }) {
    let url = this.API_URL;
    const query: string[] = [];
    if (params?.statut) query.push(`statut=${params.statut}`);
    if (params?.per_page) query.push(`per_page=${params.per_page}`);
    if (query.length) url += `?${query.join('&')}`;

    return this.httpClient.get<TicketsResponse>(url);
  }

  getOne(id: number) {
    return this.httpClient.get<TicketModel>(`${this.API_URL}/${id}`);
  }

  save(payload: CreateTicketRequest) {
    return this.httpClient.post<{ ticket: TicketModel; message: string }>(this.API_URL, payload);
  }

  updateStatut(id: number, statut: TicketStatut) {
    return this.httpClient.patch<{ ticket: TicketModel; message: string }>(
      `${this.API_URL}/${id}/statut`,
      { statut }
    );
  }

  annuler(id: number) {
    return this.httpClient.patch<{ ticket: TicketModel; message: string }>(
      `${this.API_URL}/${id}/annuler`,
      {}
    );
  }

  // Retourne l'URL directe de téléchargement (le token est ajouté par l'intercepteur
  // pour les appels HttpClient ; pour un lien <a> classique, voir la note dans ticket-detail.ts)
  getRecuUrl(id: number) {
    return `${this.API_URL}/${id}/recu`;
  }

  telechargerRecu(id: number) {
    return this.httpClient.get(`${this.API_URL}/${id}/recu`, { responseType: 'blob' });
  }
}
