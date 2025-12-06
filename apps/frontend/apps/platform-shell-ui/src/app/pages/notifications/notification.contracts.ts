/**
 * API Contracts for Notification System
 * نظام العقود البرمجية لنظام الإشعارات
 * 
 * هذا الملف يحدد جميع الأنواع والواجهات المطلوبة
 * يجب على جميع المطورين الالتزام بهذه العقود بالضبط
 * 
 * @author Project Manager
 * @date 2025-11-27
 */

import { Observable } from 'rxjs';

// ============================================================================
// CORE MODELS - النماذج الأساسية
// ============================================================================

/**
 * نموذج الإشعار الأساسي
 * Core Notification Model
 */
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date | string;
  link?: string;
  userId?: number;
}

/**
 * فلتر الإشعارات
 * Notification Filter
 */
export interface NotificationFilter {
  type?: 'all' | 'info' | 'success' | 'warning' | 'error';
  status?: 'all' | 'read' | 'unread';
  startDate?: string | null;
  endDate?: string | null;
  searchTerm?: string;
}

/**
 * بيانات إنشاء إشعار جديد
 * Create Notification Payload
 */
export interface CreateNotificationPayload {
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  link?: string;
  userId?: number;
}

/**
 * بيانات تحديث إشعار
 * Update Notification Payload
 */
export interface UpdateNotificationPayload {
  title?: string;
  message?: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isRead?: boolean;
  link?: string;
}

// ============================================================================
// SERVICE CONTRACTS - عقود الخدمات
// ============================================================================

/**
 * عقد خدمة الإشعارات
 * Notification Service Contract
 * 
 * يجب على NotificationService تنفيذ جميع هذه Methods
 */
export interface INotificationService {
  /**
   * الحصول على جميع الإشعارات
   */
  getNotifications(): Observable<Notification[]>;
  
  /**
   * الحصول على إشعار واحد
   */
  getNotificationById(id: number): Notification | undefined;
  
  /**
   * إنشاء إشعار جديد
   */
  createNotification(payload: CreateNotificationPayload): Observable<Notification>;
  
  /**
   * تحديث إشعار
   */
  updateNotification(id: number, payload: UpdateNotificationPayload): Observable<Notification>;
  
  /**
   * تحديد إشعار كمقروء
   */
  markAsRead(id: number): Observable<Notification>;
  
  /**
   * تحديد جميع الإشعارات كمقروءة
   */
  markAllAsRead(): Observable<void>;
  
  /**
   * حذف إشعار
   */
  deleteNotification(id: number): Observable<void>;
  
  /**
   * Observable للإشعارات
   */
  notifications$: Observable<Notification[]>;
  
  /**
   * Observable لعدد الإشعارات غير المقروءة
   */
  unreadCount$: Observable<number>;
}

/**
 * عقد خدمة الصوت
 * Sound Service Contract
 */
export interface INotificationSoundService {
  /**
   * تشغيل صوت الإشعار
   */
  playNotificationSound(type: Notification['type']): void;
  
  /**
   * تفعيل/تعطيل الصوت
   */
  toggleSound(enabled: boolean): void;
  
  /**
   * هل الصوت مفعل؟
   */
  isSoundEnabled(): boolean;
}

/**
 * عقد خدمة Real-time
 * Real-time Service Contract
 */
export interface INotificationRealtimeService {
  /**
   * Observable للإشعارات الجديدة
   */
  notifications$: Observable<Notification>;
  
  /**
   * الاتصال بالخادم
   */
  connect(): void;
  
  /**
   * قطع الاتصال
   */
  disconnect(): void;
  
  /**
   * هل متصل؟
   */
  isConnected(): boolean;
}

// ============================================================================
// COMPONENT CONTRACTS - عقود المكونات
// ============================================================================

/**
 * عقد مكون Badge
 * Badge Component Contract
 */
export interface INotificationBadgeComponent {
  /**
   * عدد الإشعارات غير المقروءة
   */
  count: number;
  
  /**
   * الحد الأقصى للعرض (99+)
   */
  maxCount?: number;
  
  /**
   * عند النقر
   */
  onClick?: () => void;
}

