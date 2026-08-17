export interface Role {
  id: number;
  name: 'ROLE_ADMIN' | 'ROLE_CANDIDAT';
}

export interface Utilisateur {
  id: number;
  nom: string;
  prenom: string;
  username: string;
  telephone: string;
  roles: Role[];
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  username: string;
  token: string;
  roles: string[];
}

export interface RegisterRequest {
  nom: string;
  prenom: string;
  username: string;
  telephone: string;
  password: string;
}
