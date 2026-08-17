import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from './api-config';
import { LoginRequest, LoginResponse, RegisterRequest, Utilisateur } from '../models/utilisateur.model';

interface DecodedUser {
  username: string;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'sunuxam_token';
  private readonly USER_KEY = 'sunuxam_user';

  private currentUserSignal = signal<DecodedUser | null>(this.loadUserFromStorage());

  currentUser = computed(() => this.currentUserSignal());
  isAuthenticated = computed(() => !!this.currentUserSignal());
  isAdmin = computed(() => this.currentUserSignal()?.roles.includes('ROLE_ADMIN') ?? false);
  isCandidat = computed(() => this.currentUserSignal()?.roles.includes('ROLE_CANDIDAT') ?? false);

  constructor(private http: HttpClient) {}

  private loadUserFromStorage(): DecodedUser | null {
    const raw = localStorage.getItem(this.USER_KEY);
    return raw ? JSON.parse(raw) : null;
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, request).pipe(
      tap((response) => {
        localStorage.setItem(this.TOKEN_KEY, response.token);
        const user: DecodedUser = { username: response.username, roles: response.roles };
        localStorage.setItem(this.USER_KEY, JSON.stringify(user));
        this.currentUserSignal.set(user);
      })
    );
  }

  register(request: RegisterRequest): Observable<Utilisateur> {
    return this.http.post<Utilisateur>(`${API_BASE_URL}/auth/register`, request);
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSignal.set(null);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }
}
