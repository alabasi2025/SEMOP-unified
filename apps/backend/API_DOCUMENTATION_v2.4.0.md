# 📚 SEMOP ERP - API Documentation v2.4.0

## 🎯 Overview

**Version:** 2.4.0  
**Release Date:** November 28, 2025  
**Base URL:** `http://72.61.111.217:3000/api`  
**Total Endpoints:** 85+  
**New Endpoints:** 30  
**Authentication:** JWT Bearer Token

---

## 🆕 What's New in v2.4.0

### **New Modules (7):**
1. ✅ **Billing Engine** - Advanced invoicing and billing management
2. ✅ **Wallet Service** - Digital wallet and balance management
3. ✅ **Assets Management** - Fixed assets tracking and depreciation
4. ✅ **SCM (Supply Chain)** - Consumables management
5. ✅ **Notifications** - Multi-channel notification system
6. ✅ **Configuration** - System settings management
7. ✅ **Inventory Enhancement** - Stock count and level tracking

### **New Endpoints:** 30+
- Billing: 5 endpoints
- Wallet: 5 endpoints
- Assets: 8 endpoints
- SCM: 4 endpoints
- Notifications: 6 endpoints
- Configuration: 2 endpoints

---

## 🔐 Authentication

All API endpoints require JWT authentication.

### **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@semop.com"
  }
}
```

### **Using Token**
```http
GET /api/billing/invoices
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💰 Billing Engine API

### **Base Path:** `/api/billing`

### **1. List All Invoices**
```http
GET /api/billing/invoices
Authorization: Bearer {token}
```

**Query Parameters:**
- `status` (optional): `draft`, `sent`, `paid`, `overdue`
- `customerId` (optional): Filter by customer
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "invoiceNumber": "INV-2025-001",
      "customerId": 5,
      "customerName": "ABC Company",
      "amount": 15000.00,
      "currency": "SAR",
      "status": "sent",
      "dueDate": "2025-12-15",
      "createdAt": "2025-11-28T10:00:00Z"
    }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}
```

---

### **2. Get Invoice Details**
```http
GET /api/billing/invoices/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "invoiceNumber": "INV-2025-001",
  "customer": {
    "id": 5,
    "name": "ABC Company",
    "email": "contact@abc.com"
  },
  "items": [
    {
      "description": "Product A",
      "quantity": 10,
      "unitPrice": 1000.00,
      "total": 10000.00
    }
  ],
  "subtotal": 10000.00,
  "tax": 1500.00,
  "total": 11500.00,
  "status": "sent",
  "dueDate": "2025-12-15"
}
```

---

### **3. Create Invoice**
```http
POST /api/billing/invoices
Authorization: Bearer {token}
Content-Type: application/json

{
  "customerId": 5,
  "dueDate": "2025-12-15",
  "currency": "SAR",
  "items": [
    {
      "description": "Product A",
      "quantity": 10,
      "unitPrice": 1000.00
    }
  ],
  "notes": "Payment terms: Net 30"
}
```

**Response:**
```json
{
  "id": 1,
  "invoiceNumber": "INV-2025-001",
  "status": "draft",
  "total": 11500.00,
  "createdAt": "2025-11-28T10:00:00Z"
}
```

---

### **4. Update Invoice**
```http
PUT /api/billing/invoices/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "sent",
  "dueDate": "2025-12-20"
}
```

---

### **5. Delete Invoice**
```http
DELETE /api/billing/invoices/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "message": "Invoice deleted successfully"
}
```

---

## 💳 Wallet Service API

### **Base Path:** `/api/wallet`

### **1. Get Wallet Balance**
```http
GET /api/wallet/balance/:userId
Authorization: Bearer {token}
```

**Response:**
```json
{
  "userId": 10,
  "balance": 50000.00,
  "currency": "SAR",
  "lastTransaction": "2025-11-28T10:00:00Z"
}
```

---

### **2. Create Wallet**
```http
POST /api/wallet
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 10,
  "initialBalance": 10000.00,
  "currency": "SAR"
}
```

---

### **3. Add Transaction**
```http
POST /api/wallet/transactions
Authorization: Bearer {token}
Content-Type: application/json

