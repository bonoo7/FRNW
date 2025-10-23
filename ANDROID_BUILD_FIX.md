# 🔧 تصحيح بناء تطبيق فكّر على Android

## 🔍 المشكلة المكتشفة

عند تشغيل `npm run android`، كان التطبيق يثبت باسم **"تحدي المعرفة"** وليس **"فكّر"** بسبب عدم توافق التكاوين بين ملفات المشروع.

### الأسباب:

| الملف | المحتوى القديم | المحتوى الجديد | الملاحظة |
|------|---------------|--------------|---------|
| `app.json` | `net.fakker.app` | `net.fakker.app` ✅ | صحيح من البداية |
| `android/app/build.gradle` | `com.bonoo7.frn` | `net.fakker.app` ⚠️ | **تم التصحيح** |
| `android/app/src/main/AndroidManifest.xml` | `com.bonoo7.frn` | `net.fakker.app` ⚠️ | **تم التصحيح** |
| `android/app/src/main/res/values/strings.xml` | `تحدي المعرفة` | `فكّر` ⚠️ | **تم التصحيح** |

---

## ✅ التصحيحات المطبقة

### 1. تحديث معرف التطبيق (Package Name)
```gradle
// BEFORE:
namespace 'com.bonoo7.frn'
applicationId 'com.bonoo7.frn'

// AFTER:
namespace 'net.fakker.app'
applicationId 'net.fakker.app'
```
**الملف:** `android/app/build.gradle` (السطور 89-91)

### 2. تحديث AndroidManifest.xml
```xml
<!-- BEFORE -->
<data android:scheme="com.bonoo7.frn"/>

<!-- AFTER -->
<data android:scheme="net.fakker.app"/>
```
**الملف:** `android/app/src/main/AndroidManifest.xml` (السطر 28)

### 3. تحديث اسم التطبيق في الموارد
```xml
<!-- BEFORE -->
<string name="app_name">تحدي المعرفة</string>

<!-- AFTER -->
<string name="app_name">فكّر</string>
```
**الملف:** `android/app/src/main/res/values/strings.xml` (السطر 2)

---

## 🚀 كيفية البناء الآن

### الخيار 1: البناء المحلي (الأسرع للاختبار)
```bash
npm install
npm run android
```

### الخيار 2: البناء السحابي مع EAS (الموصى به)
```bash
# تثبيت EAS CLI
npm install -g eas-cli

# تسجيل الدخول
eas login

# بناء النسخة التطوير
eas build --platform android --profile development

# أو بناء نسخة تجريبية
eas build --platform android --profile preview

# أو بناء نسخة إنتاجية (للـ Play Store)
eas build --platform android --profile production
```

---

## 📋 الملفات المعدلة

✅ `android/app/build.gradle`
✅ `android/app/src/main/AndroidManifest.xml`
✅ `android/app/src/main/res/values/strings.xml`

---

## 💾 معلومات التطبيق الجديدة

| المعلومة | القيمة |
|---------|--------|
| **اسم التطبيق** | فكّر |
| **Package Name** | `net.fakker.app` |
| **Slug** | `frn` |
| **الإصدار** | 1.0.0 |
| **رقم الإصدار** | 1 |

---

## 🧹 تنظيف قبل البناء

إذا واجهت مشاكل، جرب:

```bash
# حذف cache
npm run clean

# أو حذف يدوي
rm -r node_modules/.cache
rm -r .expo/web
rm -r android/app/build

# إعادة تثبيت
npm install
```

---

## 🐛 استكشاف الأخطاء

### إذا ظهر خطأ "Package already exists"
- احذف النسخة القديمة من الهاتف
- امسح Android Studio cache
- أعد تشغيل اللعبة

### إذا لم يظهر التطبيق
```bash
adb devices                    # تحقق من الهاتف المتصل
adb uninstall net.fakker.app   # احذف النسخة القديمة
npm run android                # بناء جديد
```

---

## 📝 ملاحظات

- **الخادم**: التطبيق يستخدم بيانات محلية وخادم Express في `server/`
- **المنصات**: التطبيق يعمل على iOS و Web أيضاً بنفس الاسم الجديد
- **التحديثات**: تأكد من تحديث جميع المراجع إذا غيرت معرف الحزمة مرة أخرى

---

**تم آخر تحديث:** 2025-10-23
**الحالة:** ✅ جاهز للبناء
