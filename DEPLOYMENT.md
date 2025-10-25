# 🚀 النشر والإطلاق

## النشر على الويب (Vercel)

### المتطلبات
- حساب Vercel
- مستودع GitHub متصل

### خطوات النشر

1. **ادفع التعديلات**
```bash
git push origin design-improvement
```

2. **الانتظار لـ Auto Deploy**
- Vercel سينشر تلقائياً عند كل push

3. **تحقق من الحالة**
- زيارة dashboard.vercel.com

### رابط الإنتاج
```
https://frn-production.vercel.app
```

## النشر على Google Play Store

### المتطلبات
- حساب Google Play
- ملف Android keystore
- Certificate signing

### خطوات البناء

```bash
npm run build:android
eas build --platform android --auto-submit
```

## النشر على Apple App Store

### المتطلبات
- حساب Apple Developer
- Mac (للـ build)
- Apple Certificate

### خطوات البناء

```bash
npm run build:ios
eas build --platform ios --auto-submit
```

## متطلبات الأمان

- ✅ HTTPS مجبر
- ✅ لا توجد بيانات حساسة في الكود
- ✅ تحقق من المتغيرات البيئية

## نصائح النشر

1. **اختبر دائماً محلياً أولاً**
   ```bash
   npm run build
   npm run test
   ```

2. **استخدم متغيرات البيئة**
   ```bash
   # .env
   REACT_APP_API_URL=https://api.example.com
   ```

3. **راقب الأخطاء**
   - استخدم Sentry للـ error tracking
   - استخدم Google Analytics للـ monitoring

## التحديثات والإصدارات

- اتبع Semantic Versioning (x.y.z)
- قم بـ tag لكل إصدار
- اكتب release notes واضحة