{
  "walletId": 5,
  "type": "credit",
  "amount": 5000.00,
  "description": "Payment received",
  "reference": "INV-2025-001"
}
```

**Transaction Types:**
- `credit`: Add funds
- `debit`: Deduct funds

---

### **4. Get Transaction History**
```http
GET /api/wallet/transactions/:walletId
Authorization: Bearer {token}
```

**Query Parameters:**
- `startDate` (optional): Filter from date
- `endDate` (optional): Filter to date
- `type` (optional): `credit` or `debit`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "credit",
      "amount": 5000.00,
      "balance": 50000.00,
      "description": "Payment received",
      "createdAt": "2025-11-28T10:00:00Z"
    }
  ]
}
```

---

### **5. Transfer Between Wallets**
```http
POST /api/wallet/transfer
Authorization: Bearer {token}
Content-Type: application/json

{
  "fromWalletId": 5,
  "toWalletId": 10,
  "amount": 1000.00,
  "description": "Transfer to supplier"
}
```

---

## 🏢 Assets Management API

### **Base Path:** `/api/assets`

### **1. List All Assets**
```http
GET /api/assets
Authorization: Bearer {token}
```

**Query Parameters:**
- `category` (optional): Asset category
- `status` (optional): `active`, `disposed`, `under_maintenance`
- `page`, `limit`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Company Vehicle",
      "category": "Transportation",
      "purchaseDate": "2024-01-15",
      "purchasePrice": 80000.00,
      "currentValue": 72000.00,
      "status": "active"
    }
  ]
}
```

---

### **2. Get Asset Details**
```http
GET /api/assets/:id
Authorization: Bearer {token}
```

**Response:**
```json
{
  "id": 1,
  "name": "Company Vehicle",
  "category": "Transportation",
  "serialNumber": "VEH-2024-001",
  "purchaseDate": "2024-01-15",
  "purchasePrice": 80000.00,
  "currentValue": 72000.00,
  "depreciationMethod": "straight_line",
  "usefulLife": 5,
  "status": "active",
  "location": "Riyadh Office",
  "assignedTo": "John Doe"
}
```

---

### **3. Create Asset**
```http
POST /api/assets
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Company Vehicle",
  "category": "Transportation",
  "serialNumber": "VEH-2024-001",
  "purchaseDate": "2024-01-15",
  "purchasePrice": 80000.00,
  "depreciationMethod": "straight_line",
  "usefulLife": 5,
  "location": "Riyadh Office"
}
```

---

### **4. Calculate Depreciation**
```http
GET /api/assets/:id/depreciation
Authorization: Bearer {token}
```

**Response:**
```json
{
  "assetId": 1,
  "purchasePrice": 80000.00,
  "currentValue": 72000.00,
  "accumulatedDepreciation": 8000.00,
  "annualDepreciation": 16000.00,
  "remainingLife": 4.5
}
```

---

### **5. Schedule Maintenance**
```http
POST /api/assets/:id/maintenance
Authorization: Bearer {token}
Content-Type: application/json

{
  "type": "routine",
  "scheduledDate": "2025-12-01",
  "description": "Annual service",
  "estimatedCost": 2000.00
}
```

---

### **6. Get Maintenance History**
```http
GET /api/assets/:id/maintenance
Authorization: Bearer {token}
```

---

### **7. Update Asset**
```http
PUT /api/assets/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "under_maintenance",
  "location": "Service Center"
}
```

---

### **8. Dispose Asset**
```http
POST /api/assets/:id/dispose
Authorization: Bearer {token}
Content-Type: application/json

{
  "disposalDate": "2025-11-28",
  "disposalValue": 50000.00,
  "reason": "End of useful life"
}
```

---

## 📦 SCM (Supply Chain Management) API

### **Base Path:** `/api/scm`

### **1. List Consumables**
```http
GET /api/scm/consumables
Authorization: Bearer {token}
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Office Paper A4",
      "sku": "CONS-001",
      "category": "Office Supplies",
      "currentStock": 500,
      "unit": "ream",
      "reorderLevel": 100
    }
  ]
}
```

---

### **2. Record Usage**
```http
POST /api/scm/consumables/:id/usage
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 10,
  "usedBy": "Admin Department",
  "purpose": "Monthly printing",
  "date": "2025-11-28"
}
```

---

### **3. Get Usage History**
```http
GET /api/scm/consumables/:id/usage
Authorization: Bearer {token}
```

**Query Parameters:**
- `startDate`, `endDate`
- `department`

---

### **4. Restock Consumable**
```http
POST /api/scm/consumables/:id/restock
Authorization: Bearer {token}
Content-Type: application/json

