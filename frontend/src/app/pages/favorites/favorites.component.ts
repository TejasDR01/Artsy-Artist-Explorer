import { Component, OnInit, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';
import { RelativeTimePipe } from '../../pipes/relative-time.pipe';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { Observable} from 'rxjs';
import { Favorite } from '../../models/favorite.model';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe, RouterModule],
  templateUrl: './favorites.component.html'
})
export class FavoritesComponent implements OnInit {
  private router = inject(Router);
  favorites$!: Observable<Favorite[]>;
  isLoading$!: Observable<Boolean>;

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoading$ = this.favoriteService.getisLoading();
    this.favorites$ = this.favoriteService.getFavorites();
  }

  removeFavorite(artistId: string, event: Event): void {
    event.stopPropagation();
    this.favoriteService.removeFavorite(artistId);
  }
}