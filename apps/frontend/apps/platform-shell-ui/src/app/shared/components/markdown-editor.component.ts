import { Component, Input, Output, EventEmitter, forwardRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'app-markdown-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MarkdownEditorComponent),
      multi: true
    }
  ],
  templateUrl: './markdown-editor.component.html',
  styleUrls: ['./markdown-editor.component.css']
})
export class MarkdownEditorComponent implements ControlValueAccessor {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  @Input() height = 400;
  @Output() valueChange = new EventEmitter<string>();

  value = '';
  viewMode: 'edit' | 'split' | 'preview' = 'split';

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(value: string): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = (value: string) => {
      fn(value);
      this.valueChange.emit(value);
    };
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  insertMarkdown(before: string, after: string): void {
    if (!this.isBrowser) {
      return;
    }

    const textarea = document.querySelector('.editor-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = this.value.substring(start, end);
    const newText = this.value.substring(0, start) + before + selectedText + after + this.value.substring(end);
    
    this.value = newText;
    this.onChange(this.value);

    // setTimeout is generally safe, but the DOM manipulation inside it must be guarded.
    // Since we already guarded the whole method, this is fine.
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  }
}