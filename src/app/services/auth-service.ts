import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { AuthResponse, AuthUser, LoginRequest, RegisterRequest } from '../models/auth-model';

const TOKEN_KEY = 'pressing_token';
const USER_KEY = 'pressing_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private router = inject(Router);

  API_URL = `${environment.apiUrl}`;

  // état courant exposé en signal, initialisé depuis le localStorage au démarrage
  currentUser = signal<AuthUser | null>(this.readStoredUser());

  isAuthenticated = computed(() => this.currentUser() !== null);
  isGestionnaire = computed(() => this.currentUser()?.role === 'gestionnaire');
  isClient = computed(() => this.currentUser()?.role === 'client');

  register(data: RegisterRequest) {
    return this.httpClient
      .post<AuthResponse>(`${this.API_URL}/register`, data)
      .pipe(
        // effet de bord géré dans le composant appelant via tap(), voir login()
      );
  }

  login(data: LoginRequest) {
    return this.httpClient.post<AuthResponse>(`${this.API_URL}/login`, data);
  }

  logout() {
    return this.httpClient.post(`${this.API_URL}/logout`, {});
  }

  // À appeler après un register/login réussi pour persister la session
  storeSession(response: AuthResponse) {
    localStorage.setItem(TOKEN_KEY, response.token);
    localStorage.setItem(USER_KEY, JSON.stringify(response.user));
    this.currentUser.set(response.user);
  }

  // À appeler après un logout (réussi ou non, pour toujours nettoyer côté front)
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  private readStoredUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  }
}
