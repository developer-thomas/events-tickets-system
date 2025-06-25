import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../auth/storage.service';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const storageService = inject(StorageService);
  const role = storageService.getRole();
  
  let token: string | null = null;

  if (role === 'ADMIN') {
    token = storageService.getToken();
  } else if (role === 'CLIENT') {
    token = storageService.getUserToken();
  } else if (role === 'REPRESENTATIVE') {
    token = storageService.getToken();
  }

  if (token) {
    const authHeader = `Bearer ${token}`;
    const modifiedRequest = request.clone({
      setHeaders: {
        'Authorization': authHeader,
        'ngrok-skip-browser-warning': 'true'
      }
    });

    return next(modifiedRequest);
  }

  return next(request);
};
