import { provideRouter, Routes } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent)
  }
];

export const appConfig = {
  providers: [
    provideRouter(appRoutes),
    importProvidersFrom(HttpClientModule),
    importProvidersFrom(FormsModule)
  ]
};
