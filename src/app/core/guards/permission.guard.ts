import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { PermissionRouteMap } from '../../modules/shared/utils/permission-route.map';
import { UserService } from '../auth/user.service';

export const permissionGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);

  const requiredPermission = route.data?.['permission'] as string;
  const userPermissions = userService.getPermissions(); 

  if (userPermissions.includes(requiredPermission)) {
    return true;
  }

  const allowedRoute = getFirstAllowedRoute(userPermissions);
  if (allowedRoute) {
    router.navigate([allowedRoute]);
    return false;
  }

  router.navigate(['/admin']);
  return false;
};

// Função auxiliar
function getFirstAllowedRoute(permissions: string[]): string | null {
  for (const permission of permissions) {
    const path = PermissionRouteMap[permission];
    if (path) return path;
  }
  return null;
}