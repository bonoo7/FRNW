# 🔧 حل مشكلة `redirect_uri_mismatch`

## ❌ المشكلة:
```
error=400: redirect_uri_mismatch
request_details: flowName=GeneralOuthFlow
```

هذا يعني أن Google يرفض الاتصال لأن Package Name لا يطابق!

---

## 🔍 السبب الرئيسي:

**في Google Cloud Console:**
```
✓ Android client for: com.diwandevlab.fakker
```

**في `app.json` (قديم):**
```json
"package": "net.fakker.app"  ❌ لا يطابق!
```

---

## ✅ الحل المطبق:

### تم تحديث `app.json`:

**قبل:**
```json
{
  "ios": {
    "bundleIdentifier": "net.fakker.app"
  },
  "android": {
    "package": "net.fakker.app"
  }
}
```

**بعد:**
```json
{
  "ios": {
    "bundleIdentifier": "com.diwandevlab.fakker"
  },
  "android": {
    "package": "com.diwandevlab.fakker"
  }
}
```

---

## 🚀 الخطوات التالية:

### 1️⃣ لـ Expo Go (التطوير):
```bash
# امسح الـ cache
expo start --clear

# على الهاتف:
# 1. أغلق Expo Go
# 2. افتحه مرة أخرى
# 3. امسح Cache من إعدادات الهاتف
# 4. جرب تسجيل الدخول
```

### 2️⃣ لـ Native Build (للإنتاج):
```bash
# إذا كنت ستبني النسخة الأصلية:
expo prebuild --clean
expo run:android
```

---

## 📋 التحقق السريع:

تأكد أن:

✅ **في `app.json`:**
- `ios.bundleIdentifier`: `com.diwandevlab.fakker`
- `android.package`: `com.diwandevlab.fakker`

✅ **في Google Console (Credentials):**
- Android client for: `com.diwandevlab.fakker`
- Authorized Redirect URIs تحتوي على:
  - `https://auth.expo.io/@bonoo7/frn`
  - `https://auth.expo.io/`
  - `https://fakker-auth.firebaseapp.com/__/auth/handler`

✅ **في `contexts/AuthContext.js`:**
- `androidClientId`: من Google Console

---

## ⏱️ هل يحتاج وقت؟

**نعم، لكن عادة ثانيتين فقط:**
- Google يحفظ التغييرات في ثانية
- لكن قد تحتاج Expo Go إلى إعادة تشغيل كامل

---

## 🎯 إذا لم يعمل بعد:

1. تأكد من نسخ Package Name بالضبط **بدون مسافات**
2. أعد تشغيل الهاتف بالكامل
3. امسح بيانات Expo Go من إعدادات الهاتف
4. جرب مرة أخرى

---

## 📝 ملخص التغييرات:

- `app.json`: تم تحديث iOS Bundle ID و Android Package ✅
- معرفات عميل Google: صحيحة الآن ✅
- Redirect URIs: مسجلة في Google Console ✅
