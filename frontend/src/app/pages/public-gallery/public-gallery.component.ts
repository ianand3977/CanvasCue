import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-gallery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-gallery.component.html',
  styleUrls: ['./public-gallery.component.css']
})
export class PublicGalleryComponent implements OnInit {
  artworks: any[] = [];
  loading = false;
  error = '';
  selectedArt: any = null;
  showModal = false;
  isLoggedIn = false;
  tags: string[] = [];
  selectedTag: string = '';
  filteredArtworks: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.isLoggedIn = !!localStorage.getItem('token');
    this.fetchTags();
    this.fetchArtworks();
  }

  fetchTags() {
    this.http.get<any[]>(`${environment.apiUrl}/api/tag`).subscribe({
      next: (data) => {
        this.tags = data.map(t => t.name);
      },
      error: () => {
        this.tags = [];
      }
    });
  }

  fetchArtworks() {
    this.loading = true;
    this.http.get<any[]>(`${environment.apiUrl}/api/artwork?status=approved`).subscribe({
      next: (data) => {
        this.artworks = data;
        this.applyTagFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load gallery.';
        this.loading = false;
      }
    });
  }

  applyTagFilter() {
    if (!this.selectedTag) {
      this.filteredArtworks = this.artworks;
    } else {
      this.filteredArtworks = this.artworks.filter(art => art.tags && art.tags.includes(this.selectedTag));
    }
  }

  onTagChange(tag: string) {
    this.selectedTag = tag;
    this.applyTagFilter();
  }

  openModal(art: any) {
    if (!this.isLoggedIn) {
      alert('Please log in or register to view full artwork details.');
      return;
    }
    this.selectedArt = art;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.selectedArt = null;
  }
}
