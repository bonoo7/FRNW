# 🔧 حل مشكلة Google OAuth في Expo Go - الخطأ 400 redirect_uri_mismatch

## ❌ المشكلة:
```
access_blocked: فكّر's request is invalid
error=400: redirect_uri_mismatch
```

**المشكلة تحدث فقط على Expo Go في الهاتف وليس على المتصفح**

---

## 🔍 السبب الرئيسي:

عند استخدام **Expo Go** للتطوير، Google يحتاج إلى معرفة redirect URI محدد. المشكلة عادة تكون:

1. **Redirect URI مفقود في Google Console**
2. **iOS URL Scheme خاطئ في `app.json`**
3. **OAuth Consent Screen غير مكتمل**

---

## ✅ الحل الشامل:

### الخطوة 1️⃣: إصلاح `app.json` ✅ (تم)

تم إصلاح الـ iOS URL Scheme:

```json
// ✅ الصحيح:
"plugins": [
  "@react-native-google-signin/google-signin",
  {
    "iosUrlScheme": "fakker"  // ✅ اسم الـ scheme البسيط
  }
]
```

---

### الخطوة 2️⃣: التحقق من Google Cloud Console

اذهب إلى: https://console.cloud.google.com/

#### أ) OAuth Consent Screen:
```
APIs & Services → OAuth consent screen
```

**تأكد من:**
- ☑️ User Type = **External**
- ☑️ App name = **فكّر**
- ☑️ User support email = (بريدك)
- ☑️ Developer contact = (بريدك)
- ☑️ Scopes = `email`, `profile`

اضغط **SAVE AND CONTINUE**

---

#### ب) Credentials:
```
APIs & Services → Credentials
```

**ابحث عن Web Client وتأكد من هذه الـ URIs:**

```
https://auth.expo.io/@bonoo7/frn
https://auth.expo.io/
https://fakker-auth.firebaseapp.com/__/auth/handler
```

**إذا كانت ناقصة، أضفها:**
1. اضغط على **Web Client**
2. اضغط **+ ADD URI** تحت "Authorized redirect URIs"
3. أضف كل URI واحدة وحفظ

---

### الخطوة 3️⃣: التحقق من Android Client

في Google Console → Credentials:

```
Android client for:
- Package: com.diwandevlab.fakker ✅
```

---

### الخطوة 4️⃣: على الهاتف - امسح الـ Cache

```bash
# 1️⃣ على الحاسوب:
expo start --clear

# 2️⃣ على الهاتف:
# - أغلق Expo Go بالكامل
# - اذهب إلى إعدادات الهاتف
# - Apps → Expo Go → Storage → Clear Cache
# - افتح Expo Go مجدداً
# - جرب تسجيل الدخول
```

---

## 🎯 إذا استمرت المشكلة:

### جرّب هذا:

#### 1️⃣ أعد تشغيل Expo Go بالكامل:
```bash
# أغلق Expo Go تماماً
# أغلق الطرفية
# أعد فتح الطرفية
# اكتب:
expo start --clear
```

#### 2️⃣ امسح جميع بيانات Expo Go:
```
Settings → Apps → Expo Go → Storage → Clear Data
(ليس فقط Cache)
```

#### 3️⃣ تحقق من رقم الإصدار:
```bash
expo -v
npm list expo
```

#### 4️⃣ جرّب Native Build:
```bash
# بدلاً من Expo Go
expo prebuild --clean
expo run:android
```

---

## 📋 قائمة التحقق:

### في Google Console:
- [ ] OAuth Consent Screen = External
- [ ] جميع الحقول المطلوبة معبأة
- [ ] Scopes = email, profile
- [ ] Web Client اذهب إلى Authorized URIs:
  - [ ] https://auth.expo.io/@bonoo7/frn
  - [ ] https://auth.expo.io/
  - [ ] https://fakker-auth.firebaseapp.com/__/auth/handler

### في `app.json`:
- [ ] `scheme`: "fakker"
- [ ] `iosUrlScheme`: "fakker"
- [ ] `android.package`: "com.diwandevlab.fakker"
- [ ] `ios.bundleIdentifier`: "com.diwandevlab.fakker"

### في `contexts/AuthContext.js`:
- [ ] `clientId`: صحيح من Google Console
- [ ] `androidClientId`: من Android Client في Google Console
- [ ] `iosClientId`: مساوي للـ `clientId`
- [ ] `scopes`: ['profile', 'email']

### على الهاتف:
- [ ] تم مسح بيانات Expo Go
- [ ] تم فتح Expo Go مرة أخرى
- [ ] تم تشغيل `expo start --clear`

---

## 🚀 خطوات الاختبار:

### الأولى - من المتصفح (يعمل):
```
1. اذهب إلى http://localhost:19000
2. جرب تسجيل الدخول
3. يجب أن يعمل ✅
```

### الثانية - من Expo Go (الهدف):
```
1. افتح Expo Go على الهاتف
2. امسح الـ QR Code
3. جرب تسجيل الدخول
4. إذا ظهرت رسالة error مرة أخرى، اقرأ الرسالة بدقة
```

---

## 💡 ملاحظات مهمة:

⚠️ **البيانات تحتاج وقت للتحديث:**
- تغييرات Google Console قد تستغرق **1-2 دقيقة**
- امسح cache Expo Go و أعد التشغيل
- أحياناً إعادة تشغيل الهاتف مفيدة

⚠️ **Expo Go مختلف عن Native Build:**
- Expo Go يستخدم معرف تطبيق Google خاص به
- إذا كنت تريد النسخة النهائية، استخدم Native Build

⚠️ **تجنب الأخطاء الشائعة:**
- لا تستخدم `localhost` مع Expo Go
- لا تضع مسافات في معرفات Google
- تأكد من نسخ Package Name بالضبط

---

## 📞 إذا استمرت المشكلة:

1. **تأكد من البريد الإلكتروني:**
   - هل البريد الذي تحاول الدخول به موجود في Test Users؟
   - اذهب إلى OAuth Consent Screen → Test Users
   - أضف بريدك الإلكتروني

2. **تأكد من الإعدادات في Firebase:**
   - اذهب إلى Firebase Console
   - تأكد أن Google Sign-In مفعل
   - تأكد من الـ Web Client ID

3. **جرّب إعادة الإنشاء:**
   ```bash
   rm -rf .expo
   expo start --clear
   ```

---

## ✨ المساعدة الإضافية:

- 📚 [Expo Auth Documentation](https://docs.expo.dev/guides/authentication/#google)
- 🔐 [Google Cloud Console](https://console.cloud.google.com)
- 🚀 [Firebase Console](https://console.firebase.google.com)

---

**آخر تحديث:** تم إصلاح `app.json` - الآن جرّب الخطوات أعلاه على Google Console ✅
