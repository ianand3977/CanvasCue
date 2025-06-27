import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent {
  username = '';

  constructor(private auth: AuthService, private router: Router) {
    // Optionally, decode JWT to get username
    const token = this.auth.getToken();
    if (!token) {
      this.router.navigate(['/login']);
    } else {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.username = payload.username;
    }
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
