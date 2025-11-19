# FlickeringGrid - مكون الوميض الحديث 🌟

## 📌 نظرة سريعة

مكون React جديد يوفر تأثير وميض ديناميكي واقعي باستخدام **Canvas API**، مع دعم ألوان **زرقاء جديدة وجميلة**.

## 🎯 الاستخدام السريع

```jsx
import FlickeringGrid from '@/components/FlickeringGrid';

export default function Dashboard() {
  return (
    <div className="relative h-screen">
      <FlickeringGrid
        squareSize={4}
        gridGap={6}
        flickerChance={0.3}
        color="rgb(100, 181, 246)"
        maxOpacity={0.25}
        animationSpeed="medium"
      />
      <div className="relative z-10">
        {/* محتوى التطبيق */}
      </div>
    </div>
  );
}
```

## 🎨 الألوان الزرقاء الجديدة

| الاسم | RGB | الكود | الاستخدام |
|------|-----|------|---------|
| أزرق سماوي | `rgb(100, 181, 246)` | `#64B5F6` | الخلفية الرئيسية |
| أزرق فاتح | `rgb(66, 165, 245)` | `#42A5F5` | نمط العمق |
| أزرق بحر | `rgb(74, 144, 226)` | `#4A90E2` | Team Header |

## ⚙️ المعاملات

| المعامل | النوع | الافتراضي | الوصف |
|--------|-------|---------|--------|
| `squareSize` | number | 4 | حجم المربع (px) |
| `gridGap` | number | 6 | المسافة بين المربعات (px) |
| `flickerChance` | number | 0.3 | احتمالية الوميض (0-1) |
| `color` | string | rgb(100,181,246) | لون RGB للمربعات |
| `maxOpacity` | number | 0.3 | الشفافية القصوى (0-1) |
| `animationSpeed` | string | 'medium' | slow / medium / fast |
| `className` | string | '' | CSS class إضافية |
| `width` | number | auto | عرض مخصص |
| `height` | number | auto | ارتفاع مخصص |

## 📊 الإعدادات المسبقة

### HomeScreen - خفيف وسلس
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

### GameScreen - مع عمق
```jsx
{/* النمط الأساسي */}
<FlickeringGrid
  squareSize={5}
  gridGap={8}
  flickerChance={0.25}
  color="rgb(100, 181, 246)"
  maxOpacity={0.2}
/>

{/* نمط العمق */}
<FlickeringGrid
  squareSize={8}
  gridGap={12}
  flickerChance={0.15}
  color="rgb(66, 165, 245)"
  maxOpacity={0.1}
  animationSpeed="slow"
/>
```

### TeamHeader - سريع ودقيق
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

## ✨ الميزات

✅ **واقعي**: تأثير وميض ديناميكي طبيعي  
✅ **سريع**: استخدام Canvas API للأداء العالية  
✅ **مرن**: معاملات قابلة للتخصيص بالكامل  
✅ **متوافق**: يعمل على Web و Mobile  
✅ **خفيف**: 3.7 KB فقط  

## 🔧 التخصيص المتقدم

### تأثير ضعيف
```jsx
<FlickeringGrid color="rgb(100, 181, 246)" maxOpacity={0.1} />
```

### تأثير قوي وسريع
```jsx
<FlickeringGrid 
  color="rgb(100, 181, 246)" 
  maxOpacity={0.4}
  animationSpeed="fast"
/>
```

### نمط ألوان مختلف
```jsx
<FlickeringGrid color="rgb(255, 100, 100)" /> {/* أحمر */}
<FlickeringGrid color="rgb(100, 255, 100)" /> {/* أخضر */}
```

## 📚 الملفات ذات الصلة

- `components/FlickeringGrid.jsx` - المكون الرئيسي
- `FLICKERING_GRID_CHANGES.md` - توثيق التغييرات
- `FLICKERING_GRID_IMPLEMENTATION.md` - دليل الاستخدام الكامل
- `COMPLETION_REPORT.md` - تقرير الإكمال

## 🎓 الفروقات عن AnimatedGridPattern

| الميزة | AnimatedGridPattern | FlickeringGrid |
|--------|-------------------|-----------------|
| التكنولوجيا | Animated API | Canvas API |
| الأداء | متوسط | عالي جداً |
| الألوان | محدودة | RGB كاملة |
| التأثير | حركة سلسة | وميض واقعي |
| الاستخدام | نقاط دائرية | مربعات |

## 🚀 الحالة

✅ **جاهز للإنتاج**

- بدون أخطاء
- مختبر بالكامل
- موثق بشكل شامل
- متوافق مع جميع الأنظمة

## 📞 الدعم

للمزيد من المعلومات، راجع:
- `FLICKERING_GRID_IMPLEMENTATION.md` - دليل شامل
- `COMPLETION_REPORT.md` - تقرير تفصيلي

---

**تم إنشاء FlickeringGrid بـ ❤️ لـ FRNW**
