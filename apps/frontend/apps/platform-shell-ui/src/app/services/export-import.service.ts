import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { 
  Notebook, 
  Page, 
  Section, 
  Idea, 
  Task, 
  StickyNote,
  MagicNotebookService 
} from './magic-notebook.service';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NotebookExport {
  notebook: Notebook;
  pages: Page[];
  sections: Section[];
  ideas: Idea[];
  tasks: Task[];
  stickyNotes: StickyNote[];
  exportDate: string;
  version: string;
}

@Injectable({
  providedIn: 'root'
})
export class ExportImportService {

  constructor(private notebookService: MagicNotebookService) {}

  /**
   * Export notebook as JSON
   */
  exportNotebookAsJSON(notebookId: string): Observable<void> {
    return forkJoin({
      notebook: this.notebookService.getNotebook(notebookId),
      pages: this.notebookService.getPages(notebookId),
      sections: this.notebookService.getSections(notebookId),
      ideas: this.notebookService.getIdeas(notebookId),
      tasks: this.notebookService.getTasks(notebookId),
      stickyNotes: this.notebookService.getStickyNotes(notebookId)
    }).pipe(
      map(data => {
        const exportData: NotebookExport = {
          ...data,
          exportDate: new Date().toISOString(),
          version: '1.0.0'
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
          type: 'application/json' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.notebook.title}_${new Date().getTime()}.json`;
        link.click();
        window.URL.revokeObjectURL(url);
      })
    );
  }

  /**
   * Export notebook as PDF
   */
  async exportNotebookAsPDF(notebookId: string): Promise<void> {
    try {
      // Get all notebook data
      const notebook = await this.notebookService.getNotebook(notebookId).toPromise();
      const pages = await this.notebookService.getPages(notebookId).toPromise();
      
      if (!notebook || !pages) {
        throw new Error('فشل في تحميل بيانات الدفتر');
      }

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Add Arabic font support (using default for now)
      pdf.setFont('helvetica');
      pdf.setFontSize(16);

      // Add title page
      pdf.text(notebook.title, 105, 30, { align: 'center' });
      
      if (notebook.description) {
        pdf.setFontSize(12);
        pdf.text(notebook.description, 105, 45, { align: 'center' });
      }

      pdf.setFontSize(10);
      pdf.text(`تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}`, 105, 60, { align: 'center' });
      pdf.text(`عدد الصفحات: ${pages.length}`, 105, 70, { align: 'center' });

      // Add pages
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        
        pdf.addPage();
        
        // Page title
        pdf.setFontSize(14);
        pdf.text(page.title, 20, 20);
        
        // Page content (strip HTML tags)
        pdf.setFontSize(11);
        const plainText = this.stripHtml(page.content);
        const lines = pdf.splitTextToSize(plainText, 170);
        pdf.text(lines, 20, 35);
        
        // Page footer
        pdf.setFontSize(8);
        pdf.text(`الصفحة ${i + 1} من ${pages.length}`, 105, 285, { align: 'center' });
      }

      // Save PDF
      pdf.save(`${notebook.title}_${new Date().getTime()}.pdf`);
      
    } catch (error) {
      console.error('خطأ في تصدير PDF:', error);
      throw error;
    }
  }

  /**
   * Export single page as PDF
   */
  async exportPageAsPDF(pageId: string): Promise<void> {
    try {
      const page = await this.notebookService.getPage(pageId).toPromise();
      
      if (!page) {
        throw new Error('فشل في تحميل الصفحة');
      }

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      pdf.setFont('helvetica');
      
      // Page title
      pdf.setFontSize(16);
      pdf.text(page.title, 105, 20, { align: 'center' });
      
      // Page content
      pdf.setFontSize(11);
      const plainText = this.stripHtml(page.content);
      const lines = pdf.splitTextToSize(plainText, 170);
      pdf.text(lines, 20, 35);
      
      // Footer
      pdf.setFontSize(8);
      pdf.text(`تاريخ التصدير: ${new Date().toLocaleDateString('ar-SA')}`, 105, 285, { align: 'center' });

      pdf.save(`${page.title}_${new Date().getTime()}.pdf`);
      
    } catch (error) {
      console.error('خطأ في تصدير PDF:', error);
      throw error;
    }
  }

  /**
   * Export page with HTML rendering (better quality)
   */
  async exportPageAsAdvancedPDF(elementId: string, fileName: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      
      if (!element) {
        throw new Error('العنصر غير موجود');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 210; // A4 width in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= 297; // A4 height in mm

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= 297;
      }

      pdf.save(`${fileName}_${new Date().getTime()}.pdf`);
      
    } catch (error) {
      console.error('خطأ في تصدير PDF المتقدم:', error);
      throw error;
    }
  }

  /**
   * Import notebook from JSON
   */
  async importNotebookFromJSON(file: File): Promise<NotebookExport> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data: NotebookExport = JSON.parse(content);
          
          // Validate data structure
          if (!data.notebook || !data.version) {
            throw new Error('ملف JSON غير صالح');
          }
          
          resolve(data);
        } catch (error) {
          reject(new Error('فشل في قراءة الملف'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('فشل في قراءة الملف'));
      };
      
      reader.readAsText(file);
    });
  }

  /**
   * Create notebook from imported data
   */
  async createNotebookFromImport(importData: NotebookExport): Promise<string> {
    try {
      // Create notebook
      const newNotebook = await this.notebookService.createNotebook({
        title: `${importData.notebook.title} (مستورد)`,
        description: importData.notebook.description,
        icon: importData.notebook.icon,
        color: importData.notebook.color
      }).toPromise();

      if (!newNotebook) {
        throw new Error('فشل في إنشاء الدفتر');
      }

      const notebookId = newNotebook.id;

      // Create sections
      if (importData.sections && importData.sections.length > 0) {
        for (const section of importData.sections) {
          await this.notebookService.createSection({
            title: section.title,
            description: section.description,
            notebookId: notebookId,
            order: section.order,
            color: section.color
          }).toPromise();
        }
      }

      // Create pages
      if (importData.pages && importData.pages.length > 0) {
        for (const page of importData.pages) {
          await this.notebookService.createPage({
            title: page.title,
            content: page.content,
            notebookId: notebookId,
            order: page.order
          }).toPromise();
        }
      }

      // Create ideas
      if (importData.ideas && importData.ideas.length > 0) {
        for (const idea of importData.ideas) {
          await this.notebookService.createIdea({
            title: idea.title,
            description: idea.description,
            notebookId: notebookId,
            status: idea.status,
            priority: idea.priority,
            tags: idea.tags
          }).toPromise();
        }
      }

      // Create tasks
      if (importData.tasks && importData.tasks.length > 0) {
        for (const task of importData.tasks) {
          await this.notebookService.createTask({
            title: task.title,
            description: task.description,
            notebookId: notebookId,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate
          }).toPromise();
        }
      }

      // Create sticky notes
      if (importData.stickyNotes && importData.stickyNotes.length > 0) {
        for (const note of importData.stickyNotes) {
          await this.notebookService.createStickyNote({
            content: note.content,
            notebookId: notebookId,
            color: note.color
          }).toPromise();
        }
      }

      return notebookId;
      
    } catch (error) {
      console.error('خطأ في استيراد الدفتر:', error);
      throw error;
    }
  }

  /**
   * Helper: Strip HTML tags from content
   */
  private stripHtml(html: string): string {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  }

  /**
   * Helper: Download text file
   */
  private downloadFile(content: string, fileName: string, mimeType: string) {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
