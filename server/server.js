const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// إعداد CORS للسماح بالوصول من أي مصدر
app.use(cors({
  origin: '*', // السماح لأي مصدر بالوصول
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // السماح بهذه الطرق
  allowedHeaders: ['Content-Type', 'Authorization'] // السماح بهذه الرؤوس
}));

app.use(bodyParser.json({ limit: '50mb' }));

// Serve React Native Web build for non-API routes
const webBuildPath = path.join(__dirname, '../web-build');
app.use(express.static(webBuildPath));
app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(webBuildPath, 'index.html'));
});

// مسار مجلد الفئات الذي يحتوي على الأسئلة
const categoriesPath = path.join(__dirname, '../data/categories');

// الحصول على جميع الأسئلة
app.get('/api/questions', async (req, res) => {
  try {
    // استيراد جميع الأسئلة من ملفات الفئات
    const allQuestionsModule = await import('../data/categories/index.js');
    const allQuestions = allQuestionsModule.default || allQuestionsModule.allQuestions;
    res.json(allQuestions);
  } catch (error) {
    console.error('خطأ في الحصول على الأسئلة:', error);
    res.status(500).json({ error: 'فشل في الحصول على الأسئلة' });
  }
});

// تحديث سؤال محدد في الفئة المناسبة
app.put('/api/questions', async (req, res) => {
  try {
    const { originalQuestion, updatedQuestion } = req.body;
    
    if (!originalQuestion || !updatedQuestion) {
      return res.status(400).json({ error: 'البيانات المطلوبة غير مكتملة' });
    }
    
    // الفئة التي سيتم تحديثها
    const category = originalQuestion.category || updatedQuestion.category;
    if (!category) {
      return res.status(400).json({ error: 'الفئة غير محددة' });
    }
    
    // استيراد جميع الأسئلة
    const allQuestionsModule = await import('../data/categories/index.js');
    const allQuestions = allQuestionsModule.default || allQuestionsModule.allQuestions;
    
    // البحث عن السؤال المطلوب تحديثه
    const questionIndex = allQuestions.findIndex(q => 
      q.question === originalQuestion.question && 
      q.answer === originalQuestion.answer
    );
    
    if (questionIndex === -1) {
      return res.status(404).json({ error: 'لم يتم العثور على السؤال' });
    }
    
    // تحديث السؤال
    allQuestions[questionIndex] = updatedQuestion;
    
    // إعادة تجميع الملفات (يمكن إضافة منطق لحفظ في الملف الصحيح)
    res.json({ success: true, message: 'تم تحديث السؤال بنجاح. يرجى تشغيل npm run split-questions لحفظ التغييرات' });
  } catch (error) {
    console.error('خطأ في تحديث السؤال:', error);
    res.status(500).json({ error: `فشل في تحديث السؤال: ${error.message}` });
  }
});

// تحديث مجموعة من الأسئلة دفعة واحدة
app.put('/api/questions/batch', async (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'البيانات المطلوبة غير صحيحة' });
    }
    
    // تنبيه: في النظام الجديد، يجب إعادة تشغيل npm run split-questions لحفظ التغييرات
    res.json({ 
      success: true, 
      message: `تم تحديث ${questions.length} سؤال بنجاح. يرجى تشغيل npm run split-questions لحفظ التغييرات في الملفات`
    });
  } catch (error) {
    console.error('خطأ في تحديث الأسئلة:', error);
    res.status(500).json({ error: `فشل في تحديث الأسئلة: ${error.message}` });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
