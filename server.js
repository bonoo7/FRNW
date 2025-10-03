const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
  origin: ['http://localhost:8081', 'http://localhost:19006', 'http://localhost:3000', 'https://www.fakker.net'],
  methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '50mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// تكوين الملفات الثابتة
app.use(express.static(path.join(__dirname, 'dist')));
app.use('/admin', express.static(path.join(__dirname, 'public/admin')));

// المسار الرئيسي
app.get('/', (req, res) => {
  res.redirect('/admin/reports');
});

// Route لعرض صفحة التقارير
app.get('/admin/reports', (req, res) => {
  console.log('GET /admin/reports');
  res.sendFile(path.join(__dirname, 'public/admin/reports.html'));
});

// Route لعرض صفحة الاختبار
app.get('/admin/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/admin/test.html'));
});

// API Routes
app.get('/api/reports/types', (req, res) => {
  console.log('GET /api/reports/types');
  res.json([
    'محتوى غير لائق',
    'محتوى مكرر',
    'معلومات خاطئة',
    'مشكلة تقنية',
    'أخرى'
  ]);
});

// نقطة نهاية لكتابة الملفات
app.post('/api/write-file', (req, res) => {
  console.log('POST /api/write-file');
  try {
    const { filePath, content } = req.body;
    
    if (!filePath || content === undefined) {
      return res.status(400).json({ 
        success: false, 
        message: 'يجب توفير مسار الملف والمحتوى' 
      });
    }
    
    // التحقق من أن المسار آمن (لمنع الوصول إلى ملفات خارج المشروع)
    const fullPath = path.resolve(__dirname, filePath);
    
    // التحقق من أن المسار داخل مجلد المشروع
    if (!fullPath.startsWith(__dirname)) {
      return res.status(403).json({ 
        success: false, 
        message: 'مسار غير مصرح به' 
      });
    }
    
    // التأكد من وجود المجلد
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // كتابة المحتوى إلى الملف
    fs.writeFileSync(fullPath, content, 'utf8');
    
    console.log(`تم كتابة الملف بنجاح: ${filePath}`);
    return res.status(200).json({ 
      success: true, 
      message: 'تم كتابة الملف بنجاح' 
    });
  } catch (error) {
    console.error('خطأ في كتابة الملف:', error);
    return res.status(500).json({ 
      success: false, 
      message: `خطأ في كتابة الملف: ${error.message}` 
    });
  }
});

// نقطة نهاية لقراءة الملفات
app.get('/api/read-file', (req, res) => {
  console.log('GET /api/read-file', req.query);
  try {
    const { path: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({ 
        success: false, 
        message: 'يجب توفير مسار الملف' 
      });
    }
    
    // التحقق من أن المسار آمن (لمنع الوصول إلى ملفات خارج المشروع)
    const fullPath = path.resolve(__dirname, filePath);
    
    // التحقق من أن المسار داخل مجلد المشروع
    if (!fullPath.startsWith(__dirname)) {
      return res.status(403).json({ 
        success: false, 
        message: 'مسار غير مصرح به' 
      });
    }
    
    // التحقق من وجود الملف
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ 
        success: false, 
        message: 'الملف غير موجود' 
      });
    }
    
    // قراءة محتوى الملف
    const content = fs.readFileSync(fullPath, 'utf8');
    
    return res.status(200).json({ 
      success: true, 
      content 
    });
  } catch (error) {
    console.error('خطأ في قراءة الملف:', error);
    return res.status(500).json({ 
      success: false, 
      message: `خطأ في قراءة الملف: ${error.message}` 
    });
  }
});

// تخزين البلاغات في الذاكرة (مؤقتاً)
let reports = [];

// نقطة نهاية لإرسال بلاغ جديد
app.post('/api/reports', (req, res) => {
  console.log('POST /api/reports', req.body);
  const report = {
    id: Date.now().toString(),
    timestamp: new Date(),
    status: 'new',
    question: req.body.question || '',
    reportType: req.body.reportType || '',
    reason: req.body.reason || '',
    comment: req.body.comment || '',
    ...req.body
  };
  reports.push(report);
  res.status(201).json(report);
});

// نقطة نهاية لتحديث حالة البلاغ
app.patch('/api/reports/:id', (req, res) => {
  console.log('PATCH /api/reports/:id', req.params.id, req.body);
  try {
    const { id } = req.params;
    const { status } = req.body;

    const report = reports.find(r => r.id === id);
    if (!report) {
      return res.status(404).json({ message: 'البلاغ غير موجود' });
    }

    // التحقق من صحة الحالة
    const validStatuses = ['new', 'processing', 'resolved', 'rejected'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'حالة غير صالحة' });
    }

    // تحديث الحالة
    report.status = status;
    res.json({ message: 'تم تحديث حالة البلاغ بنجاح', report });
  } catch (error) {
    console.error('Error updating report:', error);
    res.status(500).json({ message: 'حدث خطأ أثناء تحديث حالة البلاغ' });
  }
});

// نقطة نهاية لجلب جميع البلاغات
app.get('/api/reports', (req, res) => {
  console.log('GET /api/reports');
  res.json(reports);
});

// الصفحة الرئيسية للـ API
app.get('/api', (req, res) => {
  res.json({
    message: 'مرحباً بك في واجهة برمجة التطبيق الخاصة بنظام التبليغات',
    endpoints: {
      'POST /api/reports': 'إرسال تبليغ جديد',
      'GET /api/reports': 'عرض جميع التبليغات',
      'GET /api/reports/types': 'عرض أنواع التبليغات المتاحة',
      'PATCH /api/reports/:id': 'تحديث حالة البلاغ',
      'POST /api/write-file': 'كتابة محتوى إلى ملف',
      'GET /api/read-file': 'قراءة محتوى من ملف'
    },
    status: 'متصل',
    version: '1.0.0'
  });
});

// تسجيل جميع الطلبات
app.use((req, res, next) => {
  console.log('Headers:', req.headers);
  if (req.method === 'POST' || req.method === 'PATCH') {
    console.log('Body:', req.body);
  }
  next();
});

// Catch all route for SPA
app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    console.log('404 API:', req.path);
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    console.log('SPA route:', req.path);
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  }
});

// تشغيل الخادم
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