/**
 * عقد مكون Header
 * Header Component Contract
 */
export interface INotificationHeaderComponent {
  /**
   * عدد الإشعارات غير المقروءة
   */
  unreadCount: number;
  
  /**
   * عند تحديد الكل كمقروء
   */
  markAllAsRead: () => void;
  
  /**
   * عند النقر على الإعدادات
   */
  settingsClick: () => void;
}

/**
 * عقد مكون Filter
 * Filter Component Contract
 */
export interface INotificationFilterComponent {
  /**
   * الفلتر الحالي
   */
  currentFilter: NotificationFilter;
  
  /**
   * عند تغيير الفلتر
   */
  filterChange: (filter: NotificationFilter) => void;
}

/**
 * عقد مكون List
 * List Component Contract
 */
export interface INotificationListComponent {
  /**
   * قائمة الإشعارات
   */
  notifications: Notification[];
  
  /**
   * حالة التحميل
   */
  loading: boolean;
  
  /**
   * رسالة الخطأ
   */
  error: string | null;
  
  /**
   * عند النقر على إشعار
   */
  notificationClick: (notification: Notification) => void;
  
  /**
   * عند تحديد كمقروء
   */
  markAsRead: (id: number) => void;
  
  /**
   * عند الحذف
   */
  deleteNotification: (id: number) => void;
}

/**
 * عقد مكون Item
 * Item Component Contract
 */
export interface INotificationItemComponent {
  /**
   * الإشعار
   */
  notification: Notification;
  
  /**
   * عند النقر
   */
  onClick: () => void;
  
  /**
   * عند تحديد كمقروء
   */
  onMarkAsRead: () => void;
  
  /**
   * عند الحذف
   */
  onDelete: () => void;
}

/**
 * عقد مكون Pagination
 * Pagination Component Contract
 */
export interface INotificationPaginationComponent {
  /**
   * الصفحة الحالية
   */
  currentPage: number;
  
  /**
   * إجمالي الصفحات
   */
  totalPages: number;
  
  /**
   * عدد العناصر لكل صفحة
   */
  itemsPerPage: number;
  
  /**
   * عند تغيير الصفحة
   */
  pageChange: (page: number) => void;
  
  /**
   * عند تغيير عدد العناصر
   */
  itemsPerPageChange: (count: number) => void;
}

// ============================================================================
// UTILITY TYPES - أنواع مساعدة
// ============================================================================

/**
 * نوع الإشعار
 */
export type NotificationType = Notification['type'];

/**
 * حالة الإشعار
 */
export type NotificationStatus = 'read' | 'unread';

/**
 * خيارات الترتيب
 */
export type NotificationSortBy = 'date' | 'type' | 'status';

/**
 * اتجاه الترتيب
 */
export type SortDirection = 'asc' | 'desc';

// ============================================================================
// CONSTANTS - الثوابت
// ============================================================================

/**
 * أنواع الإشعارات المتاحة
 */
export const NOTIFICATION_TYPES: NotificationType[] = ['info', 'success', 'warning', 'error'];

/**
 * حالات الإشعارات
 */
export const NOTIFICATION_STATUSES: NotificationStatus[] = ['read', 'unread'];

/**
 * الحد الأقصى لعدد الإشعارات في الصفحة
 */
export const MAX_NOTIFICATIONS_PER_PAGE = 20;

/**
 * الحد الأقصى لعرض العداد
 */
export const MAX_BADGE_COUNT = 99;

// ============================================================================
// VALIDATION HELPERS - مساعدات التحقق
// ============================================================================

/**
 * التحقق من صحة نوع الإشعار
 */
export function isValidNotificationType(type: string): type is NotificationType {
  return NOTIFICATION_TYPES.includes(type as NotificationType);
}

/**
 * التحقق من صحة الإشعار
 */
export function isValidNotification(obj: any): obj is Notification {
  return (
    obj &&
    typeof obj.id === 'number' &&
    typeof obj.title === 'string' &&
    typeof obj.message === 'string' &&
    isValidNotificationType(obj.type) &&
    typeof obj.isRead === 'boolean'
  );
}
