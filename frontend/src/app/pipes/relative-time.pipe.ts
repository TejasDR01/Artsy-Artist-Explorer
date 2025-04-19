import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Pipe({
  name: 'relativeTime',
  pure: false // Impure pipe to trigger updates
})
export class RelativeTimePipe implements PipeTransform, OnDestroy {

  private timerSubscription: Subscription | null = null;
  private lastValue: Date | number | string | null = null;
  private updateInterval: number = 1000;
  private lastResult: string = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  transform(value: Date | number | string): string {
    if (!value) {
      this.clearTimer();
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (isNaN(seconds)) {
      this.clearTimer();
      return ''; // Handle invalid date
    }

    if (seconds >= 1 && seconds < 60) {
      this.updateInterval = 1000;
      this.setupTimer();
      this.lastValue = value;
      this.lastResult = `${seconds} second${seconds === 1 ? '' : 's'} ago`;
      return this.lastResult;
    } else if (seconds >= 60 && seconds < 3600) {
      this.updateInterval = 60000;
      this.setupTimer();
      this.lastValue = value;
      const minutes = Math.floor(seconds / 60);
      this.lastResult = `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
      return this.lastResult;
    } else {
      this.clearTimer();
      const intervals: { [key: string]: number } = {
        year: 31536000,
        month: 2592000,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1 // Included for initial calculation
      };

      for (const unit in intervals) {
        const interval = Math.floor(seconds / intervals[unit]);
        if (interval >= 1) {
          return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
        }
      }
      return 'just now';
    }
  }

  private setupTimer(): void {
    if (!this.timerSubscription) {
      this.timerSubscription = interval(1000).subscribe(() => {
        if (this.lastValue) {
          const date = this.lastValue instanceof Date ? this.lastValue : new Date(this.lastValue);
          const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
          this.lastResult = `${seconds} second${seconds === 1 ? '' : 's'} ago`;
          this.changeDetectorRef.detectChanges(); // Force update
        }
      });
    }
  }

  private clearTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
  }
}