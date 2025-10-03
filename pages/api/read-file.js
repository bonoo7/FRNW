import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'طريقة غير مسموح بها' });
  }

  try {
    const { path: filePath } = req.query;
    
    if (!filePath) {
      return res.status(400).json({ success: false, message: 'مسار الملف مطلوب' });
    }
    
    // التحقق من أن المسار آمن (لمنع الوصول إلى ملفات خارج المشروع)
    const fullPath = path.resolve(process.cwd(), filePath);
    
    // التحقق من أن المسار داخل مجلد المشروع
    if (!fullPath.startsWith(process.cwd())) {
      return res.status(403).json({ success: false, message: 'مسار غير مصرح به' });
    }
    
    // التحقق من وجود الملف
    if (!fs.existsSync(fullPath)) {
      return res.status(404).json({ success: false, message: 'الملف غير موجود' });
    }
    
    // قراءة محتوى الملف
    const content = fs.readFileSync(fullPath, 'utf8');
    
    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.error('خطأ في قراءة الملف:', error);
    return res.status(500).json({ success: false, message: `خطأ في قراءة الملف: ${error.message}` });
  }
}
