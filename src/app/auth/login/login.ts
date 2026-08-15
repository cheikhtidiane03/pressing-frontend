import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  protected erreur = signal<string | null>(null);
  protected chargement = signal(false);

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    this.authService.login(this.loginForm.value as { email: string; password: string }).subscribe({
      next: (res) => {
        this.authService.storeSession(res);
        this.chargement.set(false);
        // redirige vers l'espace adapté au rôle
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.chargement.set(false);
        this.erreur.set(err.error?.message ?? 'Identifiants incorrects.');
      },
    });
  }
}
