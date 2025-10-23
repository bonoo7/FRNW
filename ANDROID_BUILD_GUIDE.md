# 📱 خطوات البناء والتشغيل على Android

## الخطوة 1️⃣: تثبيت الاعتماديات
```bash
cd C:\Users\6rga3\FRNW
npm install
```

## الخطوة 2️⃣: البناء المحلي (البسيط)
```bash
npm run android
```
**المتطلبات:**
- Android Studio أو Android SDK
- Java Development Kit (JDK)
- هاتف أو محاكاة متصل عبر ADB

---

## الخطوة 3️⃣: البناء السحابي (الموصى به) - اختياري

### أ) تثبيت EAS CLI
```bash
npm install -g eas-cli
```

### ب) تسجيل الدخول إلى Expo
```bash
eas login
# أو إنشاء حساب جديد
eas auth
```

### ج) بناء التطبيق
```bash
# نسخة تطوير (سريعة)
eas build --platform android --profile development

# نسخة تجريبية (قريبة من الإنتاج)
eas build --platform android --profile preview

# نسخة إنتاجية (للـ Play Store)
eas build --platform android --profile production
```

---

## 🔥 المشاكل الشائعة والحلول

### ❌ خطأ: "Port 8081 is in use"
```bash
# استخدم منفذ مختلف
npm start -- --port 8082
```

### ❌ خطأ: "Cannot find Android SDK"
```bash
# ضبط متغيرات البيئة
setx ANDROID_HOME "C:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk"
```

### ❌ خطأ: "App already installed"
```bash
# احذف النسخة القديمة أولاً
adb uninstall net.fakker.app
npm run android
```

### ❌ خطأ: "Build failed"
```bash
# نظف وأعد المحاولة
npm run clean
rm -r node_modules/.cache
npm install
npm run android
```

---

## 📋 التحقق من الأجهزة المتصلة
```bash
adb devices
```

---

## ✅ النتيجة المتوقعة
- اسم التطبيق: **فكّر** ✅
- معرّف الحزمة: `net.fakker.app` ✅
- الإصدار: 1.0.0 ✅

---

## 💡 نصائح إضافية

1. **قبل البناء**: تأكد من توصيل الهاتف بـ USB وتفعيل وضع المطور
2. **أثناء البناء**: لا تقطع الاتصال أو أغلق الطرفية
3. **بعد البناء**: قد يستغرق التثبيت دقائق، انتظر حتى ينتهي

---

**للمزيد من التفاصيل:** اقرأ `ANDROID_BUILD_FIX.md`
