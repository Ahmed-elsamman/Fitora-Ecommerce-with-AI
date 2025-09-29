# حل سريع لمشكلة SSL

## المشكلة
```
Error: Cannot find module '../scripts/ssl-fix'
```

## الحل السريع

### 1. تحديث src/index.ts
```typescript
// إصلاح مشكلة SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

### 2. تشغيل Strapi
```bash
npm run develop
```

## الحل البديل

### استخدام متغير البيئة
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run develop
```

### أو إضافة إلى .env
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## اختبار الحل

```bash
# اختبار الاتصال
npm run test:supabase

# اختبار API
curl http://localhost:1337/api/products
```

## ملاحظة
هذا الحل يعطل فحص SSL للأمان. استخدمه فقط في بيئة التطوير!
