import { Component, forwardRef, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditorModule } from 'primeng/editor';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, EditorModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ],
  template: `
    <div class="rich-text-editor-container">
      <p-editor 
        [(ngModel)]="value" 
        [style]="{'height': height}"
        (onTextChange)="onContentChange($event)"
        [placeholder]="placeholder">
        <ng-template pTemplate="header">
          <span class="ql-formats">
            <button type="button" class="ql-bold" aria-label="Bold"></button>
            <button type="button" class="ql-italic" aria-label="Italic"></button>
            <button type="button" class="ql-underline" aria-label="Underline"></button>
            <button type="button" class="ql-strike" aria-label="Strike"></button>
          </span>
          <span class="ql-formats">
            <select class="ql-header">
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option selected>Normal</option>
            </select>
          </span>
          <span class="ql-formats">
            <button type="button" class="ql-list" value="ordered" aria-label="Ordered List"></button>
            <button type="button" class="ql-list" value="bullet" aria-label="Unordered List"></button>
            <select class="ql-align">
              <option selected></option>
              <option value="center"></option>
              <option value="right"></option>
              <option value="justify"></option>
            </select>
          </span>
          <span class="ql-formats">
            <button type="button" class="ql-link" aria-label="Insert Link"></button>
            <button type="button" class="ql-image" aria-label="Insert Image"></button>
            <button type="button" class="ql-code-block" aria-label="Insert Code Block"></button>
          </span>
          <span class="ql-formats">
            <button type="button" class="ql-clean" aria-label="Remove Styles"></button>
          </span>
        </ng-template>
      </p-editor>
      <div class="editor-footer" *ngIf="showWordCount">
        <small>عدد الكلمات: {{ wordCount }} | عدد الأحرف: {{ charCount }}</small>
      </div>
    </div>
  `,
  styles: [`
    .rich-text-editor-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .editor-footer {
      padding: 0.5rem 1rem;
      background: #f8f9fa;
      border-top: 1px solid #ddd;
      text-align: right;
      color: #6c757d;
    }
    ::ng-deep .p-editor-container .p-editor-toolbar {
      background: #f8f9fa;
      border-bottom: 1px solid #ddd;
    }
    ::ng-deep .p-editor-container .p-editor-content {
      border: none;
    }
    ::ng-deep .p-editor-container .p-editor-content .ql-editor {
      font-size: 1rem;
      line-height: 1.6;
    }
    ::ng-deep .p-editor-container .ql-editor.ql-blank::before {
      color: #999;
      font-style: normal;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class RichTextEditorComponent implements ControlValueAccessor, OnInit {
	  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
  @Input() placeholder = 'اكتب هنا...';
  @Input() height = '300px';
  @Input() showWordCount = true;

  value: string = '';
  wordCount = 0;
  charCount = 0;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  ngOnInit() {
    this.updateCounts();
  }

  onContentChange(event: any) {
    this.updateCounts();
    this.onChange(this.value);
    this.onTouched();
  }

  updateCounts() {
    const text = this.stripHtml(this.value || '');
    this.charCount = text.length;
    this.wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  }

  stripHtml(html: string): string {
    if (isPlatformBrowser(this.platformId)) {
      const tmp = document.createElement('DIV');
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || '';
    }
    return html; // Return original HTML or an empty string if not in browser (SSR)
  }

  writeValue(value: any): void {
    this.value = value || '';
    this.updateCounts();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state if needed
  }
}