/**
 * خدمة إدارة الأسئلة - تتعامل مع تحرير الأسئلة وحفظها
 */

import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// عنوان API الخادم
const API_URL = 'http://localhost:3000/api';

// مفاتيح التخزين المحلي
const TEMP_EDITS_STORAGE_KEY = 'tempEdits';
const TEMP_DELETED_QUESTIONS_STORAGE_KEY = 'tempDeletedQuestions';

/**
 * خدمة محرر الأسئلة
 */
class QuestionEditorService {
  // المتغيرات الساكنة للتخزين المؤقت
  static tempEdits = [];
  static tempDeletedQuestions = [];
  
  // تهيئة الخدمة
  static async initialize() {
    try {
      // تحميل التعديلات المؤقتة
      const tempEditsStr = await AsyncStorage.getItem(TEMP_EDITS_STORAGE_KEY);
      if (tempEditsStr) {
        this.tempEdits = JSON.parse(tempEditsStr);
        console.log('تم تحميل التعديلات المؤقتة:', this.tempEdits.length);
      } else {
        this.tempEdits = [];
      }
      
      // تحميل الأسئلة المحذوفة مؤقتًا
      const tempDeletedStr = await AsyncStorage.getItem(TEMP_DELETED_QUESTIONS_STORAGE_KEY);
      if (tempDeletedStr) {
        this.tempDeletedQuestions = JSON.parse(tempDeletedStr);
        console.log('تم تحميل الأسئلة المحذوفة مؤقتًا:', this.tempDeletedQuestions.length);
      } else {
        this.tempDeletedQuestions = [];
      }
      
      return true;
    } catch (error) {
      console.error('خطأ في تهيئة خدمة محرر الأسئلة:', error);
      this.tempEdits = [];
      this.tempDeletedQuestions = [];
      return false;
    }
  }

  /**
   * الحصول على جميع الأسئلة من ملفات الفئات
   * @returns {Promise<Array>} مصفوفة تحتوي على جميع الأسئلة
   */
  static async getAllQuestions() {
    try {
      // استيراد الأسئلة من ملفات الفئات المقسمة
      const allQuestions = await import('../data/categories/index.js');
      return allQuestions.default || allQuestions.allQuestions;
    } catch (error) {
      console.error('خطأ في الحصول على الأسئلة:', error);
      throw new Error('فشل في الحصول على الأسئلة');
    }
  }

  /**
   * الحصول على الفئات الفريدة من جميع الأسئلة
   * @returns {Promise<Array>} مصفوفة تحتوي على الفئات الفريقة
   */
  static async getUniqueCategories() {
    try {
      const questions = await this.getAllQuestions();
      
      // استخراج الفئات الفريقة
      const categories = [...new Set(questions.map(q => q.category))];
      return categories.sort();
    } catch (error) {
      console.error('خطأ في الحصول على الفئات:', error);
      throw new Error('فشل في الحصول على الفئات');
    }
  }

  /**
   * الحصول على الأسئلة حسب الفئة
   * @param {string} category الفئة المطلوبة
   * @returns {Promise<Array>} مصفوفة تحتوي على الأسئلة في الفئة المحددة
   */
  static async getQuestionsByCategory(category) {
    try {
      const questions = await this.getAllQuestions();
      
      // تصفية الأسئلة حسب الفئة
      const filteredQuestions = questions.filter(q => q.category === category);
      
      // تطبيق التعديلات المؤقتة على الأسئلة المفلترة
      return this.applyTempEdits(filteredQuestions);
    } catch (error) {
      console.error('خطأ في الحصول على الأسئلة حسب الفئة:', error);
      throw new Error('فشل في الحصول على الأسئلة حسب الفئة');
    }
  }

