import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../../core/services/auth.service';
import { ConfirmDialogService } from '../../../core/services/confirm-dialog.service';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-candidat-layout',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule, ThemeToggleComponent],
  templateUrl: './candidat-layout.component.html',
  styleUrls: ['./candidat-layout.component.css']
})
export class CandidatLayoutComponent {
  mobileOpen = signal(false);

  constructor(public auth: AuthService, private router: Router, private confirmDialog: ConfirmDialogService) {}

  initiales(): string {
    const u = this.auth.currentUser()?.username ?? '';
    return u.slice(0, 2).toUpperCase();
  }

  async demanderDeconnexion() {
    const confirmed = await this.confirmDialog.confirm({
      title: 'Se déconnecter ?',
      message: 'Vous devrez vous reconnecter pour accéder à nouveau à votre espace.',
      confirmLabel: 'Se déconnecter',
      danger: true
    });
    if (confirmed) {
      this.auth.logout();
      this.router.navigate(['/connexion']);
    }
  }
}
