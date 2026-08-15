import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { gestionnaireGuard } from './guards/gestionnaire-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home').then((m) => m.Home),
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login),
  },
  {
    path: 'register',
    loadComponent: () => import('./auth/register/register').then((m) => m.Register),
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'services',
    canActivate: [authGuard],
    loadComponent: () => import('./services-catalogue/service-list/service-list').then((m) => m.ServiceList),
  },
  {
    path: 'tickets',
    canActivate: [authGuard],
    loadComponent: () => import('./tickets/ticket-list/ticket-list').then((m) => m.TicketList),
  },
  {
    path: 'tickets/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./tickets/ticket-detail/ticket-detail').then((m) => m.TicketDetail),
  },
  {
    path: 'notifications',
    canActivate: [authGuard, gestionnaireGuard],
    loadComponent: () =>
      import('./notifications/notifications').then((m) => m.Notifications),
  },
  { path: '**', redirectTo: '' },
];