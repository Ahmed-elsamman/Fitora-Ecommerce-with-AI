const { Client } = require('pg');
require('dotenv').config();

async function comprehensiveDateFix() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
  });

  try {
    await client.connect();
    console.log('🔧 إصلاح شامل لمشكلة التواريخ...\n');

    // 1. إصلاح جميع الجداول التي تحتوي على تواريخ
    const tablesWithDates = [
      'up_users',
      'products', 
      'categories',
      'brands',
      'carts',
      'orders',
      'reviews',
      'addresses',
      'abouts',
      'globals',
      'files',
      'upload_folders'
    ];

    for (const table of tablesWithDates) {
      console.log(`🔍 فحص وإصلاح جدول ${table}...`);
      
      try {
        // فحص وجود الجدول
        const tableExists = await client.query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = $1
          );
        `, [table]);

        if (!tableExists.rows[0].exists) {
          console.log(`⚠️  الجدول ${table} غير موجود، تخطي...`);
          continue;
        }

        // فحص الأعمدة المتاحة
        const columns = await client.query(`
          SELECT column_name, data_type 
          FROM information_schema.columns 
          WHERE table_schema = 'public' 
          AND table_name = $1
          AND column_name IN ('created_at', 'updated_at', 'published_at')
        `, [table]);

        if (columns.rows.length === 0) {
          console.log(`⚠️  الجدول ${table} لا يحتوي على أعمدة تواريخ، تخطي...`);
          continue;
        }

        const dateColumns = columns.rows.map(col => col.column_name);
        console.log(`   📋 أعمدة التواريخ: ${dateColumns.join(', ')}`);

        // إصلاح التواريخ الناقصة
        for (const column of dateColumns) {
          const nullCount = await client.query(`
            SELECT COUNT(*) as count 
            FROM ${table} 
            WHERE ${column} IS NULL
          `);

          if (nullCount.rows[0].count > 0) {
            console.log(`   🔧 إصلاح ${nullCount.rows[0].count} سجل بتاريخ ناقص في ${column}...`);
            
            await client.query(`
              UPDATE ${table} 
              SET ${column} = NOW()
              WHERE ${column} IS NULL
            `);
          }
        }

        // إصلاح التواريخ غير الصحيحة (1970-01-01)
        for (const column of dateColumns) {
          const invalidCount = await client.query(`
            SELECT COUNT(*) as count 
            FROM ${table} 
            WHERE ${column} = '1970-01-01 00:00:00+00'::timestamp
          `);

          if (invalidCount.rows[0].count > 0) {
            console.log(`   🔧 إصلاح ${invalidCount.rows[0].count} سجل بتاريخ غير صحيح في ${column}...`);
            
            await client.query(`
              UPDATE ${table} 
              SET ${column} = NOW()
              WHERE ${column} = '1970-01-01 00:00:00+00'::timestamp
            `);
          }
        }

        console.log(`   ✅ تم إصلاح جدول ${table}`);

      } catch (error) {
        console.log(`   ❌ خطأ في جدول ${table}: ${error.message}`);
      }
    }

    // 2. إصلاح إعدادات Strapi
    console.log('\n🔧 إصلاح إعدادات Strapi...');
    
    try {
      // تحديث إعدادات core store
      await client.query(`
        UPDATE strapi_core_store_settings 
        SET value = '{"isFirstRun": false}'
        WHERE key = 'isFirstRun'
      `);
      console.log('   ✅ تم تحديث إعدادات core store');
    } catch (error) {
      console.log(`   ⚠️  خطأ في تحديث core store: ${error.message}`);
    }

    // 3. تنظيف البيانات المؤقتة
    console.log('\n🧹 تنظيف البيانات المؤقتة...');
    
    try {
      // حذف البيانات المؤقتة القديمة
      await client.query(`
        DELETE FROM strapi_core_store_settings 
        WHERE key LIKE '%temp%' 
        OR key LIKE '%cache%'
        OR value = 'null'
      `);
      console.log('   ✅ تم تنظيف البيانات المؤقتة');
    } catch (error) {
      console.log(`   ⚠️  خطأ في تنظيف البيانات المؤقتة: ${error.message}`);
    }

    console.log('\n✅ تم الانتهاء من الإصلاح الشامل!');
    console.log('\n📝 الخطوات التالية:');
    console.log('1. npm run clear:cache');
    console.log('2. npm run build');
    console.log('3. npm run develop');
    console.log('4. امسح cache المتصفح (Ctrl+Shift+R)');

  } catch (error) {
    console.error('❌ خطأ في الإصلاح الشامل:', error.message);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  comprehensiveDateFix();
}

module.exports = { comprehensiveDateFix };

