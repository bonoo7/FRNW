# 🎮 Fakker Quiz App - Release Documentation

## 📋 نسخة التطبيق الحالية
**v2.1** - تحديث الألعاب المحفوظة والملف الشخصي

---

## ✨ الميزات الرئيسية

### 1. 🎯 نظام الألعاب المحفوظة (Saved Games)
- **حفظ اللعبة تلقائياً**: تُحفظ فقط الألعاب الجديدة من الشاشة الرئيسية
- **استكمال اللعبة**: الألعاب غير المكتملة يمكن استكمالها من حيث توقفت
- **إعادة التشغيل**: إعادة لعب نفس اللعبة بأسئلة جديدة بدون حفظ كلعبة جديدة
- **عرض الفئات**: تظهر جميع الفئات المختارة في كل لعبة محفوظة
- **الحالة**: تمييز واضح بين الألعاب المكتملة والمتوقفة

### 2. 👤 الملف الشخصي المدمج
- **واجهة موحدة**: الملف الشخصي و"ألعابي" بجانب بعضهما في رأس الصفحة
- **تصميم Chip/Pill Button**: زرين متطابقين للتناسق البصري
- **شارة الرصيد**: عرض عدد الألعاب المتبقية مباشرة على الملف الشخصي
- **الظلال والتأثيرات**: تأثيرات بصرية احترافية

### 3. 🎮 إعدادات اللعبة المتقدمة
- اختيار عدد الفرق (2-5)
- إدخال أسماء الفرق المخصصة
- اختيار الفئات المطلوبة
- تسمية الجولات

### 4. 🏆 نظام النقاط
- نقاط مختلفة حسب درجة الصعوبة (سهل/متوسط/صعب)
- مضاعفة النقاط (2x)
- مضاعفة 5 مرات النقاط (5x Penta Points)
- نقاط مكافآت

---

## 🔧 الملفات الأساسية

### Services (الخدمات)
| الملف | الوظيفة |
|------|--------|
| `savedGamesService.js` | إدارة الألعاب المحفوظة في Firebase |
| `creditsService.js` | إدارة الرصيد والألعاب المتبقية |
| `storageService.js` | تخزين البيانات المحلي |
| `gameService.js` | منطق اللعبة والأسئلة |
| `pentaPointsService.js` | إدارة مضاعفة النقاط 5 مرات |

### Components (المكونات)
| المكون | الوصف |
|-------|-------|
| `SavedGamesModal.js` | عرض وإدارة الألعاب المحفوظة |
| `IntegratedUserProfile.js` | الملف الشخصي والرصيد المدمج |
| `GameSetup.js` | إعدادات اللعبة الجديدة |
| `TeamsHeader.js` | رأس الفريق الحالي |
| `QuestionDetailsModal.js` | تفاصيل السؤال |
| `WinnerCelebration.js` | تأثيرات الفوز |

### Screens (الشاشات)
| الشاشة | الوصف |
|------|-------|
| `HomeScreen.js` | الشاشة الرئيسية |
| `GameScreen.js` | شاشة اللعب |
| `RoundResults.js` | نتائج الجولة |
| `AuthScreen.js` | تسجيل الدخول/التسجيل |

---

## 🚀 كيفية الاستخدام

### لعبة جديدة:
1. من الشاشة الرئيسية → اضغط "بدء اللعب"
2. اختر عدد الفرق وأدخل أسماءهم
3. اختر الفئات المطلوبة
4. ابدأ اللعب
5. بعد انتهاء اللعبة → تُحفظ تلقائياً في "ألعابي"

### استكمال لعبة:
1. اضغط "ألعابي" في رأس الصفحة
2. اختر لعبة غير مكتملة (مع شارة "غير مكتملة")
3. اضغط "استكمال"
4. استكمل اللعبة من حيث توقفت
5. النتيجة تحدث نفس السجل الأصلي

