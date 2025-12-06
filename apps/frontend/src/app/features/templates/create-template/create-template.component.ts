import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { TemplatesService } from '../templates.service';
import { CreateTemplateDto } from 'semop-contracts/dtos/templates'; // افتراض توفر الحزمة

@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.scss']
})
export class CreateTemplateComponent implements OnInit {
  templateForm: FormGroup;
  isLoading = false;
  submissionMessage: { type: 'success' | 'error', message: string } | null = null;

  constructor(private fb: FormBuilder, private templatesService: TemplatesService) {
    this.templateForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      type: ['', Validators.required],
      content: ['', [Validators.required, this.jsonValidator]] // تم تغيير القيمة الافتراضية إلى سلسلة فارغة وإضافة مدقق JSON
    });
  }

  // مدقق مخصص للتحقق من أن القيمة هي JSON صالح
  jsonValidator(control: AbstractControl): ValidationErrors | null {
    try {
      JSON.parse(control.value);
    } catch (e) {
      return { invalidJson: true };
    }
    return null;
  }

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.submissionMessage = null;
    if (this.templateForm.valid) {
      this.isLoading = true;
      const formValue = this.templateForm.value;
      
      // تحويل محتوى JSON من سلسلة نصية إلى كائن
      const templateData: CreateTemplateDto = {
        ...formValue,
        content: JSON.parse(formValue.content)
      };

      this.templatesService.createTemplate(templateData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.submissionMessage = { type: 'success', message: response.message };
          this.templateForm.reset({ name: '', description: '', type: '', content: '' });
        },
        error: (err) => {
          this.isLoading = false;
          this.submissionMessage = { type: 'error', message: 'فشل في إنشاء القالب. يرجى المحاولة مرة أخرى.' };
          console.error('Submission Error', err);
        }
      });
    }
  }
}
