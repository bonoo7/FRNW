# 🛠️ خطوات الإصلاح السريعة - Google OAuth في Expo Go

## المشكلة:
```
error=400: redirect_uri_mismatch
access_blocked: فكّر's request is invalid
```
**يحدث فقط على Expo Go من الهاتف** ✓

---

## ✅ التغييرات المطبقة:

### 1️⃣ `app.json` - تم إصلاحه:
```json
✅ "scheme": "fakker"
✅ "iosUrlScheme": "fakker"
✅ "bundleIdentifier": "com.diwandevlab.fakker"
✅ "android.package": "com.diwandevlab.fakker"
✅ إضافة intentFilters و CFBundleURLTypes
```

---

## 🚀 الخطوات المطلوبة على Google Cloud Console:

### الخطوة 1: OAuth Consent Screen
```
1. اذهب إلى: https://console.cloud.google.com/
2. اختر المشروع: fakker-auth
3. APIs & Services → OAuth consent screen
```

**تأكد من:**
- [ ] User Type = **External**
- [ ] App name = **فكّر**
- [ ] User support email = (ضع بريدك)
- [ ] Developer contact = (ضع بريدك)
- [ ] اضغط "Add or remove scopes"
  - [ ] أضف: `email`, `profile`
- [ ] اضغط **SAVE AND CONTINUE**

---

### الخطوة 2: Credentials - Web Client

```
APIs & Services → Credentials
```

**في Web Client الخاص بك:**

اضغط على **Web client** وأضف هذه Redirect URIs:

```
https://auth.expo.io/@bonoo7/frn
https://auth.expo.io/
https://fakker-auth.firebaseapp.com/__/auth/handler
```

**كيفية الإضافة:**
1. في "Authorized redirect URIs" اضغط **+ ADD URI**
2. أضف الرابط الأول وحفظ
3. كرر للرابط الثاني والثالث
4. اضغط **SAVE** في الأسفل

---

### الخطوة 3: تأكد من Android Client

```
في نفس صفحة Credentials
```

**ابحث عن Android client:**
```
Package Name: com.diwandevlab.fakker
```

---

## 📱 على الهاتف:

### أولاً - امسح الـ Cache:

```bash
# 1. في الطرفية على الحاسوب:
expo start --clear

# 2. في الهاتف:
# ➡️ اذهب إلى: Settings
# ➡️ Apps
# ➡️ اعثر على: Expo Go
# ➡️ Storage
# ➡️ اضغط: Clear Cache (و Clear Data إن أمكن)
# ➡️ افتح Expo Go مرة أخرى
```

### ثانياً - جرب التسجيل:

```
1. افتح Expo Go
2. امسح QR Code من طرفية الحاسوب
3. جرب تسجيل الدخول بـ Google
```

---

## 🎯 إذا لم يعمل:

### جرّب هذه الخطوات:

#### الخطوة 1: أعد تشغيل كل شيء
```bash
# في الطرفية:
Ctrl+C  # لإيقاف expo
expo start --clear
```

#### الخطوة 2: امسح بيانات Expo Go كلياً
```
Settings → Apps → Expo Go → Storage
⬇️ اضغط: Clear Cache
⬇️ اضغط: Clear Data (احذر: ستحتاج إلى إعادة تثبيت)
```

#### الخطوة 3: تحقق من Test Users في Google Console
```
OAuth consent screen → Test users (أسفل الصفحة)
⬇️ اضغط: + ADD USERS
⬇️ ضع بريدك الإلكتروني
⬇️ اضغط: SAVE
```

#### الخطوة 4: جرّب Native Build
```bash
# إذا استمرت المشكلة:
eas build --platform android --profile preview
# أو للتطوير المباشر:
expo prebuild --clean
expo run:android
```

---

## 📋 تحقق سريع:

### في `app.json`:
```bash
cd C:\Users\6rga3\FRNW
grep -E '"scheme"|"iosUrlScheme"|"package"|"bundleIdentifier"' app.json
```

**يجب أن تشاهد:**
```
"scheme": "fakker"
"iosUrlScheme": "fakker"
"bundleIdentifier": "com.diwandevlab.fakker"
"package": "com.diwandevlab.fakker"
```

### في `contexts/AuthContext.js`:
```javascript
// السطر 37-40 يجب أن يكون:
clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
scopes: ['profile', 'email'],
```

---

## ⏰ ملخص التوقيت:

| الخطوة | الوقت المتوقع |
|------|-----------|
| إضافة Redirect URIs | 1-2 دقيقة |
| إعادة تشغيل Expo | 30 ثانية |
| امسح Cache Expo Go | 1-2 دقيقة |
| جرب التسجيل | 10 ثوانٍ |

**المجموع: ~5 دقائق** ⏱️

---

## 🆘 المساعدة الإضافية:

إذا استمرت المشكلة، أرسل:
1. **الرسالة الكاملة** التي تظهر في المتصفح
2. **لقطة شاشة** من Google Console (OAuth consent screen)
3. **ناتج** الأمر:
   ```bash
   expo --version
   npm list expo-auth-session
   ```

---

## ✨ ملاحظات ختامية:

✅ **تم إصلاح `app.json`**
✅ **الـ Client IDs صحيحة في `AuthContext.js`**
⚠️ **بقي عليك إضافة Redirect URIs في Google Console**
⚠️ **بعدها امسح Cache Expo Go**
🎉 **يجب أن يعمل!**

---

**تم إنشاء هذا الملف بناءً على المشكلة المبلغ عنها**
**آخر تحديث: اليوم**
