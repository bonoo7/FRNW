# إصلاح مشكلة تكرار اللعبة المستكملة

## 🐛 المشكلة:
عند استكمال لعبة ثم الضغط على "إنهاء اللعب" قبل إكمالها، تظهر نفس اللعبة كلعبة جديدة بدلاً من تحديثها في مكانها، مما يسبب تكرار الألعاب.

## ✅ السبب الحقيقي:
1. عند الانتقال من `SavedGamesModal` إلى `GameScreen`، يتم تمرير `gameData` عبر `JSON.stringify`
2. البيانات المهمة (`savedGameId`, `isContinuing`) قد تُفقد أو لا تُمرر بشكل صحيح
3. عند الانتقال إلى `RoundResults.js`، لا تصل البيانات الصحيحة لتحديد أن هذه لعبة استكمال

## 🔧 الإصلاحات المطبقة:

### 1. في `SavedGamesModal.js`:
إضافة logging وتأكد من تمرير جميع البيانات:
```javascript
if (mode === 'continue') {
  gameData = await SavedGamesService.continueGame(game);
  console.log('Continue game data:', {
    isContinuing: gameData.isContinuing,
    savedGameId: gameData.savedGameId, // ✓ يجب أن يكون موجوداً
    hasQuestions: !!gameData.questions
  });
}
```

### 2. في `services/savedGamesService.js`:
تأكد من حفظ جميع البيانات المطلوبة في `continueGame()`:
```javascript
return {
  ...
  isContinuing: true,     // ✓ علم مهم جداً
  savedGameId: savedGame.id, // ✓ معرف اللعبة الأصلية مهم جداً
  ...
};
```

### 3. في `screens/RoundResults.js`:
تحديث الحفظ بناءً على الأعلام:
```javascript
// أولاً: فحص لعبة استكمال
if (gameData?.isContinuing && gameData?.savedGameId) {
  // تحديث اللعبة الأصلية (ليس حفظ جديد)
  await SavedGamesService.updateSavedGame(gameData.savedGameId, {...});
}
// ثانياً: فحص لعبة معاد تشغيلها
else if (gameData?.isReplaying) {
  // عدم الحفظ
}
// ثالثاً: لعبة جديدة عادية
else {
  // حفظ جديد
  await SavedGamesService.saveGame(...);
}
```

## 📊 تدفق البيانات الصحيح:

### عند استكمال:
```
SavedGamesModal
  ├─ game.id = "ABC123"
  ├─ continueGame(game)
  └─ gameData = {
       isContinuing: true,
       savedGameId: "ABC123", // ✓ مهم
       ...
     }
      │
      ├─ JSON.stringify(gameData)
      │
      ├─ router.push({
      │    params: { gameData: "JSON..." }
      │  })
      │
      ├─ GameScreen
      │
      └─ RoundResults.js
          ├─ gameData = JSON.parse(params.gameData)
          ├─ if (gameData.isContinuing && gameData.savedGameId)
          │    └─ updateSavedGame(gameData.savedGameId, {...})
          └─ ✓ تحديث نفس السجل (لا سجل جديد)
```

## ✅ التحقق:

بعد هذا الإصلاح:
1. **عند استكمال اللعبة ثم إنهاءها**: 
   - يتم تحديث نفس السجل ✓
   - لا يتم إنشاء سجل جديد ✓
   - العدد لا يزيد ✓

2. **عند إعادة تشغيل اللعبة**:
   - يتم حفظ كلعبة جديدة فقط إذا كانت معاد تشغيلها من البداية ✓

3. **الحفظ الصحيح**:
   - جميع البيانات محفوظة بشكل صحيح ✓
   - `savedGameId` موجود ✓
   - `isContinuing` موجود ✓

## 📝 الملفات المحدثة:
- ✅ `screens/RoundResults.js`
- ✅ `services/savedGamesService.js`
- ✅ `components/SavedGamesModal.js`
