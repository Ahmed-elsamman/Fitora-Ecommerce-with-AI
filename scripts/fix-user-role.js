const axios = require('axios');

async function fixUserRole() {
  try {
    console.log('🔧 إصلاح دور المستخدم...\n');
    
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MywiaWF0IjoxNzU5MDYxOTA2LCJleHAiOjE3NjE2NTM5MDZ9.i1wNn3lXL_ilovWlkRZ_yFohRG1fea7HTzzOgu1kbkA';
    const baseURL = 'http://localhost:1337';
    
    // 1. الحصول على معلومات المستخدم
    console.log('1️⃣ الحصول على معلومات المستخدم...');
    const userResponse = await axios.get(`${baseURL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const user = userResponse.data;
    console.log('✅ معلومات المستخدم:');
    console.log(`- ID: ${user.id}`);
    console.log(`- Username: ${user.username}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role?.name || 'غير محدد'}`);
    
    // 2. الحصول على الأدوار المتاحة
    console.log('\n2️⃣ الحصول على الأدوار المتاحة...');
    const rolesResponse = await axios.get(`${baseURL}/api/users/roles`);
    const roles = rolesResponse.data.data;
    
    console.log('✅ الأدوار المتاحة:');
    roles.forEach(role => {
      console.log(`- ${role.name} (${role.type}) - ID: ${role.id}`);
    });
    
    // 3. العثور على دور Authenticated
    const authenticatedRole = roles.find(role => role.type === 'authenticated');
    if (!authenticatedRole) {
      console.log('❌ لم يتم العثور على دور Authenticated');
      return;
    }
    
    console.log(`\n3️⃣ تعيين دور ${authenticatedRole.name} للمستخدم...`);
    
    // 4. تحديث دور المستخدم
    const updateResponse = await axios.put(`${baseURL}/api/users/${user.id}`, {
      data: {
        role: authenticatedRole.id
      }
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ تم تحديث دور المستخدم بنجاح!');
    
    // 5. التحقق من التحديث
    console.log('\n4️⃣ التحقق من التحديث...');
    const updatedUserResponse = await axios.get(`${baseURL}/api/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const updatedUser = updatedUserResponse.data;
    console.log('✅ المستخدم المحدث:');
    console.log(`- Role: ${updatedUser.role?.name || 'غير محدد'}`);
    console.log(`- Role Type: ${updatedUser.role?.type || 'غير محدد'}`);
    
    console.log('\n✅ تم إصلاح دور المستخدم بنجاح!');
    console.log('الآن يمكنك إضافة المنتجات باستخدام نفس الـ token.');
    
  } catch (error) {
    console.log('❌ خطأ في إصلاح دور المستخدم:');
    console.log('- Status:', error.response?.status);
    console.log('- Error:', error.response?.data?.error?.message || error.message);
    console.log('- Details:', error.response?.data?.error?.details || 'لا توجد تفاصيل');
  }
}

if (require.main === module) {
  fixUserRole();
}

module.exports = { fixUserRole };
