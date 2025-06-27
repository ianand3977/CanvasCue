import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'setToken', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate', 'getCurrentNavigation']);
    routerSpy.getCurrentNavigation.and.returnValue({ extras: { state: { cta: 'Be a digital creator and showcase your artwork today. Create a free account!' } } } as any);
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should login and navigate to dashboard on success', fakeAsync(() => {
    component.email = 'user@email.com';
    component.password = 'pass';
    const token = 'mock-token';
    authServiceSpy.login.and.returnValue(of({ token }));
    authServiceSpy.setToken.and.stub();
    routerSpy.navigate.and.stub();
    component.login();
    tick(1000);
    expect(authServiceSpy.login).toHaveBeenCalledWith('user@email.com', 'pass');
    expect(authServiceSpy.setToken).toHaveBeenCalledWith(token);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/public-gallery']);
    expect(component.error).toBe('');
    expect(component.success).toContain('Login successful');
  }));

  it('should show error on login failure', fakeAsync(() => {
    component.email = 'user@email.com';
    component.password = 'wrong';
    authServiceSpy.login.and.returnValue(throwError(() => ({ error: { message: 'Invalid' } })));
    component.login();
    tick();
    expect(component.error).toBe('Invalid');
    expect(component.success).toBe('');
  }));

  it('should show CTA message if present in navigation state', () => {
    expect(component.ctaMessage).toContain('Be a digital creator');
  });

  it('should logout and navigate to login', () => {
    authServiceSpy.logout.and.stub();
    routerSpy.navigate.and.stub();
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
