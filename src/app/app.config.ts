import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideEnvironmentNgxMask } from 'ngx-mask';
import { provideToastr } from 'ngx-toastr';
import { routes } from './app.routes';
import { globalErrorInterceptor } from './modules/shared/interceptors/global-error/global-error.interceptor';
import { loadingInterceptor } from './modules/shared/interceptors/loading/loading.interceptor';
import { LOCALE_ID } from '@angular/core';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      withInMemoryScrolling({ scrollPositionRestoration: 'top' }),
      withHashLocation(),
    ),
    provideToastr({
      closeButton: true,
      progressBar: true,
      timeOut: 5000,
      positionClass: 'toast-top-right',
    }),
    provideAnimationsAsync(),
    provideEnvironmentNgxMask(),
    provideHttpClient(
      withInterceptors([
        globalErrorInterceptor,
        loadingInterceptor,
        authInterceptor
      ]),
    ),
    { provide: LOCALE_ID, useValue: 'pt-BR'}
  ],
};
