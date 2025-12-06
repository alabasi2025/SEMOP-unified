import { Injectable } from '@angular/core';
import { INotificationSoundService, Notification } from './notification.contracts';

/**
 * NotificationSoundService
 * 
 * @description
 * Service for playing notification sounds in the SEMOP ERP system.
 * Implements INotificationSoundService from API Contract.
 * 
 * @implements {INotificationSoundService}
 * @see notification.contracts.ts
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationSoundService implements INotificationSoundService {
  private audio: HTMLAudioElement | null = null;
  private soundEnabled = true;
  private volume = 0.7; // Default volume (70%)

  // Sound file paths for different notification types
  private soundPaths = {
    info: '/assets/sounds/notification-info.mp3',
    success: '/assets/sounds/notification-success.mp3',
    warning: '/assets/sounds/notification-warning.mp3',
    error: '/assets/sounds/notification-error.mp3'
  };

  constructor() {
    // Initialize audio element
    this.audio = new Audio();
    this.audio.volume = this.volume;
  }

  /**
   * تشغيل صوت الإشعار
   * Play notification sound based on type
   */
  playNotificationSound(type: Notification['type']): void {
    if (!this.soundEnabled || !this.audio) {
      return;
    }

    try {
      // Set the sound file based on type
      this.audio.src = this.soundPaths[type];
      this.audio.volume = this.volume;

      // Play the sound
      const playPromise = this.audio.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`Played ${type} notification sound`);
          })
          .catch((error) => {
            console.warn('Sound playback failed:', error);
          });
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }

  /**
   * تفعيل/تعطيل الصوت
   * Toggle sound on/off
   */
  toggleSound(enabled: boolean): void {
    this.soundEnabled = enabled;
    console.log(`Notification sounds ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * هل الصوت مفعل؟
   * Check if sound is enabled
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  /**
   * Set volume level (helper method, not in contract)
   * @param level - Volume level (0 to 1)
   */
  setVolume(level: number): void {
    if (level < 0 || level > 1) {
      console.warn('Volume level must be between 0 and 1');
      return;
    }

    this.volume = level;

    if (this.audio) {
      this.audio.volume = level;
    }
  }

  /**
   * Get current volume level (helper method, not in contract)
   */
  getVolume(): number {
    return this.volume;
  }
}
