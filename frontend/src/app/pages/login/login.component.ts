import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoading = false;
  emailTouched = false;
  passwordTouched = false;
  backEndError = false;

  constructor(
    private authService: AuthService,
    private favoriteService: FavoriteService
  ) {}

  login() {
    this.isLoading = true;
    this.authService.login(this.email, this.password).subscribe({
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