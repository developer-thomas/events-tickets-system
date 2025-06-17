import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StorageService } from '../auth/storage.service';

export const loggedUserGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const userToken = storageService.getUserToken();

  if (userToken) {
    return true;
  }

  // redireciona para login
  return router.createUrlTree(['/login']);
};
