import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { Observable } from 'rxjs';
import { Notification } from '../../models/notification.model'

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="toast-container end-0 p-2 mt-4">
    <div
      *ngFor="let notification of notifications$ | async"
      class="alert alert-{{notification.type}} alert-dismissible mb-3 fade show"
      role="alert"
    >
      <div class="toast-body" style="font-size: 13px; pointer-events: auto;">
        {{ notification.message }}
        <button
        type="button"
        class="btn-close"
        (click)="delete(notification.id)"></button>
      </div>
    </div>
  </div>`,
  styles: []
})
export class NotificationComponent implements OnInit{
  notifications$!: Observable<Notification[]>;
  constructor(
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();
  }

  delete(id :string): void {
    this.notificationService.remove(id);
  }

}