 # دليل الهجرة إلى Supabase

## الخطوات المطلوبة لربط مشروعك بـ Supabase

### 1. الحصول على معلومات الاتصال من Supabase

1. **اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)**
2. **اختر مشروعك**
3. **اذهب إلى Settings > Database**
4. **انسخ المعلومات التالية:**
   - **Host**: `db.xxxxxxxxxxxxx.supabase.co`
   - **Database name**: `postgres`
   - **Port**: `5432`
   - **Username**: `postgres`
   - **Password**: كلمة المرور التي اخترتها

### 2. إعداد ملف .env

1. **انسخ محتويات ملف `supabase-config.env`**
2. **الصقها في ملف `.env`**
3. **استبدل القيم التالية:**
   - `[YOUR_PROJECT_REF]` بـ Project Reference من Supabase
   - `[YOUR_PASSWORD]` بكلمة مرور قاعدة البيانات

**مثال:**
```env
DATABASE_URL=postgresql://postgres:yourpassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
DATABASE_HOST=db.abcdefghijklmnop.supabase.co
DATABASE_PASSWORD=yourpassword123
```

### 3. اختبار الاتصال

```bash
npm run test:supabase
```

### 4. تشغيل Strapi مع Supabase

```bash
npm run develop
```

Strapi سيقوم تلقائياً بإنشاء الجداول المطلوبة في Supabase.

### 5. التحقق من النجاح

1. **اذهب إلى Supabase Dashboard > Table Editor**
2. **تأكد من وجود الجداول التالية:**
   - `strapi_core_store_settings`
   - `strapi_database_schema`
   - `admin_users`
   - `files`
   - `upload_files`
   - وجداول أخرى حسب محتوى مشروعك

### 6. استيراد البيانات (اختياري)

إذا كان لديك بيانات في قاعدة البيانات الحالية:

1. **قم بعمل backup من البيانات الحالية**
2. **استخدم أدوات مثل pg_dump لتصدير البيانات**
3. **استورد البيانات إلى Supabase**

### 7. إعدادات إضافية

#### Row Level Security (RLS)
```sql
-- تفعيل RLS على الجداول الحساسة
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE users_permissions_user ENABLE ROW LEVEL SECURITY;
```

#### إعدادات الأداء
```sql
-- إنشاء فهارس للأداء
CREATE INDEX IF NOT EXISTS idx_upload_files_created_at ON upload_files(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
```

### 8. استكشاف الأخطاء

#### مشاكل شائعة:

1. **خطأ SSL:**
   - تأكد من `DATABASE_SSL=true`
   - تأكد من `rejectUnauthorized: false` في الإعدادات

2. **خطأ الاتصال:**
   - تأكد من صحة Host و Port
   - تأكد من صحة كلمة المرور
   - تأكد من أن المشروع نشط

3. **خطأ الصلاحيات:**
   - تأكد من أن المستخدم له صلاحيات كاملة
   - تأكد من إعدادات Schema

### 9. الأوامر المفيدة

```bash
# اختبار الاتصال
npm run test:supabase

# تشغيل الهجرة
npm run migrate:supabase

# تشغيل Strapi
npm run develop

# بناء المشروع للإنتاج
npm run build
```

### 10. نصائح مهمة

- **احتفظ بنسخة احتياطية** من قاعدة البيانات الحالية
- **اختبر الاتصال** قبل المتابعة
- **راقب الأداء** بعد الهجرة
- **حدث إعدادات الأمان** حسب الحاجة

---

## الدعم

إذا واجهت أي مشاكل، تأكد من:
1. صحة إعدادات Supabase
2. وجود جميع المتطلبات
3. تشغيل الأوامر بالترتيب الصحيح

