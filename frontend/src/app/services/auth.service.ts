import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private baseUrl = '/api/auth';
  
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser = this.currentUserSubject.asObservable();

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const user = localStorage.getItem('currentUser');
    if (user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/login`, 
      { email, password }
    ).pipe(
      tap(User => {
        // Store user details (excluding sensitive data) in local storage
        const userForStorage = {
          id: User.id,
          fullname: User.fullname,
          email: User.email,
          profileImageUrl: User.profileImageUrl
        };
        this.currentUserSubject.next(userForStorage);
        localStorage.setItem('currentUser', JSON.stringify(userForStorage));
        this.router.navigate(['/']);
      })
    );
  }

  register(fullname: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}/register`, 
      { fullname, email, password }
    ).pipe(
      tap(User => {
        const userForStorage = {
          id: User.id,
          fullname: User.fullname,
          email: User.email,
          profileImageUrl: User.profileImageUrl
        };
        this.currentUserSubject.next(userForStorage);
        localStorage.setItem('currentUser', JSON.stringify(userForStorage));
        this.router.navigate(['/']);
      })
    );
  }

  logout() {
    this.http.get<void>(`${this.baseUrl}/logout`).pipe(
      tap((msg) => {
        this.clearUserData();
        this.notificationService.show('Logged out', 'success');
        this.router.navigate(['/']);
      })
    ).subscribe({
      next: () => {}
      ,error: (err) => {
        console.log(err);
        if(err.status === 403 || err.status === 401) {
          this.clearUserData();
          this.router.navigate(["/login"]);
          alert("Session Expired or Unauthorized!!")
        } 
      }
    });
  }

  deleteAccount() {
    this.http.delete<void>(`${this.baseUrl}/delete`).pipe(
      tap((msg) => {
        this.clearUserData();
        this.notificationService.show('Account deleted', 'danger');
        this.router.navigate(['/']);
      })
    ).subscribe({
      next: () => {}
      ,error: (err) => {
        console.log(err);
        if(err.status === 403 || err.status === 401) {
          this.clearUserData();
          this.router.navigate(["/login"]);
          alert("Session Expired or Unauthorized!!")
        } 
      }
    });
  }

  clearUserData(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }
}