import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { candidatGuard } from './core/guards/candidat.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'connexion', pathMatch: 'full' },
  {
    path: 'connexion',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent)
  },
  {
    path: 'inscription',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent)
  },
  {
    path: 'candidat',
    canActivate: [candidatGuard],
    loadComponent: () => import('./features/candidat/layout/candidat-layout.component').then((m) => m.CandidatLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/candidat/dashboard/candidat-dashboard.component').then((m) => m.CandidatDashboardComponent)
      },
      {
        path: 'concours',
        loadComponent: () => import('./features/candidat/concours-list/concours-list.component').then((m) => m.ConcoursListComponent)
      },
      {
        path: 'concours/:id',
        loadComponent: () => import('./features/candidat/concours-detail/concours-detail.component').then((m) => m.ConcoursDetailComponent)
      },
      {
        path: 'mes-candidatures',
        loadComponent: () => import('./features/candidat/mes-candidatures/mes-candidatures.component').then((m) => m.MesCandidaturesComponent)
      },
      {
        path: 'candidature/:id',
        loadComponent: () => import('./features/candidat/candidature-detail/candidature-detail.component').then((m) => m.CandidatureDetailComponent)
      }
    ]
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent)
      },
      {
        path: 'concours',
        loadComponent: () => import('./features/admin/concours/concours-admin.component').then((m) => m.ConcoursAdminComponent)
      },
      {
        path: 'epreuves',
        loadComponent: () => import('./features/admin/epreuves/epreuves-selector.component').then((m) => m.EpreuvesSelectorComponent)
      },
      {
        path: 'candidatures',
        loadComponent: () => import('./features/admin/candidatures/candidatures-selector.component').then((m) => m.CandidaturesSelectorComponent)
      },
      {
        path: 'notes',
        loadComponent: () => import('./features/admin/notes/notes-selector.component').then((m) => m.NotesSelectorComponent)
      },
      {
        path: 'repartition',
        loadComponent: () => import('./features/admin/affectations/repartition-selector.component').then((m) => m.RepartitionSelectorComponent)
      },
      {
        path: 'concours/:id/epreuves',
        loadComponent: () => import('./features/admin/epreuves/epreuves-admin.component').then((m) => m.EpreuvesAdminComponent)
      },
      {
        path: 'concours/:id/candidatures',
        loadComponent: () => import('./features/admin/candidatures/candidatures-admin.component').then((m) => m.CandidaturesAdminComponent)
      },
      {
        path: 'concours/:id/notes',
        loadComponent: () => import('./features/admin/notes/notes-admin.component').then((m) => m.NotesAdminComponent)
      },
      {
        path: 'concours/:id/affectations',
        loadComponent: () => import('./features/admin/affectations/affectations-admin.component').then((m) => m.AffectationsAdminComponent)
      },
      {
        path: 'salles',
        loadComponent: () => import('./features/admin/salles/salles-admin.component').then((m) => m.SallesAdminComponent)
      },
      {
        path: 'utilisateurs',
        loadComponent: () => import('./features/admin/utilisateurs/utilisateurs-admin.component').then((m) => m.UtilisateursAdminComponent)
      }
    ]
  },
  { path: '**', redirectTo: 'connexion' }
];
