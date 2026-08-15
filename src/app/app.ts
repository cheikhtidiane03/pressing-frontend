import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from './services/auth-service';
import { ThemeService } from './services/theme-service';
import { Modal } from './shared/modal/modal';

const ROUTES_SANS_SHELL = ['/', '/login', '/register'];

const TITRES_PAGES: { prefix: string; titre: string }[] = [
  { prefix: '/dashboard', titre: 'Tableau de bord' },
  { prefix: '/services', titre: 'Services' },
  { prefix: '/tickets/', titre: 'Détail du ticket' },
  { prefix: '/tickets', titre: 'Tickets' },
  { prefix: '/notifications', titre: 'Notifications' },
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, Modal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected authService = inject(AuthService);
  protected themeService = inject(ThemeService);
  private router = inject(Router);

  protected pageSansShell = signal(ROUTES_SANS_SHELL.includes(this.router.url));
  protected pageTitre = signal(this.calculerTitre(this.router.url));
  protected sidebarOuverte = signal(false);
  protected confirmationDeconnexionOuverte = signal(false);

  protected initiales = computed(() => {
    const nom = this.authService.currentUser()?.name ?? '';
    return nom
      .split(' ')
      .map((mot) => mot.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  });

  constructor() {
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed()
      )
      .subscribe((e) => {
        const url = e.urlAfterRedirects.split('?')[0];
        this.pageSansShell.set(ROUTES_SANS_SHELL.includes(url));
        this.pageTitre.set(this.calculerTitre(url));
        this.sidebarOuverte.set(false);
      });
  }

  toggleSidebar() {
    this.sidebarOuverte.set(!this.sidebarOuverte());
  }

  private calculerTitre(url: string): string {
    const match = TITRES_PAGES.find((p) => url.startsWith(p.prefix));
    return match?.titre ?? 'NettoLik';
  }

  demanderDeconnexion() {
    this.confirmationDeconnexionOuverte.set(true);
  }

  annulerDeconnexion() {
    this.confirmationDeconnexionOuverte.set(false);
  }

  confirmerDeconnexion() {
    this.confirmationDeconnexionOuverte.set(false);
    this.authService.logout().subscribe({
      complete: () => this.authService.clearSession(),
      error: () => this.authService.clearSession(),
    });
  }
}