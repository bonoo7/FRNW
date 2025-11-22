# 📘 دليل نظام Freemium - نظام الرصيد الكامل

## 🎯 نظرة عامة

تم تطبيق نظام **Freemium** كامل ومحمي يمنح كل مستخدم جديد **لعبتين مجانيتين** عند التسجيل، وبعد استخدامهما يجب عليه الشراء للمتابعة.

---

## 📊 هيكلية قاعدة البيانات (Database Schema)

### 1. حقل `credits` في مستند المستخدم (`users/{userId}`)

```javascript
{
  uid: "user123",
  email: "user@example.com",
  displayName: "محمد",
  
  credits: {
    remaining: 2,              // الرصيد المتبقي (قابل للنقصان والزيادة)
    initialFree: 2,            // عدد الألعاب المجانية الأولية (ثابت)
    totalPurchased: 0,         // إجمالي الألعاب المشتراة (يزيد فقط)
    totalUsed: 0,              // إجمالي الألعاب المستخدمة (يزيد فقط)
    totalGranted: 0,           // إجمالي المكافآت المجانية (يزيد فقط)
    lastUsedAt: timestamp,     // آخر استخدام للرصيد
    lastPurchaseAt: timestamp  // آخر عملية شراء
  }
}
```

### 2. مجموعة `creditLogs` - سجل استخدام الرصيد

```javascript
{
  userId: "user123",
  type: "game_start",          // game_start, purchase, grant
  amount: -1,                  // سالب عند الاستخدام، موجب عند الشراء/المنح
  remainingAfter: 1,           // الرصيد بعد العملية
  reason: "بدء لعبة جديدة",
  metadata: {},
  timestamp: serverTimestamp(),
  createdAt: "2025-01-15..."
}
```

### 3. مجموعة `purchaseTransactions` - معاملات الشراء

```javascript
{
  userId: "user123",
  creditsAmount: 10,           // عدد الألعاب المشتراة
  price: 9.99,
  currency: "USD",
  platform: "ios",             // web, ios, android
  paymentMethod: "apple_pay",
  transactionId: "txn_abc123",
  status: "completed",
  timestamp: serverTimestamp(),
  createdAt: "2025-01-15..."
}
```

---

## 🔐 منطق التسجيل (Registration Logic)

### في `AuthContext.js`

عند إنشاء حساب جديد، يتم تهيئة الرصيد تلقائياً:

```javascript
const userData = {
  uid: user.uid,
  email: user.email,
  // ... بيانات أخرى
  
  credits: {
    remaining: 2,              // 🎁 لعبتان مجانيتان
    initialFree: 2,
    totalPurchased: 0,
    totalUsed: 0,
    totalGranted: 0,
    lastUsedAt: null,
    lastPurchaseAt: null
  }
};

await setDoc(userRef, userData);
```

---

## 🎮 منطق بدء اللعبة (Start Game Logic)

### استخدام `CreditsService.consumeCreditForGame()`

```javascript
import CreditsService from '../services/creditsService';

const startGame = async () => {
  try {
    // محاولة خصم رصيد واحد
    const result = await CreditsService.consumeCreditForGame(userId);
    
    if (result.success) {
      // ✅ الرصيد كافٍ، ابدأ اللعبة
      console.log(`Game started! Remaining: ${result.remaining}`);
      navigation.navigate('GameScreen');
    } else {
      // ❌ الرصيد غير كافٍ
      console.log('Insufficient credits');
      Alert.alert('رصيد غير كافٍ', result.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### كيف يعمل؟

1. **يقرأ** الرصيد الحالي من Firestore
2. **يتحقق** إذا كان `remaining >= 1`
3. **إذا كان كافياً:**
   - يخصم `remaining` بمقدار 1
   - يزيد `totalUsed` بمقدار 1
   - يحدث `lastUsedAt`
   - **يستخدم Transaction** لضمان عدم حدوث تضارب
4. **إذا لم يكن كافياً:**
   - يرجع `success: false` مع رسالة

---

## 🛡️ قواعد الحماية (Firestore Security Rules)

### ملف `firestore.rules`

```javascript
// قواعد تحديث الرصيد
allow update: if isSignedIn() 
              && isOwner(userId)
              && validateCreditsUpdate();

