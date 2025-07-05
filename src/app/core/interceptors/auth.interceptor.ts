import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../auth/storage.service';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../auth/user.service';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const storageService = inject(StorageService);
  const userService = inject(UserService);
  const router = inject(Router);

  const role = storageService.getRole();
  let token: string | null = null;

  if (role === 'ADMIN') {
    token = storageService.getToken();
  } else if (role === 'CLIENT') {
    token = storageService.getUserToken();
  } else if (role === 'REPRESENTATIVE') {
    token = storageService.getToken();
  }

  const modifiedRequest = token
    ? request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'ngrok-skip-browser-warning': 'true'
        }
      })
    : request;

  return next(modifiedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        userService.clearAdminData();
        userService.clearClientData();
        location.reload();
      }

      return throwError(() => error);
    })
  );
};
