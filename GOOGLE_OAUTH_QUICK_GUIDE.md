# شرح مبسط: إضافة fakker:// في Google Cloud

## بخطوات سريعة جداً:

### 1️⃣ اذهب للموقع
- افتح: https://console.cloud.google.com/

### 2️⃣ اختر المشروع
- اضغط على "Select a Project" في الأعلى
- اختر: `fakker-auth`

### 3️⃣ اذهب إلى المصادقة (Authentication)
في القائمة اليسار:
```
APIs & Services
    ↓
Credentials
```

### 4️⃣ ابحث عن Web Client
- ستشاهد قائمة بـ OAuth 2.0 Client IDs
- ابحث عن "Web client"
- اضغط عليه

### 5️⃣ أضف Redirect URIs
ستشاهد قسم: **Authorized redirect URIs**

اضغط على **+ Add URI**

أضف هذه الـ URIs واحداً تلو الآخر:

#### للـ Expo Go:
```
https://auth.expo.io/@YOUR_EXPO_USERNAME/frn
https://auth.expo.io/
```

#### للـ Android:
```
fakker://
```

### 6️⃣ اضغط Save
- اضغط **SAVE** في الأسفل

### ✅ تم!

---

## نقاط مهمة:

### كيف أعرف اسم مستخدمي على Expo؟
1. افتح Terminal/Command Prompt
2. اكتب: `expo whoami`
3. ستشاهد اسم المستخدم

### مثال:
إذا كان اسمك على Expo: `myusername`

ستضيف:
```
https://auth.expo.io/@myusername/frn
https://auth.expo.io/
fakker://
```

### بعد الإضافة:
1. أعد تشغيل Expo Go
2. اضغط على "تسجيل الدخول بـ Google"
3. يجب أن يعمل الآن! 🎉

---

## إذا لم يعمل:

### جرّب هذا:
```bash
# في Terminal
expo start --clear

# ثم في Expo Go
# امسح الكاش وأعد تشغيل التطبيق
```

### أو للـ Native Build:
```bash
expo prebuild --clean
expo run:android
```

---

## الرابط المختصر:
Google Cloud Console → APIs & Services → Credentials → Web Client → Add URI

**حقل الإدخال يشبه هذا:**
```
┌─────────────────────────────────────┐
│ Authorized redirect URIs            │
│                                     │
│ ✓ https://auth.expo.io/            │
│ ✓ https://auth.expo.io/@user/frn   │
│ ✓ fakker://                         │
│                                     │
│ [+ Add URI]  [SAVE]                │
└─────────────────────────────────────┘
```