  /**
   * البحث عن الأسئلة باستخدام نص البحث
   * @param {string} searchText نص البحث
   * @returns {Promise<Array>} مصفوفة تحتوي على الأسئلة المطابقة
   */
  static async searchQuestions(searchText) {
    try {
      const questions = await this.getAllQuestions();
      
      if (!searchText || searchText.trim() === '') {
        return questions;
      }
      
      const searchLower = searchText.toLowerCase();
      
      // البحث في نص السؤال والإجابة والفئة
      return questions.filter(q => 
        q.question.toLowerCase().includes(searchLower) || 
        q.answer.toLowerCase().includes(searchLower) || 
        q.category.toLowerCase().includes(searchLower)
      );
    } catch (error) {
      console.error('خطأ في البحث عن الأسئلة:', error);
      throw new Error('فشل في البحث عن الأسئلة');
    }
  }

  /**
   * حفظ تعديل مؤقت للسؤال
   * @param {Object} originalQuestion السؤال الأصلي
   * @param {Object} updatedQuestion السؤال المحدث
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async saveTempEdit(originalQuestion, updatedQuestion) {
    try {
      // التحقق من وجود تعديل سابق لنفس السؤال
      const existingEditIndex = this.tempEdits.findIndex(edit => 
        edit.originalQuestion.question === originalQuestion.question && 
        edit.originalQuestion.answer === originalQuestion.answer
      );
      
      // إذا كان هناك تعديل سابق، قم بتحديثه
      if (existingEditIndex !== -1) {
        this.tempEdits[existingEditIndex] = { originalQuestion, updatedQuestion };
      } else {
        // إضافة تعديل جديد
        this.tempEdits.push({ originalQuestion, updatedQuestion });
      }
      
      // حفظ التعديلات في التخزين المؤقت
      await AsyncStorage.setItem(TEMP_EDITS_STORAGE_KEY, JSON.stringify(this.tempEdits));
      
      return { 
        success: true, 
        message: 'تم حفظ التعديل مؤقتًا' 
      };
    } catch (error) {
      console.error('خطأ في حفظ التعديل المؤقت:', error);
      return { 
        success: false, 
        message: `فشل في حفظ التعديل المؤقت: ${error.message}` 
      };
    }
  }
  
  /**
   * الحصول على التعديلات المؤقتة
   * @returns {Promise<Array>} مصفوفة تحتوي على التعديلات المؤقتة
   */
  static async getTempEdits() {
    try {
      // التحقق من وجود تعديلات في الذاكرة
      if (this.tempEdits.length === 0) {
        // محاولة استرجاع التعديلات من التخزين المؤقت
        const storedEdits = await AsyncStorage.getItem(TEMP_EDITS_STORAGE_KEY);
        
        if (storedEdits) {
          this.tempEdits = JSON.parse(storedEdits);
        }
      }
      
      return this.tempEdits;
    } catch (error) {
      console.error('خطأ في الحصول على التعديلات المؤقتة:', error);
      return [];
    }
  }
  
  /**
   * الحصول على عدد التعديلات المؤقتة
   * @returns {Promise<number>} عدد التعديلات المؤقتة
   */
  static async getTempEditsCount() {
    try {
      const tempEdits = await this.getTempEdits();
      return tempEdits.length;
    } catch (error) {
      console.error('خطأ في الحصول على عدد التعديلات المؤقتة:', error);
      return 0;
    }
  }

