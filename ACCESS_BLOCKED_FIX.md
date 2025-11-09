# 🚨 حل مشكلة "access_blocked: فكّر's request is invalid"

## ❌ المشكلة:
```
access_blocked: فكّر's request is invalid
```

هذا الخطأ يعني أن Google يرفض التطبيق لسبب أمني أو إعدادات ناقصة.

---

## 🔍 الأسباب المحتملة:

### 1️⃣ **OAuth Consent Screen غير مكتمل** ⚠️ (الأكثر شيوعاً)
### 2️⃣ **Scopes غير مسموح بها**
### 3️⃣ **Client ID من نوع خاطئ**
### 4️⃣ **App Status في Google Console**

---

## ✅ الحل الشامل:

### الخطوة 1️⃣: التحقق من OAuth Consent Screen

**اذهب إلى Google Cloud Console:**
```
APIs & Services 
  → OAuth consent screen
```

**تأكد من هذه النقاط:**

```
☐ User Type: External ✓ (مهم جداً!)
☐ App name: فكّر (أو اسم واضح)
☐ User support email: ✓ (بريدك الإلكتروني)
☐ App logo: ✓ (اختياري لكن أفضل)
☐ Developer contact: ✓ (بريدك أيضاً)
☐ Authorized domains: ✓ (لو كنت تستخدم domain)
☐ Scopes: ✓ (profile, email)
```

**المهم جداً:**
- ✅ إذا كان `User Type = External` → يجب تأكيد الـ Scopes
- ✅ اضغط: "Add or remove scopes"
- ✅ تأكد أن `email` و `profile` مختارة

---

### الخطوة 2️⃣: التحقق من Credentials

**اذهب إلى:**
```
APIs & Services 
  → Credentials
```

**تأكد من:**

☑️ **Web Client:**
```
Client ID: 372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com
Authorized Redirect URIs: ✓
  - https://auth.expo.io/@bonoo7/frn
  - https://auth.expo.io/
  - https://yourapp.fakker.net/auth/callback
  - https://fakker-auth.firebaseapp.com/__/auth/handler
```

☑️ **Android Client:**
```
Client ID: 372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com
Package: com.diwandevlab.fakker
```

---

### الخطوة 3️⃣: تفعيل Google+ API (مهم!)

**بعض الأحيان Google يحتاج تفعيل API:**

```
APIs & Services 
  → Library (البحث)
  → ابحث عن: "Google+ API"
  → اضغط: ENABLE
```

أو تأكد من تفعيل:
- ✅ Google+ API
- ✅ Google Identity API

---

### الخطوة 4️⃣: إذا كنت في مرحلة Testing

**إضافة حسابات الاختبار:**

```
OAuth consent screen
  → Test users (أسفل الشاشة)
  → Add users
  → اضف بريدك الإلكتروني
  → Save
```

---

## 📝 التحقق من الأكواد:

### في `contexts/AuthContext.js`:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
  scopes: ['profile', 'email'],  // ✅ يجب أن تكون الـ scopes هنا
});
```

### في `app.json`:

```json
{
  "android": {
    "package": "com.diwandevlab.fakker"  // ✅ يجب أن يطابق Google
  }
}
```

---

## 🎯 الحل الأسرع (جرّب هذا أولاً):

### 1️⃣ اذهب إلى Google Cloud Console
### 2️⃣ APIs & Services → OAuth consent screen
### 3️⃣ تأكد من:
   - User Type = **External**
   - تم تعبئة جميع الحقول المطلوبة
   - تم إضافة `profile` و `email` في Scopes

### 4️⃣ اذهب إلى Credentials
### 5️⃣ في Web Client → Authorized Redirect URIs:
   ```
   https://auth.expo.io/@bonoo7/frn
   https://auth.expo.io/
   https://fakker-auth.firebaseapp.com/__/auth/handler
   ```
### 6️⃣ اضغط SAVE

### 7️⃣ على الهاتف:
```bash
expo start --clear
```

---

## 🔗 روابط مفيدة:

- **Google Cloud Console**: https://console.cloud.google.com/
- **OAuth Scopes**: https://developers.google.com/identity/protocols/oauth2/scopes
- **Expo Auth Docs**: https://docs.expo.dev/guides/authentication/#google

---

## ⚠️ نقاط مهمة:

1. **User Type = External** ← هذا مهم جداً!
2. **Scopes يجب أن تكون موثوقة** من قبل Google
3. **لا تستخدم scopes غريبة** - استخدم فقط: `profile`, `email`
4. **بعد أي تغيير → أعد تشغيل Expo Go على الهاتف**

---

## 📱 إذا لم يعمل:

جرّب هذا:
1. امسح بيانات Expo Go من الهاتف
2. أعد تثبيت Expo Go
3. جرّب مرة أخرى

أو اسأل: هل ظهرت رسالة أخرى في المتصفح عندما ضغطت على Google Sign-In؟
