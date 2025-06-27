import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  register(fullName: string, email: string, password: string, role: string, bio: string) {
    return this.http.post('http://localhost:5000/api/user/register', { fullName, email, password, role, bio });
  }

  login(email: string, password: string) {
    return this.http.post('http://localhost:5000/api/user/login', { email, password });
  }

  requestOtp(email: string) {
    return this.http.post('http://localhost:5000/api/user/request-otp', { email });
  }

  verifyOtp(email: string, otp: string) {
    return this.http.post('http://localhost:5000/api/user/verify-otp', { email, otp }).pipe(
      tap(() => {
        // Save OTP verified state in localStorage for this email
        localStorage.setItem('otp_verified_' + email, 'true');
      })
    );
  }

  isOtpVerified(email: string): boolean {
    return localStorage.getItem('otp_verified_' + email) === 'true';
  }

  clearOtpVerified(email: string) {
    localStorage.removeItem('otp_verified_' + email);
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
