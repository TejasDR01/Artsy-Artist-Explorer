export interface Notification {
    id: string;
    message: string;
    type: 'success' | 'danger' | 'info' | 'warning';
    timeout?: number;
  }