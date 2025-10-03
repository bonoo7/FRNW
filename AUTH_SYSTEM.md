# نظام المصادقة المتطور

هذا الدليل يوضح كيفية استخدام نظام المصادقة المتطور في تطبيق فكّر. النظام يوفر مرونة كاملة للمطورين لتخصيص سلوك المصادقة حسب احتياجات التطبيق.

## المكونات الأساسية

### 1. AuthGuard
مكون أساسي لحماية المحتوى مع خيارات مرنة.

```jsx
import AuthGuard from '../components/AuthGuard';

// الاستخدام الأساسي
<AuthGuard forceAuth={false}>
  <YourComponent />
</AuthGuard>

// إجبار المصادقة
<AuthGuard forceAuth={true}>
  <ProtectedContent />
</AuthGuard>
```

**الخصائص:**
- `forceAuth`: إجبار المصادقة (افتراضي: false)
- `children`: المحتوى المحمي

### 2. ProtectedRoute
حماية الروتات مع رسائل مخصصة ومرونة في السلوك.

```jsx
import ProtectedRoute from '../components/ProtectedRoute';

// للصفحات التي تتطلب تسجيل دخول
<ProtectedRoute requireAuth={true} fallbackMessage="رسالة مخصصة">
  <YourPage />
</ProtectedRoute>

// للصفحات المخصصة للضيوف فقط
<ProtectedRoute requireAuth={false}>
  <GuestOnlyPage />
</ProtectedRoute>
```

**الخصائص:**
- `requireAuth`: هل تتطلب الصفحة مصادقة
- `fallbackMessage`: رسالة مخصصة عند منع الوصول
- `children`: محتوى الصفحة

### 3. RequiredAuthWrapper
مكون متطور لإجبار المصادقة مع واجهة مستخدم جميلة.

```jsx
import RequiredAuthWrapper from '../components/RequiredAuthWrapper';

<RequiredAuthWrapper 
  title="عنوان مخصص"
  message="رسالة توضيحية مخصصة"
  showGuestOption={false}
>
  <YourProtectedContent />
</RequiredAuthWrapper>
```

**الخصائص:**
- `title`: العنوان المعروض (اختياري)
- `message`: الرسالة التوضيحية (اختياري)  
- `showGuestOption`: إظهار خيار "العودة" (افتراضي: false)
- `children`: المحتوى المحمي

### 4. ForceAuthScreen
شاشة مستقلة لإجبار المصادقة مع تصميم جذاب.

```jsx
import ForceAuthScreen from '../components/ForceAuthScreen';

// استخدام مباشر
<ForceAuthScreen />
```

### 5. AuthSettings
مكون لإدارة إعدادات المصادقة على مستوى التطبيق.

```jsx
import AuthSettings from '../components/AuthSettings';

<AuthSettings
  visible={showSettings}
  onClose={() => setShowSettings(false)}
/>
```

## الصفحات المتاحة

### 1. صفحة تجريب المصادقة
```
/auth-demo
```
صفحة تفاعلية تعرض جميع مكونات المصادقة مع أمثلة عملية.

### 2. صفحة اللعبة المحمية
```
/auth-required
```
مثال على لعبة تتطلب مصادقة إجبارية.

### 3. الملف الشخصي
```
/profile
```
يستخدم RequiredAuthWrapper للحماية.

### 4. الإحصائيات
```
/statistics
```
يستخدم RequiredAuthWrapper للحماية.

## إعدادات المصادقة

يمكن تكوين سلوك المصادقة من خلال مكون AuthSettings:

