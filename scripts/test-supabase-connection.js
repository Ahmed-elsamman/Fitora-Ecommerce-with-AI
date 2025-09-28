const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function testConnection() {
  console.log('🔄 اختبار الاتصال مع Supabase...\n');
  
  // قراءة إعدادات قاعدة البيانات
  const dbUrl = process.env.DATABASE_URL;
  const dbHost = process.env.DATABASE_HOST;
  const dbPort = process.env.DATABASE_PORT;
  const dbName = process.env.DATABASE_NAME;
  const dbUser = process.env.DATABASE_USERNAME;
  const dbPassword = process.env.DATABASE_PASSWORD;
  
  console.log('📋 إعدادات قاعدة البيانات:');
  console.log(`Host: ${dbHost}`);
  console.log(`Port: ${dbPort}`);
  console.log(`Database: ${dbName}`);
  console.log(`User: ${dbUser}`);
  console.log(`SSL: ${process.env.DATABASE_SSL}`);
  console.log('');
  
  if (!dbUrl && !dbHost) {
    console.log('❌ لم يتم العثور على إعدادات قاعدة البيانات في ملف .env');
    console.log('تأكد من نسخ محتويات supabase-config.env إلى .env');
    return;
  }
  
  try {
    // اختبار الاتصال باستخدام pg
    const { Client } = require('pg');
    
    const client = new Client({
      connectionString: dbUrl,
      host: dbHost,
      port: dbPort,
      database: dbName,
      user: dbUser,
      password: dbPassword,
      ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false
    });
    
    await client.connect();
    console.log('✅ تم الاتصال بنجاح مع قاعدة بيانات Supabase!');
    
    // اختبار استعلام بسيط
    const result = await client.query('SELECT version()');
    console.log('📊 إصدار PostgreSQL:', result.rows[0].version);
    
    // اختبار الجداول الموجودة
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('\n📋 الجداول الموجودة:');
    if (tablesResult.rows.length > 0) {
      tablesResult.rows.forEach(row => {
        console.log(`  - ${row.table_name}`);
      });
    } else {
      console.log('  لا توجد جداول (هذا طبيعي في البداية)');
    }
    
    await client.end();
    console.log('\n✅ تم إغلاق الاتصال بنجاح');
    
  } catch (error) {
    console.log('❌ خطأ في الاتصال:', error.message);
    console.log('\n🔧 نصائح لحل المشكلة:');
    console.log('1. تأكد من صحة إعدادات Supabase');
    console.log('2. تأكد من أن كلمة المرور صحيحة');
    console.log('3. تأكد من أن المشروع نشط في Supabase');
    console.log('4. تأكد من إعدادات SSL');
  }
}

if (require.main === module) {
  testConnection();
}

module.exports = { testConnection };

