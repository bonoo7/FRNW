# 🧪 دليل الاختبار

## أنواع الاختبارات

### 1. اختبارات الوحدات (Unit Tests)
```bash
npm run test
```

**الملفات المختبرة:**
- `utils/*.js` - دوال مساعدة
- `services/*.js` - خدمات البيانات
- `contexts/*.js` - سياق التطبيق

### 2. اختبارات التكامل (Integration Tests)
```bash
npm run test -- --integration
```

**ما يتم اختباره:**
- تفاعل المكونات معاً
- تدفق البيانات
- الانتقالات بين الشاشات

### 3. اختبارات النهاية (E2E Tests)
```bash
npm run test:e2e
```

**السيناريوهات:**
- بدء لعبة جديدة
- انتقاء الفئات
- تسجيل النقاط

## كتابة الاختبارات

### مثال: اختبار دالة حساب النقاط

```javascript
import { calculateScore } from '../utils/scoring';

describe('calculateScore', () => {
  test('يجب أن يحسب النقاط بشكل صحيح', () => {
    const result = calculateScore({
      isCorrect: true,
      timeSpent: 2000,
      maxTime: 10000
    });
    expect(result).toBeGreaterThan(0);
  });

  test('يجب أن يعيد 0 للإجابة الخاطئة', () => {
    const result = calculateScore({
      isCorrect: false,
      timeSpent: 5000,
      maxTime: 10000
    });
    expect(result).toBe(0);
  });
});
```

### مثال: اختبار مكون

```javascript
import { render, screen } from '@testing-library/react-native';
import GameSetup from '../components/GameSetup';

describe('GameSetup', () => {
  test('يجب أن يعرض حقول الإدخال', () => {
    render(<GameSetup />);
    expect(screen.getByPlaceholderText('أدخل اسم الفريق')).toBeTruthy();
  });
});
```

## أوامر الاختبار الشاملة

| الأمر | الوصف |
|------|-------|
| `npm run test` | تشغيل جميع الاختبارات |
| `npm run test -- --watch` | مراقبة الملفات وإعادة التشغيل |
| `npm run test -- --coverage` | تقرير التغطية |
| `npm test -- GameScreen` | اختبار ملف محدد |

## التغطية المطلوبة

- **الدوال المساعدة**: 100%
- **المكونات الأساسية**: 80%+
- **الخدمات**: 90%+
- **السياق**: 85%+

## مراقبة الاختبارات

```bash
# شاهد الملفات وأعد التشغيل تلقائياً
npm run test -- --watch
```

## استكشاف الأخطاء

**المشكلة**: Test timeout
- **الحل**: زد `timeout` في الملف

**المشكلة**: Async test failures
- **الحل**: استخدم `async/await` أو `done` callback

**المشكلة**: Mock not working
- **الحل**: تأكد من استخدام `jest.mock()` بشكل صحيح

## الممارسات الجيدة

✅ اكتب اختبارات قبل الكود (TDD)
✅ أعط الاختبارات أسماء واضحة
✅ اختبر الحالات الطبيعية والاستثنائية
✅ تجنب الاختبارات المترابطة
✅ استخدم snapshots للـ UI المعقدة

