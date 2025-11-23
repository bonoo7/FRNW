# خطوات تفعيل ميزة الألعاب المحفوظة

## المشكلة الحالية:
```
FirebaseError: Missing or insufficient permissions.
```

## السبب:
قواعد Firebase Firestore لم تُحدّث لتسمح بالقراءة والكتابة من مجموعة `savedGames`.

## الحل:

### 1. انتقل إلى Firebase Console
- اذهب إلى https://console.firebase.google.com
- اختر مشروعك

### 2. اضغط على Firestore Database
في الجانب الأيسر: Firestore Database

### 3. انسخ إلى قسم Rules
- اضغط على تبويب "Rules"
- استبدل محتوى القواعد بالمحتوى التالي:

```firestore rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ====== Helper Functions ======
    
    function isSignedIn() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    function isValidUserData() {
      return request.resource.data.keys().hasAll(['uid', 'email', 'credits']);
    }
    
    function validateCreditsUpdate() {
      let oldCredits = resource.data.credits;
      let newCredits = request.resource.data.credits;
      let oldData = resource.data;
      let newData = request.resource.data;
      
      return (
        !('credits' in newData.diff(oldData).affectedKeys()) ||
        (
          newCredits.initialFree == oldCredits.initialFree &&
          (
            (
              newCredits.remaining == oldCredits.remaining - 1 &&
              newCredits.totalUsed == oldCredits.totalUsed + 1 &&
              oldCredits.remaining > 0 &&
              newCredits.remaining >= 0
            ) ||
            (
              newCredits.remaining > oldCredits.remaining &&
              newCredits.remaining - oldCredits.remaining <= 100 &&
              newCredits.totalPurchased == oldCredits.totalPurchased + (newCredits.remaining - oldCredits.remaining)
            ) ||
            (
              newCredits.remaining > oldCredits.remaining &&
              newCredits.remaining - oldCredits.remaining <= 20 &&
              newCredits.get('totalGranted', 0) == oldCredits.get('totalGranted', 0) + (newCredits.remaining - oldCredits.remaining)
            )
          )
        )
      );
    }
    
    // ====== Users Collection Rules ======
    match /users/{userId} {
      allow read: if isSignedIn() && isOwner(userId);
      
      allow create: if isSignedIn() 
                    && isOwner(userId)
                    && isValidUserData()
                    && request.resource.data.credits.remaining == 2
                    && request.resource.data.credits.initialFree == 2
                    && request.resource.data.credits.totalPurchased == 0
                    && request.resource.data.credits.totalUsed == 0;
      
      allow update: if isSignedIn() 
                    && isOwner(userId)
                    && validateCreditsUpdate();
      
      allow delete: if false;
    }
    
    // ====== Games Collection Rules ======
    match /games/{gameId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() 
                    && request.resource.data.userId == request.auth.uid;
      
      allow update: if isSignedIn() 
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;
      
      allow delete: if false;
    }
    
    // ====== Credit Logs Collection Rules ======
    match /creditLogs/{logId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() 
                    && request.resource.data.userId == request.auth.uid;
      
      allow update, delete: if false;
    }
    
    // ====== Purchase Transactions Collection Rules ======
    match /purchaseTransactions/{transactionId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.status == 'completed'
                    && request.resource.data.creditsAmount > 0
                    && request.resource.data.creditsAmount <= 100;
      
      allow update, delete: if false;
    }
    
    // ====== Question Answers Collection Rules ======
    match /questionAnswers/{answerId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() 
                    && request.resource.data.userId == request.auth.uid;
      
      allow update, delete: if false;
    }
    
    // ====== Question Reports Collection Rules ======
    match /questionReports/{reportId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.status == 'pending';
      
      allow update, delete: if false;
    }
    
    // ====== Saved Games Collection Rules (جديد) ======
    match /savedGames/{gameId} {
      allow read: if isSignedIn() && resource.data.userId == request.auth.uid;
      
      allow create: if isSignedIn() 
                    && request.resource.data.userId == request.auth.uid
                    && request.resource.data.roundName != null
                    && request.resource.data.teams != null
                    && request.resource.data.categories != null;
      
      allow update: if isSignedIn() 
                    && resource.data.userId == request.auth.uid
                    && request.resource.data.userId == request.auth.uid;
      
      allow delete: if isSignedIn() && resource.data.userId == request.auth.uid;
    }
    
    // ====== Default: Deny All Other Access ======
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4. انشر القواعس الجديدة
- اضغط على "Publish"
- تأكد من ظهور رسالة النجاح

### 5. جرّب التطبيق
بعد تحديث القواعس بـ 30 ثانية:
- افتح التطبيق
- العب جولة
- عند النهاية ستُحفظ اللعبة في Firebase
- انقر على "ألعابي" سترى الألعاب المحفوظة

## التحقق من الحفظ:

### في Firebase Console:
1. اذهب إلى Firestore Database
2. ابحث عن مجموعة `savedGames`
3. يجب أن ترى المستندات الجديدة

### في Console Browser:
عند لعب جولة والنهاية، يجب أن تشاهد الرسالة:
```
تم حفظ اللعبة للإعادة
```

## ملاحظات مهمة:

✅ القواعس تسمح فقط لكل مستخدم بقراءة وكتابة ألعابه الخاصة
✅ لا يمكن لمستخدم آخر الوصول إلى ألعابك
✅ يمكن حذف الألعاب في أي وقت
✅ البيانات آمنة وموثوقة
