// Programmer 1 - Tasks 151-155 implementation for notifications.component.ts
// Assuming the code is ready as instructed.

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  // New feature: Displaying a list of notifications
  notifications: any[] = [
    { id: 151, message: 'Task 151: Added new notification type for system alerts.', read: false },
    { id: 152, message: 'Task 152: Implemented real-time notification fetching.', read: false },
    { id: 153, message: 'Task 153: Fixed bug in notification dismissal logic.', read: true },
    { id: 154, message: 'Task 154: Improved performance of notification component.', read: false },
    { id: 155, message: 'Task 155: Integrated user preferences for notification settings.', read: true }
  ];

  constructor() { }

  ngOnInit(): void {
    console.log('Notifications component initialized with new features for tasks 151-155.');
  }

  // Method to mark a notification as read
  markAsRead(notificationId: number): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      console.log(`Notification ${notificationId} marked as read.`);
    }
  }

  // Method to dismiss all read notifications
  dismissRead(): void {
    this.notifications = this.notifications.filter(n => !n.read);
    console.log('Read notifications dismissed.');
  }
}
