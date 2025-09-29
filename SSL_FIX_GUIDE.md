# حل مشكلة SSL - self-signed certificate in certificate chain

## المشكلة
```
[2025-09-28 11:42:18.175] error: self-signed certificate in certificate chain
Error: self-signed certificate in certificate chain
```

## السبب
Supabase يستخدم شهادات SSL قد لا تكون معترف بها محلياً.

## الحلول المطبقة

### ✅ 1. تحديث إعدادات قاعدة البيانات

تم تحديث `config/database.ts`:
```typescript
ssl: env.bool('DATABASE_SSL', false) ? {
  rejectUnauthorized: false, // مطلوب لـ Supabase
  ca: undefined,
  key: undefined,
  cert: undefined,
  checkServerIdentity: () => undefined, // تجاهل فحص الهوية
} : false,
```

### ✅ 2. إصلاح SSL في التطبيق

تم إنشاء `scripts/ssl-fix.js`:
```javascript
const https = require('https');

// تعطيل فحص SSL للاتصالات
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// إعدادات SSL مخصصة
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined,
});
```

### ✅ 3. تطبيق الإصلاح في src/index.ts

```typescript
// إصلاح مشكلة SSL
require('../scripts/ssl-fix');
```

## طرق التشغيل

### الطريقة الأولى: متغير البيئة
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run develop
```

### الطريقة الثانية: ملف .env
أضف إلى ملف `.env`:
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

### الطريقة الثالثة: سكريبت
```bash
# استخدم ملف ssl-fix.env
cp ssl-fix.env .env
npm run develop
```

## اختبار الحل

### 1. اختبار الاتصال:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run test:supabase
```

### 2. تشغيل Strapi:
```bash
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run develop
```

### 3. اختبار API:
```bash
curl http://localhost:1337/api/products
```

## تحذيرات الأمان

⚠️ **مهم:** هذا الحل يعطل فحص SSL للأمان. استخدمه فقط في:
- بيئة التطوير
- اختبار الاتصال
- حل مشاكل SSL المؤقتة

## للحصول على أمان أفضل

### 1. استخدام شهادات صحيحة:
```typescript
ssl: {
  rejectUnauthorized: true,
  ca: fs.readFileSync('path/to/ca-cert.pem'),
}
```

### 2. تحديث Node.js:
```bash
npm update
```

### 3. استخدام إصدار أحدث من Supabase:
```bash
npm update @supabase/supabase-js
```

## استكشاف الأخطاء

### إذا استمرت المشكلة:

1. **تحقق من إعدادات Supabase:**
   - Database > Settings
   - Connection pooling
   - SSL certificates

2. **تحقق من إعدادات الشبكة:**
   ```bash
   ping aws-1-eu-north-1.pooler.supabase.com
   ```

3. **تحقق من إعدادات Firewall:**
   - Port 6543
   - SSL connections

4. **تحقق من إعدادات Node.js:**
   ```bash
   node --version
   npm --version
   ```

## الأوامر المفيدة

```bash
# اختبار الاتصال مع SSL
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run test:supabase

# تشغيل Strapi مع SSL
NODE_TLS_REJECT_UNAUTHORIZED=0 npm run develop

# إصلاح الصلاحيات
npm run setup:permissions

# إصلاح دور المستخدم
npm run fix:user-role
```

## ملخص الحل

1. ✅ تم تحديث إعدادات SSL في قاعدة البيانات
2. ✅ تم إنشاء سكريبت إصلاح SSL
3. ✅ تم تطبيق الإصلاح في التطبيق
4. ✅ تم اختبار الاتصال بنجاح

الآن يجب أن يعمل Strapi بدون أخطاء SSL! 🚀

---

## نصائح إضافية

- **احتفظ بنسخة احتياطية** من الإعدادات الأصلية
- **اختبر الاتصال** قبل المتابعة
- **راقب Logs** للتأكد من عدم وجود أخطاء
- **استخدم HTTPS** في الإنتاج للحصول على أمان أفضل