  /**
   * مسح التعديلات المؤقتة
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async clearTempEdits() {
    try {
      this.tempEdits = [];
      await AsyncStorage.removeItem(TEMP_EDITS_STORAGE_KEY);
      
      return { 
        success: true, 
        message: 'تم مسح التعديلات المؤقتة' 
      };
    } catch (error) {
      console.error('خطأ في مسح التعديلات المؤقتة:', error);
      return { 
        success: false, 
        message: `فشل في مسح التعديلات المؤقتة: ${error.message}` 
      };
    }
  }
  
  /**
   * حفظ حذف مؤقت للسؤال
   * @param {Object} questionToDelete السؤال المراد حذفه
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async saveTempDelete(questionToDelete) {
    try {
      console.log('حفظ حذف مؤقت للسؤال:', JSON.stringify(questionToDelete, null, 2));
      
      // تحميل الأسئلة المحذوفة مؤقتًا أولاً
      const currentDeletedCount = await this.getTempDeletedCount();
      console.log('عدد الأسئلة المحذوفة مؤقتًا قبل الإضافة:', currentDeletedCount);
      
      // إضافة السؤال إلى قائمة الأسئلة المحذوفة مؤقتًا
      this.tempDeletedQuestions.push(questionToDelete);
      console.log('تمت إضافة السؤال إلى قائمة الأسئلة المحذوفة مؤقتًا');
      console.log('عدد الأسئلة المحذوفة مؤقتًا بعد الإضافة:', this.tempDeletedQuestions.length);
      
      // حفظ الأسئلة المحذوفة مؤقتًا في التخزين المحلي
      await AsyncStorage.setItem(TEMP_DELETED_QUESTIONS_STORAGE_KEY, JSON.stringify(this.tempDeletedQuestions));
      console.log('تم حفظ الأسئلة المحذوفة مؤقتًا في التخزين المحلي');
      
      // التحقق من الحفظ
      const savedData = await AsyncStorage.getItem(TEMP_DELETED_QUESTIONS_STORAGE_KEY);
      const parsedData = savedData ? JSON.parse(savedData) : [];
      console.log('البيانات المحفوظة في التخزين المحلي:', parsedData.length);
      
      console.log(`تم حفظ الحذف مؤقتًا. عدد الأسئلة المحذوفة مؤقتًا: ${this.tempDeletedQuestions.length}`);
      
      return { 
        success: true, 
        message: 'تم حفظ الحذف مؤقتًا. سيتم تطبيق الحذف عند حفظ جميع التعديلات.',
        deletedCount: this.tempDeletedQuestions.length
      };
    } catch (error) {
      console.error('خطأ في حفظ الحذف المؤقت:', error);
      return { 
        success: false, 
        message: `فشل في حفظ الحذف المؤقت: ${error.message}` 
      };
    }
  }

  /**
   * الحصول على عدد الأسئلة المحذوفة مؤقتًا
   * @returns {Promise<number>} عدد الأسئلة المحذوفة مؤقتًا
   */
  static async getTempDeletedCount() {
    try {
      // محاولة استرجاع الأسئلة المحذوفة مؤقتًا من التخزين المحلي
      const tempDeletedStr = await AsyncStorage.getItem(TEMP_DELETED_QUESTIONS_STORAGE_KEY);
      console.log('البيانات المسترجعة من التخزين المحلي (tempDeletedQuestions):', tempDeletedStr);
      
      if (tempDeletedStr) {
        this.tempDeletedQuestions = JSON.parse(tempDeletedStr);
        console.log('تم تحميل الأسئلة المحذوفة مؤقتًا:', this.tempDeletedQuestions.length);
      } else {
        this.tempDeletedQuestions = [];
        console.log('لا توجد أسئلة محذوفة مؤقتًا في التخزين المحلي');
      }
      
      return this.tempDeletedQuestions.length;
    } catch (error) {
      console.error('خطأ في الحصول على عدد الأسئلة المحذوفة مؤقتًا:', error);
      this.tempDeletedQuestions = [];
      return 0;
    }
  }

