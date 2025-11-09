# ✅ حل مشكلة Google OAuth - النسخة الصحيحة

## المشكلة التي واجهتها:
```
"THE REQUESTED URL WAS NOT FOUND ON THIS SERVER"
+ "Invalid Redirect: must contain a domain" عند محاولة إضافة fakker://
```

---

## ✅ الحل الصحيح:

### 1️⃣ معرفات العملاء (Client IDs) - الصحيحة الآن:

في `contexts/AuthContext.js`:
```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',  // Web
  iosClientId: '372931862438-8vht7vrqf8f89k4sfi4j8bkumnatdr3q.apps.googleusercontent.com',  // iOS (نفس Web أو مختلف)
  androidClientId: '372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul.apps.googleusercontent.com',  // ✅ Android الصحيح
  scopes: ['profile', 'email'],
});
```

**التحديث**: تم تغيير `androidClientId` من:
- ❌ `372931862438-1q2w3e4r5t6y7u8i9o0p1a2s3d4f5g6h` (لا وجود له في Google Console)
- ✅ إلى: `372931862438-1u1jgmlv0vel8dfl5ivqg6585vjhi8ul` (من Google Console الفعلي)

---

### 2️⃣ Authorized Redirect URIs - في Google Cloud Console:

اذهب إلى:
```
Google Cloud Console 
  → APIs & Services 
  → Credentials 
  → Web Client 
  → Authorized redirect URIs
```

**أضف هذه الروابط:**
```
https://auth.expo.io/@bonoo7/frn
https://auth.expo.io/
https://yourapp.fakker.net/auth/callback
https://fakker-auth.firebaseapp.com/__/auth/handler
```

---

### 3️⃣ لماذا لا يمكن إضافة `fakker://` مباشرة؟

Google OAuth يطلب أن تكون Redirect URIs عنوان ويب (domain) صحيح. 

الحل:
- ✅ استخدم `https://` URIs كما هو موضح أعلاه
- ✅ هذه الروابط ستوجهك إلى التطبيق عبر Expo و Firebase

---

### 4️⃣ للاختبار على الهاتف:

```bash
# امسح الـ cache وأعد التشغيل
expo start --clear

# على الهاتف:
# 1. أغلق Expo Go تماماً
# 2. افتحه مرة أخرى
# 3. امسح الـ cache (من إعدادات التطبيق)
# 4. جرب تسجيل الدخول بـ Google
```

---

### 5️⃣ ملخص التغييرات المطلوبة:

✅ **تم تحديث في الملفات:**
- `contexts/AuthContext.js` - معرف Android الصحيح
- `GOOGLE_OAUTH_SETUP.md` - شرح Redirect URIs الصحيح
- `GOOGLE_OAUTH_QUICK_GUIDE.md` - الدليل السريع المحدّث

✅ **ما عليك فعله الآن:**
1. تأكد من إضافة الروابط الأربعة في Google Console
2. اضغط SAVE
3. أعد تشغيل Expo
4. جرب تسجيل الدخول

---

## 🎯 إذا لم يعمل:

1. تأكد أن جميع الروابط مطابقة بالضبط (بدون مسافات إضافية)
2. أعد تشغيل الهاتف بالكامل
3. امسح Expo Go وأعد تثبيته
4. تأكد من اسم المستخدم على Expo: `expo whoami`

---

---

## 🔴 **اكتشاف مهم (2025-11-03):**

Google Web Client **لا يقبل `exp://` URIs!**

```
❌ لا تحاول إضافة: exp://192.168.8.13
❌ لا تحاول إضافة: exp://localhost:19000
```

**Google سيرفضها برسالة:**
```
Invalid Redirect: must end with a public top-level domain
```

---

## ✅ الحل الصحيح:

### Web Client - ابقِ على هذه فقط:
```
✅ https://auth.expo.io/@bonoo7/frn
✅ https://auth.expo.io/
✅ https://fakker-auth.firebaseapp.com/__/auth/handler
```

### Android Client:
```
✅ Google ينشئه تلقائياً ويستقبل exp:// URIs
✅ لا تحتاج لفعل شيء يدوياً
```

---

## 🎉 الآن يجب أن يعمل!

جرّب على محاكي Android - يجب أن يعمل الآن ✅
