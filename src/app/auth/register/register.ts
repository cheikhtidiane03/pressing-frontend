import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { ThemeService } from '../../services/theme-service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private authService = inject(AuthService);
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  protected erreur = signal<string | null>(null);
  protected chargement = signal(false);

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password_confirmation: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.erreur.set(null);
    this.chargement.set(true);

    this.authService.register(this.registerForm.value as any).subscribe({
      next: (res) => {
        this.authService.storeSession(res);
        this.chargement.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.chargement.set(false);
        const messages = err.error?.errors
          ? Object.values(err.error.errors).flat().join(' ')
          : (err.error?.message ?? 'Une erreur est survenue.');
        this.erreur.set(messages as string);
      },
    });
  }
}
