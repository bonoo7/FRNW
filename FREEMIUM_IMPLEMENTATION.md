# نظام Freemium - دليل التطبيق

## نظرة عامة
تم تطبيق نظام Freemium كامل في التطبيق يسمح للمستخدمين الجدد بلعب لعبتين مجاناً، ثم عليهم الشراء للمزيد.

---

## 1. هيكلية قاعدة البيانات

### مجموعة `users`
```javascript
{
  uid: string,              // معرف المستخدم (Firebase UID)
  email: string,
  displayName: string,
  photoURL: string,
  gameCredits: number,      // عدد الألعاب المتبقية (افتراضي: 2)
  totalGamesPlayed: number, // إجمالي الألعاب الملعوبة
  totalGamesWon: number,    // إجمالي الفوز
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### مجموعة `gameResults`
```javascript
{
  userId: string,
  gameId: string,
  score: number,
  position: number,         // 1 = فوز، > 1 = خسارة
  categoryId: string,
  questionsCount: number,
  correctAnswers: number,
  completedAt: timestamp
}
```

---

## 2. منطق التسجيل

عند إنشاء حساب جديد:
- يتم إنشاء وثيقة في مجموعة `users`
- يتم تعيين `gameCredits = 2` افتراضياً
- يتم تسجيل `createdAt` بالوقت الحالي

**الملف:** `contexts/AuthContext.js` - دالة `handleUserRegistration()`

---

## 3. منطق بدء اللعبة

### العملية:
1. **الفحص الأولي**: عند الضغط على "بدء اللعب"
   - التحقق من `gameCredits > 0`
   - إذا كانت 0: عرض رسالة "لا توجد ألعاب متبقية"
   - إذا كانت > 0: تفعيل حالة Loading

2. **خصم الأرصدة**: باستخدام Cloud Function
   - استدعاء دالة `deductGameCredit`
   - استخدام Transaction لضمان عدم حدوث تضارب
   - الإنقاص بمقدار 1 فقط
   - عرض رسالة خطأ إذا فشلت العملية

3. **الحماية**: قواعد Firestore تضمن
   - عدم تعديل `gameCredits` مباشرة من العميل
   - السماح فقط من خلال Cloud Functions

**الملفات:**
- `components/GameSetup.js` - واجهة المستخدم
- `firebase/functions/deductGameCredit.js` - Cloud Function

---

## 4. منطق إنهاء اللعبة

عند انتهاء اللعبة:
1. تسجيل النتيجة في `gameResults`
2. تحديث الإحصائيات في وثيقة `users`
3. عدم إضافة أرصدة (الأرصدة تُخصم عند البدء فقط)

**الملف:** `screens/RoundResults.js`

---

## 5. قواعد الأمان (Firestore Security Rules)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح للمستخدم بقراءة بيانات نفسه فقط
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId && 
                      !request.resource.data.diff(resource.data).affectedKeys().hasAny(['gameCredits']);
      allow create: if request.auth.uid == userId;
    }

    // السماح بإنشاء سجلات النتائج
    match /gameResults/{document=**} {
      allow create: if request.auth != null;
      allow read: if request.auth.uid == resource.data.userId;
    }
  }
}
```

---

## 6. عرض الأرصدة

### الشاشة الرئيسية
- تُعرض النقاط بجانب الملف الشخصي العلوي
- تحديث فوري عند كل تغيير

### صفحة الملف الشخصي
- عرض `gameCredits` في شارة أعلى القسم
- عرض إحصائيات الألعاب
- عرض آخر 5 ألعاب ملعوبة

**الملفات:**
- `screens/HomeScreen.js` - الشاشة الرئيسية
- `app/profile/index.js` - صفحة الملف الشخصي

---

## 7. التحديثات المطبقة

### ✅ تم إنجازه:
- [x] نظام الأرصدة الأساسي
- [x] قواعد الأمان الشاملة
- [x] عرض الأرصدة على الشاشات
- [x] منطق بدء اللعبة محمي
- [x] واجهة محسنة للملف الشخصي
- [x] عرض الإحصائيات الفعلية
- [x] رسائل خطأ واضحة

### 🎨 تحسينات الواجهة:
- زر بدء اللعب يظهر حالة Loading أثناء الفحص
- منع النقر المتعدد على الزر
- عرض الأرصدة بشارة واضحة
- إحصائيات مفصلة للمستخدم

---

## 8. الملفات المعدلة

- `firestore.rules` - قواعد الأمان المحدثة
- `components/GameSetup.js` - منطق بدء اللعبة
- `components/UserProfile.js` - عرض الأرصدة
- `screens/HomeScreen.js` - عرض الأرصدة والملف الشخصي
- `screens/RoundResults.js` - تسجيل النتائج
- `app/profile/index.js` - صفحة الملف الشخصي الجديدة
- `contexts/AuthContext.js` - إدارة البيانات

---

## 9. ملاحظات مهمة

1. **الأمان**: جميع العمليات الحساسة محمية بقواعد Firestore
2. **الموثوقية**: استخدام Transactions يضمن عدم فقدان البيانات
3. **تجربة المستخدم**: عرض واضح للأرصدة والتحديثات الفورية
4. **الترجمة**: جميع الرسائل باللغة العربية

---

**آخر تحديث:** نوفمبر 2024
