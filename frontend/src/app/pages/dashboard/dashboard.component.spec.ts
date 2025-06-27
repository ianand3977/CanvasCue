import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'logout']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
    // Set up a valid token for username extraction before component creation
    const payload = { username: 'testuser' };
    const token = 'header.' + btoa(JSON.stringify(payload)) + '.sig';
    authServiceSpy.getToken.and.returnValue(token);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create and set username from token', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.username).toBe('testuser');
  });

  it('should redirect to login if no token', () => {
    authServiceSpy.getToken.and.returnValue(null);
    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should logout and navigate to login', () => {
    authServiceSpy.getToken.and.returnValue('header.' + btoa(JSON.stringify({ username: 'testuser' })) + '.sig');
    authServiceSpy.logout.and.stub();
    routerSpy.navigate.and.stub();
    fixture.detectChanges();
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});
