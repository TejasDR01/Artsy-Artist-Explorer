import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router} from '@angular/router';
import { Artist } from '../../models/artist.model';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './artist-card.component.html',
  styleUrls: ['./artist-card.component.css']
})
export class ArtistCardComponent {
  @Input() artist!: Artist;
  @Input() isSelected: Boolean = false;
  constructor(
    public favoriteService: FavoriteService,
    public authService: AuthService
  ) {}

  toggleFavorite(event: Event): void {
    event.stopPropagation();
    if (this.isFavorite$()) {
      this.favoriteService.removeFavorite(this.artist.id);
    }
    else {
      this.favoriteService.addFavorite(this.artist.id);
    }
  }

  isFavorite$(): Boolean {
    return this.favoriteService.isFavorite(this.artist.id);
  }
}