# 🔧 الحل - Google OAuth على Android في Expo Go

## ✅ ما تم إصلاحه:

تم تغيير `redirectUrl` في `contexts/AuthContext.js`:

```javascript
// ❌ القديم (لا يعمل على Android):
redirectUrl: 'https://auth.expo.io/@bonoo7/frn'

// ✅ الجديد (يعمل على Android):
redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'
```

---

## 🚀 ما تفعله الآن:

### 1️⃣ Google Cloud Console:
```
1. اذهب إلى: https://console.cloud.google.com/
2. APIs & Services → Credentials
3. Web Client → Authorized redirect URIs
4. أضف: https://fakker-auth.firebaseapp.com/__/auth/handler
5. اضغط: SAVE
```

### 2️⃣ جهازك:
```bash
expo start --clear

# على الهاتف/محاكي:
# Settings → Apps → Expo Go → Storage
# Clear Cache + Clear Data
# افتح Expo Go من جديد
# امسح QR Code
```

### 3️⃣ اختبر:
```
اضغط Google Sign-In
```

---

## ✨ يجب أن يعمل الآن! 🎉
