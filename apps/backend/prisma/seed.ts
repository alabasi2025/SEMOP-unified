import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // إنشاء المستودعات
  console.log('📦 Creating warehouses...');
  const mainWarehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-001' },
    update: {},
    create: {
      code: 'WH-001',
      nameAr: 'المستودع الرئيسي',
      nameEn: 'Main Warehouse',
      location: 'صنعاء - شارع الزبيري',
      isActive: true,
    },
  });

  const secondaryWarehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-002' },
    update: {},
    create: {
      code: 'WH-002',
      nameAr: 'المستودع الفرعي',
      nameEn: 'Secondary Warehouse',
      location: 'عدن - المعلا',
      isActive: true,
    },
  });

  const sparePartsWarehouse = await prisma.warehouse.upsert({
    where: { code: 'WH-003' },
    update: {},
    create: {
      code: 'WH-003',
      nameAr: 'مستودع قطع الغيار',
      nameEn: 'Spare Parts Warehouse',
      location: 'تعز - الحوبان',
      isActive: true,
    },
  });

  console.log(`✅ Created ${3} warehouses`);

  // إنشاء الأصناف
  console.log('📝 Creating items...');
  
  const laptop = await prisma.item.upsert({
    where: { code: 'ITEM-001' },
    update: {},
    create: {
      code: 'ITEM-001',
      nameAr: 'لابتوب ديل Latitude 5420',
      nameEn: 'Dell Latitude 5420 Laptop',
      description: 'لابتوب ديل للأعمال - معالج i5 - رام 16GB - SSD 512GB',
      barcode: '1234567890123',
      sku: 'DELL-LAT-5420',
      minStock: 5,
      maxStock: 50,
      reorderPoint: 10,
      costPrice: 500000,
      sellingPrice: 650000,
      isActive: true,
    },
  });

  const printer = await prisma.item.upsert({
    where: { code: 'ITEM-002' },
    update: {},
    create: {
      code: 'ITEM-002',
      nameAr: 'طابعة HP LaserJet Pro',
      nameEn: 'HP LaserJet Pro Printer',
      description: 'طابعة ليزر أبيض وأسود - سرعة 30 صفحة/دقيقة',
      barcode: '1234567890124',
      sku: 'HP-LJ-PRO',
      minStock: 3,
      maxStock: 20,
      reorderPoint: 5,
      costPrice: 150000,
      sellingPrice: 200000,
      isActive: true,
    },
  });

  const monitor = await prisma.item.upsert({
    where: { code: 'ITEM-003' },
    update: {},
    create: {
      code: 'ITEM-003',
      nameAr: 'شاشة Dell 24 بوصة',
      nameEn: 'Dell 24" Monitor',
      description: 'شاشة Dell Full HD - 24 بوصة - IPS',
      barcode: '1234567890125',
      sku: 'DELL-MON-24',
      minStock: 10,
      maxStock: 100,
      reorderPoint: 20,
      costPrice: 80000,
      sellingPrice: 110000,
      isActive: true,
    },
  });

  const keyboard = await prisma.item.upsert({
    where: { code: 'ITEM-004' },
    update: {},
    create: {
      code: 'ITEM-004',
      nameAr: 'لوحة مفاتيح Logitech',
      nameEn: 'Logitech Keyboard',
      description: 'لوحة مفاتيح لاسلكية - عربي/إنجليزي',
      barcode: '1234567890126',
      sku: 'LOG-KB-001',
      minStock: 20,
      maxStock: 200,
      reorderPoint: 40,
      costPrice: 15000,
      sellingPrice: 25000,
      isActive: true,
    },
  });

  const mouse = await prisma.item.upsert({
    where: { code: 'ITEM-005' },
    update: {},
    create: {
      code: 'ITEM-005',
      nameAr: 'ماوس Logitech لاسلكي',
      nameEn: 'Logitech Wireless Mouse',
      description: 'ماوس لاسلكي - دقة عالية',
      barcode: '1234567890127',
      sku: 'LOG-MS-001',
      minStock: 30,
      maxStock: 300,
      reorderPoint: 60,
      costPrice: 8000,
      sellingPrice: 15000,
      isActive: true,
    },
  });

  const usbCable = await prisma.item.upsert({
    where: { code: 'ITEM-006' },
    update: {},
    create: {
      code: 'ITEM-006',
      nameAr: 'كابل USB Type-C',
      nameEn: 'USB Type-C Cable',
      description: 'كابل USB-C - طول 1 متر - شحن سريع',
      barcode: '1234567890128',
      sku: 'USB-C-1M',
      minStock: 50,
      maxStock: 500,
      reorderPoint: 100,
      costPrice: 2000,
      sellingPrice: 4000,
      isActive: true,
    },
  });

  const hdmiCable = await prisma.item.upsert({
    where: { code: 'ITEM-007' },
    update: {},
    create: {
      code: 'ITEM-007',
      nameAr: 'كابل HDMI',
      nameEn: 'HDMI Cable',
      description: 'كابل HDMI - طول 2 متر - 4K',
      barcode: '1234567890129',
      sku: 'HDMI-2M',
      minStock: 40,
      maxStock: 400,
      reorderPoint: 80,
      costPrice: 3000,
      sellingPrice: 6000,
      isActive: true,
    },
  });

  const externalHDD = await prisma.item.upsert({
    where: { code: 'ITEM-008' },
    update: {},
    create: {
      code: 'ITEM-008',
      nameAr: 'هارد خارجي Seagate 1TB',
      nameEn: 'Seagate External HDD 1TB',
      description: 'هارد ديسك خارجي - 1 تيرابايت - USB 3.0',
      barcode: '1234567890130',
      sku: 'SEA-HDD-1TB',
      minStock: 8,
      maxStock: 80,
      reorderPoint: 15,
      costPrice: 40000,
      sellingPrice: 60000,
      isActive: true,
    },
  });

  const webcam = await prisma.item.upsert({
    where: { code: 'ITEM-009' },
    update: {},
    create: {
      code: 'ITEM-009',
      nameAr: 'كاميرا ويب Logitech HD',
      nameEn: 'Logitech HD Webcam',
      description: 'كاميرا ويب - دقة 1080p - ميكروفون مدمج',
      barcode: '1234567890131',
      sku: 'LOG-CAM-HD',
      minStock: 5,
      maxStock: 50,
      reorderPoint: 10,
      costPrice: 35000,
      sellingPrice: 55000,
      isActive: true,
    },
  });

  const headset = await prisma.item.upsert({
    where: { code: 'ITEM-010' },
    update: {},
    create: {
      code: 'ITEM-010',
      nameAr: 'سماعة رأس بميكروفون',
      nameEn: 'Headset with Microphone',
      description: 'سماعة رأس احترافية - ميكروفون قابل للإزالة',
      barcode: '1234567890132',
      sku: 'HEAD-MIC-001',
      minStock: 10,
      maxStock: 100,
      reorderPoint: 20,
      costPrice: 25000,
      sellingPrice: 40000,
      isActive: true,
    },
  });

  console.log(`✅ Created ${10} items`);

  // إضافة مخزون أولي للمستودع الرئيسي
  console.log('📊 Adding initial stock to main warehouse...');
  
  const warehouseItems = [
    { itemId: laptop.id, warehouseId: mainWarehouse.id, quantity: 15 },
    { itemId: printer.id, warehouseId: mainWarehouse.id, quantity: 8 },
    { itemId: monitor.id, warehouseId: mainWarehouse.id, quantity: 45 },
    { itemId: keyboard.id, warehouseId: mainWarehouse.id, quantity: 120 },
    { itemId: mouse.id, warehouseId: mainWarehouse.id, quantity: 150 },
    { itemId: usbCable.id, warehouseId: mainWarehouse.id, quantity: 300 },
    { itemId: hdmiCable.id, warehouseId: mainWarehouse.id, quantity: 200 },
    { itemId: externalHDD.id, warehouseId: mainWarehouse.id, quantity: 25 },
    { itemId: webcam.id, warehouseId: mainWarehouse.id, quantity: 12 },
    { itemId: headset.id, warehouseId: mainWarehouse.id, quantity: 35 },
  ];

  for (const item of warehouseItems) {
    await prisma.warehouseItem.upsert({
      where: {
        warehouseId_itemId: {
          warehouseId: item.warehouseId,
          itemId: item.itemId,
        },
      },
      update: { quantity: item.quantity },
      create: item,
    });
  }

  console.log(`✅ Added stock for ${warehouseItems.length} items`);

  console.log('✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
