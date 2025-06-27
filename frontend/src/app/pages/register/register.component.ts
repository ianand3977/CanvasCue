import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule]
})
export class RegisterComponent implements OnInit {
  fullName = '';
  email = '';
  password = '';
  role = 'artist';
  bio = '';
  error = '';
  success = '';
  otp = '';
  otpError = '';
  otpSent = false;
  otpVerified = false;
  sendingOtp = false;
  verifyingOtp = false;
  registering = false;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    // On load, check if OTP is already verified for the email (e.g. after reload)
    if (this.email && this.auth.isOtpVerified(this.email)) {
      this.otpVerified = true;
      this.otpSent = true;
      console.log('[RegisterComponent] OTP already verified for', this.email);
    }
  }

  onEmailChange() {
    // Reset OTP state when email changes
    this.otpSent = false;
    this.otpVerified = false;
    this.otp = '';
    this.otpError = '';
    console.log('[RegisterComponent] Email changed to', this.email);
    // Check if new email is already verified (e.g. after reload)
    if (this.email && this.auth.isOtpVerified(this.email)) {
      this.otpVerified = true;
      this.otpSent = true;
      console.log('[RegisterComponent] OTP already verified for', this.email);
    }
  }

  sendOtp() {
    this.otpError = '';
    this.sendingOtp = true;
    console.log('[RegisterComponent] Sending OTP to', this.email);
    this.auth.requestOtp(this.email).subscribe({
      next: () => {
        this.otpSent = true;
        this.sendingOtp = false;
      },
      error: (err) => {
        this.otpError = err.error?.message || 'Failed to send OTP';
        this.sendingOtp = false;
      }
    });
  }

  verifyOtp() {
    this.otpError = '';
    this.verifyingOtp = true;
    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: () => {
        this.otpVerified = true;
        this.otpSent = true;
        this.verifyingOtp = false;
        console.log('[RegisterComponent] OTP verified for', this.email);
      },
      error: (err) => {
        this.otpError = err.error?.message || 'OTP verification failed';
        this.verifyingOtp = false;
        console.log('[RegisterComponent] OTP verification failed for', this.email, err);
      }
    });
  }

  register() {
    this.error = '';
    this.success = '';
    this.registering = true;
    console.log('[RegisterComponent] Attempting registration for', this.email, 'OTP verified:', this.auth.isOtpVerified(this.email));
    // Check OTP verified state before submitting
    if (!this.auth.isOtpVerified(this.email)) {
      this.error = 'OTP not verified for this email';
      this.registering = false;
      console.log('[RegisterComponent] Registration blocked: OTP not verified for', this.email);
      return;
    }
    this.auth.register(this.fullName, this.email, this.password, this.role, this.bio).subscribe({
      next: () => {
        this.success = 'Registration successful! You can now login.';
        this.auth.clearOtpVerified(this.email);
        setTimeout(() => this.router.navigate(['/login']), 1000);
        this.registering = false;
        console.log('[RegisterComponent] Registration successful for', this.email);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.success = '';
        this.registering = false;
        console.log('[RegisterComponent] Registration failed for', this.email, err);
      }
    });
  }
}
