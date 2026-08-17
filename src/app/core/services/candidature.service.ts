import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Candidature, StatutCandidature } from '../models/candidature.model';

@Injectable({ providedIn: 'root' })
export class CandidatureService {
  private url = `${API_BASE_URL}/candidatures`;

  constructor(private http: HttpClient) {}

  deposer(concoursId: number, fichiers: File[], types: string[]): Observable<Candidature> {
    const formData = new FormData();
    fichiers.forEach((f) => formData.append('pieces', f));
    types.forEach((t) => formData.append('types', t));
    return this.http.post<Candidature>(`${this.url}/concours/${concoursId}`, formData);
  }

  mesCandidatures(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.url}/mes-candidatures`);
  }

  monResultat(concoursId: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.url}/mes-candidatures/${concoursId}/resultat`);
  }

  getByConcours(concoursId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.url}/admin/concours/${concoursId}`);
  }

  getById(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.url}/${id}`);
  }

  changerStatut(id: number, statut: StatutCandidature): Observable<Candidature> {
    return this.http.put<Candidature>(`${this.url}/admin/${id}/statut`, { statut });
  }

  telechargerPiece(pieceId: number): Observable<Blob> {
    return this.http.get(`${this.url}/admin/pieces/${pieceId}/telecharger`, { responseType: 'blob' });
  }
}
