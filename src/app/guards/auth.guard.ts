import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = async (_route, state) => {
  const router = inject(Router);
  const isAuthenticated = await inject(AuthService).isAuthenticated();

  return isAuthenticated || router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};

export const guestGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const isAuthenticated = await inject(AuthService).isAuthenticated();

  return isAuthenticated ? router.createUrlTree(['/dashboard']) : true;
};
