import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Artwork } from '../../models/artwork.model';

@Component({
  selector: 'app-artwork-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artwork-card.component.html'
})
export class ArtworkCardComponent {
  @Input() artwork!: Artwork;
  @Output() showCategories = new EventEmitter<string>();
}