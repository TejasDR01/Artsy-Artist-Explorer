import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  show(message: string, type: 'success' | 'danger' | 'info' | 'warning' = 'info', timeout = 3000) {
    const notification: Notification = {
      id: Date.now().toString(),
      message,
      type,
      timeout
    };

    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([notification, ...currentNotifications]);

    if (timeout) {
      setTimeout(() => this.remove(notification.id), timeout);
    }
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications$;
  }
  remove(id: string) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next(currentNotifications.filter(n => n.id !== id));
  }
}