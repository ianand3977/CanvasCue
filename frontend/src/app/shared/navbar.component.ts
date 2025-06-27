import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav class="navbar">
      <div class="navbar-logo" (click)="navigateTo('/')">🎨 Art Portal</div>
      <ul class="navbar-links">
        <li><a href="/public-gallery">Gallery</a></li>
        <li *ngIf="isLoggedIn && role === 'artist'"><a href="/art-submission">Add Art</a></li>
        <li *ngIf="isLoggedIn && role === 'curator'"><a href="/curator-review">Curator Review</a></li>
        <li *ngIf="isLoggedIn"><a href="/profile">Profile</a></li>
        <li *ngIf="!isLoggedIn"><a href="/login">Login</a></li>
        <li *ngIf="!isLoggedIn"><a href="/register">Register</a></li>
        <li *ngIf="isLoggedIn" class="navbar-hello">Hello, {{ username }}</li>
        <li *ngIf="isLoggedIn"><button class="logout-btn" (click)="logout()">Logout</button></li>
      </ul>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #2d3748;
      color: #fff;
      padding: 0.75rem 2rem;
      font-size: 1.1rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 16px rgba(0,0,0,0.07);
      transition: box-shadow 0.18s, background 0.18s;
    }
    .navbar-logo {
      font-weight: bold;
      cursor: pointer;
      font-size: 1.3rem;
    }
    .navbar-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
      align-items: center;
    }
    .navbar-links a {
      color: #fff;
      text-decoration: none;
      transition: color 0.2s;
    }
    .navbar-links a:hover {
      color: #63b3ed;
    }
    .navbar-hello {
      color: #63b3ed;
      font-weight: 600;
      margin-right: 0.5rem;
    }
    .logout-btn {
      background: #e53e3e;
      color: #fff;
      border: none;
      border-radius: 0.4rem;
      padding: 0.4rem 1.1rem;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    }
    .logout-btn:hover {
      background: #c53030;
    }
  `]
})
export class NavbarComponent {
  isLoggedIn = false;
  username = '';
  role = '';

  constructor(private router: Router, private auth: AuthService) {
    this.updateUserState();
    // Listen for login/logout events to update navbar
    window.addEventListener('auth-changed', () => {
      this.updateUserState();
    });
  }

  updateUserState() {
    const token = this.auth.getToken();
    this.isLoggedIn = !!token;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.username = payload.fullName || payload.username || payload.email?.split('@')[0] || '';
        this.role = payload.role || '';
      } catch (e) {
        this.username = '';
        this.role = '';
      }
    } else {
      this.username = '';
      this.role = '';
    }
  }

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  logout() {
    this.auth.logout();
    this.updateUserState();
    this.router.navigate(['/login']);
  }
}
