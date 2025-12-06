import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService } from './notification.service';
import { NotificationSoundService } from './notification-sound.service';
import { NotificationRealtimeService } from './notification-realtime.service';
import { Notification, NotificationType } from './notification.contracts';
import { NotificationHeaderComponent, NotificationStatistics } from './notification-header.component';
import { NotificationFilterPanelComponent, NotificationFilter } from './notification-filter-panel.component';
import { NotificationListComponent } from './notification-list.component';
import { NotificationPaginationComponent } from './notification-pagination.component';
import { NotificationSettingsPanelComponent, NotificationSettings } from './notification-settings-panel.component';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [
    CommonModule,
    NotificationHeaderComponent,
    NotificationFilterPanelComponent,
    NotificationListComponent,
    NotificationPaginationComponent,
    NotificationSettingsPanelComponent
  ],
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  // State
  notifications: Notification[] = [];
  filteredNotifications: Notification[] = [];
  paginatedNotifications: Notification[] = [];
  loading: boolean = false;
  showSettings: boolean = false;

  // Statistics
  statistics: NotificationStatistics = {
    total: 0,
    unread: 0,
    today: 0
  };

  // Filter & Pagination
  currentFilter: NotificationFilter = {
    types: [],
    status: 'all',
    dateRange: 'all',
    priority: 'all'
  };
  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;

  // View & Sort
  viewMode: 'list' | 'grid' = 'list';
  sortBy: 'date' | 'type' | 'priority' = 'date';

  // Settings
  settings: NotificationSettings = {
    soundEnabled: true,
    soundVolume: 70,
    desktopNotifications: true,
    autoRefreshInterval: 60,
    defaultViewMode: 'list',
    itemsPerPage: 10,
    retentionDays: 30
  };

  // Subscriptions
  private subscriptions: Subscription[] = [];
  private autoRefreshInterval?: any;

  constructor(
    private notificationService: NotificationService,
    private soundService: NotificationSoundService,
    private realtimeService: NotificationRealtimeService
  ) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadNotifications();
    this.subscribeToUnreadCount();
    this.subscribeToRealtimeNotifications();
    this.connectRealtime();
    this.setupAutoRefresh();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.realtimeService.disconnect();
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }

  /**
   * Load settings
   */
  loadSettings(): void {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
        this.viewMode = this.settings.defaultViewMode;
        this.itemsPerPage = this.settings.itemsPerPage;
        this.soundService.setVolume(this.settings.soundVolume / 100);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }

  /**
   * Load notifications
   */
  loadNotifications(): void {
    this.loading = true;
    
    const sub = this.notificationService.getNotifications().subscribe({
      next: (notifications: Notification[]) => {
        this.notifications = notifications;
        this.applyFilters();
        this.calculateStatistics();
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Failed to load notifications:', error);
        this.loading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  /**
   * Subscribe to unread count
   */
  subscribeToUnreadCount(): void {
    const sub = this.notificationService.unreadCount$.subscribe(count => {
      this.statistics.unread = count;
    });
    this.subscriptions.push(sub);
  }

  /**
   * Subscribe to realtime notifications
   */
  subscribeToRealtimeNotifications(): void {
    const sub = this.realtimeService.notifications$.subscribe(notification => {
      this.notifications.unshift(notification);
      this.applyFilters();
      this.calculateStatistics();
      
      if (this.settings.soundEnabled) {
        this.soundService.playNotificationSound(notification.type);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Connect to realtime service
   */
  connectRealtime(): void {
    this.realtimeService.connect();
  }

  /**
   * Setup auto refresh
   */
  setupAutoRefresh(): void {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }

    if (this.settings.autoRefreshInterval > 0) {
      this.autoRefreshInterval = setInterval(() => {
        this.loadNotifications();
      }, this.settings.autoRefreshInterval * 1000);
    }
  }

  /**
   * Calculate statistics
   */
  calculateStatistics(): void {
    this.statistics.total = this.notifications.length;
    this.statistics.unread = this.notifications.filter(n => !n.isRead).length;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    this.statistics.today = this.notifications.filter(n => {
      const notifDate = new Date(n.createdAt);
      notifDate.setHours(0, 0, 0, 0);
      return notifDate.getTime() === today.getTime();
    }).length;
  }

  /**
   * Apply filters
   */
  applyFilters(): void {
    let filtered = [...this.notifications];

    // Type filter
    if (this.currentFilter.types.length > 0) {
      filtered = filtered.filter(n => this.currentFilter.types.includes(n.type));
    }

    // Status filter
    if (this.currentFilter.status !== 'all') {
      filtered = filtered.filter(n => 
        this.currentFilter.status === 'read' ? n.isRead : !n.isRead
      );
    }

    // Date range filter
    if (this.currentFilter.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();

      switch (this.currentFilter.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setDate(now.getDate() - 30);
          break;
      }

      filtered = filtered.filter(n => new Date(n.createdAt) >= cutoffDate);
    }

    // Search filter
    if (this.searchQuery) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }

    // Sort
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        default:
          return 0;
      }
    });

    this.filteredNotifications = filtered;
    this.totalItems = filtered.length;
    this.applyPagination();
  }

  /**
   * Apply pagination
   */
  applyPagination(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedNotifications = this.filteredNotifications.slice(start, end);
  }

  /**
   * Handle filter change
   */
  onFilterChange(filter: NotificationFilter): void {
    this.currentFilter = filter;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Handle search change
   */
  onSearchChange(query: string): void {
    this.searchQuery = query;
    this.currentPage = 1;
    this.applyFilters();
  }

  /**
   * Handle page change
   */
  onPageChange(page: number): void {
    this.currentPage = page;
    this.applyPagination();
  }

  /**
   * Handle items per page change
   */
  onItemsPerPageChange(itemsPerPage: number): void {
    this.itemsPerPage = itemsPerPage;
    this.currentPage = 1;
    this.applyPagination();
  }

  /**
   * Handle view mode change
   */
  onViewModeChange(mode: 'list' | 'grid'): void {
    this.viewMode = mode;
  }

  /**
   * Handle sort change
   */
  onSortChange(sortBy: 'date' | 'type' | 'priority'): void {
    this.sortBy = sortBy;
    this.applyFilters();
  }

  /**
   * Handle refresh
   */
  onRefresh(): void {
    this.loadNotifications();
  }

  /**
   * Handle settings open
   */
  onOpenSettings(): void {
    this.showSettings = true;
  }

  /**
   * Handle settings save
   */
  onSettingsSave(settings: NotificationSettings): void {
    this.settings = settings;
    this.viewMode = settings.defaultViewMode;
    this.itemsPerPage = settings.itemsPerPage;
    this.soundService.setVolume(settings.soundVolume / 100);
    this.setupAutoRefresh();
    this.showSettings = false;
    this.applyPagination();
  }

  /**
   * Handle settings close
   */
  onSettingsClose(): void {
    this.showSettings = false;
  }

  /**
   * Handle notification read
   */
  onNotificationRead(id: number): void {
    const sub = this.notificationService.markAsRead(id).subscribe({
      next: (updated) => {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index !== -1) {
          this.notifications[index] = updated;
          this.applyFilters();
          this.calculateStatistics();
        }
      },
      error: (error: any) => {
        console.error('Failed to mark as read:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Handle notification delete
   */
  onNotificationDelete(id: number): void {
    const sub = this.notificationService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.applyFilters();
        this.calculateStatistics();
      },
      error: (error: any) => {
        console.error('Failed to delete notification:', error);
      }
    });
    this.subscriptions.push(sub);
  }

  /**
   * Handle bulk mark as read
   */
  onBulkMarkAsRead(ids: number[]): void {
    ids.forEach(id => this.onNotificationRead(id));
  }

  /**
   * Handle bulk delete
   */
  onBulkDelete(ids: number[]): void {
    ids.forEach(id => this.onNotificationDelete(id));
  }
}
