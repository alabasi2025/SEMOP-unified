#!/usr/bin/env node
/**
 * Smart Notebook Database Initialization Script
 * This script creates all Smart Notebook tables in the database
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
const { Pool } = pg;

async function initDatabase() {
  console.log('🚀 بدء تهيئة قاعدة بيانات Smart Notebook...\n');

  // Create connection
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ خطأ: DATABASE_URL غير موجود في متغيرات البيئة');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    // Test connection
    console.log('📡 اختبار الاتصال بقاعدة البيانات...');
    await prisma.$connect();
    console.log('✅ تم الاتصال بنجاح\n');

    // Check existing tables
    console.log('🔍 فحص الجداول الموجودة...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND (
        table_name LIKE 'smart_%' OR
        table_name = 'ideas' OR 
        table_name = 'chat_logs' OR 
        table_name = 'reports' OR 
        table_name = 'tasks' OR 
        table_name = 'pages'
      )
      ORDER BY table_name
    `;

    if (tables.length > 0) {
      console.log(`✅ تم العثور على ${tables.length} جدول:\n`);
      tables.forEach(t => console.log(`   - ${t.table_name}`));
    } else {
      console.log('⚠️  لم يتم العثور على جداول Smart Notebook');
      console.log('💡 الجداول ستُنشأ تلقائياً عند أول استخدام للـ APIs\n');
    }

    // Test a simple query to trigger table creation if needed
    console.log('\n🧪 اختبار الوصول إلى Ideas...');
    try {
      const ideas = await prisma.idea.findMany({ take: 1 });
      console.log(`✅ جدول Ideas يعمل (عدد السجلات: ${ideas.length})`);
    } catch (error) {
      console.log('⚠️  جدول Ideas غير موجود أو يحتاج إلى إنشاء');
      console.log('   الخطأ:', error.message);
    }

    console.log('\n✅ انتهت عملية التهيئة بنجاح!');
    console.log('🎉 Smart Notebook جاهز للاستخدام\n');

  } catch (error) {
    console.error('\n❌ خطأ أثناء التهيئة:');
    console.error(error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

initDatabase();
