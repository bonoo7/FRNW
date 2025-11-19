#!/usr/bin/env node

/**
 * سكريبت لتقسيم ملف الأسئلة حسب الفئات
 * هذا السكريبت ينشئ ملف منفصل لكل فئة
 * بدون التأثير على التطبيق - يتم استيراد الملفات ودمجها تلقائياً
 */

const fs = require('fs');
const path = require('path');

// استيراد الأسئلة من الملف الأصلي
const questionsPath = path.join(__dirname, '../data/questions.js');
const questionsContent = fs.readFileSync(questionsPath, 'utf8');

// استخراج مصفوفة الأسئلة باستخدام regex
const questionsMatch = questionsContent.match(/export const questions = \[([\s\S]*)\];/);
if (!questionsMatch) {
  console.error('❌ لم يتمكن من استخراج الأسئلة من الملف');
  process.exit(1);
}

// تحويل النص إلى مصفوفة
const questionsArrayStr = '[' + questionsMatch[1] + ']';
let questions;
try {
  questions = eval(questionsArrayStr);
} catch (error) {
  console.error('❌ خطأ في معالجة الأسئلة:', error.message);
  process.exit(1);
}

// تجميع الأسئلة حسب الفئة
const categorizedQuestions = {};
questions.forEach(q => {
  const category = q.category || 'غير مصنفة';
  if (!categorizedQuestions[category]) {
    categorizedQuestions[category] = [];
  }
  categorizedQuestions[category].push(q);
});

// إنشاء مجلد الفئات إن لم يكن موجوداً
const categoriesDir = path.join(__dirname, '../data/categories');
if (!fs.existsSync(categoriesDir)) {
  fs.mkdirSync(categoriesDir, { recursive: true });
  console.log('✅ تم إنشاء مجلد categories');
}

// كتابة ملف لكل فئة
let totalQuestions = 0;
Object.entries(categorizedQuestions).forEach(([category, categoryQuestions]) => {
  const fileName = `${category.replace(/\s+/g, '_')}.js`;
  const filePath = path.join(categoriesDir, fileName);
  
  // صيغة الملف
  const fileContent = `// 📚 أسئلة فئة: ${category}
// عدد الأسئلة: ${categoryQuestions.length}

export const ${category.replace(/\s+/g, '_')}Questions = ${JSON.stringify(categoryQuestions, null, 2)};

export default ${category.replace(/\s+/g, '_')}Questions;
`;

  fs.writeFileSync(filePath, fileContent, 'utf8');
  console.log(`✅ ${category} (${categoryQuestions.length} سؤال) → ${fileName}`);
  totalQuestions += categoryQuestions.length;
});

// إنشاء ملف index.js لاستيراد جميع الفئات
const indexPath = path.join(categoriesDir, 'index.js');
const indexContent = `// 📚 استيراد جميع فئات الأسئلة
// هذا الملف يدمج جميع الأسئلة من الملفات المنفصلة

${Object.keys(categorizedQuestions)
  .map(category => {
    const varName = category.replace(/\s+/g, '_');
    const fileName = `${category.replace(/\s+/g, '_')}`;
    return `import ${varName}Questions from './${fileName}';`;
  })
  .join('\n')}

// دمج جميع الأسئلة
export const allQuestions = [
${Object.keys(categorizedQuestions)
  .map(category => `  ...${category.replace(/\s+/g, '_')}Questions,`)
  .join('\n')}
];

// تصدير كل فئة على حدة
export {
${Object.keys(categorizedQuestions)
  .map(category => `  ${category.replace(/\s+/g, '_')}Questions,`)
  .join('\n')}
};

export default allQuestions;
`;

fs.writeFileSync(indexPath, indexContent, 'utf8');
console.log('✅ تم إنشاء index.js لدمج جميع الفئات');

console.log(`\n📊 الملخص:`);
console.log(`   • عدد الفئات: ${Object.keys(categorizedQuestions).length}`);
console.log(`   • إجمالي الأسئلة: ${totalQuestions}`);
console.log(`   • الملفات المُنشأة: ${Object.keys(categorizedQuestions).length + 1}`);
console.log(`\n✨ تم بنجاح! يمكنك الآن استخدام الأسئلة من data/categories/`);
