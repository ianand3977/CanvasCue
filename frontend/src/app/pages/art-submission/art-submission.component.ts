import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-art-submission',
  templateUrl: './art-submission.component.html',
  styleUrls: ['./art-submission.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule]
})
export class ArtSubmissionComponent {
  artForm: FormGroup;
  imagePreview: string | ArrayBuffer | null = null;
  submitting = false;
  success = '';
  error = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.artForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      tags: ['', Validators.required],
      image: [null, Validators.required]
    });
  }

  onImageChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.artForm.patchValue({ image: file });
      this.artForm.get('image')?.updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  submitArt() {
    this.error = '';
    this.success = '';
    if (this.artForm.invalid) return;
    this.submitting = true;
    const formData = new FormData();
    formData.append('title', this.artForm.value.title);
    formData.append('description', this.artForm.value.description);
    formData.append('tags', this.artForm.value.tags);
    formData.append('image', this.artForm.value.image);
    // Attach JWT token to the request
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    this.http.post('http://localhost:5000/api/artwork', formData, { headers }).subscribe({
      next: () => {
        this.success = 'Artwork submitted! Awaiting curator approval.';
        this.submitting = false;
        this.artForm.reset();
        this.imagePreview = null;
      },
      error: (err) => {
        this.error = err.error?.message || 'Submission failed.';
        this.submitting = false;
      }
    });
  }
}