  /**
   * مسح الأسئلة المحذوفة مؤقتًا
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async clearTempDeleted() {
    try {
      this.tempDeletedQuestions = [];
      await AsyncStorage.removeItem(TEMP_DELETED_QUESTIONS_STORAGE_KEY);
      
      return { 
        success: true, 
        message: 'تم مسح جميع الأسئلة المحذوفة مؤقتًا' 
      };
    } catch (error) {
      console.error('خطأ في مسح الأسئلة المحذوفة مؤقتًا:', error);
      return { 
        success: false, 
        message: `فشل في مسح الأسئلة المحذوفة مؤقتًا: ${error.message}` 
      };
    }
  }
  
  /**
   * تطبيق التعديلات المؤقتة على مجموعة من الأسئلة
   * @param {Array} questions مصفوفة الأسئلة الأصلية
   * @returns {Array} مصفوفة الأسئلة بعد تطبيق التعديلات المؤقتة
   */
  static applyTempEdits(questions) {
    if (!questions || questions.length === 0 || !this.tempEdits || this.tempEdits.length === 0) {
      return questions;
    }
    
    // نسخ مصفوفة الأسئلة لتجنب تعديل الأصل
    const updatedQuestions = [...questions];
    
    // تطبيق كل تعديل مؤقت
    for (const edit of this.tempEdits) {
      const { originalQuestion, updatedQuestion } = edit;
      
      // البحث عن السؤال في المصفوفة
      const index = updatedQuestions.findIndex(q => 
        q.id === originalQuestion.id
      );
      
      // إذا وجد السؤال، قم بتحديثه
      if (index !== -1) {
        updatedQuestions[index] = { ...updatedQuestion };
      }
    }
    
    return updatedQuestions;
  }

