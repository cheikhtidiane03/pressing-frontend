import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Salle } from '../models/salle.model';

@Injectable({ providedIn: 'root' })
export class SalleService {
  private url = `${API_BASE_URL}/salles`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Salle[]> {
    return this.http.get<Salle[]>(this.url);
  }

  creer(salle: Partial<Salle>): Observable<Salle> {
    return this.http.post<Salle>(`${this.url}/admin`, salle);
  }

  update(id: number, salle: Partial<Salle>): Observable<Salle> {
    return this.http.put<Salle>(`${this.url}/admin/${id}`, salle);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/admin/${id}`);
  }
}
