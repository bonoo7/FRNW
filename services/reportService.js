// تحديد عنوان API بناءً على بيئة التشغيل
console.log('Development mode:', __DEV__);
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api'
  : 'https://www.fakker.net/api';

console.log('Using API URL:', API_BASE_URL);

class ReportService {
  async submitReport(reportData) {
    try {
      console.log('Submitting report to:', API_BASE_URL);
      const response = await fetch(`${API_BASE_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          question: reportData.question,
          answer: reportData.answer,
          reportType: reportData.reportType,
          reason: reportData.reason,
          comment: reportData.comment,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'فشل إرسال البلاغ');
      }

      const result = await response.json();
      console.log('Report submitted successfully:', result);
      return result;
    } catch (error) {
      console.error('Error submitting report:', error);
      throw error;
    }
  }

  async getReportTypes() {
    try {
      const response = await fetch(`${API_BASE_URL}/reports/types`);
      if (!response.ok) {
        throw new Error('فشل جلب أنواع البلاغات');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching report types:', error);
      throw error;
    }
  }
}

export default new ReportService();
