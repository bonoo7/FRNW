export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const reportTypes = {
    question_error: {
      id: 'question_error',
      label: 'خطأ في السؤال',
      description: 'السؤال يحتوي على معلومات خاطئة'
    },
    answer_error: {
      id: 'answer_error',
      label: 'خطأ في الإجابة',
      description: 'الإجابة الصحيحة غير صحيحة'
    },
    category_error: {
      id: 'category_error',
      label: 'خطأ في التصنيف',
      description: 'السؤال مصنف في فئة غير مناسبة'
    },
    difficulty_error: {
      id: 'difficulty_error',
      label: 'مستوى صعوبة غير مناسب',
      description: 'مستوى صعوبة السؤال غير مناسب'
    },
    inappropriate: {
      id: 'inappropriate',
      label: 'محتوى غير لائق',
      description: 'السؤال يحتوي على محتوى غير مناسب'
    },
    other: {
      id: 'other',
      label: 'أخرى',
      description: 'مشكلة أخرى'
    }
  };

  res.status(200).json(reportTypes);
}