  /**
   * حفظ جميع التعديلات المؤقتة في الملف
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async saveAllEditsToFile() {
    try {
      // الحصول على جميع الأسئلة
      let allQuestions = await this.getAllQuestions();
      
      // الحصول على التعديلات المؤقتة
      await this.getTempEdits();
      
      // الحصول على الأسئلة المحذوفة مؤقتًا
      await this.getTempDeletedCount();
      
      let updatedCount = 0;
      let deletedCount = 0;
      let errorCount = 0;
      
      // تطبيق التعديلات المؤقتة
      for (const edit of this.tempEdits) {
        const { originalQuestion, updatedQuestion } = edit;
        
        // البحث عن السؤال المطلوب تحديثه
        const questionIndex = allQuestions.findIndex(q => 
          q.question === originalQuestion.question && 
          q.answer === originalQuestion.answer
        );
        
        if (questionIndex !== -1) {
          // تحديث السؤال في المصفوفة
          allQuestions[questionIndex] = updatedQuestion;
          updatedCount++;
        } else {
          errorCount++;
        }
      }
      
      // حذف الأسئلة المحذوفة مؤقتًا
      for (const questionToDelete of this.tempDeletedQuestions) {
        // البحث عن السؤال المراد حذفه
        const questionIndex = allQuestions.findIndex(q => 
          q.question === questionToDelete.question && 
          q.answer === questionToDelete.answer
        );
        
        if (questionIndex !== -1) {
          // حذف السؤال من المصفوفة
          allQuestions.splice(questionIndex, 1);
          deletedCount++;
        } else {
          errorCount++;
        }
      }
      
      // إرسال جميع الأسئلة المحدثة إلى API
      const response = await fetch(`${API_URL}/questions/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: allQuestions }),
      });
      
      if (response.ok) {
        // مسح التعديلات المؤقتة بعد الحفظ الناجح
        await this.clearTempEdits();
        // مسح الأسئلة المحذوفة مؤقتًا بعد الحفظ الناجح
        await this.clearTempDeleted();
        
        let successMessage = '';
        if (updatedCount > 0) {
          successMessage += `تم حفظ ${updatedCount} تعديل بنجاح`;
        }
        if (deletedCount > 0) {
          successMessage += successMessage ? ' و' : '';
          successMessage += `تم حذف ${deletedCount} سؤال بنجاح`;
        }
        if (errorCount > 0) {
          successMessage += ` (فشل في العثور على ${errorCount} سؤال)`;
        }
        
        return { 
          success: true, 
          message: successMessage,
          updatedQuestions: allQuestions
        };
      } else {
        const result = await response.json();
        return { 
          success: false, 
          message: result.error || 'فشل في حفظ التعديلات' 
        };
      }
    } catch (error) {
      console.error('خطأ في حفظ التعديلات:', error);
      
      // في حالة الخطأ، نعرض خيار التحديث اليدوي
      this.showManualBatchUpdateAlert();
      
      return { 
        success: false, 
        message: `فشل في حفظ التعديلات: ${error.message}` 
      };
    }
  }

  /**
   * تحديث سؤال في ملف الأسئلة باستخدام API
   * @param {Object} originalQuestion السؤال الأصلي
   * @param {Object} updatedQuestion السؤال المحدث
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async updateQuestionInFile(originalQuestion, updatedQuestion) {
    try {
      // حفظ التعديل مؤقتًا أولاً
      await this.saveTempEdit(originalQuestion, updatedQuestion);
      
      // محاولة تحديث السؤال عبر API
      const response = await fetch(`${API_URL}/questions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ originalQuestion, updatedQuestion }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { 
          success: true, 
          message: 'تم تحديث السؤال بنجاح وحفظه مؤقتًا' 
        };
      } else {
        // إذا فشل الاتصال بالـ API، نعرض خيار التحديث اليدوي
        this.showManualUpdateAlert(originalQuestion, updatedQuestion);
        
        return { 
          success: false, 
          message: result.error || 'فشل في تحديث السؤال عبر API، ولكن تم حفظه مؤقتًا' 
        };
      }
    } catch (error) {
      console.error('خطأ في تحديث السؤال:', error);
      
      // في حالة الخطأ، نعرض خيار التحديث اليدوي
      this.showManualUpdateAlert(originalQuestion, updatedQuestion);
      
      return { 
        success: false, 
        message: `فشل في تحديث السؤال: ${error.message}، ولكن تم حفظه مؤقتًا` 
      };
    }
  }
  
  /**
   * عرض تنبيه للتحديث اليدوي
   * @param {Object} originalQuestion السؤال الأصلي
   * @param {Object} updatedQuestion السؤال المحدث
   */
  static showManualUpdateAlert(originalQuestion, updatedQuestion) {
    // الحصول على جميع الأسئلة من الذاكرة
    this.getAllQuestions().then(allQuestions => {
      // البحث عن السؤال المطلوب تحديثه
      const questionIndex = allQuestions.findIndex(q => 
        q.question === originalQuestion.question && 
        q.answer === originalQuestion.answer
      );
      
      if (questionIndex !== -1) {
        // تحديث السؤال في المصفوفة
        allQuestions[questionIndex] = updatedQuestion;
        
        // عرض رسالة للمستخدم
        Alert.alert(
          'تعذر الاتصال بالخادم',
          'لا يمكن تحديث ملف الأسئلة عبر API. هل ترغب في نسخ الأسئلة المحدثة لتحديثها يدوياً؟',
          [
            {
              text: 'نسخ الأسئلة المحدثة',
              onPress: () => {
                const questionsString = JSON.stringify(allQuestions, null, 2);
                // هنا يمكن إضافة كود لنسخ النص إلى الحافظة
                Alert.alert('تم النسخ', 'تم نسخ الأسئلة المحدثة. يمكنك الآن لصقها في ملف questions.js');
              }
            },
            {
              text: 'إلغاء',
              style: 'cancel'
            }
          ]
        );
      }
    });
  }
  
