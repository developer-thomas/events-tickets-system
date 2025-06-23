import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { StorageService } from '../auth/storage.service';

export const loggedAdminGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const router = inject(Router);

  const token = storageService.getToken();

  if (token) {
    return true;
  }

  // redireciona para login
  return router.createUrlTree(['/admin']);
};
