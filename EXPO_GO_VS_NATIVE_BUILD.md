# 🔧 حل مشكلة: No development build installed

## 🔴 الخطأ:

```
CommandError: No development build (net.fakker.app) for this project is installed.
```

---

## 🎯 السبب:

Expo يحاول تشغيل **native build** بدلاً من **Expo Go**

---

## ✅ الحل البسيط:

### استخدم Expo Go بدلاً من Native Build:

```bash
# ❌ لا تستخدم هذا:
eas build

# ✅ استخدم بدلاً منه:
expo start
```

---

## 🚀 الخطوات:

### 1️⃣ في الطرفية:

```bash
expo start --clear
```

### 2️⃣ اختر **Expo Go**:

```
? How would you like to open the app?
❯ Expo Go (recommended)
  Android Emulator
  iOS Simulator
  Web Browser
  Server
```

اختر: **`Expo Go`** أو **`Android Emulator`**

### 3️⃣ على الهاتف/المحاكي:

```
افتح Expo Go
امسح QR Code
```

---

## ⚠️ الفرق:

| | Expo Go | Native Build |
|---|---|---|
| **التشغيل** | فوري | يحتاج build |
| **المميزات** | كل المميزات الأساسية | جميع المميزات |
| **السرعة** | سريع جداً | بطيء |
| **للتطوير** | ✅ مثالي | للإنتاج |

---

## 🎯 أنت تحتاج **Expo Go**:

```bash
# هذا هو الصحيح لك:
expo start --clear
```

---

**الآن جرّب - يجب أن يعمل!** ✅
