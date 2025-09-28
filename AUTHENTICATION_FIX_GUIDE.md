# حل مشكلة المصادقة - خطأ 401 عند إضافة المنتجات

## المشكلة
```
{
    "data": null,
    "error": {
        "status": 401,
        "name": "UnauthorizedError",
        "message": "Invalid credentials",
        "details": {}
    }
}
```

## السبب
المستخدم لا يملك دور `authenticated` أو `admin` المطلوب لإضافة المنتجات.

## الحلول

### الحل الأول: إصلاح دور المستخدم عبر Admin Panel

1. **اذهب إلى Admin Panel:**
   ```
   http://localhost:1337/admin
   ```

2. **اذهب إلى Content Manager:**
   - Collection Types > Users
   - ابحث عن المستخدم (ID: 3)
   - اضغط على Edit

3. **حدد الدور:**
   - في حقل "Role" اختر "Authenticated"
   - احفظ التغييرات

### الحل الثاني: إصلاح دور المستخدم عبر API

1. **تأكد من أن Strapi يعمل:**
   ```bash
   npm run develop
   ```

2. **شغل سكريبت الإصلاح:**
   ```bash
   npm run fix:user-role
   ```

### الحل الثالث: إصلاح يدوي عبر API

1. **احصل على معلومات المستخدم:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:1337/api/users/me
   ```

2. **احصل على الأدوار المتاحة:**
   ```bash
   curl http://localhost:1337/api/users/roles
   ```

3. **حدث دور المستخدم:**
   ```bash
   curl -X PUT \
        -H "Authorization: Bearer YOUR_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"data": {"role": 1}}' \
        http://localhost:1337/api/users/3
   ```

## اختبار الحل

### 1. تحقق من دور المستخدم:
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:1337/api/users/me
```

يجب أن ترى:
```json
{
  "id": 3,
  "username": "ahmed elsamman",
  "email": "ahmed.elssamman+3@gmail.com",
  "role": {
    "id": 1,
    "name": "Authenticated",
    "type": "authenticated"
  }
}
```

### 2. اختبر إضافة منتج:
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "data": {
         "title": "Test Product",
         "description": "Test Description",
         "price": 99.99,
         "stock": 10
       }
     }' \
     http://localhost:1337/api/products
```

## إعدادات الصلاحيات المطلوبة

### دور Authenticated يجب أن يملك:
- `api::product.product.create` ✅
- `api::product.product.update` ✅
- `api::product.product.delete` ✅
- `api::product.product.find` ✅
- `api::product.product.findOne` ✅

### دور Admin يجب أن يملك:
- جميع صلاحيات Authenticated ✅
- صلاحيات إضافية للإدارة ✅

## استكشاف الأخطاء

### إذا استمر الخطأ 401:

1. **تحقق من صحة الـ Token:**
   ```bash
   # فك تشفير الـ Token في jwt.io
   # تأكد من أن المستخدم موجود
   ```

2. **تحقق من الصلاحيات:**
   ```bash
   npm run setup:permissions
   ```

3. **تحقق من دور المستخدم:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
        http://localhost:1337/api/users/me
   ```

4. **تحقق من إعدادات JWT:**
   ```env
   JWT_SECRET=your-jwt-secret
   ADMIN_JWT_SECRET=your-admin-jwt-secret
   ```

## نصائح مهمة

- **تأكد من أن Strapi يعمل** قبل الاختبار
- **استخدم Token صحيح** وليس منتهي الصلاحية
- **تحقق من دور المستخدم** في كل مرة
- **أعد تشغيل Strapi** بعد تغيير الصلاحيات

## الأوامر المفيدة

```bash
# إصلاح الصلاحيات
npm run setup:permissions

# إصلاح دور المستخدم
npm run fix:user-role

# اختبار الاتصال
npm run test:supabase

# تشغيل Strapi
npm run develop
```

---

## ملخص الحل

1. ✅ تأكد من أن Strapi يعمل
2. ✅ شغل `npm run setup:permissions`
3. ✅ أصلح دور المستخدم عبر Admin Panel أو API
4. ✅ اختبر إضافة المنتجات
5. ✅ استخدم Token صحيح في كل طلب

بعد تطبيق هذه الخطوات، يجب أن تعمل إضافة المنتجات بدون خطأ 401! 🚀
