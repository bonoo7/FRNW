# 🔧 حل المشكلة الحقيقية - Expo Go Redirect URI

## 🔴 المشكلة الحقيقية:

```
redirect_uri=exp://192.168.8.13
flowName=GeneralOAuthFlow
```

---

## 🎯 ماذا يعني هذا؟

عندما تشغل التطبيق على **Expo Go** (محاكي أو هاتف)، يُرسل:

```
redirect_uri = exp://192.168.8.13
```

لكن في **Google Console** لديك:

```
https://auth.expo.io/@bonoo7/frn
https://auth.expo.io/
https://fakker-auth.firebaseapp.com/__/auth/handler
```

**هذه لا تطابق `exp://192.168.8.13`!** ❌

---

## ✅ الحل:

### أضف هذا الـ URI في Google Console:

```
exp://192.168.8.13
```

و أيضاً:

```
exp://localhost:19000
```

---

## 🚀 الخطوات:

### في Google Cloud Console:

```
1. اذهب إلى: https://console.cloud.google.com/
2. Credentials → Web Client
3. في Authorized redirect URIs اضغط: + ADD URI
4. أضف: exp://192.168.8.13
5. اضغط: + ADD URI مرة أخرى
6. أضف: exp://localhost:19000
7. اضغط: SAVE
```

---

## 📋 القائمة الكاملة الصحيحة:

```
✅ https://fakker-auth.firebaseapp.com/__/auth/handler
✅ https://auth.expo.io/@bonoo7/frn
✅ https://auth.expo.io/
✅ exp://192.168.8.13              ← أضف هذا (محاكي)
✅ exp://localhost:19000           ← أضف هذا (محاكي)
```

---

## 🎯 ملاحظة مهمة:

`192.168.8.13` هي **IP المحاكي الخاص بك**

إذا تغيرت IP المحاكي:
- أضف الـ IP الجديدة أيضاً
- أو استخدم `exp://localhost:19000` (يعمل دائماً)

---

## 🧪 اختبر الآن:

```bash
expo start --clear

# على المحاكي:
# امسح QR Code
# جرّب Google Sign-In
```

---

## 🎉 يجب أن يعمل الآن!
