import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { CreateTemplateComponent } from './create-template/create-template.component';

const routes: Routes = [
  {
    path: 'create',
    component: CreateTemplateComponent,
    data: { title: 'إنشاء قالب جديد' }
  },
  // يمكن إضافة مسارات أخرى هنا
];

@NgModule({
  declarations: [
    CreateTemplateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ]
})
export class TemplatesModule { }
