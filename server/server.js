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

// مسار الملف الذي يحتوي على الأسئلة
const questionsFilePath = path.join(__dirname, '../data/questions.js');

// الحصول على جميع الأسئلة
app.get('/api/questions', (req, res) => {
  try {
    // قراءة محتوى الملف
    const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
    
    // استخراج مصفوفة الأسئلة من محتوى الملف
    const questionsMatch = fileContent.match(/export const questions = (\[[\s\S]*\]);/);
    
    if (questionsMatch && questionsMatch[1]) {
      // تحويل النص إلى كائن JSON
      const questionsArray = JSON.parse(questionsMatch[1]);
      res.json(questionsArray);
    } else {
      res.status(500).json({ error: 'فشل في استخراج الأسئلة من الملف' });
    }
  } catch (error) {
    console.error('خطأ في الحصول على الأسئلة:', error);
    res.status(500).json({ error: 'فشل في الحصول على الأسئلة' });
  }
});

// تحديث سؤال محدد
app.put('/api/questions', (req, res) => {
  try {
    const { originalQuestion, updatedQuestion } = req.body;
    
    if (!originalQuestion || !updatedQuestion) {
      return res.status(400).json({ error: 'البيانات المطلوبة غير مكتملة' });
    }
    
    // قراءة محتوى الملف
    const fileContent = fs.readFileSync(questionsFilePath, 'utf8');
    
    // استخراج مصفوفة الأسئلة من محتوى الملف
    const questionsMatch = fileContent.match(/export const questions = (\[[\s\S]*\]);/);
    
    if (questionsMatch && questionsMatch[1]) {
      // تحويل النص إلى كائن JSON
      const questionsArray = JSON.parse(questionsMatch[1]);
      
      // البحث عن السؤال المطلوب تحديثه
      const questionIndex = questionsArray.findIndex(q => 
        q.question === originalQuestion.question && 
        q.answer === originalQuestion.answer
      );
      
      if (questionIndex === -1) {
        return res.status(404).json({ error: 'لم يتم العثور على السؤال' });
      }
      
      // تحديث السؤال في المصفوفة
      questionsArray[questionIndex] = updatedQuestion;
      
      // كتابة المصفوفة المحدثة إلى الملف
      const updatedContent = `export const questions = ${JSON.stringify(questionsArray, null, 2)};`;
      fs.writeFileSync(questionsFilePath, updatedContent, 'utf8');
      
      res.json({ success: true, message: 'تم تحديث السؤال بنجاح' });
    } else {
      res.status(500).json({ error: 'فشل في استخراج الأسئلة من الملف' });
    }
  } catch (error) {
    console.error('خطأ في تحديث السؤال:', error);
    res.status(500).json({ error: `فشل في تحديث السؤال: ${error.message}` });
  }
});

// تحديث مجموعة من الأسئلة دفعة واحدة
app.put('/api/questions/batch', (req, res) => {
  try {
    const { questions } = req.body;
    
    if (!questions || !Array.isArray(questions)) {
      return res.status(400).json({ error: 'البيانات المطلوبة غير صحيحة' });
    }
    
    // كتابة المصفوفة المحدثة إلى الملف
    const updatedContent = `export const questions = ${JSON.stringify(questions, null, 2)};`;
    fs.writeFileSync(questionsFilePath, updatedContent, 'utf8');
    
    res.json({ success: true, message: `تم تحديث ${questions.length} سؤال بنجاح` });
  } catch (error) {
    console.error('خطأ في تحديث الأسئلة:', error);
    res.status(500).json({ error: `فشل في تحديث الأسئلة: ${error.message}` });
  }
});

// تشغيل الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
});
