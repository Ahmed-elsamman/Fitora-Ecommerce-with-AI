const https = require('https');

// تعطيل فحص SSL للاتصالات
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// إعدادات SSL مخصصة
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined,
});

// تطبيق الإعدادات على جميع طلبات HTTPS
if (typeof global !== 'undefined') {
  global.httpsAgent = httpsAgent;
}

console.log('✅ تم تطبيق إصلاح SSL');
console.log('⚠️  تحذير: تم تعطيل فحص SSL للأمان');

module.exports = { httpsAgent };
