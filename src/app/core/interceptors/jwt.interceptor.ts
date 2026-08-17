import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toast = inject(ToastService);

  const token = authService.getToken();
  const authReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/connexion']);
        toast.error('Session expirée, merci de vous reconnecter.');
      } else if (error.status === 403) {
        toast.error("Vous n'avez pas les droits pour effectuer cette action.");
      } else if (error.status === 0) {
        toast.error('Impossible de contacter le serveur. Vérifiez que le backend est démarré.');
      } else if (error.error?.message) {
        toast.error(error.error.message);
      }
      return throwError(() => error);
    })
  );
};