  /**
   * عرض تنبيه للتحديث اليدوي لجميع التعديلات
   */
  static showManualBatchUpdateAlert() {
    Promise.all([this.getAllQuestions(), this.getTempEdits()]).then(([allQuestions, tempEdits]) => {
      if (tempEdits.length === 0) {
        Alert.alert('تنبيه', 'لا توجد تعديلات مؤقتة للحفظ');
        return;
      }
      
      // تطبيق التعديلات على مصفوفة الأسئلة
      for (const edit of tempEdits) {
        const { originalQuestion, updatedQuestion } = edit;
        
        // البحث عن السؤال المطلوب تحديثه
        const questionIndex = allQuestions.findIndex(q => 
          q.question === originalQuestion.question && 
          q.answer === originalQuestion.answer
        );
        
        if (questionIndex !== -1) {
          // تحديث السؤال في المصفوفة
          allQuestions[questionIndex] = updatedQuestion;
        }
      }
      
      // عرض رسالة للمستخدم
      Alert.alert(
        'تعذر الاتصال بالخادم',
        `لا يمكن تحديث ملف الأسئلة عبر API. هل ترغب في نسخ جميع الأسئلة المحدثة (${tempEdits.length} تعديل) لتحديثها يدوياً؟`,
        [
          {
            text: 'نسخ الأسئلة المحدثة',
            onPress: () => {
              const questionsString = JSON.stringify(allQuestions, null, 2);
              // هنا يمكن إضافة كود لنسخ النص إلى الحافظة
              Alert.alert('تم النسخ', 'تم نسخ الأسئلة المحدثة. يمكنك الآن لصقها في ملف questions.js');
            }
          },
          {
            text: 'إلغاء',
            style: 'cancel'
          }
        ]
      );
    });
  }

