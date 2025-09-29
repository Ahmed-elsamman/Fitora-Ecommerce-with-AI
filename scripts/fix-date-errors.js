const { Client } = require('pg');
require('dotenv').config();

async function fixDateErrors() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('🔍 فحص وإصلاح أخطاء التواريخ...\n');

    // 1. فحص المستخدمين
    console.log('1️⃣ فحص جدول المستخدمين...');
    const usersResult = await client.query(`
      SELECT id, username, email, created_at, updated_at, published_at
      FROM up_users 
      WHERE created_at IS NULL OR updated_at IS NULL OR published_at IS NULL
    `);
    
    if (usersResult.rows.length > 0) {
      console.log(`❌ وجد ${usersResult.rows.length} مستخدم بتواريخ ناقصة:`);
      usersResult.rows.forEach(user => {
        console.log(`- ${user.username} (${user.email}): created_at=${user.created_at}, updated_at=${user.updated_at}, published_at=${user.published_at}`);
      });
      
      // إصلاح التواريخ الناقصة
      console.log('\n🔧 إصلاح التواريخ الناقصة...');
      await client.query(`
        UPDATE up_users 
        SET 
          created_at = COALESCE(created_at, NOW()),
          updated_at = COALESCE(updated_at, NOW()),
          published_at = COALESCE(published_at, NOW())
        WHERE created_at IS NULL OR updated_at IS NULL OR published_at IS NULL
      `);
      console.log('✅ تم إصلاح تواريخ المستخدمين');
    } else {
      console.log('✅ جميع تواريخ المستخدمين صحيحة');
    }

    // 2. فحص المنتجات
    console.log('\n2️⃣ فحص جدول المنتجات...');
    const productsResult = await client.query(`
      SELECT id, title, created_at, updated_at, published_at
      FROM products 
      WHERE created_at IS NULL OR updated_at IS NULL OR published_at IS NULL
    `);
    
    if (productsResult.rows.length > 0) {
      console.log(`❌ وجد ${productsResult.rows.length} منتج بتواريخ ناقصة:`);
      productsResult.rows.forEach(product => {
        console.log(`- ${product.title}: created_at=${product.created_at}, updated_at=${product.updated_at}, published_at=${product.published_at}`);
      });
      
      // إصلاح التواريخ الناقصة
      console.log('\n🔧 إصلاح تواريخ المنتجات...');
      await client.query(`
        UPDATE products 
        SET 
          created_at = COALESCE(created_at, NOW()),
          updated_at = COALESCE(updated_at, NOW()),
          published_at = COALESCE(published_at, NOW())
        WHERE created_at IS NULL OR updated_at IS NULL OR published_at IS NULL
      `);
      console.log('✅ تم إصلاح تواريخ المنتجات');
    } else {
      console.log('✅ جميع تواريخ المنتجات صحيحة');
    }

    // 3. فحص التواريخ غير الصحيحة
    console.log('\n3️⃣ فحص التواريخ غير الصحيحة...');
    const invalidDatesResult = await client.query(`
      SELECT 'up_users' as table_name, id, created_at, updated_at, published_at
      FROM up_users 
      WHERE created_at = '1970-01-01 00:00:00+00'::timestamp 
         OR updated_at = '1970-01-01 00:00:00+00'::timestamp
         OR published_at = '1970-01-01 00:00:00+00'::timestamp
      
      UNION ALL
      
      SELECT 'products' as table_name, id, created_at, updated_at, published_at
      FROM products 
      WHERE created_at = '1970-01-01 00:00:00+00'::timestamp 
         OR updated_at = '1970-01-01 00:00:00+00'::timestamp
         OR published_at = '1970-01-01 00:00:00+00'::timestamp
    `);
    
    if (invalidDatesResult.rows.length > 0) {
      console.log(`❌ وجد ${invalidDatesResult.rows.length} سجل بتواريخ غير صحيحة (1970-01-01):`);
      invalidDatesResult.rows.forEach(record => {
        console.log(`- ${record.table_name} ID ${record.id}: created_at=${record.created_at}, updated_at=${record.updated_at}, published_at=${record.published_at}`);
      });
      
      // إصلاح التواريخ غير الصحيحة
      console.log('\n🔧 إصلاح التواريخ غير الصحيحة...');
      await client.query(`
        UPDATE up_users 
        SET 
          created_at = NOW(),
          updated_at = NOW(),
          published_at = NOW()
        WHERE created_at = '1970-01-01 00:00:00+00'::timestamp 
           OR updated_at = '1970-01-01 00:00:00+00'::timestamp
           OR published_at = '1970-01-01 00:00:00+00'::timestamp
      `);
      
      await client.query(`
        UPDATE products 
        SET 
          created_at = NOW(),
          updated_at = NOW(),
          published_at = NOW()
        WHERE created_at = '1970-01-01 00:00:00+00'::timestamp 
           OR updated_at = '1970-01-01 00:00:00+00'::timestamp
           OR published_at = '1970-01-01 00:00:00+00'::timestamp
      `);
      console.log('✅ تم إصلاح التواريخ غير الصحيحة');
    } else {
      console.log('✅ جميع التواريخ صحيحة');
    }

    console.log('\n✅ تم الانتهاء من فحص وإصلاح التواريخ!');
    
  } catch (error) {
    console.error('❌ خطأ في فحص التواريخ:', error.message);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  fixDateErrors();
}

module.exports = { fixDateErrors };


