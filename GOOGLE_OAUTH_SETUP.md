# كيفية إضافة fakker:// في Google Cloud Console

## الخطوة 1: الدخول إلى Google Cloud Console
1. اذهب إلى: https://console.cloud.google.com/
2. سجّل دخولك بحسابك على Google

## الخطوة 2: اختيار المشروع
1. في الأعلى، اختر المشروع الخاص بك (fakker-auth)
2. إذا لم تره، انقر على "Select a Project" واختر المشروع

## الخطوة 3: الذهاب إلى OAuth Consent Screen
1. في القائمة الجانبية، اذهب إلى:
   - **APIs & Services** (واجهات برمجية والخدمات)
   - **OAuth consent screen** (شاشة موافقة OAuth)

## الخطوة 4: تحديث بيانات الموافقة
1. تأكد من أن الخيار **External** مختار
2. انقر على **EDIT APP** (تعديل التطبيق)
3. ملء البيانات المطلوبة:
   - **App name**: فكّر (أو اسم التطبيق)
   - **User support email**: البريد الإلكتروني الخاص بك
   - **Developer contact**: بريدك الإلكتروني أيضاً
4. انقر **SAVE AND CONTINUE**

## الخطوة 5: الذهاب إلى OAuth Credentials
1. من القائمة الجانبية، اذهب إلى:
   - **APIs & Services** 
   - **Credentials** (بيانات الاعتماد)

2. ابحث عن تطبيقك (يجب أن تراه في قائمة "OAuth 2.0 Client IDs")
3. انقر على **Web Client** (عميل ويب)
   - أو إذا لم تره، انقر على "+ CREATE CREDENTIALS" ثم "OAuth client ID"

## الخطوة 6: إضافة Authorized Redirect URIs
هذا هو الجزء المهم!

### للـ Expo Go (التطوير):
1. ابحث عن قسم **Authorized redirect URIs**
2. انقر على **+ ADD URI**
3. أضف المحاور التالية واحداً تلو الآخر:

```
https://auth.expo.io/@YOUR_USERNAME/frn
https://auth.expo.io/
```

**ملاحظة**: استبدل `YOUR_USERNAME` باسم مستخدمك على Expo

### للـ Android Native (الإنتاج):
أضف أيضاً:

```
fakker://
https://yourapp.com/auth/callback
```

## الخطوة 7: حفظ التغييرات
1. انقر **SAVE** (حفظ)
2. يجب أن تشاهد رسالة تأكيد

## الخطوة 8: التحقق من البيانات

### للعثور على معرف العميل (Client ID):
1. في صفحة Credentials
2. انقر على **Web Client** 
3. انسخ **Client ID** و **Client Secret**

### للعثور على معرف مشروعك:
1. في الأعلى يسار الصفحة
2. يجب أن تشاهد: `Project ID: fakker-auth` (أو ما شابه)

## ملفات التكوين التي تحتاج إلى تحديثها

### في `app.json`:
```json
"plugins": [
  [
    "@react-native-google-signin/google-signin",
    {
      "iosUrlScheme": "fakker"
    }
  ]
]
```

### في `contexts/AuthContext.js`:
تأكد من أن Client IDs صحيحة:

```javascript
const [request, response, promptAsync] = Google.useAuthRequest({
  clientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',
  scopes: ['profile', 'email'],
});
```

## خطوات إضافية

### إذا كنت تستخدم Expo Go:
1. أعد تشغيل Expo Go
2. امسح الكاش: `expo start --clear`
3. أعد المحاولة

### إذا كنت تستخدم Native Build:
1. شغّل: `expo prebuild --clean`
2. ثم: `expo run:android`

## قائمة تحقق (Checklist)

- [ ] تم الدخول إلى Google Cloud Console
- [ ] اخترت المشروع الصحيح (fakker-auth)
- [ ] ذهبت إلى OAuth consent screen وأكملت البيانات
- [ ] ذهبت إلى Credentials
- [ ] أضفت Authorized Redirect URIs:
  - [ ] `https://auth.expo.io/@YOUR_USERNAME/frn`
  - [ ] `https://auth.expo.io/`
  - [ ] `fakker://` (للـ Android)
- [ ] حفظت التغييرات
- [ ] نسخت Client IDs
- [ ] حدثت `app.json` و `AuthContext.js`
- [ ] أعد تشغيل التطبيق

## رابط مفيد
- Google Cloud Console: https://console.cloud.google.com/
- توثيق Expo Auth: https://docs.expo.dev/guides/authentication/#google

## نصائح مهمة

⚠️ **تذكر:**
- استبدل `YOUR_USERNAME` باسم مستخدمك الفعلي على Expo
- استبدل `YOUR_WEB_CLIENT_ID` بمعرف عميلك الفعلي من Google
- لا تنسَ حفظ التغييرات بعد إضافة Redirect URIs
- قد تستغرق التغييرات بعض الوقت للتطبيق (عادة دقيقة واحدة)

---

إذا واجهت مشاكل، تأكد من:
1. أن `fakker://` مضاف بالضبط كما هو (بدون مسافات)
2. أن اسم مستخدم Expo صحيح
3. أنك حفظت التغييرات
