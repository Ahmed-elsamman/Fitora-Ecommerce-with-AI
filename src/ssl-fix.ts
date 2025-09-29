// إصلاح مشكلة SSL
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

console.log('✅ تم تطبيق إصلاح SSL');