### الإعدادات المتاحة:
- **إجبار المصادقة للعب**: المستخدمون يجب أن يسجلوا دخول قبل بدء أي لعبة
- **إجبار المصادقة للإحصائيات**: مطلوب تسجيل الدخول لعرض الإحصائيات
- **إجبار المصادقة للملف الشخصي**: مطلوب تسجيل الدخول لعرض الملف الشخصي
- **السماح بوضع الضيف**: المستخدمون يمكنهم اللعب بدون تسجيل دخول
- **حفظ التقدم بدون مصادقة**: حفظ نتائج الألعاب محلياً للضيوف
- **إظهار تذكيرات المصادقة**: إظهار رسائل تشجيعية لتسجيل الدخول
- **المزامنة التلقائية عند تسجيل الدخول**: مزامنة البيانات المحلية عند تسجيل الدخول

## أمثلة عملية

### مثال 1: صفحة تتطلب مصادقة إجبارية
```jsx
import RequiredAuthWrapper from '../components/RequiredAuthWrapper';

export default function MyProtectedPage() {
  return (
    <RequiredAuthWrapper 
      title="الوصول المحدود"
      message="هذه الصفحة تتطلب تسجيل الدخول للوصول إلى الميزات المتقدمة"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <MyPageContent />
    </RequiredAuthWrapper>
  );
}
```

### مثال 2: صفحة مع حماية مرنة
```jsx
import ProtectedRoute from '../components/ProtectedRoute';

export default function FlexiblePage() {
  return (
    <ProtectedRoute 
      requireAuth={true} 
      fallbackMessage="يرجى تسجيل الدخول لعرض هذا المحتوى"
    >
      <Stack.Screen options={{ headerShown: false }} />
      <FlexiblePageContent />
    </ProtectedRoute>
  );
}
```

### مثال 3: مكون مع حارس مصادقة
```jsx
import AuthGuard from '../components/AuthGuard';

const MyComponent = () => {
  return (
    <AuthGuard forceAuth={true}>
      <div>هذا المحتوى يظهر فقط للمستخدمين المسجلين</div>
    </AuthGuard>
  );
};
```

## نصائح للمطورين

### 1. اختيار المكون المناسب
- **AuthGuard**: للحماية البسيطة داخل المكونات
- **ProtectedRoute**: لحماية الصفحات مع مرونة في السلوك
- **RequiredAuthWrapper**: لإجبار المصادقة مع واجهة جميلة
- **ForceAuthScreen**: كشاشة مستقلة لإجبار المصادقة

### 2. تجربة المكونات
استخدم صفحة `/auth-demo` لتجربة جميع المكونات ورؤية كيفية عملها.

### 3. تخصيص الإعدادات
استخدم مكون AuthSettings لتخصيص سلوك المصادقة حسب احتياجات تطبيقك.

### 4. أفضل الممارسات
- استخدم RequiredAuthWrapper للصفحات الهامة
- استخدم ProtectedRoute للصفحات العادية
- اختبر دائماً السلوك مع المستخدمين المسجلين وغير المسجلين
- قدم رسائل واضحة للمستخدمين

## الوصول السريع

من القائمة الرئيسية (UserMenu)، يمكن الوصول إلى:
- **تجريب المصادقة**: رابط مباشر لصفحة `/auth-demo`
- **الإعدادات**: للوصول إلى إعدادات التطبيق العامة

## الملاحظات الفنية

### حفظ الإعدادات
تُحفظ إعدادات المصادقة في:
- **محلياً**: AsyncStorage تحت مفتاح 'authSettings'
- **السحابة**: Firestore للمستخدمين المسجلين

### التوافق
- **الويب**: دعم كامل لجميع المكونات
- **الموبايل**: دعم كامل مع تحسينات للشاشات الصغيرة
- **التابلت**: تحسينات خاصة للشاشات الكبيرة

### الأمان
- جميع المكونات تستخدم Firebase Authentication
- التحقق من الهوية يتم على مستوى الخادم
- البيانات الحساسة محمية بقواعد Firestore

هذا النظام يوفر مرونة كاملة للمطورين مع ضمان تجربة مستخدم ممتازة. جرب المكونات المختلفة واختر ما يناسب احتياجاتك!