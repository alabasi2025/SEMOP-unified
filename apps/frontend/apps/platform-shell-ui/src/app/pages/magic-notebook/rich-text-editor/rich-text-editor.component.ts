import { Component, Input, Output, EventEmitter, OnInit, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import Quill from 'quill';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, QuillModule],
  templateUrl: './rich-text-editor.component.html',
  styleUrls: ['./rich-text-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true
    }
  ]
})
export class RichTextEditorComponent implements OnInit, ControlValueAccessor {
  @Input() placeholder = 'ابدأ الكتابة هنا...';
  @Input() height = '400px';
  @Input() readOnly = false;
  @Output() contentChange = new EventEmitter<string>();

  content = '';
  quillInstance?: Quill;

  // Quill configuration with RTL support
  quillModules = {
    toolbar: [
      [{ 'direction': 'rtl' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ]
  };

  quillFormats = [
    'direction',
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'color',
    'background',
    'script',
    'list',
    'bullet',
    'indent',
    'align',
    'blockquote',
    'code-block',
    'link',
    'image',
    'video'
  ];

  // ControlValueAccessor implementation
  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit() {
    // Set default RTL direction
    if (!this.content) {
      this.content = '<p dir="rtl"></p>';
    }
  }

  onEditorCreated(quill: Quill) {
    this.quillInstance = quill;
    
    // Set RTL as default
    const editor = quill.root;
    editor.setAttribute('dir', 'rtl');
  }

  onContentChanged(event: any) {
    const html = event.html || '';
    this.content = html;
    this.onChange(html);
    this.contentChange.emit(html);
  }

  // ControlValueAccessor methods
  writeValue(value: string): void {
    this.content = value || '<p dir="rtl"></p>';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.readOnly = isDisabled;
  }

  // Helper methods
  getPlainText(): string {
    if (this.quillInstance) {
      return this.quillInstance.getText();
    }
    return '';
  }

  getWordCount(): number {
    const text = this.getPlainText().trim();
    if (!text) return 0;
    return text.split(/\s+/).length;
  }

  clear() {
    this.content = '<p dir="rtl"></p>';
    this.onChange(this.content);
    this.contentChange.emit(this.content);
  }

  focus() {
    if (this.quillInstance) {
      this.quillInstance.focus();
    }
  }
}
