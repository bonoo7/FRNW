# تحديث الثيم الأزرق - مكون FlickeringGrid الحديث

## ملخص التغييرات

تم استبدال نمط الشبكة المتحرك بمكون **FlickeringGrid** حديث يستخدم Canvas API لتحقيق تأثير وميض واقعي وديناميكي مع ألوان زرقاء جديدة.

## الملفات المعدلة

### 1. `components/FlickeringGrid.jsx` (مكون جديد)
مكون FlickeringGrid حديث يوفر:

#### الخصائص المتاحة:
- **`squareSize`**: حجم المربع الواحد (بالبكسل)
  - HomeScreen: 4
  - GameScreen: 5-8
  - TeamHeader: 3

- **`gridGap`**: المسافة بين المربعات (بالبكسل)
  - HomeScreen: 6
  - GameScreen: 8-12
  - TeamHeader: 5

- **`flickerChance`**: احتمالية الوميض (0.0 - 1.0)
  - HomeScreen: 0.3
  - GameScreen: 0.25, 0.15
  - TeamHeader: 0.2

- **`color`**: لون المربعات بصيغة RGB
  - HomeScreen: `rgb(100, 181, 246)` (أزرق سماوي)
  - GameScreen الأساسي: `rgb(100, 181, 246)`
  - GameScreen الثانوي: `rgb(66, 165, 245)` (أزرق أفتح)
  - TeamHeader: `rgb(74, 144, 226)` (أزرق البحر)

- **`maxOpacity`**: أقصى شفافية (0.0 - 1.0)
  - HomeScreen: 0.25
  - GameScreen: 0.2, 0.1
  - TeamHeader: 0.15

- **`animationSpeed`**: سرعة الوميض
  - `slow`: 0.5x (النمط الثانوي في GameScreen)
  - `medium`: 1x (HomeScreen و GameScreen الأساسي)
  - `fast`: 2x (TeamHeader)

#### الميزات:
- ✨ تأثير وميض واقعي ديناميكي
- 🎨 دعم ألوان RGB قابلة للتخصيص
- ⚡ استخدام Canvas للأداء العالية
- 🔄 حركة متموجة طبيعية
- 📱 دعم جميع الأنظمة (iOS, Android, Web)

### 2. `screens/HomeScreen.js`
```jsx
<FlickeringGrid
  squareSize={4}
  gridGap={6}
  flickerChance={0.3}
  color="rgb(100, 181, 246)"
  maxOpacity={0.25}
  animationSpeed="medium"
/>
```

**الموقع**: الخلفية الرئيسية للشاشة

### 3. `screens/GameScreen.js`

**الموضع 1 - الخلفية الرئيسية**:
```jsx
{/* النمط الأساسي */}
<FlickeringGrid
  squareSize={5}
  gridGap={8}
  flickerChance={0.25}
  color="rgb(100, 181, 246)"
  maxOpacity={0.2}
  animationSpeed="medium"
/>

{/* النمط الإضافي للعمق */}
<FlickeringGrid
  squareSize={8}
  gridGap={12}
  flickerChance={0.15}
  color="rgb(66, 165, 245)"
  maxOpacity={0.1}
  animationSpeed="slow"
/>
```

**الموضع 2 - Team Header**:
```jsx
<FlickeringGrid
  squareSize={3}
  gridGap={5}
  flickerChance={0.2}
  color="rgb(74, 144, 226)"
  maxOpacity={0.15}
  animationSpeed="fast"
/>
```

## الألوان المستخدمة

| الاسم | RGB | الاستخدام |
|------|-----|---------|
| أزرق سماوي | `rgb(100, 181, 246)` | HomeScreen و GameScreen الأساسي |
| أزرق أفتح | `rgb(66, 165, 245)` | النمط الثانوي في GameScreen |
| أزرق البحر | `rgb(74, 144, 226)` | TeamHeader |

## كيف يعمل المكون

1. **إنشاء الشبكة**: يتم حساب عدد الصفوف والأعمدة بناءً على حجم الشاشة وحجم المربع
2. **تهيئة الحالة**: كل مربع له حالة خاصة (opacity, flickering state, direction)
3. **الرسم على Canvas**: يتم تحديث الشفافية كل frame
4. **تأثير الوميض**: 
   - إذا كان المربع وميض: يزيد/يقل opacity تدريجياً
   - إذا لم يكن وميض: يتلاشى تدريجياً
   - احتمال عشوائي لبدء الوميض

## الشاشات المتأثرة

✅ **الشاشة الرئيسية (HomeScreen)**
- خلفية زرقاء مع وميض حديث

✅ **شاشة اللعب (GameScreen)**
- خلفية رئيسية مع نمطين لعمق بصري
- خلفية Team Header مع وميض سريع

⏸️ **شاشة اختيار الفئات (QuestionScreen)**
- لم تتغير - تستخدم BackgroundPattern الأساسي

## ملاحظات مهمة

- لم يتم حذف `AnimatedGridPattern` القديم (يمكن استخدامه في مكان آخر)
- المكون يستخدم Canvas API مما يوفر أداء أفضل
- الألوان الجديدة توفر تباين أفضل مع الخلفية الزرقاء الغامقة
- يمكن تخصيص جميع المعاملات لإنشاء تأثيرات مختلفة

