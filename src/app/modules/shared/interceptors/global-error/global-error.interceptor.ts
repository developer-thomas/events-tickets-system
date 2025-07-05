import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const globalErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastr = inject(ToastrService);

  return next(req).pipe(
    catchError((error) => {
      const silentRoutes = ['/auth/me'];

      const shouldSilenceToast = silentRoutes.some(route => req.url.includes(route));

      if (!shouldSilenceToast) {
        toastr.error(error?.error?.message || 'Erro inesperado');
      }

      return throwError(() => error);
    })
  );
};
