import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { ServiceModel } from '../models/service-model';
import { ServicesResponse } from '../models/api-response-model';

@Injectable({ providedIn: 'root' })
export class ServiceService {
  private httpClient = inject(HttpClient);

  API_URL = `${environment.apiUrl}/services`;

  getAll(params?: { libelle?: string; per_page?: number }) {
    let url = this.API_URL;
    const query: string[] = [];
    if (params?.libelle) query.push(`libelle=${encodeURIComponent(params.libelle)}`);
    if (params?.per_page) query.push(`per_page=${params.per_page}`);
    if (query.length) url += `?${query.join('&')}`;

    return this.httpClient.get<ServicesResponse>(url);
  }

  save(service: Partial<ServiceModel>) {
    return this.httpClient.post<ServiceModel>(this.API_URL, service);
  }

  update(id: number, service: Partial<ServiceModel>) {
    return this.httpClient.put<ServiceModel>(`${this.API_URL}/${id}`, service);
  }

  archiver(id: number) {
    return this.httpClient.patch(`${this.API_URL}/${id}/archiver`, {});
  }

  delete(id: number) {
    return this.httpClient.delete(`${this.API_URL}/${id}`);
  }
}
