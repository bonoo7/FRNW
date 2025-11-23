# إصلاح نهائي لميزة استكمال وإعادة تشغيل الألعاب

## ✅ المشاكل التي تم إصلاحها:

### 1. الألعاب المستكملة والمعاد تشغيلها تُحفظ كلعبة جديدة
**الحل:**
- تفعيل الفحص `!gameData.isReplaying && !gameData.isContinuing` في `RoundResults.js`
- في `saveGame()`: إرجاع `null` إذا كانت اللعبة `isReplaying`
- الألعاب المستكملة تُحدّث فقط (لا حفظ جديد)

### 2. إعادة التشغيل تستكمل من حيث توقفت بدلاً من إعادة جميع الأسئلة
**الحل:**
- في `replayGame()`: إعادة تعيين `isUsed: false` لجميع الأسئلة
- نسخ `questions` مع مسح علم الاستخدام
- إعادة تعيين `currentTeamIndex` و `currentCategoryIndex` للصفر

## 📝 التغييرات في الملفات:

### 1. `services/savedGamesService.js`

#### تحديث `saveGame()`:
```javascript
// إضافة حفظ questions و currentTeamIndex و currentCategoryIndex
const gameToSave = {
  ...
  questions: gameData.questions || {}, // حفظ جميع الأسئلة
  currentTeamIndex: gameData.currentTeamIndex || 0,
  currentCategoryIndex: gameData.currentCategoryIndex || 0,
};
```

#### تحديث `replayGame()`:
```javascript
// إعادة تعيين جميع الأسئلة
const resetQuestions = {};
Object.keys(savedGame.questions).forEach(category => {
  resetQuestions[category] = {};
  Object.keys(savedGame.questions[category]).forEach(difficulty => {
    resetQuestions[category][difficulty] = savedGame.questions[category][difficulty].map(q => ({
      ...q,
      isUsed: false // إعادة تعيين حالة الاستخدام
    }));
  });
});

return {
  ...
  questions: resetQuestions, // جميع الأسئلة معاد تعيينها
  currentTeamIndex: 0,
  currentCategoryIndex: 0,
  isReplaying: true
};
```

#### تحديث `continueGame()`:
```javascript
return {
  ...
  questions: JSON.parse(JSON.stringify(savedGame.questions || {})), // نسخة عميقة
  currentTeamIndex: savedGame.currentTeamIndex || 0,
  currentCategoryIndex: savedGame.currentCategoryIndex || 0,
  isContinuing: true
};
```

### 2. `screens/RoundResults.js`

#### تحديث `handleNewRound()`:
```javascript
// عدم حفظ الألعاب المعاد تشغيلها
if (currentUser?.uid && gameData && !gameData.isReplaying && !gameData.isContinuing) {
  await SavedGamesService.saveGame(...); // فقط للألعاب الجديدة
}

// تحديث الألعاب المستكملة مع الأسئلة
else if (gameData && gameData.isContinuing) {
  await SavedGamesService.updateSavedGame(gameData.savedGameId, {
    scores: scores,
    questions: gameData.questions, // تحديث حالة الأسئلة
    statistics: gameData.statistics,
    isCompleted: completed
  });
}
```

## 🎮 السلوك الجديد:

### إعادة تشغيل:
```
لعبة محفوظة (مثلاً 3 أسئلة من 36 مستخدمة)
    ↓
اضغط "إعادة تشغيل"
    ↓
✓ جميع الأسئلة تُعاد (36 سؤال من جديد)
✓ جميع isUsed = false
✓ النقاط = 0 من البداية
✓ currentTeamIndex = 0
✓ currentCategoryIndex = 0
    ↓
لا يتم حفظ كلعبة جديدة في "ألعابي"
```

### استكمال:
```
لعبة غير مكتملة (3 أسئلة من 36 مستخدمة)
    ↓
اضغط "استكمال"
    ↓
✓ استرجاع الأسئلة المتبقية (33 سؤال)
✓ النقاط السابقة محفوظة
✓ currentTeamIndex و currentCategoryIndex محفوظ
    ↓
يتم تحديث نفس السجل (لا سجل جديد)
```

## 📊 حقول قاعدة البيانات:

```javascript
{
  id: string,
  userId: string,
  roundName: string,
  teams: string[],
  categories: string[],
  selectedQuestions: object[],
  questions: object, // ✓ جديد: جميع الأسئلة مع حالة isUsed
  scores: { [teamName]: number },
  statistics: object,
  isCompleted: boolean,
  currentTeamIndex: number, // ✓ جديد: لاستكمال من نقطة معينة
  currentCategoryIndex: number, // ✓ جديد
  createdAt: ISO,
  updatedAt: ISO,
  replayCount: number
}
```

## ✅ اختبارات التحقق:

1. **اختبر إعادة التشغيل:**
   - العب جولة واستوقفها مبكراً (مثلاً 3 أسئلة من 36)
   - افتح "ألعابي" → اضغط "إعادة تشغيل"
   - تحقق: جميع الأسئلة متاحة من البداية (36 سؤال)
   - تحقق: لم تُضف لعبة جديدة في "ألعابي"

2. **اختبر الاستكمال:**
   - العب جولة واستوقفها مبكراً
   - افتح "ألعابي" → اضغط "استكمال"
   - تحقق: الأسئلة المتبقية متاحة فقط
   - تحقق: النقاط السابقة محفوظة
   - تحقق: لا توجد لعبة جديدة في "ألعابي"

3. **اختبر لعبة مكتملة:**
   - العب جولة كاملة (استخدم جميع الأسئلة)
   - تحقق: لا يوجد زر "استكمال" (الشارة خضراء)
   - اضغط "إعادة تشغيل" → تحقق من جميع الأسئلة
   - تحقق: لم تُضف لعبة جديدة
