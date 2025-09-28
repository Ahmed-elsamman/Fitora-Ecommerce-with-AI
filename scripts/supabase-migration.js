const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// قراءة متغيرات البيئة
require('dotenv').config();

// إعدادات Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabaseConnection() {
  try {
    console.log('🔄 اختبار الاتصال مع Supabase...');
    
    // اختبار الاتصال
    const { data, error } = await supabase
      .from('_supabase_migrations')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ خطأ في الاتصال:', error.message);
      return false;
    }
    
    console.log('✅ تم الاتصال بنجاح مع Supabase!');
    return true;
  } catch (err) {
    console.log('❌ خطأ في الاتصال:', err.message);
    return false;
  }
}

async function createStrapiTables() {
  try {
    console.log('🔄 إنشاء جداول Strapi في Supabase...');
    
    // قائمة الجداول المطلوبة لـ Strapi
    const tables = [
      'strapi_core_store_settings',
      'strapi_database_schema',
      'strapi_migrations',
      'strapi_webhooks',
      'up_migrations',
      'strapi_api_tokens',
      'strapi_transfer_tokens',
      'strapi_api_token_permissions',
      'strapi_api_token_permissions_token_links',
      'strapi_transfer_token_permissions',
      'strapi_transfer_token_permissions_token_links',
      'admin_users',
      'admin_users_roles_links',
      'admin_roles',
      'admin_permissions',
      'admin_permissions_role_links',
      'files',
      'files_related_morphs',
      'upload_files',
      'upload_files_morphs',
      'upload_folders',
      'upload_folders_parent_links',
      'i18n_locale',
      'users_permissions_role',
      'users_permissions_user',
      'users_permissions_permission',
      'users_permissions_role_permission_links',
      'users_permissions_user_role_links'
    ];
    
    for (const table of tables) {
      try {
        // محاولة إنشاء الجدول
        const { error } = await supabase.rpc('create_table_if_not_exists', {
          table_name: table
        });
        
        if (error && !error.message.includes('already exists')) {
          console.log(`⚠️  تحذير: ${table} - ${error.message}`);
        } else {
          console.log(`✅ تم إنشاء/التحقق من الجدول: ${table}`);
        }
      } catch (err) {
        console.log(`⚠️  تحذير: ${table} - ${err.message}`);
      }
    }
    
    console.log('✅ تم إنشاء الجداول الأساسية!');
  } catch (err) {
    console.log('❌ خطأ في إنشاء الجداول:', err.message);
  }
}

async function main() {
  console.log('🚀 بدء عملية الهجرة إلى Supabase...\n');
  
  // اختبار الاتصال
  const connected = await testSupabaseConnection();
  if (!connected) {
    console.log('\n❌ فشل في الاتصال. تأكد من إعدادات Supabase في ملف .env');
    process.exit(1);
  }
  
  // إنشاء الجداول
  await createStrapiTables();
  
  console.log('\n✅ تم إعداد Supabase بنجاح!');
  console.log('\n📝 الخطوات التالية:');
  console.log('1. انسخ محتويات ملف supabase-config.env إلى ملف .env');
  console.log('2. استبدل [YOUR_PROJECT_REF] و [YOUR_PASSWORD] بالقيم الفعلية');
  console.log('3. شغل: npm run develop');
  console.log('4. Strapi سيقوم بإنشاء الجداول تلقائياً');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testSupabaseConnection, createStrapiTables };

