# 🔧 حل مشكلة المتصفح الخارجي - OAuth يفتح خارج التطبيق

## 🔴 المشكلة:

```
✅ التطبيق يعمل
❌ لكن عند اختيار Google Sign-In
❌ ينفتح متصفح خارجي
❌ يجب أن يكون داخل التطبيق فقط
```

---

## 🎯 السبب:

الـ `redirectUrl` أو معرفات Google مكسورة!

عندما يفشل OAuth flow، Expo تفتح متصفح خارجي كـ fallback.

---

## ✅ الحل:

### المشكلة في `contexts/AuthContext.js`:

الـ `redirectUrl` الحالية قد تكون خاطئة:

```javascript
// ❓ قد تكون المشكلة هنا:
redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'
```

---

## 🔧 التصحيح:

### قم بتغيير `contexts/AuthContext.js`:

استبدل السطور 36-41 بهذا:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  // حذفنا redirectUrl - Expo ستتعامل معها تلقائياً
});
```

---

### أو إذا أردت بقاء redirectUrl:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
  redirectUrl: 'https://auth.expo.io/'  // استخدم الـ base URL بدلاً من Firebase URL
});
```

---

## 📝 شرح:

| الخيار | الشرح |
|--------|--------|
| **بدون redirectUrl** | Expo تستخدم default Redirect URL - يعمل بشكل أفضل |
| **مع `https://auth.expo.io/`** | Base URL الآمن - يعمل معظم الوقت |
| **مع Firebase URL** | قد يسبب مشاكل عند التطوير على محاكي |

---

## 🚀 الخطوات:

### 1️⃣ عدّل `contexts/AuthContext.js`:

```javascript
// غيّر من:
redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'

// إلى (الخيار الأول - الأفضل):
// احذفها تماماً

// أو (الخيار الثاني):
redirectUrl: 'https://auth.expo.io/'
```

### 2️⃣ اختبر:

```bash
expo start --clear

# على محاكي Android:
# امسح QR Code
# اضغط Google Sign-In
```

---

## ✅ النتيجة:

بعد هذا التصحيح:
```
✅ Google Sign-In يفتح داخل التطبيق (WebView)
✅ لا متصفح خارجي
✅ تسجيل دخول سلس
```

---

## 🎯 إذا استمرت المشكلة:

### جرّب هذا:

```javascript
// أزل redirectUrl تماماً:
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',
  androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',
  scopes: ['profile', 'email']
  // لا توجد redirectUrl
});
```

---

## 📞 معلومات إضافية:

عندما تحذف `redirectUrl`:
- Expo تستخدم **Expo Go redirect scheme** تلقائياً
- `exp://` يُستخدم تلقائياً
- Google OAuth تعرفها وتقبلها

---

## 🎉 يجب أن يعمل الآن!

**النقطة المهمة:** Firebase URL قد تسبب مشاكل في Expo Go. استخدم Expo URLs فقط!
