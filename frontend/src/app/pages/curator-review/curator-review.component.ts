import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-curator-review',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './curator-review.component.html',
  styleUrls: ['./curator-review.component.css']
})
export class CuratorReviewComponent {
  artworks: any[] = [];
  loading = false;
  error = '';
  success = '';
  feedback: { [key: number]: string } = {};
  submitting: { [key: number]: boolean } = {};

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPendingArtworks();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` })
    };
  }

  fetchPendingArtworks() {
    this.loading = true;
    this.error = '';
    this.success = '';
    this.http.get<any[]>(`${environment.apiUrl}/api/artwork?status=pending`, this.getAuthHeaders())
      .subscribe({
        next: (data) => {
          this.artworks = (data || []).filter(a => a.status === 'pending');
          this.loading = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Failed to load artworks';
          this.loading = false;
        }
      });
  }

  approve(artworkId: number) {
    this.error = '';
    this.success = '';
    this.submitting[artworkId] = true;
    const feedbackText = this.feedback[artworkId] || '';
    this.http.post(`${environment.apiUrl}/api/artwork/${artworkId}/approve`, { feedback: feedbackText }, this.getAuthHeaders())
      .subscribe({
        next: () => {
          this.artworks = this.artworks.filter(a => a.id !== artworkId);
          this.success = 'Artwork approved!';
          this.feedback[artworkId] = '';
          this.submitting[artworkId] = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Approval failed';
          this.submitting[artworkId] = false;
        }
      });
  }

  reject(artworkId: number) {
    this.error = '';
    this.success = '';
    const feedbackText = this.feedback[artworkId] || '';
    if (!feedbackText.trim()) {
      this.error = 'Feedback is required for rejection.';
      return;
    }
    this.submitting[artworkId] = true;
    this.http.post(`${environment.apiUrl}/api/artwork/${artworkId}/reject`, { feedback: feedbackText }, this.getAuthHeaders())
      .subscribe({
        next: () => {
          this.artworks = this.artworks.filter(a => a.id !== artworkId);
          this.success = 'Artwork rejected.';
          this.feedback[artworkId] = '';
          this.submitting[artworkId] = false;
        },
        error: (err) => {
          this.error = err.error?.message || 'Rejection failed';
          this.submitting[artworkId] = false;
        }
      });
  }
}
