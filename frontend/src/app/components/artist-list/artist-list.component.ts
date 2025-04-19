import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artist } from '../../models/artist.model';
import { ArtistCardComponent } from '../artist-card/artist-card.component';

@Component({
  selector: 'app-artist-list',
  standalone: true,
  imports: [CommonModule, ArtistCardComponent],
  templateUrl: './artist-list.component.html'
})
export class ArtistListComponent {
  @Input() artists: Artist[] | null = null;
  @Output() artistClicked = new EventEmitter<string>();
  selectedArtistId: string | null = null;

  selectArtist(artistId: string) {
    this.selectedArtistId = artistId;
    this.artistClicked.emit(this.selectedArtistId);
  }
}