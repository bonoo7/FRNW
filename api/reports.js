export default async function handler(req, res) {
  // إعداد CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // التعامل مع طلبات OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const reportData = req.body;

    // التحقق من البيانات المطلوبة
    if (!reportData.question || !reportData.reportType) {
      return res.status(400).json({ 
        message: 'يجب توفير السؤال ونوع البلاغ' 
      });
    }

    // إضافة معلومات إضافية للبلاغ
    const report = {
      ...reportData,
      id: Date.now().toString(),
      status: 'new',
      timestamp: new Date().toISOString(),
    };

    // هنا يمكنك إضافة كود لحفظ البلاغ في قاعدة البيانات
    // مؤقتاً سنقوم بإرجاع البلاغ كما هو
    
    res.status(201).json({
      message: 'تم استلام البلاغ بنجاح',
      report
    });
  } catch (error) {
    console.error('Error processing report:', error);
    res.status(500).json({ 
      message: 'حدث خطأ أثناء معالجة البلاغ' 
    });
  }
}
