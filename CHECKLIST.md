# ✅ قائمة التحقق - إصلاح وبناء تطبيق فكّر على Android

## 1️⃣ التحقق من الملفات المعدلة

### ✅ `android/app/build.gradle`
- [x] السطر 89: `namespace 'net.fakker.app'`
- [x] السطر 91: `applicationId 'net.fakker.app'`

```bash
# للتحقق:
Select-String -Path "android\app\build.gradle" -Pattern "net.fakker.app"
```

### ✅ `android/app/src/main/AndroidManifest.xml`
- [x] السطر 28: `<data android:scheme="net.fakker.app"/>`

```bash
# للتحقق:
Select-String -Path "android\app\src\main\AndroidManifest.xml" -Pattern "net.fakker.app"
```

### ✅ `android/app/src/main/res/values/strings.xml`
- [x] السطر 2: `<string name="app_name">فكّر</string>`

```bash
# للتحقق:
Select-String -Path "android\app\src\main\res\values\strings.xml" -Pattern "فكّر"
```

---

## 2️⃣ التنظيف

- [x] حذف `android/app/build/` (حجم قديم: 560 MB)
- [x] حذف `node_modules/.cache`
- [x] حذف `.expo/web`

```bash
# للتحقق:
Test-Path "android\app\build"  # يجب أن يكون FALSE
Test-Path "node_modules\.cache"  # يجب أن يكون FALSE
```

---

## 3️⃣ المتطلبات المسبقة

### المتطلبات الأساسية
- [x] Node.js 16+ مثبت
- [x] npm مثبت
- [x] المشروع في: `C:\Users\6rga3\FRNW`

```bash
# للتحقق:
node --version
npm --version
```

### متطلبات Android
- [ ] Java Development Kit (JDK 11+) مثبت
- [ ] Android SDK مثبت
- [ ] Android Studio أو SDK-only tools

```bash
# للتحقق:
java -version
adb --version
```

---

## 4️⃣ تثبيت الاعتماديات

```bash
cd C:\Users\6rga3\FRNW
npm install
```

- [ ] تم التثبيت بنجاح
- [ ] لا توجد أخطاء حمراء
- [ ] تم إنشاء `node_modules/`

---

## 5️⃣ الهاتف أو المحاكي

### إذا كان هاتفاً حقيقياً:
- [ ] تم توصيل الهاتف عبر USB
- [ ] تم تفعيل وضع المطور (Developer Mode)
- [ ] تم السماح بـ USB Debugging
- [ ] تم السماح بتثبيت من مصادر غير معروفة

```bash
# للتحقق:
adb devices  # يجب أن يظهر الهاتف
```

### إذا كان محاكياً:
- [ ] تم فتح محاكي Android
- [ ] المحاكي يعمل بشكل صحيح

```bash
# للتحقق:
adb devices  # يجب أن يظهر المحاكي
```

---

## 6️⃣ حذف النسخة القديمة (اختياري)

```bash
adb uninstall com.bonoo7.frn
```

- [ ] تم حذف النسخة القديمة بنجاح

---

## 7️⃣ البناء والتشغيل

```bash
npm run android
```

- [ ] بدأ عملية البناء
- [ ] لا توجد أخطاء
- [ ] تم تثبيت التطبيق على الجهاز
- [ ] فتح التطبيق تلقائياً

**وقت البناء المتوقع:** 5-10 دقائق (أول مرة)

---

## 8️⃣ التحقق من النتيجة

### على الهاتف:
- [ ] اسم التطبيق: **فكّر** ✅
- [ ] يعمل بدون أخطاء
- [ ] يمكن اللعب بشكل طبيعي

### من خلال الطرفية:
```bash
# للتحقق من أن التطبيق مثبت:
adb shell pm list packages | grep fakker
# يجب أن يظهر: package:net.fakker.app
```

---

## 9️⃣ استكشاف الأخطاء

### إذا فشل البناء:

```bash
# نظف وأعد المحاولة:
npm run clean
npm install
npm run android
```

- [ ] تم التنظيف
- [ ] تم إعادة التثبيت
- [ ] حاول البناء مرة أخرى

### إذا ظهر خطأ "Package already exists":

```bash
# احذف النسخة القديمة أولاً:
adb uninstall com.bonoo7.frn
adb uninstall net.fakker.app  # احذف أي نسخة جديدة
npm run android
```

- [ ] تم حذف النسخ السابقة
- [ ] حاول البناء مرة أخرى

---

## 🔟 المرحلة التالية (اختياري)

### للنشر على Play Store:
```bash
eas build --platform android --profile production
eas submit --platform android
```

- [ ] تم البناء الإنتاجي
- [ ] تم الرفع على Play Store

---

## 📊 الملخص النهائي

| الخطوة | الحالة | الملاحظات |
|------|--------|---------|
| تصحيح الملفات | ✅ مكتمل | 3 ملفات معدلة |
| التنظيف | ✅ مكتمل | تم حذف 560 MB |
| المتطلبات | ⏳ بالانتظار | بحاجة لـ JDK و Android SDK |
| الاعتماديات | ⏳ بالانتظار | بعد تشغيل `npm install` |
| الجهاز | ⏳ بالانتظار | هاتف أو محاكي متصل |
| البناء | ⏳ بالانتظار | تشغيل `npm run android` |
| النتيجة | ⏳ بالانتظار | اسم التطبيق يجب أن يكون "فكّر" |

---

## 📞 الدعم

إذا واجهت مشاكل:
1. اقرأ `ANDROID_BUILD_FIX.md`
2. اقرأ `ANDROID_BUILD_GUIDE.md`
3. اقرأ `ANDROID_FIX_AR.md`
4. اقرأ `PROJECT_COMPARISON.md`

---

**تاريخ الإنشاء:** 2025-10-23  
**آخر تحديث:** 2025-10-23  
**الحالة:** ✅ جاهز
