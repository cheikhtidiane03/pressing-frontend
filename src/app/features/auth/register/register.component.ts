import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';
import { SpinnerComponent } from '../../../shared/components/spinner/spinner.component';
import { RegisterRequest } from '../../../core/models/utilisateur.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule, ThemeToggleComponent, SpinnerComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  form: RegisterRequest = { nom: '', prenom: '', username: '', telephone: '', password: '' };
  loading = signal(false);

  constructor(private auth: AuthService, private router: Router, private toast: ToastService) {}

  onSubmit() {
    this.loading.set(true);
    this.auth.register(this.form).subscribe({
      next: () => {
        this.loading.set(false);
        this.toast.success('Compte créé avec succès ! Vous pouvez vous connecter.');
        this.router.navigate(['/connexion']);
      },
      error: () => this.loading.set(false)
    });
  }
}
