// PHASE: DTO_QUALITY_FIX
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerContactController } from './customer-contact.controller';
import { CustomerContactService } from './customer-contact.service';
import { CustomerContact } from './customer-contact.entity';
import { } from '@semop/contracts';


@Module({
  imports: [TypeOrmModule.forFeature([CustomerContact])],
  controllers: [CustomerContactController],
  providers: [CustomerContactService],
  exports: [CustomerContactService], // لتصدير الخدمة إذا كانت ستستخدم في وحدات أخرى
})
export class CustomerContactModule {}
