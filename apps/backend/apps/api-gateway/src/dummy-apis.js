// Dummy APIs for Cycle 4 - Quick Fix
// This file adds simple API endpoints without rebuilding the entire backend

const express = require('express');
const router = express.Router();

// Genes API
router.get('/genes', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'محاسبة متقدمة',
      description: 'نظام محاسبة متقدم مع تقارير مالية',
      category: 'accounting',
      icon: '📊',
      enabled: true,
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'إدارة المخزون الذكية',
      description: 'نظام ذكي لإدارة المخزون مع تنبيهات',
      category: 'inventory',
      icon: '📦',
      enabled: true,
      createdAt: new Date()
    },
    {
      id: 3,
      name: 'تتبع المشتريات',
      description: 'نظام متكامل لتتبع المشتريات والموردين',
      category: 'purchases',
      icon: '🛒',
      enabled: false,
      createdAt: new Date()
    }
  ]);
});

router.post('/genes', (req, res) => {
  res.status(201).json({
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  });
});

// Latitude Points API
router.get('/latitude-points', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'صنعاء',
      latitude: 15.3694,
      longitude: 44.1910,
      description: 'عاصمة اليمن',
      type: 'city',
      createdAt: new Date()
    },
    {
      id: 2,
      name: 'عدن',
      latitude: 12.7855,
      longitude: 45.0187,
      description: 'العاصمة الاقتصادية',
      type: 'city',
      createdAt: new Date()
    }
  ]);
});

router.post('/latitude-points', (req, res) => {
  res.status(201).json({
    id: Date.now(),
    ...req.body,
    createdAt: new Date()
  });
});

// Purchase Orders API
router.get('/purchase-orders', (req, res) => {
  res.json([
    {
      id: 1,
      orderNumber: 'PO-2025-001',
      supplier: 'مورد ABC',
      totalAmount: 50000,
      status: 'pending',
      createdAt: new Date()
    }
  ]);
});

// Account Hierarchy API
router.get('/account-hierarchy', (req, res) => {
  res.json([
    {
      id: 1,
      code: '1000',
      name: 'الأصول',
      parentId: null,
      level: 1,
      createdAt: new Date()
    },
    {
      id: 2,
      code: '1100',
      name: 'الأصول المتداولة',
      parentId: 1,
      level: 2,
      createdAt: new Date()
    }
  ]);
});

// Role Permissions API
router.get('/role-permissions', (req, res) => {
  res.json([
    {
      id: 1,
      roleId: 1,
      roleName: 'مدير النظام',
      permissions: ['read', 'write', 'delete', 'admin'],
      createdAt: new Date()
    }
  ]);
});

// Customer Contacts API
router.get('/customer-contacts', (req, res) => {
  res.json([
    {
      id: 1,
      customerId: 1,
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
      phone: '+967-777-123456',
      position: 'مدير المشتريات',
      createdAt: new Date()
    }
  ]);
});

module.exports = router;
