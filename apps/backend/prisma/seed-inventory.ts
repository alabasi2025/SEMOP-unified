import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedInventory() {
  console.log('🌱 Starting inventory seed...');

  // Seed Units (الوحدات)
  console.log('📦 Seeding units...');
  const units = [
    { code: 'KG', nameAr: 'كيلوجرام', nameEn: 'Kilogram', symbol: 'كجم', isActive: true },
    { code: 'G', nameAr: 'جرام', nameEn: 'Gram', symbol: 'جم', isActive: true },
    { code: 'L', nameAr: 'لتر', nameEn: 'Liter', symbol: 'ل', isActive: true },
    { code: 'ML', nameAr: 'ملليلتر', nameEn: 'Milliliter', symbol: 'مل', isActive: true },
    { code: 'M', nameAr: 'متر', nameEn: 'Meter', symbol: 'م', isActive: true },
    { code: 'CM', nameAr: 'سنتيمتر', nameEn: 'Centimeter', symbol: 'سم', isActive: true },
    { code: 'PCS', nameAr: 'قطعة', nameEn: 'Piece', symbol: 'قطعة', isActive: true },
    { code: 'BOX', nameAr: 'صندوق', nameEn: 'Box', symbol: 'صندوق', isActive: true },
    { code: 'PACK', nameAr: 'عبوة', nameEn: 'Package', symbol: 'عبوة', isActive: true },
    { code: 'CARTON', nameAr: 'كرتونة', nameEn: 'Carton', symbol: 'كرتونة', isActive: true },
    { code: 'DOZEN', nameAr: 'دزينة', nameEn: 'Dozen', symbol: 'دزينة', isActive: true },
    { code: 'TON', nameAr: 'طن', nameEn: 'Ton', symbol: 'طن', isActive: true },
  ];

  for (const unit of units) {
    await prisma.unit.upsert({
      where: { code: unit.code },
      update: unit,
      create: unit,
    });
  }
  console.log(`✅ Created ${units.length} units`);

  // Seed Item Categories (تصنيفات الأصناف)
  console.log('📂 Seeding item categories...');
  const categories = [
    { code: 'RAW', nameAr: 'مواد خام', nameEn: 'Raw Materials', description: 'المواد الخام المستخدمة في الإنتاج', isActive: true },
    { code: 'FIN', nameAr: 'منتجات نهائية', nameEn: 'Finished Products', description: 'المنتجات الجاهزة للبيع', isActive: true },
    { code: 'SEMI', nameAr: 'منتجات نصف مصنعة', nameEn: 'Semi-Finished Products', description: 'منتجات في مراحل الإنتاج', isActive: true },
    { code: 'SPARE', nameAr: 'قطع غيار', nameEn: 'Spare Parts', description: 'قطع الغيار والصيانة', isActive: true },
    { code: 'PACK', nameAr: 'مواد تعبئة وتغليف', nameEn: 'Packaging Materials', description: 'مواد التعبئة والتغليف', isActive: true },
    { code: 'CONS', nameAr: 'مواد استهلاكية', nameEn: 'Consumables', description: 'المواد الاستهلاكية', isActive: true },
    { code: 'OFFICE', nameAr: 'لوازم مكتبية', nameEn: 'Office Supplies', description: 'اللوازم المكتبية', isActive: true },
    { code: 'CLEAN', nameAr: 'مواد تنظيف', nameEn: 'Cleaning Supplies', description: 'مواد ومعدات التنظيف', isActive: true },
  ];

  for (const category of categories) {
    await prisma.itemCategory.upsert({
      where: { code: category.code },
      update: category,
      create: category,
    });
  }
  console.log(`✅ Created ${categories.length} item categories`);

  console.log('🎉 Inventory seed completed successfully!');
}

seedInventory()
  .catch((e) => {
    console.error('❌ Error seeding inventory:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
