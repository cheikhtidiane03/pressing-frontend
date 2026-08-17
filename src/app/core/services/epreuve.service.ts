import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Epreuve } from '../models/concours.model';

@Injectable({ providedIn: 'root' })
export class EpreuveService {
  private url = `${API_BASE_URL}/epreuves`;

  constructor(private http: HttpClient) {}

  getByConcours(concoursId: number): Observable<Epreuve[]> {
    return this.http.get<Epreuve[]>(`${this.url}/concours/${concoursId}`);
  }

  ajouter(concoursId: number, epreuve: Partial<Epreuve>): Observable<Epreuve> {
    return this.http.post<Epreuve>(`${this.url}/admin/concours/${concoursId}`, epreuve);
  }

  update(id: number, epreuve: Partial<Epreuve>): Observable<Epreuve> {
    return this.http.put<Epreuve>(`${this.url}/admin/${id}`, epreuve);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/admin/${id}`);
  }
}
