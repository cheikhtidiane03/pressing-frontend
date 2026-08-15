import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { CaParService, StatistiquesJour, TicketsParMois } from '../models/statistique-model';

@Injectable({ providedIn: 'root' })
export class StatistiqueService {
  private httpClient = inject(HttpClient);

  API_URL = `${environment.apiUrl}/statistiques`;

  jour() {
    return this.httpClient.get<StatistiquesJour>(`${this.API_URL}/jour`);
  }

  mensuel() {
    return this.httpClient.get<{ tickets_par_mois: TicketsParMois[] }>(`${this.API_URL}/mensuel`);
  }

  parService() {
    return this.httpClient.get<{ chiffre_affaires_par_service: CaParService[] }>(
      `${this.API_URL}/services`
    );
  }
}