{
  "quantity": 200,
  "supplier": "ABC Supplies",
  "cost": 5000.00,
  "date": "2025-11-28"
}
```

---

## 🔔 Notifications API

### **Base Path:** `/api/notifications`

### **1. Get User Notifications**
```http
GET /api/notifications
Authorization: Bearer {token}
```

**Query Parameters:**
- `read` (optional): `true` or `false`
- `type` (optional): `email`, `sms`, `push`, `in_app`

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "type": "in_app",
      "title": "New Invoice",
      "message": "Invoice INV-2025-001 has been created",
      "read": false,
      "createdAt": "2025-11-28T10:00:00Z"
    }
  ]
}
```

---

### **2. Send Notification**
```http
POST /api/notifications
Authorization: Bearer {token}
Content-Type: application/json

{
  "userId": 10,
  "type": "email",
  "title": "Payment Reminder",
  "message": "Your invoice is due in 3 days",
  "priority": "high"
}
```

**Notification Types:**
- `email`: Email notification
- `sms`: SMS notification
- `push`: Push notification
- `in_app`: In-app notification

**Priorities:**
- `low`, `normal`, `high`, `urgent`

---

### **3. Mark as Read**
```http
PUT /api/notifications/:id/read
Authorization: Bearer {token}
```

---

### **4. Delete Notification**
```http
DELETE /api/notifications/:id
Authorization: Bearer {token}
```

---

### **5. Get Notification Preferences**
```http
GET /api/notifications/preferences
Authorization: Bearer {token}
```

**Response:**
```json
{
  "email": true,
  "sms": false,
  "push": true,
  "in_app": true,
  "categories": {
    "invoices": true,
    "payments": true,
    "system": false
  }
}
```

---

### **6. Update Preferences**
```http
PUT /api/notifications/preferences
Authorization: Bearer {token}
Content-Type: application/json

{
  "email": true,
  "sms": true,
  "categories": {
    "invoices": true,
    "payments": true
  }
}
```

---

## ⚙️ Configuration API

### **Base Path:** `/api/configuration`

### **1. Get System Settings**
```http
GET /api/configuration
Authorization: Bearer {token}
```

**Response:**
```json
{
  "company": {
    "name": "SEMOP ERP",
    "currency": "SAR",
    "timezone": "Asia/Riyadh",
    "fiscalYearStart": "01-01"
  },
  "billing": {
    "invoicePrefix": "INV",
    "taxRate": 15,
    "paymentTerms": 30
  },
  "notifications": {
    "emailEnabled": true,
    "smsEnabled": false
  }
}
```

---

### **2. Update Settings**
```http
PUT /api/configuration
Authorization: Bearer {token}
Content-Type: application/json

{
  "company": {
    "name": "SEMOP ERP",
    "currency": "SAR"
  },
  "billing": {
    "taxRate": 15
  }
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

---

## 🔍 Error Response Format

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number"
    }
  ]
}
```

---

## 📝 Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response Meta:**
```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

---

## 🔎 Filtering & Sorting

**Filtering:**
```http
GET /api/billing/invoices?status=paid&customerId=5
```

**Sorting:**
```http
GET /api/billing/invoices?sortBy=createdAt&order=desc
```

**Search:**
```http
GET /api/billing/invoices?search=ABC Company
```

---

## 📚 Additional Resources

- **Swagger UI:** http://72.61.111.217:3000/api/docs
- **Postman Collection:** Available on request
- **GitHub:** https://github.com/alabasi2025/unified-backend-monorepo
- **Support:** support@semop.com

---

## 📅 Version History

### **v2.4.0** (November 28, 2025)
- ✅ Added Billing Engine (5 endpoints)
- ✅ Added Wallet Service (5 endpoints)
- ✅ Added Assets Management (8 endpoints)
- ✅ Added SCM (4 endpoints)
- ✅ Added Notifications (6 endpoints)
- ✅ Added Configuration (2 endpoints)
- ✅ Total: 30 new endpoints

### **v2.3.0** (November 27, 2025)
- ✅ Added 41 backend components
- ✅ Enhanced existing modules

### **v2.2.0** (November 2025)
- ✅ Magic Notebook integration
- ✅ Database optimization

---

**© 2025 SEMOP ERP - All Rights Reserved**
