import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Concours } from '../models/concours.model';

@Injectable({ providedIn: 'root' })
export class ConcoursService {
  private url = `${API_BASE_URL}/concours`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Concours[]> {
    return this.http.get<Concours[]>(this.url);
  }

  getById(id: number): Observable<Concours> {
    return this.http.get<Concours>(`${this.url}/${id}`);
  }

  creer(concours: Partial<Concours>): Observable<Concours> {
    return this.http.post<Concours>(`${this.url}/admin`, concours);
  }

  update(id: number, concours: Partial<Concours>): Observable<Concours> {
    return this.http.put<Concours>(`${this.url}/admin/${id}`, concours);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/admin/${id}`);
  }
}