### إعادة تشغيل لعبة:
1. اضغط "ألعابي"
2. اختر أي لعبة
3. اضغط "إعادة تشغيل"
4. جميع الأسئلة تتكرر من البداية
5. لا يتم حفظها كلعبة جديدة

---

## 📊 قاعدة البيانات

### مجموعة `savedGames` في Firestore:
```javascript
{
  id: string,
  userId: string,
  roundName: string,
  teams: [string],
  categories: [string],
  selectedQuestions: [object],
  questions: object,        // جميع الأسئلة مع حالة isUsed
  scores: { [teamName]: number },
  statistics: {
    totalQuestions: number,
    answeredQuestions: number,
    doublePointsUsed: number,
    categoryStats: object
  },
  isNewGame: boolean,       // لعبة جديدة من الشاشة الرئيسية
  isContinuing: boolean,    // استكمال لعبة سابقة
  isReplaying: boolean,     // إعادة تشغيل لعبة
  isCompleted: boolean,     // هل استخدمت جميع الأسئلة
  savedGameId: string,      // معرف اللعبة الأصلية (للاستكمال)
  currentTeamIndex: number,
  currentCategoryIndex: number,
  createdAt: ISO,
  updatedAt: ISO
}
```

---

## 🔐 قواعس الأمان (Firestore)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // السماح بقراءة وكتابة البيانات الشخصية للمستخدم
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // السماح بقراءة وكتابة الألعاب المحفوظة
    match /savedGames/{gameId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
  }
}
```

---

## 🛠️ متطلبات التطبيق

### Dependencies
- `react-native` >= 0.71
- `expo` >= 49.0
- `firebase` >= 9.0
- `expo-router` >= 2.0
- `react-native-reanimated` >= 2.0
- `react-native-gesture-handler` >= 2.0

### Services الخارجية
- Firebase Authentication
- Cloud Firestore
- Firebase Storage (اختياري)

---

## 📝 التغييرات الأخيرة

### الإصدار v2.1
- ✅ إضافة نظام الألعاب المحفوظة
- ✅ ميزة استكمال اللعبة
- ✅ ميزة إعادة التشغيل
- ✅ عرض الفئات في المودال
- ✅ تصميم موحد للملف الشخصي و"ألعابي"
- ✅ تحسين واجهة المستخدم

### الإصدار v2.0
- ✅ واجهة رئيسية جديدة
- ✅ نظام الرصيد/الألعاب المتبقية
- ✅ نظام المصادقة المحسّن
- ✅ نظام النقاط المتقدم

---

## 🎨 تصميم الواجهة

### الألوان الأساسية
- Primary: `#1E40AF` (أزرق)
- Secondary: `#3B82F6` (أزرق فاتح)
- Error: `#FF6B6B` (أحمر)
- Success: `#4CAF50` (أخضر)

### الخطوط
- Primary Font: "ReadexPro"
- Secondary Font: "Cairo"

### التأثيرات
- Shadows: احترافية مع elevation
- Animations: Fade, Scale, Rotate
- Transitions: سلسة ومحسّنة

---

## 📱 المتوافقة مع

- ✅ iOS (14.0+)
- ✅ Android (9.0+)
- ✅ Web
- ✅ React Native

---

## 🚀 الخطوات التالية المقترحة

1. **نظام الإحصائيات**: تتبع إحصائيات اللاعب التفصيلية
2. **نظام الترتيبات**: Leaderboard عام
3. **نظام الإنجازات**: Achievements و Badges
4. **ألعاب متعددة اللاعبين**: وضع لاعبين متعددين
5. **ألعاب الأصدقاء**: تحدي الأصدقاء

---

## 📞 الدعم الفني

للإبلاغ عن مشاكل أو اقتراح تحسينات، يرجى فتح issue على GitHub.

---

**آخر تحديث**: 23 نوفمبر 2025  
**الإصدار**: v2.1  
**الحالة**: مستقر
