# 🏗️ معمارية المشروع

## هيكل المشروع

```
FRNW/
├── app/                    # جذر تطبيق Expo Router
│   ├── _layout.js         # التخطيط الرئيسي
│   └── index.js           # الصفحة الرئيسية
├── screens/               # شاشات التطبيق الرئيسية
│   ├── GameScreen.js      # شاشة اللعب
│   ├── HomeScreen.js      # الشاشة الرئيسية
│   ├── ResultsScreen.js   # شاشة النتائج
│   └── CategoryScreen.js  # شاشة اختيار الفئات
├── components/            # مكونات React Native المعاد استخدامها
│   ├── GameSetup.js      # إعداد اللعبة
│   ├── TeamsHeader.js    # رأس الفرق
│   ├── QuestionCard.js   # بطاقة السؤال
│   └── ScoreBoard.js     # لوحة النقاط
├── contexts/              # React Context للحالة العامة
│   ├── GameContext.js    # حالة اللعبة
│   └── AuthContext.js    # حالة المصادقة
├── services/              # خدمات البيانات والـ APIs
│   ├── firebaseService.js
│   └── questionService.js
├── styles/                # أنماط وألوان
│   ├── themes.js         # ملف الثيمات
│   └── colors.js         # ألوان التطبيق
├── data/                  # بيانات ثابتة
│   └── categories.js     # الفئات والأسئلة
├── utils/                 # دوال مساعدة
│   ├── calculations.js
│   └── formatting.js
└── package.json           # الـ dependencies

```

## تدفق البيانات

```
HomeScreen
    ↓
CategoryScreen (اختيار الفئات)
    ↓
GameSetup (إعداد الفرق)
    ↓
GameScreen (اللعب الفعلي)
    ↓
ResultsScreen (النتائج)
```

## المكونات الرئيسية

### 1. GameScreen.js
- شاشة اللعب الرئيسية
- عرض الأسئلة والخيارات
- إدارة نظام النقاط

### 2. TeamsHeader.js
- عرض أسماء الفرق والنقاط
- تحديث الخيار المختار
- عرض أيقونات الفئات

### 3. GameSetup.js
- إدخال أسماء الفرق
- اختيار الفئات
- إعدادات اللعبة

## الثيمات المدعومة

- **الثيم الأزرق**: ألوان زرقاء بتدرج جميل
- **الثيم الداكن**: ألوان داكنة مريحة للعين
- **الثيم الفاتح**: ألوان فاتحة ومشرقة

## تقنيات الأداء

- ✅ Lazy loading للصور
- ✅ تخزين مؤقت للبيانات
- ✅ تحسين حجم الحزم
- ✅ استخدام React.memo للمكونات الثقيلة