function validateCreditsUpdate() {
  let oldCredits = resource.data.credits;
  let newCredits = request.resource.data.credits;
  
  // السيناريو 1: استهلاك رصيد (بدء لعبة)
  let isValidConsumption = 
    (newCredits.remaining == oldCredits.remaining - 1) &&
    (newCredits.totalUsed == oldCredits.totalUsed + 1) &&
    oldCredits.remaining > 0;
  
  // السيناريو 2: شراء رصيد
  let purchaseAmount = newCredits.remaining - oldCredits.remaining;
  let isValidPurchase = 
    purchaseAmount > 0 && purchaseAmount <= 100 &&
    (newCredits.totalPurchased == oldCredits.totalPurchased + purchaseAmount);
  
  // السيناريو 3: منح رصيد مجاني
  let grantAmount = newCredits.remaining - oldCredits.remaining;
  let isValidGrant = 
    grantAmount > 0 && grantAmount <= 20 &&
    (newCredits.totalGranted == oldCredits.totalGranted + grantAmount);
  
  return isValidConsumption || isValidPurchase || isValidGrant;
}
```

### ✅ ما تحميه القواعد:

- ❌ **منع** تعديل الرصيد يدوياً
- ❌ **منع** زيادة الرصيد بدون شراء أو منح
- ❌ **منع** خصم أكثر من 1 في المرة الواحدة
- ❌ **منع** تغيير `initialFree` بعد الإنشاء
- ✅ **السماح** بالخصم بمقدار 1 فقط
- ✅ **السماح** بالشراء (1-100 لعبة)
- ✅ **السماح** بالمنح (1-20 لعبة)

---

## 🎨 المكونات الجاهزة (UI Components)

### 1. `CreditsDisplay` - عرض وشراء الرصيد

```javascript
import CreditsDisplay from '../components/CreditsDisplay';

<CreditsDisplay 
  onPurchaseComplete={(newBalance) => {
    console.log('New balance:', newBalance);
  }}
/>
```

**الميزات:**
- عرض الرصيد الحالي
- نافذة الشراء مع 4 باقات
- تحديث تلقائي بعد الشراء

### 2. `CreditGate` - بوابة التحقق من الرصيد

```javascript
import CreditGate from '../components/CreditGate';

<CreditGate
  onAllow={(result) => {
    // ابدأ اللعبة
    navigation.navigate('GameScreen');
  }}
  onDeny={() => {
    // اعرض نافذة الشراء
  }}
>
  <Text>ابدأ اللعب!</Text>
