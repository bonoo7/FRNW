# 🎯 الحل الكامل - مشكلة Google OAuth في Expo Go

**تاريخ المشكلة:** إصلاح خطأ `400: redirect_uri_mismatch` و `access_blocked`

---

## 📊 ملخص الحالة:

### المشكلة:
```
❌ عند محاولة تسجيل الدخول عبر Google من Expo Go
   error=400: redirect_uri_mismatch
   access_blocked: فكّر's request is invalid

✅ يعمل من متصفح الويب (http://localhost:19000)
✅ المشكلة تحدث فقط على Expo Go في الهاتف
```

### الأسباب المكتشفة:
1. ❌ الـ `iosUrlScheme` خاطئ في `app.json` ← **تم إصلاحه**
2. ⚠️ Redirect URI ناقصة في Google Console ← **يجب إضافتها**
3. ⚠️ OAuth Consent Screen قد تكون غير مكتملة ← **تحقق من ذلك**

---

## ✅ التغييرات المطبقة:

### 1️⃣ تم إصلاح `app.json`:

```diff
- "iosUrlScheme": "com.googleusercontent.apps.372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q"
+ "iosUrlScheme": "fakker"

- "bundleIdentifier": "net.fakker.app"
+ "bundleIdentifier": "com.diwandevlab.fakker"

- "package": "net.fakker.app"
+ "package": "com.diwandevlab.fakker"

+ إضافة CFBundleURLTypes للـ iOS
+ إضافة intentFilters للـ Android
```

### 2️⃣ التحقق من `contexts/AuthContext.js`:

```javascript
✅ clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com'
✅ androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com'
✅ scopes: ['profile', 'email']
```

---

## 🔧 الخطوات المتبقية (اليدوية):

### ⏳ الخطوة 1: تحديث Google Cloud Console

**الرابط:** https://console.cloud.google.com/

#### أ) OAuth Consent Screen:

```
1. اختر المشروع: fakker-auth
2. APIs & Services
3. OAuth consent screen
4. اضغط: EDIT APP
```

**تأكد من هذه الحقول:**
- [ ] User Type = **External** (مهم جداً!)
- [ ] App name = **فكّر**
- [ ] User support email = [بريدك]
- [ ] App logo = (اختياري)
- [ ] Developer contact = [بريدك]
- [ ] Authorized domains = (إذا كنت تستخدم custom domain)

**Scopes:**
- [ ] اضغط "Add or remove scopes"
- [ ] اختر: **email**
- [ ] اختر: **profile**
- [ ] حفظ

**اضغط: SAVE AND CONTINUE**

---

#### ب) Credentials - Web Client:

```
1. APIs & Services
2. Credentials
3. ابحث عن: Web client (في OAuth 2.0 Client IDs)
4. اضغط عليه
```

**في "Authorized redirect URIs":**
- [ ] اضغط: **+ ADD URI**
- [ ] أضف: `https://auth.expo.io/@bonoo7/frn`
- [ ] اضغط: **+ ADD URI** مرة أخرى
- [ ] أضف: `https://auth.expo.io/`
- [ ] اضغط: **+ ADD URI** مرة أخرى
- [ ] أضف: `https://fakker-auth.firebaseapp.com/__/auth/handler`

**اضغط: SAVE**

---

#### ج) تأكد من Android Client:

```
في نفس صفحة Credentials
```

**ابحث عن:** `Android client for com.diwandevlab.fakker`

**يجب أن تشاهد:**
```
Package name: com.diwandevlab.fakker ✓
```

---

### ⏳ الخطوة 2: على الهاتف - امسح الـ Cache

```bash
# 1. في الطرفية (أوقف expo إن كان مشغّل):
expo start --clear

# 2. في الهاتف:
# - اذهب إلى: Settings
# - اختر: Apps
# - ابحث عن: Expo Go
# - اضغط: Storage
# - اضغط: Clear Cache
# - (إذا أمكن) اضغط: Clear Data
# - افتح Expo Go من جديد
```

---

### ⏳ الخطوة 3: جرّب التسجيل

