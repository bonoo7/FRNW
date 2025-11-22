# دليل تغيير الثيم الداكن 🎨

## المتطلبات المسبقة
تم تحليل نظام الخلفيات في `BACKGROUND_SYSTEM_ANALYSIS.md`

---

## خطوات التغيير الصحيحة

### ✅ الخطوة 1: تحديد الألوان الجديدة

**الألوان القديمة (أزرق):**
```
التدرج الأساسي: #0A0E27 → #1A1F3A
لون النمط: #4F46E5 (بنفسجي أزرق)
التدرجات في GameScreen: #1E40AF → #3B82F6
```

**الألوان الجديدة (أسود داكن):**
```
التدرج الأساسي: #0D0D0D → #1A1A1A → #0F0F0F
لون النمط: #2D2D2D (رمادي داكن)
التدرجات في GameScreen: #0D0D0D → #1A1A1A
```

---

### ✅ الخطوة 2: تعديل BackgroundSelector.jsx

**الملف:** `components/BackgroundSelector.jsx`

**موقع التغيير:** السطور 15-33

**البحث عن:**
```javascript
if (currentTheme === 'dark') {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0A0E27', '#1A1F3A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* الطبقة الأولى: النمط الأساسي (صلبان واضحة) */}
        <PatternCrosses color="#4F46E5" opacity={0.12} />
        
        {/* الطبقة الثانية: التكسجتشر (حبيبات فيلم قوية للمظهر السينمائي) */}
        <TextureFilmGrain color="#FFFFFF" opacity={0.15} />
        
        {children}
      </LinearGradient>
    </View>
  );
}
```

**التعديل إلى:**
```javascript
if (currentTheme === 'dark') {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#0D0D0D', '#1A1A1A', '#0F0F0F']}  // ← غيّر هنا
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* الطبقة الأولى: النمط الأساسي (صلبان واضحة) */}
        <PatternCrosses color="#2D2D2D" opacity={0.15} />  {/* ← غيّر اللون والشفافية */}
        
        {/* الطبقة الثانية: التكسجتشر (حبيبات فيلم قوية للمظهر السينمائي) */}
        <TextureFilmGrain color="#FFFFFF" opacity={0.08} />  {/* ← غيّر الشفافية */}
        
        {children}
      </LinearGradient>
    </View>
  );
}
```

**الملخص:**
- ✏️ `colors` من `['#0A0E27', '#1A1F3A']` إلى `['#0D0D0D', '#1A1A1A', '#0F0F0F']`
- ✏️ `PatternCrosses color` من `#4F46E5` إلى `#2D2D2D`
- ✏️ `PatternCrosses opacity` من `0.12` إلى `0.15`
- ✏️ `TextureFilmGrain opacity` من `0.15` إلى `0.08`

---

### ✅ الخطوة 3: تعديل GameScreen.js

**الملف:** `screens/GameScreen.js`

**موقع التغيير 1:** السطور 469 (استيراد currentTheme)

**البحث عن:**
```javascript
const { theme } = useTheme();
```

**التعديل إلى:**
```javascript
const { theme, currentTheme } = useTheme();
```

**موقع التغيير 2:** السطور 1049-1061 (التدرج الرئيسي)

**البحث عن:**
```javascript
{/* تدرج رئيسي */}
<LinearGradient
  colors={['#1E40AF', '#3B82F6', '#1E40AF']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ 
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0
  }}
/>
```

**التعديل إلى:**
```javascript
{/* تدرج رئيسي */}
<LinearGradient
  colors={currentTheme === 'dark' ? ['#0D0D0D', '#1A1A1A'] : ['#1E40AF', '#3B82F6', '#1E40AF']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
  style={{ 
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    zIndex: 0
  }}
/>
```

**موقع التغيير 3:** السطور 1064-1077 (التدرج الثانوي)

**البحث عن:**
```javascript
{/* تدرج ثانوي للحواف */}
<LinearGradient
  colors={['#3B82F6', 'transparent']}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 0.3 }}
  style={{ 
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '30%',
    zIndex: 0,
    opacity: 0.15,
  }}
/>
```

**التعديل إلى:**
```javascript
{/* تدرج ثانوي للحواف */}
<LinearGradient
  colors={currentTheme === 'dark' ? ['#2D2D2D', 'transparent'] : ['#3B82F6', 'transparent']}
  start={{ x: 0, y: 0 }}
  end={{ x: 0, y: 0.3 }}
  style={{ 
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '30%',
    zIndex: 0,
    opacity: currentTheme === 'dark' ? 0.08 : 0.15,
  }}
/>
```

---

### ✅ الخطوة 4: تعديل HomeScreen.js

**الملف:** `screens/HomeScreen.js`

**موقع التغيير 1:** السطور 335 (استيراد currentTheme)

**البحث عن:**
```javascript
const { theme } = useTheme();
```

**التعديل إلى:**
```javascript
const { theme, currentTheme } = useTheme();
```

**موقع التغيير 2:** السطور 949-961 (التدرجات)

**البحث عن:**
```javascript
<LinearGradient
  colors={['#1E40AF', '#3B82F6', '#1E40AF']}
  ...
/>
```

**التعديل إلى:**
```javascript
<LinearGradient
  colors={currentTheme === 'dark' ? ['#0D0D0D', '#1A1A1A', '#0F0F0F'] : ['#1E40AF', '#3B82F6', '#1E40AF']}
  ...
/>
```

---

## ✔️ التحقق من التغييرات

### اختبر الثيم الداكن:
1. افتح التطبيق
2. اذهب إلى الإعدادات
3. اختر "الثيم الداكن"
4. تحقق من أن الخلفية أسود داكن (وليس أزرق)

### تحقق من الصفحات:
- ✅ HomeScreen (الصفحة الرئيسية)
- ✅ GameScreen (شاشة اللعبة)
- ✅ QuestionScreen (شاشة السؤال)
- ✅ GameResults (نتائج اللعبة)

---

## 📝 ملاحظات مهمة

1. **تأثر المكونات:**
   - BackgroundSelector يؤثر على: جميع الصفحات التي تستخدمه
   - GameScreen و HomeScreen لهما تأثيرهما الخاص بالإضافة إلى BackgroundSelector

2. **الألوان الجديدة:**
   - أسود: `#000000` - `#0D0D0D` (للخلفية الصافية)
   - رمادي داكن: `#1A1A1A` - `#2D2D2D` (للأنماط والتدرجات الثانوية)

3. **الشفافية:**
   - نقصنا من `0.15` إلى `0.08` للحبيبات (أقل وضوحاً)
   - زدنا من `0.12` إلى `0.15` للصلبان (أكثر وضوحاً)

4. **التوافقية:**
   - استخدام `currentTheme === 'dark'` يضمن عدم تأثر الثيمات الأخرى (blue، fresh)

---

## 🚀 خطوات الإجراء

```bash
# 1. تعديل BackgroundSelector.jsx
# 2. تعديل GameScreen.js (3 تغييرات)
# 3. تعديل HomeScreen.js (2 تغييرات)
# 4. اختبر الثيم الداكن
# 5. تحقق من الثيمات الأخرى لا تتأثر
```

---

## 🎯 النتيجة النهائية

بعد هذه التغييرات:
- ✅ الثيم الداكن سيكون أسود نقي بدلاً من الأزرق الغامق
- ✅ الأنماط ستكون رمادي داكن بدلاً من البنفسجي الأزرق
- ✅ الحبيبات ستكون أقل وضوحاً وأكثر احترافية
- ✅ الثيمات الأخرى (blue، fresh) ستبقى كما هي
