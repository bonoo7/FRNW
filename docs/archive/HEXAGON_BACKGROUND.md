# 🎨 HexagonBackground - خلفية السداسيات المتقدمة

## 📌 نظرة عامة

مكون React محترف يوفر **خلفية سداسيات شبكية** للثيم الداكن، مستوحى من [animate-ui](https://animate-ui.com/docs/components/backgrounds/hexagon)، مع شبكة ديناميكية وتصميم متجاوب.

## ✨ الجديد في الإصدار الأخير

### 🎯 التحسينات الرئيسية:
- ✅ **خوارزمية جديدة** مستوحاة من animate-ui الأصلية
- ✅ **SVG hexagons** برسم دقيق وسداسيات مثالية
- ✅ **شبكة ديناميكية** تتغير حسب حجم الشاشة
- ✅ **أداء محسّن** مع تحديث تلقائي للأبعاد
- ✅ **دعم الثيم الديناميكي** - الألوان تتغير مع الثيم
- ✅ **حاويات ملونة ديناميكية** - لون الحاوية يتطابق مع ألوان الثيم

## 🎯 الاستخدام

### الاستخدام المباشر:
```jsx
import HexagonBackground from '@/components/HexagonBackground';

export default function DarkThemeScreen() {
  return (
    <View style={{ flex: 1 }}>
      <HexagonBackground
        hexagonSize={75}
        hexagonMargin={3}
      />
      <View style={{ flex: 1, zIndex: 1 }}>
        {/* المحتوى الرئيسي */}
      </View>
    </View>
  );
}
```

### الاستخدام مع BackgroundSelector (موصى به):
```jsx
import BackgroundSelector from '@/components/BackgroundSelector';

<BackgroundSelector
  darkConfig={{
    hexagonSize: 75,
    hexagonMargin: 3,
  }}
>
  {/* المحتوى */}
</BackgroundSelector>
```

## ⚙️ المعاملات

| المعامل | النوع | الافتراضي | الوصف |
|--------|-------|---------|--------|
| `hexagonSize` | number | 75 | حجم السداسي (بالبكسل) |
| `hexagonMargin` | number | 3 | المسافة بين السداسيات |
| `children` | ReactNode | undefined | المحتوى فوق الخلفية |
| `hexagonProps` | object | {} | معاملات إضافية للسداسيات |

## 🎨 الإعدادات المسبقة

### HomeScreen:
```jsx
{
  hexagonSize: 75,
  hexagonMargin: 3,
}
```

### GameScreen - الحاوية الرئيسية:
```jsx
{
  hexagonSize: 75,
  hexagonMargin: 3,
}
```

### GameScreen - الحاويات الثانوية:
```jsx
{
  hexagonSize: 85,
  hexagonMargin: 3,
}
```

### GameScreen - Team Header:
```jsx
{
  hexagonSize: 65,
  hexagonMargin: 3,
}
```

### GameSetup:
```jsx
{
  hexagonSize: 75,
  hexagonMargin: 3,
}
```

## 🎨 ألوان الثيم الديناميكية

### Dark Theme:
- **الخلفية**: `#000000` (أسود نقي)
- **حدود السداسيات**: `#404040` (رمادي)
- **حاويات**: `#1A1A1A` (رمادي غامق)
- **حدود الحاويات**: `#3A3A3A` (رمادي)

### Blue Theme:
- **الخلفية**: `#FFFFFF` (أبيض)
- **حاويات**: `#D6E9FF` (أزرق فاتح)
- **حدود الحاويات**: `#2E5DB8` (أزرق)

### Fresh & Purple Themes:
- **الخلفية**: `#FFFFFF` (أبيض)
- **حاويات**: `#FFFFFF` (أبيض)
- **حدود الحاويات**: حسب لون الثيم

## 🔄 BackgroundSelector

مكون ذكي يختار بين:
- **FlickeringGrid**: للثيمات الفاتحة (Blue, Fresh, Purple)
- **HexagonBackground**: للثيم الداكن فقط

### الاستخدام:
```jsx
import BackgroundSelector from '@/components/BackgroundSelector';

<BackgroundSelector
  lightConfig={{
    squareSize: 4,
    gridGap: 6,
    flickerChance: 0.3,
    color: 'rgb(100, 181, 246)',
    maxOpacity: 0.25,
    animationSpeed: 'medium',
  }}
  darkConfig={{
    hexagonSize: 75,
    hexagonMargin: 3,
  }}
>
  {/* المحتوى */}
</BackgroundSelector>
```

## 📍 مواقع الاستخدام الحالية

| الشاشة | الثيم | المكون | الحالة |
|--------|-------|--------|--------|
| HomeScreen | Light | FlickeringGrid | ✅ نشط |
| HomeScreen | Dark | HexagonBackground | ✅ نشط |
| GameScreen | Light | FlickeringGrid | ✅ نشط |
| GameScreen | Dark | HexagonBackground | ✅ نشط |
| GameSetup | Light | FlickeringGrid | ✅ نشط |
| GameSetup | Dark | HexagonBackground | ✅ نشط |

## 🎯 التأثير البصري

### في الثيم الداكن:
- شبكة سداسيات رمادية على خلفية سوداء
- حدود دقيقة وواضحة
- تصميم احترافي ومعاصر
- شبكة متجاوبة تملأ كامل الشاشة

### في الثيمات الفاتحة:
- استمرار استخدام FlickeringGrid
- نقاط ملونة بألوان الثيم

## 🚀 الأداء

- ✅ حسابات فعالة للشبكة
- ✅ 60 FPS سلس
- ✅ حجم ملف صغير (~ 4.2 KB)
- ✅ استهلاك CPU منخفض
- ✅ تحديث ديناميكي للأبعاد

## 🎯 الثيم الديناميكي

### الحاويات الرئيسية:
الآن جميع الحاويات تستخدم:
```jsx
backgroundColor: theme.colors.background.card
borderColor: theme.colors.border.primary
shadowColor: theme.colors.border.primary
```

هذا يضمن:
- ✅ تطابق تام مع الثيم
- ✅ تغيير فوري عند تبديل الثيم
- ✅ تناسق لوني شامل

## 📝 ملاحظات مهمة

- المكون يعمل بشكل مثالي في الثيم الداكن
- تم تحسين الأداء والرسم من خلال SVG
- جميع الحاويات الآن ديناميكية وتتغير مع الثيم
- المكون يتجاوب تلقائياً مع تغييرات حجم الشاشة

---

**تم تحديث HexagonBackground بنجاح مع أحدث تحسينات! 🎉**
