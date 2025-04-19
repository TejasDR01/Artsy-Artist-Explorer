import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../models/category.model';
import { ArtistService } from '../../services/artist.service';

@Component({
  selector: 'app-categories-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-modal.component.html'
})
export class CategoriesModalComponent {
  @Input() artworkId!: string;
  @Output() close = new EventEmitter<void>();
  categories: Category[] = [];
  isLoading = false;

  constructor(
    private modalService: NgbModal,
    private artistService: ArtistService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.isLoading = true;
    this.artistService.getCategories(this.artworkId).subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: (e) => {
        console.log(e);
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  windowwidth(): Boolean {
    if(window.innerWidth >= 992)
      return true
    else
      return false
  }
}