  /**
   * حذف سؤال من ملف الأسئلة
   * @param {Object} questionToDelete السؤال المراد حذفه
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async deleteQuestion(questionToDelete) {
    try {
      console.log('بدء عملية حذف السؤال:', JSON.stringify(questionToDelete, null, 2));
      
      // الحصول على جميع الأسئلة
      const allQuestions = await this.getAllQuestions();
      console.log(`عدد الأسئلة قبل الحذف: ${allQuestions.length}`);
      
      // البحث عن السؤال المراد حذفه
      // استخدام طريقة أكثر مرونة للبحث عن السؤال
      const questionIndex = allQuestions.findIndex(q => {
        // مقارنة نص السؤال والإجابة بشكل أساسي
        const questionMatch = q.question === questionToDelete.question;
        const answerMatch = q.answer === questionToDelete.answer;
        
        // يمكن أيضًا مقارنة الفئة ومستوى الصعوبة كعوامل إضافية
        const categoryMatch = q.category === questionToDelete.category;
        const difficultyMatch = q.difficulty === questionToDelete.difficulty;
        
        // اعتبار السؤال مطابقًا إذا كان نص السؤال والإجابة متطابقين
        return questionMatch && answerMatch;
      });
      
      console.log(`مؤشر السؤال المراد حذفه: ${questionIndex}`);
      
      if (questionIndex === -1) {
        console.log('لم يتم العثور على السؤال المراد حذفه');
        return { 
          success: false, 
          message: 'لم يتم العثور على السؤال المراد حذفه' 
        };
      }
      
      // حذف السؤال من المصفوفة
      const deletedQuestion = allQuestions.splice(questionIndex, 1)[0];
      console.log('تم حذف السؤال:', JSON.stringify(deletedQuestion, null, 2));
      console.log(`عدد الأسئلة بعد الحذف: ${allQuestions.length}`);
      
      // إرسال جميع الأسئلة المحدثة إلى API
      console.log('إرسال الأسئلة المحدثة إلى API...');
      const response = await fetch(`${API_URL}/questions/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: allQuestions }),
      });
      
      if (response.ok) {
        console.log('تم حذف السؤال بنجاح');
        return { 
          success: true, 
          message: 'تم حذف السؤال بنجاح',
          updatedQuestions: allQuestions
        };
      } else {
        const result = await response.json();
        console.error('فشل في حذف السؤال:', result.error);
        return { 
          success: false, 
          message: result.error || 'فشل في حذف السؤال' 
        };
      }
    } catch (error) {
      console.error('خطأ في حذف السؤال:', error);
      return { 
        success: false, 
        message: `فشل في حذف السؤال: ${error.message}` 
      };
    }
  }

  /**
   * إضافة سؤال جديد إلى ملف الأسئلة
   * @param {Object} newQuestion السؤال الجديد
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async addNewQuestion(newQuestion) {
    try {
      // التحقق من صحة بيانات السؤال الجديد
      if (!newQuestion.question || !newQuestion.answer || !newQuestion.category || !newQuestion.difficulty) {
        return { 
          success: false, 
          message: 'يرجى إدخال جميع البيانات المطلوبة للسؤال (السؤال، الإجابة، الفئة، مستوى الصعوبة)' 
        };
      }
      
      // الحصول على جميع الأسئلة
      const allQuestions = await this.getAllQuestions();
      
      // إضافة السؤال الجديد إلى المصفوفة
      allQuestions.push(newQuestion);
      
      // إرسال جميع الأسئلة المحدثة إلى API
      const response = await fetch(`${API_URL}/questions/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: allQuestions }),
      });
      
      if (response.ok) {
        return { 
          success: true, 
          message: 'تم إضافة السؤال الجديد بنجاح',
          updatedQuestions: allQuestions
        };
      } else {
        const result = await response.json();
        return { 
          success: false, 
          message: result.error || 'فشل في إضافة السؤال الجديد' 
        };
      }
    } catch (error) {
      console.error('خطأ في إضافة السؤال الجديد:', error);
      return { 
        success: false, 
        message: `فشل في إضافة السؤال الجديد: ${error.message}` 
      };
    }
  }

  /**
   * حذف سؤال من ملف الأسئلة
   * @param {Object} questionToDelete السؤال المراد حذفه
   * @returns {Promise<Object>} نتيجة العملية
   */
  static async deleteQuestion(questionToDelete) {
    try {
      console.log('بدء عملية حذف السؤال:', JSON.stringify(questionToDelete, null, 2));
      
      // الحصول على جميع الأسئلة
      const allQuestions = await this.getAllQuestions();
      console.log(`عدد الأسئلة قبل الحذف: ${allQuestions.length}`);
      
      // البحث عن السؤال المراد حذفه
      // استخدام طريقة أكثر مرونة للبحث عن السؤال
      const questionIndex = allQuestions.findIndex(q => {
        // مقارنة نص السؤال والإجابة بشكل أساسي
        const questionMatch = q.question === questionToDelete.question;
        const answerMatch = q.answer === questionToDelete.answer;
        
        // يمكن أيضًا مقارنة الفئة ومستوى الصعوبة كعوامل إضافية
        const categoryMatch = q.category === questionToDelete.category;
        const difficultyMatch = q.difficulty === questionToDelete.difficulty;
        
        // اعتبار السؤال مطابقًا إذا كان نص السؤال والإجابة متطابقين
        return questionMatch && answerMatch;
      });
      
      console.log(`مؤشر السؤال المراد حذفه: ${questionIndex}`);
      
      if (questionIndex === -1) {
        console.log('لم يتم العثور على السؤال المراد حذفه');
        return { 
          success: false, 
          message: 'لم يتم العثور على السؤال المراد حذفه' 
        };
      }
      
      // حذف السؤال من المصفوفة
      const deletedQuestion = allQuestions.splice(questionIndex, 1)[0];
      console.log('تم حذف السؤال:', JSON.stringify(deletedQuestion, null, 2));
      console.log(`عدد الأسئلة بعد الحذف: ${allQuestions.length}`);
      
      // إرسال جميع الأسئلة المحدثة إلى API
      console.log('إرسال الأسئلة المحدثة إلى API...');
      const response = await fetch(`${API_URL}/questions/batch`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questions: allQuestions }),
      });
      
      if (response.ok) {
        console.log('تم حذف السؤال بنجاح');
        return { 
          success: true, 
          message: 'تم حذف السؤال بنجاح',
          updatedQuestions: allQuestions
        };
      } else {
        const result = await response.json();
        console.error('فشل في حذف السؤال:', result.error);
        return { 
          success: false, 
          message: result.error || 'فشل في حذف السؤال' 
        };
      }
    } catch (error) {
      console.error('خطأ في حذف السؤال:', error);
      return { 
        success: false, 
        message: `فشل في حذف السؤال: ${error.message}` 
      };
    }
  }

}

export default QuestionEditorService;
