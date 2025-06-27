import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.auth.getToken();
    if (!token) {
      return this.router.parseUrl('/login');
    }
    // Check token expiry
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        this.auth.logout();
        return this.router.parseUrl('/login');
      }
    } catch {
      this.auth.logout();
      return this.router.parseUrl('/login');
    }
    return true;
  }
}
