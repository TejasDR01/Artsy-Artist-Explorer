import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  fullname = '';
  email = '';
  password = '';
  isLoading = false;
  fullnameTouched = false;
  emailTouched = false;
  passwordTouched = false;
  backEndError = false;

  constructor(
      private authService: AuthService,
      private favoriteService: FavoriteService
    ) {}

  register() {
    this.isLoading = true;
    this.authService.register(this.fullname, this.email, this.password).subscribe({
      next: () => {
        this.isLoading = false;
        this.favoriteService.loadFavorites();
      },
      error: (e) => {
        if(e.status === 400) {
          this.backEndError = true;
        }
        this.isLoading = false;
      }
    });
  }

  clearbackEndError() {
    this.backEndError = false;
  }
}