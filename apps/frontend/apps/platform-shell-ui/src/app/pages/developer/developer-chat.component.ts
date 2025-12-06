import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { BadgeModule } from 'primeng/badge';
import { ChipModule } from 'primeng/chip';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-developer-chat',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    ScrollPanelModule,
    BadgeModule,
    ChipModule,
    ToastModule,
  ],
  providers: [MessageService],
  template: `
    <div class="developer-chat-container">
      <p-toast></p-toast>

      <!-- Header -->
      <div class="chat-header">
        <div class="header-content">
          <div class="header-icon">
            <i class="pi pi-code"></i>
          </div>
          <div class="header-text">
            <h1>المطور (AI)</h1>
            <p>مساعدك الذكي في تطوير SEMOP</p>
          </div>
        </div>
        <div class="header-actions">
          <button pButton icon="pi pi-list" class="p-button-rounded p-button-text" 
                  pTooltip="المحادثات السابقة" (click)="showConversations()"></button>
          <button pButton icon="pi pi-plus" class="p-button-rounded p-button-text" 
                  pTooltip="محادثة جديدة" (click)="newConversation()"></button>
          <button pButton icon="pi pi-cog" class="p-button-rounded p-button-text" 
                  pTooltip="الإعدادات" (click)="showSettings()"></button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-item">
          <i class="pi pi-comments"></i>
          <span>{{ stats.totalConversations }} محادثة</span>
        </div>
        <div class="stat-item">
          <i class="pi pi-check-circle"></i>
          <span>{{ stats.completedTasks }} مهمة مكتملة</span>
        </div>
        <div class="stat-item">
          <i class="pi pi-clock"></i>
          <span>{{ stats.pendingTasks }} مهمة قيد الانتظار</span>
        </div>
      </div>

      <!-- Chat Messages -->
      <div class="chat-messages" #chatContainer>
        <div *ngIf="messages.length === 0" class="empty-state">
          <i class="pi pi-comments"></i>
          <h3>مرحباً! أنا المطور</h3>
          <p>كيف يمكنني مساعدتك في تطوير SEMOP اليوم؟</p>
          <div class="suggestions">
            <p-chip label="إنشاء صفحة جديدة" icon="pi pi-plus" (click)="sendSuggestion('أريد إنشاء صفحة جديدة')"></p-chip>
            <p-chip label="إصلاح خطأ" icon="pi pi-wrench" (click)="sendSuggestion('أريد إصلاح خطأ')"></p-chip>
            <p-chip label="توليد كود" icon="pi pi-code" (click)="sendSuggestion('أريد توليد كود')"></p-chip>
            <p-chip label="شرح معماري" icon="pi pi-book" (click)="sendSuggestion('اشرح لي البنية المعمارية')"></p-chip>
          </div>
        </div>

        <div *ngFor="let msg of messages" class="message" [ngClass]="msg.role">
          <div class="message-avatar">
            <i [class]="msg.role === 'USER' ? 'pi pi-user' : 'pi pi-code'"></i>
          </div>
          <div class="message-content">
            <div class="message-header">
              <span class="message-sender">{{ msg.role === 'USER' ? 'أنت' : 'المطور' }}</span>
              <span class="message-time">{{ msg.createdAt | date:'short' }}</span>
            </div>
            <div class="message-text" [innerHTML]="formatMessage(msg.content)"></div>
            <div *ngIf="msg.metadata" class="message-metadata">
              <span *ngIf="msg.metadata.tokensUsed">
                <i class="pi pi-bolt"></i> {{ msg.metadata.tokensUsed }} tokens
              </span>
              <span *ngIf="msg.metadata.processingTime">
                <i class="pi pi-clock"></i> {{ msg.metadata.processingTime }}ms
              </span>
            </div>
          </div>
        </div>

        <div *ngIf="isTyping" class="message ASSISTANT typing">
          <div class="message-avatar">
            <i class="pi pi-code"></i>
          </div>
          <div class="message-content">
            <div class="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Notification -->
      <div *ngIf="lastCreatedTask" class="task-notification">
        <div class="task-icon">
          <i class="pi pi-check-circle"></i>
        </div>
        <div class="task-info">
          <strong>تم إنشاء مهمة جديدة</strong>
          <p>{{ lastCreatedTask.title }}</p>
          <small>الوقت المتوقع: {{ lastCreatedTask.estimatedHours }} ساعة</small>
        </div>
        <button pButton icon="pi pi-times" class="p-button-rounded p-button-text p-button-sm" 
                (click)="lastCreatedTask = null"></button>
      </div>

      <!-- Input Area -->
      <div class="chat-input">
        <textarea pInputText [(ngModel)]="userMessage" 
                  placeholder="اكتب رسالتك هنا... (Shift+Enter للسطر الجديد)"
                  rows="3" class="w-full"
                  (keydown.enter)="onEnterPress($event)"
                  [disabled]="isSending"></textarea>
        <button pButton icon="pi pi-send" [loading]="isSending" 
                [disabled]="!userMessage.trim()" (click)="sendMessage()"
                class="send-button"></button>
      </div>
    </div>
  `,
  styles: [`
    .developer-chat-container {
      display: flex; flex-direction: column; height: calc(100vh - 100px);
      background: #f5f7fa;
    }

    /* Header */
    .chat-header {
      display: flex; justify-content: space-between; align-items: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 1.5rem 2rem; color: white;
    }
    .header-content { display: flex; align-items: center; gap: 1rem; }
    .header-icon {
      width: 50px; height: 50px; border-radius: 12px;
      background: rgba(255,255,255,0.2); display: flex;
      align-items: center; justify-content: center; font-size: 1.5rem;
    }
    .header-text h1 { margin: 0; font-size: 1.5rem; }
    .header-text p { margin: 0; opacity: 0.9; font-size: 0.875rem; }
    .header-actions { display: flex; gap: 0.5rem; }
    .header-actions button { color: white !important; }

    /* Stats Bar */
    .stats-bar {
      display: flex; gap: 2rem; padding: 1rem 2rem;
      background: white; border-bottom: 1px solid #e9ecef;
    }
    .stat-item {
      display: flex; align-items: center; gap: 0.5rem;
      color: #6c757d; font-size: 0.875rem;
    }
    .stat-item i { color: #667eea; }

    /* Chat Messages */
    .chat-messages {
      flex: 1; overflow-y: auto; padding: 2rem;
      display: flex; flex-direction: column; gap: 1.5rem;
    }

    .empty-state {
      text-align: center; padding: 3rem;
    }
    .empty-state i {
      font-size: 4rem; color: #667eea; margin-bottom: 1rem;
    }
    .empty-state h3 {
      margin: 0 0 0.5rem 0; color: #2c3e50; font-size: 1.5rem;
    }
    .empty-state p {
      margin: 0 0 2rem 0; color: #6c757d;
    }
    .suggestions {
      display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;
    }
    .suggestions :host ::ng-deep .p-chip {
      cursor: pointer; transition: transform 0.2s;
    }
    .suggestions :host ::ng-deep .p-chip:hover {
      transform: translateY(-2px);
    }

    .message {
      display: flex; gap: 1rem; animation: fadeIn 0.3s;
    }
    .message.USER { flex-direction: row-reverse; }

    .message-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .message.USER .message-avatar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .message.ASSISTANT .message-avatar {
      background: #e9ecef; color: #495057;
    }

    .message-content {
      max-width: 70%; background: white; padding: 1rem;
      border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .message.USER .message-content {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .message-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 0.5rem; font-size: 0.875rem;
    }
    .message-sender { font-weight: 600; }
    .message.USER .message-time { opacity: 0.8; }
    .message.ASSISTANT .message-time { color: #6c757d; }

    .message-text {
      line-height: 1.6; white-space: pre-wrap;
    }
    .message-text :host ::ng-deep code {
      background: rgba(0,0,0,0.1); padding: 0.2rem 0.4rem;
      border-radius: 4px; font-family: monospace;
    }
    .message-text :host ::ng-deep pre {
      background: rgba(0,0,0,0.1); padding: 1rem;
      border-radius: 8px; overflow-x: auto;
    }

    .message-metadata {
      margin-top: 0.5rem; padding-top: 0.5rem;
      border-top: 1px solid rgba(0,0,0,0.1);
      display: flex; gap: 1rem; font-size: 0.75rem;
      opacity: 0.7;
    }

    .typing {
      opacity: 0.7;
    }
    .typing-indicator {
      display: flex; gap: 0.25rem;
    }
    .typing-indicator span {
      width: 8px; height: 8px; border-radius: 50%;
      background: #667eea; animation: typing 1.4s infinite;
    }
    .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
    .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

    /* Task Notification */
    .task-notification {
      position: fixed; bottom: 120px; right: 2rem;
      background: white; padding: 1rem; border-radius: 12px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.15);
      display: flex; gap: 1rem; align-items: center;
      max-width: 400px; animation: slideIn 0.3s;
    }
    .task-icon {
      width: 40px; height: 40px; border-radius: 50%;
      background: #28a745; color: white;
      display: flex; align-items: center; justify-content: center;
    }
    .task-info strong { display: block; margin-bottom: 0.25rem; }
    .task-info p { margin: 0; color: #6c757d; font-size: 0.875rem; }
    .task-info small { color: #adb5bd; }

    /* Input Area */
    .chat-input {
      display: flex; gap: 1rem; padding: 1.5rem 2rem;
      background: white; border-top: 1px solid #e9ecef;
    }
    .chat-input textarea {
      flex: 1; resize: none; border: 2px solid #e9ecef;
      border-radius: 12px; padding: 0.75rem;
    }
    .chat-input textarea:focus {
      border-color: #667eea;
    }
    .send-button {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border: none; border-radius: 12px; padding: 0 2rem;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideIn {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }

    @keyframes typing {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-10px); }
    }
  `]
})
export class DeveloperChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  conversationId = '';
  userId = 'current-user-id'; // TODO: Get from auth service
  messages: any[] = [];
  userMessage = '';
  isSending = false;
  isTyping = false;
  lastCreatedTask: any = null;
  shouldScroll = false;

  stats = {
    totalConversations: 0,
    completedTasks: 0,
    pendingTasks: 0,
  };

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadOrCreateConversation();
    this.loadStats();
  }

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  async loadOrCreateConversation() {
    try {
      // محاولة الحصول على آخر محادثة
      const conversations = await this.http.get<any[]>(
        `/api/developer-system/conversations/user/${this.userId}`
      ).toPromise();

      if (conversations && conversations.length > 0) {
        this.conversationId = conversations[0].id;
        await this.loadConversation();
      } else {
        await this.newConversation();
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
      await this.newConversation();
    }
  }

  async newConversation() {
    try {
      const conversation = await this.http.post<any>(
        '/api/developer-system/conversations',
        { userId: this.userId, title: 'محادثة جديدة' }
      ).toPromise();

      this.conversationId = conversation.id;
      this.messages = [];
      this.lastCreatedTask = null;
    } catch (error) {
      console.error('Error creating conversation:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'فشل إنشاء محادثة جديدة'
      });
    }
  }

  async loadConversation() {
    try {
      const conversation = await this.http.get<any>(
        `/api/developer-system/conversations/${this.conversationId}`
      ).toPromise();

      this.messages = conversation.messages;
      this.shouldScroll = true;
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  }

  async loadStats() {
    try {
      const stats = await this.http.get<any>(
        `/api/developer-system/analytics/stats?userId=${this.userId}`
      ).toPromise();

      this.stats = {
        totalConversations: stats.totalConversations,
        completedTasks: stats.tasksByStatus.find((t: any) => t.status === 'COMPLETED')?._count || 0,
        pendingTasks: stats.tasksByStatus.find((t: any) => t.status === 'PENDING')?._count || 0,
      };
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  async sendMessage() {
    if (!this.userMessage.trim() || this.isSending) return;

    const message = this.userMessage.trim();
    this.userMessage = '';
    this.isSending = true;
    this.isTyping = true;

    // إضافة رسالة المستخدم مباشرة
    this.messages.push({
      role: 'USER',
      content: message,
      createdAt: new Date(),
    });
    this.shouldScroll = true;

    try {
      const response = await this.http.post<any>('/api/developer-system/chat', {
        conversationId: this.conversationId,
        userId: this.userId,
        message,
      }).toPromise();

      // إضافة رد المطور
      this.messages.push({
        role: 'ASSISTANT',
        content: response.message,
        createdAt: new Date(),
        metadata: {
          tokensUsed: response.tokensUsed,
          processingTime: response.processingTime,
        },
      });

      // عرض المهمة إذا تم إنشاؤها
      if (response.task) {
        this.lastCreatedTask = response.task;
        setTimeout(() => {
          this.lastCreatedTask = null;
        }, 10000);
      }

      this.shouldScroll = true;
      await this.loadStats();
    } catch (error) {
      console.error('Error sending message:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'خطأ',
        detail: 'فشل إرسال الرسالة'
      });
    } finally {
      this.isSending = false;
      this.isTyping = false;
    }
  }

  sendSuggestion(suggestion: string) {
    this.userMessage = suggestion;
    this.sendMessage();
  }

  onEnterPress(event: any) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatMessage(content: string): string {
    // تنسيق بسيط للرسائل
    return content
      .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br>');
  }

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = 
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) { console.error(err); }
  }

  showConversations() {
    this.messageService.add({
      severity: 'info',
      summary: 'قريباً',
      detail: 'سيتم إضافة قائمة المحادثات قريباً'
    });
  }

  showSettings() {
    this.messageService.add({
      severity: 'info',
      summary: 'قريباً',
      detail: 'سيتم إضافة صفحة الإعدادات قريباً'
    });
  }
}
