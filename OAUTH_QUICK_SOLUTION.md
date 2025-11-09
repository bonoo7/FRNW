# ⚡ الحل السريع - خطأ redirect_uri_mismatch

## 🎯 المشكلة الآن:

```
error=400: redirect_uri_mismatch
flowName=GeneralOAuthFlow
```

---

## 🔴 السبب:

URIs في Google Console غير صحيحة أو لم تُحفظ!

---

## ✅ الحل (افعل هذا الآن):

### 1️⃣ في Google Cloud Console:

**اذهب إلى:**
```
https://console.cloud.google.com/
→ Credentials
→ Web Client
→ Authorized redirect URIs
```

**اترك فقط هذه 3:**
```
✅ https://fakker-auth.firebaseapp.com/__/auth/handler
✅ https://auth.expo.io/@bonoo7/frn
✅ https://auth.expo.io/
```

**احذف:**
```
❌ https://auth.expo.io/bonoo7/frn (بدون @)
❌ https://yourapp.fakker.net/auth/callback (placeholder)
```

**⭐ اضغط SAVE في الأسفل ⭐**

---

### 2️⃣ انتظر و امسح:

```
⏱️ انتظر 2 دقيقة

على الهاتف:
Settings → Apps → Expo Go → Storage
→ Clear Cache
→ Clear Data
→ أغلق التطبيق تماماً
```

---

### 3️⃣ جرّب مرة أخرى:

```bash
expo start --clear

# على الهاتف:
# امسح QR Code
# جرّب Google Sign-In
```

---

## 🎉 يجب أن يعمل الآن!

إذا استمرت المشكلة، اقرأ `OAUTH_FLOW_ERROR_FIX.md`
