# 🚀 ابدأ هنا

## المتطلبات

- Node.js 16 أو أحدث
- npm أو yarn
- Expo CLI (اختياري)

## التثبيت

### 1. استنساخ المستودع
```bash
git clone https://github.com/bonoo7/FRNW.git
cd FRNW
```

### 2. تثبيت الـ Dependencies
```bash
npm install
```

### 3. تشغيل التطبيق

**للويب:**
```bash
npm run web
```

**للـ Development:**
```bash
npm run dev
```

**للـ Android:**
```bash
npm run android
```

## الأوامر المتاحة

| الأمر | الوصف |
|------|-------|
| `npm start` | بدء التطبيق الأساسي |
| `npm run web` | تشغيل على الويب |
| `npm run dev` | تشغيل مع dev client |
| `npm run android` | بناء وتشغيل على Android |
| `npm run ios` | بناء وتشغيل على iOS |
| `npm run build` | بناء للويب (production) |
| `npm run lint` | فحص الأكواد |
| `npm run test` | تشغيل الاختبارات |

## أول خطوات

1. **اختبر التطبيق محلياً:**
   ```bash
   npm run web
   ```

2. **افتح المتصفح:**
   - سيفتح تلقائياً على `http://localhost:19006`

3. **اختبر الميزات الأساسية:**
   - الشاشة الرئيسية
   - اختيار الفئات
   - لعب جولة تجريبية

## استكشاف الأخطاء

**المشكلة**: `npm: command not found`
- **الحل**: تأكد من تثبيت Node.js

**المشكلة**: خطأ في البناء
- **الحل**: احذف `node_modules` و `package-lock.json` ثم أعد التثبيت:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**المشكلة**: المنفذ مشغول
- **الحل**: قتل العملية على المنفذ 19006 أو اختر منفذ مختلف

## الخطوات التالية

- اقرأ [ARCHITECTURE.md](./ARCHITECTURE.md) لفهم بنية المشروع
- اقرأ [CONTRIBUTING.md](./CONTRIBUTING.md) للمساهمة
- تفقد [FAQ.md](./FAQ.md) للأسئلة الشائعة

