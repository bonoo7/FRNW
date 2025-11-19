# تحديثات الخلفيات والتصميم - الإصدار الجديد

## ملخص التغييرات (v1.4.0)

تم تحديث نظام الخلفيات في التطبيق لدعم ثلاث ثيمات مختلفة مع خلفيات متحركة وجميلة:

### 1. **ثيم داكن (Dark Theme)**
- **نوع الخلفية**: شبكة مربعات متحركة
- **اللون**: أزرق داكن متدرج (#1E40AF إلى #3B82F6)
- **المربعات**: أزرق مشع (rgb(59, 130, 246))
- **الملف الرئيسي**: `SquaresBackground.jsx`

#### المكونات:
- `Squares.jsx` - مكون Canvas يرسم شبكة مربعات متحركة
- `Squares.css` - تصميم Canvas
- `SquaresBackground.jsx` - wrapper للخلفية

#### الميزات:
- حركة سلسة للمربعات
- تأثير hover عند مرور الماوس
- شفافية متدرجة
- دعم اتجاهات متعددة (يمين، يسار، أعلى، أسفل، قطري)

---

### 2. **ثيم أزرق (Blue Theme)**
- **نوع الخلفية**: شبكة مربعات وامضة (Flickering)
- **اللون**: أزرق فاتح متدرج (#1E40AF إلى #3B82F6)
- **المربعات**: أزرق نقي مشع (rgb(59, 130, 246))
- **الملف الرئيسي**: `FlickeringGrid.jsx`

#### الميزات:
- مربعات تومض بشكل عشوائي
- حركة سلسة مع cubic-bezier timing
- شفافية ديناميكية
- سرعات متعددة (slow, medium, fast)

---

### 3. **ثيم فريش (Fresh Theme)**
- **نوع الخلفية**: دوائل متحركة ملونة
- **الخلفية**: متدرج من #ee6055 (أحمر) إلى #60d394 (أخضر)
- **الدوائل**: ألوان جميلة متعددة
  - أخضر فاتح (#aaf683)
  - أصفر ذهبي (#ffd97d)
  - برتقالي (#ff9b85)
- **الملف الرئيسي**: `AnimatedCirclesBackground.jsx`

#### الميزات:
- 5 دوائل متحركة بأحجام مختلفة
- تأخير زمني مختلف لكل دائرة (cubic-bezier timing)
- شفافية متدرجة لتأثير العمق
- حركة سلسة لمدة 3 ثواني

---

## الملفات المضافة

```
components/
├── Squares.jsx                      # مكون Canvas للمربعات
├── Squares.css                      # تصميم المربعات
├── SquaresBackground.jsx            # wrapper الخلفية المربعات
├── AnimatedCirclesBackground.jsx    # خلفية الدوائل المتحركة
├── AnimatedCirclesBackground.css    # تصميم الدوائل
└── BackgroundSelector.jsx           # محدد الخلفية حسب الثيم
```

## الملفات المعدلة

```
screens/
├── GameScreen.js                    # شاشة اللعب - تحديث الخلفية
├── HomeScreen.js                    # الشاشة الرئيسية - تحديث الخلفية
└── components/GameSetup.js          # شاشة إعدادات اللعبة

contexts/
└── ThemeContext.js                  # (بدون تغييرات مباشرة)

styles/
└── themes.js                        # (بدون تغييرات مباشرة)
```

---

## طريقة العمل

### BackgroundSelector Component

```jsx
import BackgroundSelector from '../components/BackgroundSelector';

<BackgroundSelector
  lightConfig={{
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    color: 'rgb(59, 130, 246)',
    maxOpacity: 0.35,
    animationSpeed: 'medium',
  }}
  darkConfig={{
    direction: 'right',
    speed: 1,
    borderColor: '#404040',
    squareSize: 40,
    hoverFillColor: '#222',
  }}
>
  {children}
</BackgroundSelector>
```

### آلية الاختيار:
- **ثيم Dark**: يستخدم `SquaresBackground`
- **ثيم Fresh**: يستخدم `AnimatedCirclesBackground`
- **ثيم Blue**: يستخدم `FlickeringGrid`

---

## الألوان المستخدمة

### ثيم داكن
- الخلفية: #1E40AF → #3B82F6
- المربعات: rgb(59, 130, 246)
- الحدود: #404040

### ثيم أزرق
- الخلفية: #1E40AF → #3B82F6
- المربعات: rgb(59, 130, 246)
- التدرج الثانوي: #3B82F6

### ثيم فريش
- الخلفية: #ee6055 → #60d394
- الدائرة الصغيرة: #aaf683
- الدائرة الوسطة: #ffd97d
- الدائرة الكبيرة: #ff9b85
- الدائرة الكبيرة جداً: #aaf683
- الدائرة الكبيرة جداً جداً: #ffd97d

---

## الإعدادات المتاحة

### Squares (المربعات)
```javascript
{
  direction: 'right' | 'left' | 'up' | 'down' | 'diagonal',
  speed: number,
  borderColor: string,
  squareSize: number,
  hoverFillColor: string,
}
```

### FlickeringGrid (الشبكة الوامضة)
```javascript
{
  squareSize: number,
  gridGap: number,
  flickerChance: number,
  color: string,
  maxOpacity: number,
  animationSpeed: 'slow' | 'medium' | 'fast',
}
```

### AnimatedCircles (الدوائل المتحركة)
```javascript
// لا توجد إعدادات - الخلفية ثابتة مع تصميم محدد
```

---

## ملاحظات تقنية

1. **الأداء**: كل خلفية مُحسّنة للأداء
   - Canvas API للمربعات
   - CSS animations للدوائل
   - requestAnimationFrame للحركة السلسة

2. **التوافق**: يعمل على جميع المتصفحات الحديثة
   - يشمل vendor prefixes (-webkit, -moz)
   - fallback للخلفيات

3. **z-index**: الخلفيات موضوعة في `zIndex: 0`
   - المحتوى في `zIndex: 10`

---

## التثبيت والاستخدام

```bash
# تثبيت المشروع
npm install

# تشغيل البناء
npm run build

# تشغيل التطبيق
npm start
```

---

## الإصدار
- **الإصدار**: 1.4.0
- **التاريخ**: 11 نوفمبر 2025
- **الحالة**: مكتمل وجاهز للإنتاج

---

## الخطوات التالية (اختياري)
- [ ] إضافة ثيمات إضافية
- [ ] تحسين الأداء على الأجهزة البطيئة
- [ ] إضافة مزيد من خيارات التخصيص
- [ ] توثيق الاستخدام المتقدم
