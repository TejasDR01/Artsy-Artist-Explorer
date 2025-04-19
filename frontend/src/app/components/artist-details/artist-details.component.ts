import { Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Artist } from '../../models/artist.model';
import { Artwork } from '../../models/artwork.model';
import { ArtistListComponent } from '../artist-list/artist-list.component';
import { ArtworkCardComponent } from '../artwork-card/artwork-card.component';
import { CategoriesModalComponent } from '../categories-modal/categories-modal.component';
import { AuthService } from '../../services/auth.service';
import { ArtistService } from '../../services/artist.service';
import { FavoriteService } from '../../services/favorite.service';
import { CombineBrokenWordsPipe } from "../../pipes/combine-broken.pipe";

@Component({
  selector: 'app-artist-details',
  standalone: true,
  imports: [CommonModule, NgbNavModule, ArtistListComponent, ArtworkCardComponent, CategoriesModalComponent, CombineBrokenWordsPipe],
  templateUrl: './artist-details.component.html'
})
export class ArtistDetailsComponent implements OnChanges{
  @Input() artist_id : string | null = null;
  activeId: string = '1';
  artist: Artist | null = null;
  similarArtists: Artist[] = [];
  artworks: Artwork[] = [];
  isLoading = false;
  selectedArtworkId: string | null = null;
  
  constructor(
    private artistService: ArtistService,
    public authService: AuthService,
    public favoriteService: FavoriteService,
    private location: Location
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['artist_id']) {
      if(this.artist_id){
        this.location.go(`/artist/${this.artist_id}`);
        this.isFavorite$();
      }
    this.handleArtistIdChange(); 
    }
  }
  handle_artistLists(artistId : string) {
    this.artist_id = artistId;
    this.location.go(`/artist/${this.artist_id}`);
    this.handleArtistIdChange();
  }

  handleArtistIdChange() {
    this.activeId = '1';
    if(!this.artist_id) {
      this.artist = null;
      this.similarArtists = [];
      this.artworks = [];
      this.selectedArtworkId = null;
    }
    else {
      this.isLoading = true;
      this.artistService.getArtistDetails(this.artist_id).subscribe({
        next: (details) => {
          this.isLoading = false;
          this.artist = details;
        },
        error: (e) => {
          console.log(e);
        }
      });
      if(this.authService.isLoggedIn()) {
        this.artistService.getSimilarArtists(this.artist_id).subscribe({
          next: (details) => {
            this.similarArtists = details;
          },
          error: (e) => {
            console.log(e);
          }
        });
      }
    }
  }

  handle_ArtworkTabClicked() {
    this.activeId = '2';
    if(!this.artist_id) return;
    this.isLoading = true;
    this.artistService.getArtworks(this.artist_id).subscribe({
      next: (details) => {
        this.isLoading = false;
        this.artworks = details;
      },
      error: (e) => {
        console.log(e);
      }
    });
  }

  toggleFavorite() {
    if (!this.artist_id) return;
    
    if (this.isFavorite$()) {
      this.favoriteService.removeFavorite(this.artist_id);
    } else {
      this.favoriteService.addFavorite(this.artist_id);
    }
  }

  showCategories(artworkId: string) {
    this.selectedArtworkId = artworkId;
  }

  isFavorite$(): Boolean {
    if (this.artist_id)
      return this.favoriteService.isFavorite(this.artist_id);
    return false
  }
}