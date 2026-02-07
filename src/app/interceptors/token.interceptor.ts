import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UtilisateursService } from '../services/utilisateurs/utilisateurs';

export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const utilisateursService = inject(UtilisateursService);
  const token = utilisateursService.getToken();

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  return next(req);
};
