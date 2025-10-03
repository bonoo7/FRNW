import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'طريقة غير مسموح بها' });
  }

  try {
    const { filePath, content } = req.body;
    
    // التحقق من أن المسار آمن (لمنع الوصول إلى ملفات خارج المشروع)
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // التحقق من أن المسار داخل مجلد المشروع
    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: 'مسار غير مصرح به' });
    }
    
    // التأكد من وجود المجلد
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    // كتابة المحتوى إلى الملف
    fs.writeFileSync(fullPath, content, 'utf8');
    
    return res.status(200).json({ success: true, message: 'تم كتابة الملف بنجاح' });
  } catch (error) {
    console.error('خطأ في كتابة الملف:', error);
    return res.status(500).json({ success: false, message: `خطأ في كتابة الملف: ${error.message}` });
  }
}
