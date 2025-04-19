import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArtistService } from '../../services/artist.service';
import { Artist } from '../../models/artist.model';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-form.component.html'
})
export class SearchFormComponent {
  searchTerm = '';
  isLoading = false;
  @Output() searchResults = new EventEmitter<Artist[] | null>();

  constructor(private artistService: ArtistService) {}

  search() {
    if (!this.searchTerm.trim()) return;
    
    this.isLoading = true;
    this.artistService.searchArtists(this.searchTerm).subscribe({
      next: (artists) => {
        this.isLoading = false;
        this.searchResults.emit(artists);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  clear() {
    this.searchTerm = '';
    this.searchResults.emit(null);
  }
}