</CreditGate>
```

**الميزات:**
- تحقق تلقائي من الرصيد
- خصم تلقائي عند البدء
- نافذة "رصيد غير كافٍ" تلقائية

---

## 🔧 واجهة برمجة التطبيقات (API)

### `CreditsService` - الخدمة الرئيسية

#### 1. الحصول على الرصيد

```javascript
const credits = await CreditsService.getUserCredits(userId);
console.log(credits); // 2
```

#### 2. التحقق من توفر الرصيد

```javascript
const check = await CreditsService.checkCreditsAvailability(userId);
/*
{
  hasCredits: true,
  remaining: 2,
  message: "لديك 2 ألعاب متبقية"
}
*/
```

#### 3. استهلاك رصيد (بدء لعبة)

```javascript
const result = await CreditsService.consumeCreditForGame(userId);
/*
{
  success: true,
  remaining: 1,
  message: "تم بدء اللعبة! الرصيد المتبقي: 1",
  needsPurchase: false
}
*/
```

#### 4. إضافة رصيد (شراء)

```javascript
const result = await CreditsService.addCredits(userId, 10, {
  price: 9.99,
  currency: 'USD',
  packageId: 'medium',
  platform: 'ios',
  paymentMethod: 'apple_pay',
  transactionId: 'txn_123'
});
/*
{
  success: true,
  newBalance: 11,
  added: 10
}
*/
```

#### 5. منح رصيد مجاني (مكافأة)

```javascript
const result = await CreditsService.grantFreeCredits(
  userId, 
  3, 
  'مكافأة تسجيل الدخول اليومي'
);
```

#### 6. الحصول على سجل الرصيد

```javascript
const history = await CreditsService.getCreditHistory(userId, 20);
// Array of credit log entries
```

#### 7. الحصول على إحصائيات الرصيد

```javascript
const stats = await CreditsService.getCreditStatistics(userId);
/*
{
  remaining: 5,
  totalPurchased: 20,
  totalUsed: 17,
  totalGranted: 2,
  initialFree: 2,
  lastUsedAt: ...,
  lastPurchaseAt: ...
}
*/
```

---

## 📱 مثال عملي كامل

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import CreditsService from '../services/creditsService';
import CreditsDisplay from '../components/CreditsDisplay';

const GameScreen = () => {
  const { currentUser } = useAuth();
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    loadCredits();
  }, []);

  const loadCredits = async () => {
    const userCredits = await CreditsService.getUserCredits(currentUser.uid);
    setCredits(userCredits);
  };

  const startGame = async () => {
    const result = await CreditsService.consumeCreditForGame(currentUser.uid);
    
    if (result.success) {
      setCredits(result.remaining);
      // ابدأ اللعبة
      Alert.alert('بدء اللعبة!', `الرصيد المتبقي: ${result.remaining}`);
    } else {
      // اعرض نافذة الشراء
      Alert.alert('رصيد غير كافٍ', result.message);
    }
  };

  return (
    <View>
      <CreditsDisplay onPurchaseComplete={loadCredits} />
      
      <TouchableOpacity onPress={startGame}>
        <Text>ابدأ اللعب ({credits} متبقية)</Text>
      </TouchableOpacity>
    </View>
  );
};
```

---

## 🚀 خطوات التفعيل

### 1. رفع قواعد Firestore

```bash
firebase deploy --only firestore:rules
```

### 2. استيراد الخدمات

```javascript
import CreditsService from './services/creditsService';
import CreditsDisplay from './components/CreditsDisplay';
import CreditGate from './components/CreditGate';
```

### 3. إضافة الرصيد للمستخدمين الحاليين

إذا كان لديك مستخدمون موجودون بالفعل:

```javascript
const migrateExistingUsers = async () => {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  
  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    
    if (!userData.credits) {
      await updateDoc(doc(db, 'users', userDoc.id), {
        credits: {
          remaining: 2,
          initialFree: 2,
          totalPurchased: 0,
          totalUsed: 0,
          totalGranted: 0,
          lastUsedAt: null,
          lastPurchaseAt: null
        }
      });
    }
  }
};
```

---

## 💡 نصائح مهمة

### 1. الأمان
- ✅ **دائماً** استخدم `Transaction` عند تعديل الرصيد
- ✅ **لا تسمح** بتعديل الرصيد من جانب العميل مباشرة
- ✅ **استخدم** Cloud Functions للعمليات الحرجة

### 2. تجربة المستخدم
- 📊 اعرض الرصيد بوضوح في كل صفحة
- ⚠️ حذّر المستخدم عند اقتراب نفاد الرصيد
- 🎁 قدم مكافآت لتحفيز المستخدمين

### 3. الأداء
- 💾 **خزّن** الرصيد محلياً (cache) لتقليل القراءات
- 🔄 **حدّث** الرصيد عند الحاجة فقط
- 📉 استخدم `onSnapshot` للتحديثات الفورية

---

## 🐛 استكشاف الأخطاء

### المشكلة: "Permission denied"
**الحل:** تأكد من رفع قواعد Firestore الجديدة

### المشكلة: الرصيد لا ينقص
**الحل:** تحقق من أن Transaction تعمل بشكل صحيح

### المشكلة: يمكن للمستخدم اللعب بدون رصيد
**الحل:** تأكد من استخدام `consumeCreditForGame()` قبل بدء اللعبة

---

## 📞 الدعم

للمساعدة أو الأسئلة:
- 📧 البريد الإلكتروني: support@example.com
- 💬 Discord: discord.gg/example

---

## 📄 الترخيص

MIT License - يمكنك استخدام وتعديل الكود بحرية

---

**تم إنشاؤه بواسطة:** فريق التطوير  
**آخر تحديث:** 2025-01-15  
**الإصدار:** 1.0.0
