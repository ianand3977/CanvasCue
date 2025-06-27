import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';
  success = '';
  ctaMessage = '';

  constructor(private auth: AuthService, private router: Router) {
    // Optionally, get CTA message from route state or query param
    const nav = this.router.getCurrentNavigation();
    if (nav?.extras?.state && nav.extras.state['cta']) {
      this.ctaMessage = nav.extras.state['cta'];
    }
  }

  login() {
    this.error = '';
    this.success = '';
    this.auth.login(this.email, this.password).subscribe({
      next: (res: any) => {
        this.auth.setToken(res['token']);
        this.success = 'Login successful! Redirecting...';
        // Update navbar state after login
        window.dispatchEvent(new Event('auth-changed'));
        setTimeout(() => this.router.navigate(['/public-gallery']), 1000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
