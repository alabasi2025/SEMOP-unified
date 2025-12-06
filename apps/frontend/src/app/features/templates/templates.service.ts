import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
// يجب أن يكون هذا الاستيراد متاحًا بعد تثبيت shared-contracts-repo
import { CreateTemplateDto } from 'semop-contracts/dtos/templates'; 

@Injectable({
  providedIn: 'root'
})
export class TemplatesService {

  constructor() { }

  /**
   * محاكاة لإنشاء قالب جديد.
   * @param templateData بيانات القالب المراد إنشاؤه.
   * @returns Observable يشير إلى نجاح العملية.
   */
  createTemplate(templateData: CreateTemplateDto): Observable<any> {
    console.log('Mock API Call: Creating Template with data:', templateData);
    
    // محاكاة استجابة ناجحة من الخادم بعد تأخير بسيط
    return of({
      success: true,
      message: `Template '${templateData.name}' created successfully (Mocked ID: ${Math.floor(Math.random() * 1000)})`
    }).pipe(
      delay(1000), // تأخير لمدة ثانية واحدة لمحاكاة استجابة الشبكة
      tap(response => console.log('Mock API Response:', response))
    );
  }
}
