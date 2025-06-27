import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: any): boolean | UrlTree {
    const token = this.auth.getToken();
    if (!token) return this.router.parseUrl('/login');
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expectedRole = route.data && route.data['role'];
      if (expectedRole && payload.role !== expectedRole) {
        // Redirect to profile if role does not match
        return this.router.parseUrl('/profile');
      }
      return true;
    } catch {
      this.auth.logout();
      return this.router.parseUrl('/login');
    }
  }
}
