import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, NgbDropdownModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  constructor(public authService: AuthService) {}
  Logout() {
    this.authService.logout();
  }
  deleteAccount() {
    this.authService.deleteAccount();
  }
}