import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { NotificationComponent } from './components/notification/notification.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, FooterComponent, NotificationComponent],
  template: `
    <div class="d-flex flex-column min-vh-100">
      <app-header />
      <app-notification />
      <div class="flex-grow-1">
        <router-outlet />
      </div>
      <app-footer />
    </div>
  `,
  styles: []
})
export class AppComponent {
  title = 'artsy-app';
  constructor() {}
  }