# حل مشكلة SSL - Cannot find module

## المشكلة
```
Error: Cannot find module '../scripts/ssl-fix'
```

## السبب
المسار في `src/index.ts` غير صحيح أو الملف غير موجود.

## الحلول المطبقة

### ✅ الحل الأول: إصلاح مباشر في src/index.ts
```typescript
// إصلاح مشكلة SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
```

### ✅ الحل الثاني: ملف منفصل
```typescript
// في src/ssl-fix.ts
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// في src/index.ts
import './ssl-fix';
```

## خطوات الحل

### 1. تنظيف مجلد dist
```bash
rm -rf dist
```

### 2. تشغيل Strapi
```bash
npm run develop
```

### 3. اختبار الاتصال
```bash
npm run test:supabase
```

## الحل البديل (الأسرع)

### استخدام متغير البيئة
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run develop
```

### أو إضافة إلى .env
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## استكشاف الأخطاء

### إذا استمرت المشكلة:

1. **تحقق من الملفات:**
   ```bash
   ls -la src/
   cat src/index.ts
   ```

2. **تحقق من dist:**
   ```bash
   ls -la dist/src/
   cat dist/src/index.js
   ```

3. **أعد البناء:**
   ```bash
   rm -rf dist
   npm run build
   npm run develop
   ```

## نصائح مهمة

- **احذف dist** قبل إعادة التشغيل
- **تأكد من المسارات** في الملفات
- **استخدم import** بدلاً من require
- **اختبر الاتصال** بعد كل تغيير

## الأوامر المفيدة

```bash
# تنظيف وإعادة بناء
rm -rf dist && npm run build

# تشغيل مع SSL
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run develop

# اختبار الاتصال
npm run test:supabase

# اختبار API
curl http://localhost:1337/api/products
```

## ملخص الحل

1. ✅ تم حذف مجلد dist
2. ✅ تم إصلاح src/index.ts
3. ✅ تم إنشاء src/ssl-fix.ts
4. ✅ تم اختبار الحل

الآن يجب أن يعمل Strapi بدون أخطاء SSL! 🚀
