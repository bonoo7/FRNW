# 🔴 تحليل الخطأ: flowName=GeneralOAuthFlow

## 📊 معلومات الخطأ:

```
خطأ: error=400: redirect_uri_mismatch
التفاصيل: flowName=GeneralOAuthFlow
الوقت: 2025-11-03T07:20:15.898Z
```

---

## 🔍 ماذا يعني هذا الخطأ؟

**`flowName=GeneralOAuthFlow`** يعني:
- Google تعالج طلب OAuth عام
- ✅ الطلب وصل إلى Google بشكل صحيح
- ❌ لكن Redirect URI المُرسل **لا يطابق أي URI في Google Console**

---

## 🎯 السبب المحتمل:

### 1️⃣ **URIs لم تُحفظ بشكل صحيح:**

```
❌ قمت بحذف URIs الخاطئة
   لكن لم تضغط SAVE!
```

**الحل:**
```
1. اذهب إلى Google Cloud Console
2. Credentials → Web Client
3. احذف URIs الخاطئة:
   - https://auth.expo.io/bonoo7/frn (بدون @)
   - https://yourapp.fakker.net/auth/callback (placeholder)
4. تأكد من وجود الـ 3 URIs الصحيحة
5. ⭐ اضغط SAVE في الأسفل ⭐
```

---

### 2️⃣ **Google لم تحدّث الإعدادات بعد:**

Google تحتاج **1-2 دقيقة** لتطبيق التغييرات

**الحل:**
```
1. انتظر 2 دقيقة
2. امسح Cache Expo Go تماماً
3. اغلق التطبيق
4. افتحه من جديد
5. جرّب مرة أخرى
```

---

### 3️⃣ **Redirect URL في الكود مختلفة:**

إذا كانت جميع URIs موجودة و تم حفظها...

**تحقق من:**
```javascript
// في contexts/AuthContext.js السطر 41
redirectUrl: 'https://fakker-auth.firebaseapp.com/__/auth/handler'

// هل هذا الـ URL موجود في Google Console؟
// يجب أن تكون الإجابة: ✅ نعم
```

---

## ✅ خطوات التصحيح الكاملة:

### الخطوة 1️⃣: Google Cloud Console

```
1. اذهب إلى: https://console.cloud.google.com/
2. اختر المشروع: fakker-auth
3. APIs & Services → Credentials
4. اضغط على Web Client

في Authorized redirect URIs:
   ✅ https://fakker-auth.firebaseapp.com/__/auth/handler
   ✅ https://auth.expo.io/@bonoo7/frn
   ✅ https://auth.expo.io/

   ❌ احذف:
      - https://auth.expo.io/bonoo7/frn (بدون @)
      - https://yourapp.fakker.net/auth/callback (placeholder)

5. اضغط SAVE ⭐ (مهم جداً!)
```

---

### الخطوة 2️⃣: انتظر و امسح

```
1. انتظر 2 دقيقة حتى Google تطبق التغييرات
2. على الهاتف:
   - اذهب إلى Settings
   - Apps → Expo Go → Storage
   - اضغط Clear Cache
   - اضغط Clear Data
   - أغلق التطبيق تماماً
```

---

### الخطوة 3️⃣: جرّب مرة أخرى

```bash
expo start --clear

# على الهاتف:
# امسح QR Code
# اضغط Google Sign-In
```

---

## 📋 قائمة الفحص:

- [ ] هل أضفت `https://fakker-auth.firebaseapp.com/__/auth/handler`؟
- [ ] هل أضفت `https://auth.expo.io/@bonoo7/frn` (مع @)؟
- [ ] هل أضفت `https://auth.expo.io/`؟
- [ ] هل حذفت `https://auth.expo.io/bonoo7/frn` (بدون @)؟
- [ ] هل حذفت `https://yourapp.fakker.net/auth/callback`؟
- [ ] **هل ضغطت SAVE؟** ← ⭐ هذا مهم جداً!
- [ ] انتظرت 2 دقيقة؟
- [ ] مسحت Cache Expo Go؟

---

## 🎯 السبب الأساسي للخطأ:

**99% من الحالات:**
```
❌ لم يتم حفظ التغييرات (نسيان SAVE)
أو
❌ Google لم تطبق التغييرات بعد
```

---

## 🎉 بعد التصحيح:

```
✅ لا رسائل خطأ
✅ التسجيل يعمل بسلاسة
✅ البيانات تُحفظ في Firebase
```

---

**جرّب الخطوات أعلاه ثم أخبرني إذا استمرت المشكلة!** 🚀
