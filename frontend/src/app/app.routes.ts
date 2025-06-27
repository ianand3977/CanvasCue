import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'public-gallery', pathMatch: 'full' },
  { path: 'landing', loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingModule) },
  { path: 'art-submission', loadComponent: () => import('./pages/art-submission/art-submission.component').then(m => m.ArtSubmissionComponent), canActivate: [AuthGuard, RoleGuard], data: { role: 'artist' } },
  { path: 'curator-review', loadComponent: () => import('./pages/curator-review/curator-review.component').then(m => m.CuratorReviewComponent), canActivate: [AuthGuard, RoleGuard], data: { role: 'curator' } },
  { path: 'public-gallery', loadComponent: () => import('./pages/public-gallery/public-gallery.component').then(m => m.PublicGalleryComponent) },
  { path: 'artwork-detail', loadChildren: () => import('./pages/artwork-detail/artwork-detail.module').then(m => m.ArtworkDetailModule) },
  { path: 'profile', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  { path: 'notifications', loadChildren: () => import('./pages/notifications/notifications.module').then(m => m.NotificationsModule), canActivate: [AuthGuard] },
  { path: 'not-found', loadChildren: () => import('./pages/not-found/not-found.module').then(m => m.NotFoundModule) }
];
