const fs = require('fs');
const path = require('path');

async function clearStrapiCache() {
  console.log('🧹 تنظيف cache Strapi...\n');

  try {
    // 1. حذف مجلد dist
    if (fs.existsSync('./dist')) {
      console.log('1️⃣ حذف مجلد dist...');
      fs.rmSync('./dist', { recursive: true, force: true });
      console.log('✅ تم حذف مجلد dist');
    }

    // 2. حذف مجلد .cache
    if (fs.existsSync('./.cache')) {
      console.log('2️⃣ حذف مجلد .cache...');
      fs.rmSync('./.cache', { recursive: true, force: true });
      console.log('✅ تم حذف مجلد .cache');
    }

    // 3. حذف مجلد .strapi
    if (fs.existsSync('./.strapi')) {
      console.log('3️⃣ حذف مجلد .strapi...');
      fs.rmSync('./.strapi', { recursive: true, force: true });
      console.log('✅ تم حذف مجلد .strapi');
    }

    // 4. حذف node_modules/.cache
    const nodeModulesCache = './node_modules/.cache';
    if (fs.existsSync(nodeModulesCache)) {
      console.log('4️⃣ حذف node_modules/.cache...');
      fs.rmSync(nodeModulesCache, { recursive: true, force: true });
      console.log('✅ تم حذف node_modules/.cache');
    }

    // 5. حذف ملفات temp
    const tempFiles = [
      './.tmp',
      './temp',
      './tmp'
    ];

    for (const tempFile of tempFiles) {
      if (fs.existsSync(tempFile)) {
        console.log(`5️⃣ حذف ${tempFile}...`);
        fs.rmSync(tempFile, { recursive: true, force: true });
        console.log(`✅ تم حذف ${tempFile}`);
      }
    }

    console.log('\n✅ تم تنظيف جميع ملفات cache بنجاح!');
    console.log('\n📝 الخطوات التالية:');
    console.log('1. npm run build');
    console.log('2. npm run develop');
    console.log('3. امسح cache المتصفح (Ctrl+Shift+R)');

  } catch (error) {
    console.error('❌ خطأ في تنظيف cache:', error.message);
  }
}

if (require.main === module) {
  clearStrapiCache();
}

module.exports = { clearStrapiCache };
