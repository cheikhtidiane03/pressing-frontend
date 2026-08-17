import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Affectation } from '../models/salle.model';

@Injectable({ providedIn: 'root' })
export class AffectationService {
  private url = `${API_BASE_URL}/affectations`;

  constructor(private http: HttpClient) {}

  repartir(concoursId: number): Observable<Affectation[]> {
    return this.http.post<Affectation[]>(`${this.url}/admin/concours/${concoursId}/repartir`, {});
  }

  getByConcours(concoursId: number): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.url}/admin/concours/${concoursId}`);
  }

  monAffectation(concoursId: number): Observable<Affectation> {
    return this.http.get<Affectation>(`${this.url}/mon-affectation/${concoursId}`);
  }
}
