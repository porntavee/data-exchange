import { Routes } from '@angular/router';
import { AuthGuard } from '@app/auth.guard';

import { AdminLayoutComponent } from '@app/layouts/admin-layout/admin-layout.component';
import { LoginComponent } from '@app/login/login.component';

export const AppRoutes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        loadChildren: () => import('@app/layouts/admin-layout/admin-layout.module').then(m => m.AdminLayoutModule),
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
]