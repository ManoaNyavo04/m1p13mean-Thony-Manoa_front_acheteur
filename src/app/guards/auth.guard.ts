import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UtilisateursService } from '../services/utilisateurs/utilisateurs';

export const authGuard: CanActivateFn = (route, state) => {
  const utilisateursService = inject(UtilisateursService);
  const router = inject(Router);
  const token = utilisateursService.getToken();

  if (token) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
