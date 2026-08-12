import {
  ApplicationConfig,
  InjectionToken,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { appRoutes as routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const API_BASE = new InjectionToken<string>('URL base do back end');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
    ),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    {
      provide: API_BASE,
      useValue: `http://localhost:3333/api`,
    },
  ],
};