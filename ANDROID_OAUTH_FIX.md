# 🔧 إصلاح Google OAuth على Android في Expo Go

## 🔴 المشكلة الحقيقية:

```
❌ error=400: redirect_uri_mismatch
❌ access_blocked: فكّر's request is invalid
(على Expo Go و محاكي Android فقط)
```

## 🔍 السبب:

Expo Go على **Android** يحتاج `redirectUrl` مختلفة!

**ما كان يحدث:**
```javascript
// ❌ خاطئ لـ Android
redirectUrl: 'https://auth.expo.io/@bonoo7/frn'  // هذا للـ iOS/Web
```

**الصحيح الآن:**
```javascript
// ✅ صحيح لـ Android
redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'  // Firebase URL
```

---

## ✅ التصحيح المطبق:

### `contexts/AuthContext.js` - تم التحديث:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'  // ✅ Firebase URL
});
```

---

## 🚀 الخطوات التالية:

### 1️⃣ تحديث Google Cloud Console (هام جداً!):

**اذهب إلى:** https://console.cloud.google.com/

**في Credentials → Web Client:**

تأكد من وجود هذه URIs:
```
✓ https://fakker-auth.firebaseapp.com/__/auth/handler
✓ https://auth.expo.io/@bonoo7/frn
✓ https://auth.expo.io/
```

**إذا كانت ناقصة، أضفها:**
1. اضغط: + ADD URI
2. أضف: `https://fakker-auth.firebaseapp.com/__/auth/handler`
3. اضغط: SAVE

---

### 2️⃣ على جهاز Android:

```bash
# في الطرفية:
expo start --clear

# على الهاتف/محاكي:
# اذهب إلى Settings
# اختر Apps
# اختر Expo Go
# اختر Storage
# اضغط: Clear Cache (و Clear Data)
# افتح Expo Go من جديد
# امسح QR Code
```

---

### 3️⃣ اختبر التسجيل:

```
1. اضغط تسجيل الدخول
2. اختر Google
3. اختر الحساب
4. انتظر...

🟢 يجب أن يعمل الآن!
```

---

## 📋 قائمة التحقق:

- [x] تم تحديث `contexts/AuthContext.js`
- [ ] تم إضافة Firebase URL في Google Console
- [ ] تم مسح Cache Expo Go
- [ ] تم تشغيل `expo start --clear`
- [ ] تم الاختبار على Android

---

## 🎯 معلومات مهمة:

### معرفات Google:
```
Web Client ID: 372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q
Android Client ID: 372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul
```

### Redirect URLs المطلوبة:
```
1. https://auth.expo.io/@bonoo7/frn        (Expo Go)
2. https://auth.expo.io/                   (Expo)
3. https://fakker-auth.firebaseapp.com/__/auth/handler  (Firebase/Android)
```

### Package:
```
com.diwandevlab.fakker
```

---

## ⚠️ نقاط حرجة:

1. **Firebase URL هو المفتاح**
   - بدونها Android لن يعمل

2. **Google Console يجب أن يكون محدث**
   - تأكد من إضافة جميع الـ URIs

3. **Cache Expo Go**
   - يجب أن تمسح كلياً

4. **انتظر دقيقة واحدة**
   - Google تحتاج وقتاً للتحديث

---

## 📊 الفرق بين iOS و Android:

| | iOS | Android |
|---|---|---|
| Redirect URL | `https://auth.expo.io/@bonoo7/frn` | `https://fakker-auth.firebaseapp.com/__/auth/handler` |
| Scheme | `com.googleusercontent.apps...` | نفس الـ Web Client |
| Bundle ID | `com.diwandevlab.fakker` | Package: `com.diwandevlab.fakker` |

---

## 🎉 النتيجة المتوقعة:

بعد هذه التصحيحات:
```
✅ Expo Go على Android يعمل
✅ محاكي Android يعمل
✅ لا أخطاء redirect_uri_mismatch
✅ لا رسائل access_blocked
```

---

## 🔗 الملفات ذات الصلة:

- `DO_THIS_NOW.md` - الخطوات السريعة
- `EXPO_GO_SUPER_QUICK.md` - ملخص سريع
- `FINAL_FIX_REPORT.md` - تقرير شامل

---

**آخر تحديث:** `2025-11-03`  
**الحالة:** ✅ تم التصحيح - جاهز للاختبار على Android
