export const API_CONFIG = {
  BASE_URL: 'https://www.fakker.net/api',
  ENDPOINTS: {
    REPORTS: '/reports',
    REPORT_TYPES: '/reports/types',
  },
  VERSION: 'v1',
};

export const REPORT_TYPES = {
  QUESTION_FORMAT: {
    id: 'format',
    label: 'صياغة السؤال',
    description: 'السؤال غير واضح أو يحتوي على أخطاء لغوية',
  },
  WRONG_ANSWER: {
    id: 'answer',
    label: 'خطأ في الإجابة',
    description: 'الإجابة الصحيحة غير صحيحة أو غير دقيقة',
  },
  WRONG_CATEGORY: {
    id: 'category',
    label: 'خطأ في الفئة',
    description: 'السؤال مصنف في فئة غير مناسبة',
  },
  DIFFICULTY_LEVEL: {
    id: 'difficulty',
    label: 'مستوى صعوبة غير مناسب',
    description: 'مستوى صعوبة السؤال لا يتناسب مع تصنيفه',
  },
  OTHER: {
    id: 'other',
    label: 'سبب آخر',
    description: 'مشكلة أخرى غير مذكورة',
  },
};
