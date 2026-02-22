import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { UtilisateursService } from '../services/utilisateurs/utilisateurs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const utilisateursService = inject(UtilisateursService);
  const router = inject(Router);
  const token = utilisateursService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 401) {
          utilisateursService.removeToken();
          utilisateursService.removeUserData();
          router.navigate(['/login']);
        }
        return throwError(() => error);
      })
    );
  }

  return next(req);
};
