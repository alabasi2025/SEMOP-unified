import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface NotificationSettings {
  soundEnabled: boolean;
  soundVolume: number;
  desktopNotifications: boolean;
  autoRefreshInterval: number;
  defaultViewMode: 'list' | 'grid';
  itemsPerPage: number;
  retentionDays: number;
}

@Component({
  selector: 'app-notification-settings-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './notification-settings-panel.component.html',
  styleUrls: ['./notification-settings-panel.component.css']
})
export class NotificationSettingsPanelComponent implements OnInit {
  @Output() settingsSave = new EventEmitter<NotificationSettings>();
  @Output() settingsClose = new EventEmitter<void>();

  // Settings state
  settings: NotificationSettings = {
    soundEnabled: true,
    soundVolume: 70,
    desktopNotifications: true,
    autoRefreshInterval: 60,
    defaultViewMode: 'list',
    itemsPerPage: 10,
    retentionDays: 30
  };

  // Options
  autoRefreshOptions = [
    { value: 0, label: 'معطل' },
    { value: 30, label: '30 ثانية' },
    { value: 60, label: 'دقيقة واحدة' },
    { value: 300, label: '5 دقائق' },
    { value: 600, label: '10 دقائق' }
  ];

  viewModeOptions = [
    { value: 'list', label: 'قائمة' },
    { value: 'grid', label: 'شبكة' }
  ];

  itemsPerPageOptions = [10, 25, 50, 100];

  retentionOptions = [
    { value: 7, label: '7 أيام' },
    { value: 30, label: '30 يوم' },
    { value: 90, label: '90 يوم' },
    { value: -1, label: 'للأبد' }
  ];

  ngOnInit(): void {
    this.loadSettings();
  }

  /**
   * Load settings from localStorage
   */
  loadSettings(): void {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      try {
        this.settings = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }

  /**
   * Save settings
   */
  saveSettings(): void {
    // Save to localStorage
    localStorage.setItem('notification_settings', JSON.stringify(this.settings));
    
    // Emit event
    this.settingsSave.emit(this.settings);
    
    // Show success message
    alert('تم حفظ الإعدادات بنجاح!');
  }

  /**
   * Cancel and close
   */
  cancel(): void {
    this.loadSettings(); // Reload original settings
    this.settingsClose.emit();
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    if (confirm('هل أنت متأكد من إعادة تعيين الإعدادات إلى الافتراضية؟')) {
      this.settings = {
        soundEnabled: true,
        soundVolume: 70,
        desktopNotifications: true,
        autoRefreshInterval: 60,
        defaultViewMode: 'list',
        itemsPerPage: 10,
        retentionDays: 30
      };
    }
  }

  /**
   * Get volume percentage
   */
  getVolumePercentage(): string {
    return `${this.settings.soundVolume}%`;
  }
}