```
1. على الهاتف:
   - افتح Expo Go
   - امسح QR Code من الطرفية
   
2. انتظر لتحميل التطبيق

3. جرب تسجيل الدخول بـ Google
```

---

## 🚦 شجرة تشخيص المشاكل:

```
هل يعمل التسجيل؟
│
├─ ✅ نعم → مبروك! ✨
│
└─ ❌ لا → تحقق من:
   │
   ├─ 1️⃣ ظهرت رسالة خطأ؟
   │  ├─ نعم → انسخ الرسالة الكاملة
   │  └─ لا → انتقل إلى 2️⃣
   │
   ├─ 2️⃣ هل أضفت جميع Redirect URIs؟
   │  ├─ لا → ارجع للخطوة 1 (ب)
   │  └─ نعم → انتقل إلى 3️⃣
   │
   ├─ 3️⃣ هل مسحت Cache Expo Go؟
   │  ├─ لا → ارجع للخطوة 2
   │  └─ نعم → انتقل إلى 4️⃣
   │
   ├─ 4️⃣ هل مرت دقيقة واحدة؟
   │  ├─ لا → انتظر دقيقة
   │  └─ نعم → جرّب إعادة تشغيل الهاتف
   │
   └─ 5️⃣ إذا استمرت المشكلة:
      → استخدم Native Build بدلاً من Expo Go
```

---

## 📝 الملفات التي تم تعديلها:

```
✅ app.json
   - إصلاح iosUrlScheme
   - تحديث bundleIdentifier و package
   - إضافة intentFilters و CFBundleURLTypes

✅ contexts/AuthContext.js
   - تحقق ✓ (لا تحتاج تعديلات)

📄 ملفات التوثيق الجديدة:
   - EXPO_GO_OAUTH_FIX.md
   - EXPO_GO_QUICK_FIX.md
```

---

## 🎁 إذا لم يعمل بعد:

### الخيار 1: Native Build

```bash
# بناء نسخة أصلية:
expo prebuild --clean
expo run:android

# أو استخدام EAS Build:
eas build --platform android --profile preview
```

### الخيار 2: نسخة Web محسّنة

```bash
# إذا أردت نسخة ويب بدلاً من Expo Go:
npm run web
# ثم افتح المتصفح من الهاتف:
http://[IP_ADDRESS]:3000
```

### الخيار 3: استخدم Firebase Emulator

```bash
# للاختبار المحلي:
firebase emulators:start
```

---

## 📞 معلومات التواصل السريعة:

| النقطة | القيمة |
|------|--------|
| **Web Client ID** | 372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com |
| **Android Client ID** | 372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com |
| **Package Name** | com.diwandevlab.fakker |
| **Bundle ID (iOS)** | com.diwandevlab.fakker |
| **URL Scheme** | fakker |
| **Firebase Project** | fakker-auth |
| **Expo Username** | bonoo7 |

---

## ✨ ملخص النقاط المهمة:

⚠️ **تذكر:**
1. **iosUrlScheme** يجب أن يكون **fakker** وليس معرف Google
2. **Redirect URIs** يجب أن تكون بالضبط كما هي مكتوبة
3. **User Type** في OAuth Consent Screen يجب أن يكون **External**
4. **بعد أي تغيير في Google Console انتظر دقيقة واحدة**
5. **امسح Cache Expo Go بالكامل**

---

## 🎉 النتيجة المتوقعة:

بعد اتباع جميع الخطوات:
```
✅ يمكنك تسجيل الدخول من Expo Go
✅ بدون رسائل خطأ 400
✅ البيانات تُحفظ في Firebase
✅ ينقلك إلى صفحة البداية بنجاح
```

---

**للأسئلة أو المشاكل الإضافية، راجع ملفات التوثيق الأخرى:**
- `GOOGLE_OAUTH_SETUP.md` - شرح تفصيلي للإعداد من الصفر
- `ACCESS_BLOCKED_FIX.md` - حل مشاكل Access Blocked الأخرى
- `REDIRECT_URI_MISMATCH_FIX.md` - شرح مفصل للـ redirect_uri_mismatch
