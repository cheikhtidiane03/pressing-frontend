import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { Note } from '../models/candidature.model';

@Injectable({ providedIn: 'root' })
export class NoteService {
  private url = `${API_BASE_URL}/notes`;

  constructor(private http: HttpClient) {}

  saisir(candidatureId: number, epreuveId: number, valeur: number): Observable<Note> {
    return this.http.post<Note>(`${this.url}/admin`, { candidatureId, epreuveId, valeur });
  }

  getByCandidature(candidatureId: number): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.url}/candidature/${candidatureId}`);
  }
}
