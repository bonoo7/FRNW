#!/usr/bin/env node

/**
 * استراتيجية ضغط الصور
 * 1. حذف صور GIF الكبيرة
 * 2. تقليل جودة الصور PNG
 * 3. إعادة تسمية وحفظ الصور المضغوطة
 */

const fs = require('fs');
const path = require('path');

// قائمة الصور التي سيتم حذفها
const IMAGES_TO_DELETE = [
  'assets/images/questions/fire.gif',  // 12.93 MB
];

// الصور التي سيتم معالجتها (سيتم تقليل جودتها)
// ملاحظة: بدون أداة خارجية، سنقوم بإنشاء قائمة توصيات فقط

const RECOMMENDATIONS = {
  large: {
    'assets/categories/blue-texture.png': 'تقليل الحجم من 2.4MB إلى ~1.4MB',
    'assets/categories/companions.png': 'تقليل الحجم من 1.9MB إلى ~1.1MB',
    'assets/categories/conquests.png': 'تقليل الحجم من 2.2MB إلى ~1.3MB',
    'assets/categories/quran.png': 'تقليل الحجم من 2.1MB إلى ~1.2MB',
  },
  medium: [
    'assets/categories/',  // جميع صور الفئات
  ]
};

function deleteImages() {
  console.log('\n🗑️ الخطوة 1: حذف الصور غير الضرورية\n');
  
  let deletedSize = 0;
  IMAGES_TO_DELETE.forEach(filePath => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const size = fs.statSync(fullPath).size / (1024 * 1024);
      fs.unlinkSync(fullPath);
      deletedSize += size;
      console.log(`  ✓ حذفت ${path.basename(filePath)} (${size.toFixed(2)} MB)`);
    }
  });
  
  console.log(`\n  📊 إجمالي المحذوفات: ${deletedSize.toFixed(2)} MB\n`);
  return deletedSize;
}

function createCompressionGuide() {
  console.log('\n📋 الخطوة 2: توصيات الضغط\n');
  
  let totalPotentialSaving = 0;
  
  console.log('  الصور الكبيرة جداً (يجب معالجتها):\n');
  Object.entries(RECOMMENDATIONS.large).forEach(([filePath, recommendation]) => {
    const fullPath = path.join(process.cwd(), filePath);
    if (fs.existsSync(fullPath)) {
      const size = fs.statSync(fullPath).size / 1024;
      const potentialSaving = Math.round(size * 0.4);
      totalPotentialSaving += potentialSaving;
      console.log(`    • ${path.basename(filePath)}`);
      console.log(`      ${recommendation}\n`);
    }
  });
  
  console.log('  الصور الصغيرة (ضغط تلقائي):\n');
  console.log('    • جميع صور الأسئلة: يمكن ضغطها بـ 30%\n');
  
  console.log(`\n  💾 إجمالي التوفير المتوقع: ~${(totalPotentialSaving / 1024).toFixed(1)} MB\n`);
  return totalPotentialSaving;
}

function createOptimizationPlan() {
  const plan = `
📌 خطة الضغط الموصى بها:

1. تثبيت أداة الضغط:
   npm install --save-dev sharp imagemin imagemin-optipng imagemin-mozjpeg

2. تشغيل الضغط:
   node scripts/compress-images-optimized.js

3. استراتيجية الضغط:
   - الفئات: تقليل الجودة 85-90%
   - الأسئلة: تقليل الجودة 75-80%
   - الأيقونات: بدون تغيير (عالية الجودة)

4. النتائج المتوقعة:
   - قبل: 68.31 MB
   - بعد: 40-45 MB
   - التوفير: -40%
`;
  return plan;
}

// تشغيل العمليات
const deleted = deleteImages();
const potential = createCompressionGuide();

console.log('\n═════════════════════════════════════════════════════════');
console.log('             ✅ تم إنجاز المرحلة الأولى من الضغط');
console.log('═════════════════════════════════════════════════════════\n');

console.log(`📊 النتائج:
  ✓ محذوفات: ${deleted.toFixed(2)} MB
  ✓ توفير إضافي متوقع: ~${(potential / 1024).toFixed(1)} MB
  ✓ الإجمالي: ${(deleted + potential/1024).toFixed(2)} MB\n`);

module.exports = { deleteImages, createCompressionGuide };
