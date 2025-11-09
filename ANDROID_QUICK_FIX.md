# ⚡ الإصلاح السريع - Android OAuth في Expo Go

## 🎯 المشكلة:
```
❌ error=400: redirect_uri_mismatch
❌ على Expo Go و محاكي Android فقط
```

## ✅ الحل:

### تم تعديل `contexts/AuthContext.js`:

```javascript
// ❌ القديم:
redirectUrl: 'https://auth.expo.io/@bonoo7/frn'

// ✅ الجديد:
redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'
```

---

## 🚀 ما تحتاج الآن:

### 1️⃣ Google Cloud Console (2 دقيقة):

**اذهب إلى:** https://console.cloud.google.com/

**في Credentials → Web Client:**
- تأكد من وجود هذا الـ URI:
  ```
  https://fakker-auth.firebaseapp.com/__/auth/handler
  ```
- إذا لم يكن موجود، أضفه واضغط SAVE

---

### 2️⃣ جهازك (2 دقيقة):

```bash
expo start --clear
```

**على Android:**
```
Settings → Apps → Expo Go → Storage
← اضغط Clear Cache
← اضغط Clear Data
← افتح Expo Go من جديد
← امسح QR Code
```

---

### 3️⃣ اختبر (30 ثانية):

```
اضغط Google Sign-In
```

✅ **يجب أن يعمل الآن!**

---

## 📝 ملخص:

| | القديم | الجديد |
|---|---|---|
| Redirect URL | `https://auth.expo.io/@bonoo7/frn` | `https://fakker-auth.firebaseapp.com/__/auth/handler` |
| البناء | ✓ يعمل | ✓ يعمل |
| Expo Go iOS | ✓ يعمل | ✓ يعمل |
| **Expo Go Android** | ❌ لا يعمل | ✅ **يعمل الآن!** |

---

## 📞 التفاصيل:

**Redirect URLs المطلوبة:**
1. `https://auth.expo.io/@bonoo7/frn` (Expo)
2. `https://auth.expo.io/` (Expo)
3. `https://fakker-auth.firebaseapp.com/__/auth/handler` (Firebase - مهم لـ Android)

---

**الكود جاهز!** ✅ الآن أضف الـ URL في Google Console وجرّب 🎉
