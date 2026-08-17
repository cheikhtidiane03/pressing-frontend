import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Concours } from '../models/concours.model';

@Injectable({ providedIn: 'root' })
export class ResultatService {
  private url = `${API_BASE_URL}/resultats`;

  constructor(private http: HttpClient) {}

  publier(concoursId: number): Observable<Concours> {
    return this.http.post<Concours>(`${this.url}/admin/concours/${concoursId}/publier`, {});
  }
}
