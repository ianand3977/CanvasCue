import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: any = null;
  role: string = '';
  loading = false;
  error = '';
  submissions: any[] = [];
  reviews: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchProfile();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  fetchProfile() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/api/user/me`, this.getAuthHeaders()).subscribe({
      next: (data) => {
        this.user = data;
        this.role = data.role;
        this.loading = false;
        if (this.role === 'artist') {
          this.fetchSubmissions();
        } else if (this.role === 'curator') {
          this.fetchReviews();
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load profile.';
        this.loading = false;
      }
    });
  }

  fetchSubmissions() {
    this.http.get<any[]>(`${environment.apiUrl}/api/artwork?mine=true`, this.getAuthHeaders()).subscribe({
      next: (data) => {
        // Feedbacks are now included in the backend response
        this.submissions = data;
      },
      error: () => { this.submissions = []; }
    });
  }

  fetchReviews() {
    this.http.get<any[]>(`${environment.apiUrl}/api/artwork?reviewedByMe=true`, this.getAuthHeaders()).subscribe({
      next: (data) => {
        // Feedbacks are now included in the backend response
        this.reviews = data;
      },
      error: () => { this.reviews = []; }
    });
  }
}
