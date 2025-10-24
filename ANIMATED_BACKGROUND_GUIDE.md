# دليل الخلفية المتحركة - Animated Grid Pattern

## الملخص
تم تطبيق خلفية **Animated Grid Pattern** على الصفحة الرئيسية (HomeScreen) لإضافة تأثير بصري متحرك جذاب.

## المكون الجديد
**المسار:** `components/AnimatedGridPattern.jsx`

### الخصائص المتاحة:
```javascript
<AnimatedGridPattern
  width={50}              // عرض الخلية (بالبكسل)
  height={50}             // ارتفاع الخلية (بالبكسل)
  dotSize={4}             // حجم النقطة (بالبكسل)
  dotColor="#4285F4"      // لون النقطة
  dotOpacity={0.12}       // شفافية النقطة (0-1)
  animationDuration={12000} // مدة الحركة (ميلي ثانية)
  animationDelay={0}      // تأخير البدء (ميلي ثانية)
/>
```

## المزايا
✅ **حركة سلسة**: تحريك النقاط بشكل متدرج
✅ **قابل للتخصيص**: سهل التخصيص لأي ألوان وأحجام
✅ **أداء عالي**: استخدام React Native Animated API
✅ **متوافق**: يعمل على Web, iOS, Android

## التعديلات التي تمت

### 1. ملف المكون الجديد
- تم إنشاء `components/AnimatedGridPattern.jsx`
- يستخدم `Animated.View` و `Animated.timing` للحركات السلسة
- يحسب عدد الخلايا بناءً على حجم الشاشة

### 2. تعديل HomeScreen.js
- إضافة الاستيراد: `import AnimatedGridPattern from '../components/AnimatedGridPattern';`
- استبدال النمط الثابت برقعة شبكة متحركة
- تطبيق المكون مع الخلفية المتدرجة (LinearGradient)

## الاستخدام

الخلفية تظهر تلقائياً عند استخدام الثيم الأزرق:
```javascript
{theme.currentTheme === 'blue' && (
  <>
    <LinearGradient ... />
    <AnimatedGridPattern ... />
  </>
)}
```

## التخصيص

لتغيير مظهر الخلفية، عدّل الخصائص في `HomeScreen.js` سطر 957:

```javascript
<AnimatedGridPattern
  width={50}              // أكبر = شبكة أكثر تباعداً
  height={50}
  dotSize={4}             // أكبر = نقاط أكبر
  dotColor="#4285F4"      // غيّر اللون
  dotOpacity={0.12}       // أكثر = أكثر وضوحاً
  animationDuration={12000} // أكبر = حركة أبطأ
/>
```

## الأداء
- الحركات تستخدم `useNativeDriver` على جميع المنصات
- الـ pointerEvents مضبوط على 'none' لضمان عدم التأثير على التفاعلات
- لا يوجد تأثير سلبي على أداء التطبيق

## المتطلبات
- React Native Animated API (مدمج في React Native)
- expo-linear-gradient (متوفر)
- لا توجد مكتبات خارجية إضافية مطلوبة

## الملاحظات
- النمط مرئي فقط للثيم الأزرق
- يمكن تطبيق نمط مشابه على الثيمات الأخرى حسب الحاجة
- النقاط تتحرك بشكل متموج وتتغير أحجامها تلقائياً
