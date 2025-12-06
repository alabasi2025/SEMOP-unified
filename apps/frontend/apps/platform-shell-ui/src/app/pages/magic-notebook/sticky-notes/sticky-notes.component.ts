import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { MagicNotebookService, StickyNote } from '../../../services/magic-notebook.service';

@Component({
  selector: 'app-sticky-notes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sticky-notes.component.html',
  styleUrls: ['./sticky-notes.component.css']
})
export class StickyNotesComponent implements OnInit, OnDestroy {
  notes: StickyNote[] = [];
  loading = false;
  error: string | null = null;
  notebookId: string = '';
  
  editingNote: StickyNote | null = null;
  editForm = {
    content: '',
    color: '#fef08a'
  };
  
  colors = [
    { name: 'أصفر', value: '#fef08a' },
    { name: 'وردي', value: '#fbcfe8' },
    { name: 'أزرق', value: '#bfdbfe' },
    { name: 'أخضر', value: '#bbf7d0' },
    { name: 'برتقالي', value: '#fed7aa' },
    { name: 'بنفسجي', value: '#ddd6fe' }
  ];
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notebookService: MagicNotebookService
  ) {}
  
  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      this.notebookId = params['id'];
      if (this.notebookId) {
        this.loadNotes();
      }
    });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  loadNotes(): void {
    this.loading = true;
    this.error = null;
    
    this.notebookService.getStickyNotes(this.notebookId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (notes) => {
          this.notes = notes;
          this.loading = false;
        },
        error: (err) => {
          this.error = err.message || 'فشل تحميل الملاحظات';
          this.loading = false;
        }
      });
  }
  
  createNote(): void {
    this.editingNote = null;
    this.editForm = {
      content: '',
      color: '#fef08a'
    };
  }
  
  saveNote(): void {
    if (!this.editForm.content.trim()) {
      alert('الرجاء إدخال محتوى الملاحظة');
      return;
    }
    
    this.loading = true;
    
    if (this.editingNote) {
      this.notebookService.updateStickyNote(this.editingNote.id, this.editForm)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updated) => {
            const index = this.notes.findIndex(n => n.id === updated.id);
            if (index !== -1) {
              this.notes[index] = updated;
            }
            this.editingNote = null;
            this.loading = false;
          },
          error: (err) => {
            alert('فشل حفظ الملاحظة: ' + err.message);
            this.loading = false;
          }
        });
    } else {
      this.notebookService.createStickyNote({
        ...this.editForm,
        notebookId: this.notebookId
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (note) => {
          this.notes.push(note);
          this.editingNote = null;
          this.loading = false;
        },
        error: (err) => {
          alert('فشل إنشاء الملاحظة: ' + err.message);
          this.loading = false;
        }
      });
    }
  }
  
  editNote(note: StickyNote): void {
    this.editingNote = note;
    this.editForm = {
      content: note.content,
      color: note.color
    };
  }
  
  deleteNote(note: StickyNote, event: Event): void {
    event.stopPropagation();
    
    if (!confirm('هل أنت متأكد من حذف هذه الملاحظة؟')) return;
    
    this.loading = true;
    this.notebookService.deleteStickyNote(note.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notes = this.notes.filter(n => n.id !== note.id);
          this.loading = false;
        },
        error: (err) => {
          alert('فشل حذف الملاحظة: ' + err.message);
          this.loading = false;
        }
      });
  }
  
  cancelEdit(): void {
    this.editingNote = null;
  }
  
  goBack(): void {
    this.router.navigate(['/magic-notebook', this.notebookId]);
  }
}
