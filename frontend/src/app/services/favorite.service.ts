import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private baseUrl = '/api/favorites'
  
  private favoritesSubject = new BehaviorSubject<Favorite[]>([]);
  favorites$ = this.favoritesSubject.asObservable();
  private isLoadingSubject = new BehaviorSubject<Boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  constructor() {
    this.loadFavorites();
  }

  loadFavorites(): void {
    if (this.authService.isLoggedIn()) {
      this.isLoadingSubject.next(true);
      this.http.get<Favorite[]>(`${this.baseUrl}`).subscribe({
        next: (favorites) => {
          favorites.map(fav => {
            if(fav.thumbnail == "assets/shared/missing_image.png") 
              fav.thumbnail = "assets/artsy_logo.svg";
            });
          this.favoritesSubject.next(favorites);
          this.isLoadingSubject.next(false);},
        error: (err) => {
          this.isLoadingSubject.next(false);
          if(err.status === 403 || err.status === 401) {
            this.authService.clearUserData();
            this.router.navigate(["/login"]);
            alert("Session Expired or Unauthorized!!")
          } 
        }
      });
    }
  }
  getisLoading(): Observable<Boolean> {
    return this.isLoading$;
  }
  getFavorites(): Observable<Favorite[]> {
    return this.favorites$;
  }

  addFavorite(artist_id: string) {
    this.http.post<Favorite>(`${this.baseUrl}`, {artistId : artist_id}).pipe(
      tap((addedFavorite) => {
        if(addedFavorite.thumbnail == "assets/shared/missing_image.png") 
          addedFavorite.thumbnail = "assets/artsy_logo.svg";
        const currentFavorites = this.favoritesSubject.value;
        this.favoritesSubject.next([addedFavorite, ...currentFavorites]);
        this.notificationService.show('Added to favorites', 'success');
      })
    ).subscribe({
      next: () => {}
      ,error: (err) => {
        console.log(err);
        if(err.status === 403 || err.status === 401) {
          this.authService.clearUserData();
          this.router.navigate(["/login"]);
          alert("Session Expired or Unauthorized!!")
        } 
      }
    });
  }

  removeFavorite(id: string) {
    this.http.delete<void>(`${this.baseUrl}?id=${id}`).pipe(
      tap(() => {
        const updatedFavorites = this.favoritesSubject.value.filter(fav => fav.artistId !== id);
        this.favoritesSubject.next(updatedFavorites);
        this.notificationService.show('Removed from favorites', 'danger');
      })
    ).subscribe({
      next: () => {}
      ,error: (err) => {
        console.log(err);
        if(err.status === 403 || err.status === 401) {
          this.authService.clearUserData();
          this.router.navigate(["/login"]);
          alert("Session Expired or Unauthorized!!")
        } 
      }
    });
  }

  isFavorite(artistId: string): boolean {
    return this.favoritesSubject.value.some(fav => fav.artistId === artistId);
  }
}