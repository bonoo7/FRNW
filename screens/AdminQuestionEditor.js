import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import BackgroundSelector from '../components/BackgroundSelector';
import QuestionEditorService from '../services/QuestionEditorService';
import StorageService from '../services/storageService';

const difficultyLevels = ['سهل', 'متوسط', 'صعب'];

const AdminQuestionEditor = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isNewQuestion, setIsNewQuestion] = useState(false);
  const [tempDeletedCount, setTempDeletedCount] = useState(0);
  const [initialState, setInitialState] = useState(null);
  const [initialStateApplied, setInitialStateApplied] = useState(false);
  
  // بيانات السؤال الحالي
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    answer: '',
    category: '',
    difficulty: 'متوسط',
    imgQ: '',
    imgA: '',
    vidQ: '',
    vidA: '',
  });
  
  // نسخة من السؤال الأصلي للمقارنة عند الحفظ
  const [originalQuestion, setOriginalQuestion] = useState(null);
  
  // حالة التعديل
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // عدد التعديلات المؤقتة
  const [tempEditsCount, setTempEditsCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('تهيئة خدمة محرر الأسئلة...');
        await QuestionEditorService.initialize();
        
        // قراءة الحالة المحفوظة
        const storedStateStr = await StorageService.getItem('adminEditorLastState');
        let storedState = null;
        if (storedStateStr) {
          try { storedState = JSON.parse(storedStateStr); setInitialState(storedState); } catch {}
        }
        
        // تحميل الفئات باستخدام الوظيفة الموجودة
        await loadCategories();
        // إذا كانت هناك حالة مخزنة لفئة صالحة، قم بضبط الفئة
        if (storedState && storedState.category) {
          setSelectedCategory(storedState.category);
        }
        
        // تحميل عدد التعديلات المؤقتة
        await loadTempEditsCount();
        
        setLoading(false);
      } catch (error) {
        console.error('خطأ في تحميل البيانات:', error);
        Alert.alert('خطأ', 'حدث خطأ أثناء تحميل البيانات');
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      loadQuestionsByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (questions.length > 0 && currentQuestionIndex >= 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex];
      setCurrentQuestion(question);
      setOriginalQuestion({ ...question });
      setHasUnsavedChanges(false);
    }
  }, [questions, currentQuestionIndex]);
  
  useEffect(() => {
    if (initialState && !initialStateApplied && initialState.category === selectedCategory && questions.length > 0) {
      const idx = Math.min(initialState.index, questions.length - 1);
      setCurrentQuestionIndex(idx);
      setInitialStateApplied(true);
    }
  }, [questions, initialState, initialStateApplied, selectedCategory]);
  
  // تحميل عدد التعديلات المؤقتة
  const loadTempEditsCount = async () => {
    try {
      console.log('جاري تحميل عدد التعديلات المؤقتة...');
      const count = await QuestionEditorService.getTempEditsCount();
      console.log('عدد التعديلات المؤقتة:', count);
      setTempEditsCount(count);
      
      // تحميل عدد الأسئلة المحذوفة مؤقتًا
      console.log('جاري تحميل عدد الأسئلة المحذوفة مؤقتًا...');
      const deletedCount = await QuestionEditorService.getTempDeletedCount();
      console.log('عدد الأسئلة المحذوفة مؤقتًا:', deletedCount);
      setTempDeletedCount(deletedCount);
      
      console.log('إجمالي التعديلات:', count + deletedCount);
    } catch (error) {
      console.error('خطأ في تحميل عدد التعديلات المؤقتة:', error);
    }
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesList = await QuestionEditorService.getUniqueCategories();
      setCategories(categoriesList);
      
      if (categoriesList.length > 0) {
        setSelectedCategory(categoriesList[0]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('خطأ في تحميل الفئات:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الفئات');
      setLoading(false);
    }
  };

  const loadQuestionsByCategory = async (category) => {
    try {
      setLoading(true);
      const questionsList = await QuestionEditorService.getQuestionsByCategory(category);
      setQuestions(questionsList);
      setCurrentQuestionIndex(questionsList.length > 0 ? 0 : -1);
      setLoading(false);
    } catch (error) {
      console.error('خطأ في تحميل الأسئلة:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل الأسئلة');
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const results = await QuestionEditorService.searchQuestions(searchText);
      setQuestions(results);
      setCurrentQuestionIndex(results.length > 0 ? 0 : -1);
      setIsSearchMode(true);
      setLoading(false);
    } catch (error) {
      console.error('خطأ في البحث:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء البحث عن الأسئلة');
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setIsSearchMode(false);
    if (selectedCategory) {
      loadQuestionsByCategory(selectedCategory);
    }
  };

  const handleInputChange = (field, value) => {
    setCurrentQuestion(prev => ({
      ...prev,
      [field]: value
    }));
    setHasUnsavedChanges(true);
  };

  const navigateToQuestion = (direction) => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'تغييرات غير محفوظة',
        'لديك تغييرات غير محفوظة. هل تريد حفظها قبل الانتقال؟',
        [
          {
            text: 'تجاهل التغييرات',
            onPress: () => {
              const newIndex = direction === 'next' 
                ? Math.min(currentQuestionIndex + 1, questions.length - 1)
                : Math.max(currentQuestionIndex - 1, 0);
              setCurrentQuestionIndex(newIndex);
              setHasUnsavedChanges(false);
            },
            style: 'cancel'
          },
          {
            text: 'حفظ',
            onPress: async () => {
              const saved = await saveChanges();
              if (saved) {
                const newIndex = direction === 'next' 
                  ? Math.min(currentQuestionIndex + 1, questions.length - 1)
                  : Math.max(currentQuestionIndex - 1, 0);
                setCurrentQuestionIndex(newIndex);
              }
            }
          }
        ]
      );
    } else {
      const newIndex = direction === 'next' 
        ? Math.min(currentQuestionIndex + 1, questions.length - 1)
        : Math.max(currentQuestionIndex - 1, 0);
      setCurrentQuestionIndex(newIndex);
    }
  };

  const saveChanges = async () => {
    try {
      setLoading(true);
      
      // تحديث السؤال في الملف
      const result = await QuestionEditorService.updateQuestionInFile(
        originalQuestion,
        currentQuestion
      );
      
      setLoading(false);
      
      if (result.success) {
        Alert.alert('نجاح', 'تم حفظ التغييرات بنجاح');
        setHasUnsavedChanges(false);
        setOriginalQuestion({ ...currentQuestion });
        
        // إعادة تحميل الأسئلة والاحتفاظ بالمؤشر
        const prevIndex = currentQuestionIndex;
        let updatedQuestions;
        if (isSearchMode) {
          updatedQuestions = await QuestionEditorService.searchQuestions(searchText);
        } else {
          updatedQuestions = await QuestionEditorService.getQuestionsByCategory(selectedCategory);
        }
        setQuestions(updatedQuestions);
        const newIndex = Math.min(prevIndex, updatedQuestions.length - 1);
        setCurrentQuestionIndex(newIndex);
        
        // تحديث عدد التعديلات المؤقتة
        loadTempEditsCount();
        
        return true;
      } else {
        Alert.alert('خطأ', result.message || 'فشل في حفظ التغييرات');
        return false;
      }
    } catch (error) {
      console.error('خطأ في حفظ التغييرات:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ التغييرات');
      setLoading(false);
      return false;
    }
  };
  
  const saveTempChanges = async () => {
    try {
      setLoading(true);
      
      // حفظ التعديل مؤقتًا فقط
      const result = await QuestionEditorService.saveTempEdit(
        originalQuestion,
        currentQuestion
      );
      
      setLoading(false);
      
      if (result.success) {
        Alert.alert('نجاح', 'تم حفظ التغييرات مؤقتًا');
        setHasUnsavedChanges(false);
        setOriginalQuestion({ ...currentQuestion });
        
        // تحديث عدد التعديلات المؤقتة
        loadTempEditsCount();
        
        return true;
      } else {
        Alert.alert('خطأ', result.message || 'فشل في حفظ التغييرات المؤقتة');
        return false;
      }
    } catch (error) {
      console.error('خطأ في حفظ التغييرات المؤقتة:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ التغييرات المؤقتة');
      setLoading(false);
      return false;
    }
  };
  
  const saveAllChanges = async () => {
    try {
      if (tempEditsCount === 0 && tempDeletedCount === 0) {
        Alert.alert('تنبيه', 'لا توجد تعديلات مؤقتة للحفظ');
        return;
      }
      
      setLoading(true);
      // حفظ الحالة الحالية ليتم استعادتها بعد إعادة التحميل
      await StorageService.saveItem('adminEditorLastState', JSON.stringify({ category: selectedCategory, index: currentQuestionIndex }));
      
      const result = await QuestionEditorService.saveAllEditsToFile();
      
      setLoading(false);
      
      if (result.success) {
        Alert.alert('نجاح', result.message);
        
        // تحديث عدد التعديلات المؤقتة
        setTempEditsCount(0);
        setTempDeletedCount(0);
        
        // إعادة تحميل الأسئلة والاحتفاظ بالمؤشر
        const prevIndex = currentQuestionIndex;
        let updatedQuestions;
        if (isSearchMode) {
          updatedQuestions = await QuestionEditorService.searchQuestions(searchText);
        } else {
          updatedQuestions = await QuestionEditorService.getQuestionsByCategory(selectedCategory);
        }
        setQuestions(updatedQuestions);
        const newIndex = Math.min(prevIndex, updatedQuestions.length - 1);
        setCurrentQuestionIndex(newIndex);
      } else {
        Alert.alert('خطأ', result.message);
      }
    } catch (error) {
      console.error('خطأ في حفظ جميع التعديلات:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ جميع التعديلات');
      setLoading(false);
    }
  };

  const addNewQuestion = () => {
    // إنشاء سؤال جديد فارغ
    const newQuestion = {
      question: '',
      answer: '',
      category: selectedCategory || (categories.length > 0 ? categories[0] : ''),
      difficulty: 'متوسط',
      imgQ: '',
      imgA: '',
      vidQ: '',
      vidA: '',
    };
    
    // تعيين السؤال الجديد كسؤال حالي
    setCurrentQuestion(newQuestion);
    setOriginalQuestion(null);
    setHasUnsavedChanges(true);
    setIsNewQuestion(true);
  };

  const saveNewQuestion = async () => {
    try {
      setLoading(true);
      
      // التحقق من إدخال البيانات المطلوبة
      if (!currentQuestion.question || !currentQuestion.answer) {
        Alert.alert('خطأ', 'يرجى إدخال نص السؤال والإجابة على الأقل');
        setLoading(false);
        return;
      }
      
      // حفظ السؤال الجديد
      const result = await QuestionEditorService.addNewQuestion(currentQuestion);
      
      setLoading(false);
      
      if (result.success) {
        Alert.alert('نجاح', result.message);
        
        // تحديث قائمة الأسئلة
        if (isSearchMode) {
          handleSearch();
        } else {
          // تحديث قائمة الأسئلة وتعيين السؤال الجديد كسؤال حالي
          setQuestions(result.updatedQuestions.filter(q => q.category === selectedCategory));
          setCurrentQuestionIndex(result.updatedQuestions.filter(q => q.category === selectedCategory).length - 1);
        }
        
        setIsNewQuestion(false);
        setHasUnsavedChanges(false);
        setOriginalQuestion({ ...currentQuestion });
      } else {
        Alert.alert('خطأ', result.message || 'فشل في إضافة السؤال الجديد');
      }
    } catch (error) {
      console.error('خطأ في إضافة السؤال الجديد:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء إضافة السؤال الجديد');
      setLoading(false);
    }
  };

  const deleteCurrentQuestion = async () => {
    // التأكد من وجود سؤال حالي
    if (!currentQuestion || isNewQuestion) {
      Alert.alert('خطأ', 'لا يوجد سؤال محدد للحذف');
      return;
    }
    
    console.log('محاولة حذف السؤال:', JSON.stringify(currentQuestion, null, 2));
    
    // طلب تأكيد الحذف
    Alert.alert(
      'تأكيد الحذف',
      'هل أنت متأكد من حذف هذا السؤال؟ لا يمكن التراجع عن هذه العملية.',
      [
        {
          text: 'إلغاء',
          style: 'cancel'
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              console.log('بدء عملية حذف السؤال...');
              
              // حذف السؤال مباشرة من ملف الأسئلة
              const result = await QuestionEditorService.deleteQuestion(currentQuestion);
              
              setLoading(false);
              console.log('نتيجة عملية الحذف:', result);
              
              if (result.success) {
                Alert.alert('نجاح', 'تم حذف السؤال بنجاح');
                
                // تحديث قائمة الأسئلة بعد الحذف
                if (result.updatedQuestions) {
                  const updatedQuestionsByCategory = result.updatedQuestions.filter(
                    q => q.category === selectedCategory
                  );
                  setQuestions(updatedQuestionsByCategory);
                  
                  // الانتقال إلى السؤال التالي أو السابق
                  if (updatedQuestionsByCategory.length > 0) {
                    // إذا كان هناك أكثر من سؤال، ننتقل إلى السؤال التالي أو السابق
                    const newIndex = currentQuestionIndex >= updatedQuestionsByCategory.length 
                      ? updatedQuestionsByCategory.length - 1 
                      : currentQuestionIndex;
                    
                    console.log(`الانتقال إلى السؤال في المؤشر: ${newIndex}`);
                    setCurrentQuestionIndex(newIndex);
                    setCurrentQuestion(updatedQuestionsByCategory[newIndex]);
                    setOriginalQuestion({ ...updatedQuestionsByCategory[newIndex] });
                    setHasUnsavedChanges(false);
                  } else {
                    // إذا كان هذا السؤال الوحيد في الفئة، نعرض رسالة
                    console.log('لا توجد أسئلة أخرى في هذه الفئة');
                    setQuestions([]);
                    setCurrentQuestionIndex(-1);
                    setCurrentQuestion({});
                    setOriginalQuestion(null);
                  }
                } else {
                  // إذا لم يتم إرجاع الأسئلة المحدثة، نعيد تحميل الأسئلة
                  loadQuestionsByCategory(selectedCategory);
                }
              } else {
                console.error('فشل في حذف السؤال:', result.message);
                Alert.alert('خطأ', result.message || 'فشل في حذف السؤال');
              }
            } catch (error) {
              console.error('خطأ في حذف السؤال:', error);
              Alert.alert('خطأ', 'حدث خطأ أثناء حذف السؤال');
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const previewCurrentQuestion = async () => {
    try {
      const questionPreviewData = {
        question: currentQuestion.question,
        answer: currentQuestion.answer,
        category: currentQuestion.category || selectedCategory,
        difficulty: currentQuestion.difficulty || 'متوسط',
        imgQ: currentQuestion.imgQ || '',
        imgA: currentQuestion.imgA || '',
        vidQ: currentQuestion.vidQ || '',
        vidA: currentQuestion.vidA || '',
        isPreviewMode: true,
        teams: ['الفريق الأول', 'الفريق الثاني'],
        currentTeamIndex: 0
      };

      // حفظ بيانات السؤال للمعاينة
      await StorageService.saveItem('previewQuestionData', JSON.stringify(questionPreviewData));
      
      // الانتقال إلى صفحة المعاينة
      router.push('/question-preview');
    } catch (error) {
      console.error('خطأ في معاينة السؤال:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء معاينة السؤال');
    }
  };

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'سهل':
        return '#27ae60'; // أخضر
      case 'متوسط':
        return '#f39c12'; // برتقالي
      case 'صعب':
        return '#e74c3c'; // أحمر
      default:
        return '#333';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>جاري التحميل...</Text>
      </View>
    );
  }

  return (
    <BackgroundSelector>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
      <ScrollView style={styles.scrollView}>
        
        {/* قسم البحث */}
        <View style={styles.searchRow}>
          {/* اختيار الفئة */}
          {!isSearchMode && (
            <View style={styles.filterPickerContainer}>
              <Text style={styles.label}>الفئة:</Text>
              <View style={styles.filterPickerWrapper}>
                <Picker
                  selectedValue={selectedCategory}
                  onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                  style={styles.filterPicker}
                  dropdownIconColor="#333"
                >
                  {categories.map((category, index) => (
                    <Picker.Item key={index} label={category} value={category} color="#333" />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="ابحث عن سؤال..."
              value={searchText}
              onChangeText={setSearchText}
            />
            <TouchableOpacity 
              style={styles.searchButton} 
              onPress={handleSearch}
            >
              <Ionicons name="search" size={20} color="#fff" />
            </TouchableOpacity>
            {isSearchMode && (
              <TouchableOpacity 
                style={styles.clearButton} 
                onPress={clearSearch}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* معلومات السؤال الحالي */}
        {questions.length > 0 ? (
          <View style={styles.questionInfo}>
            <Text style={styles.questionCount}>
              السؤال 
            </Text>
            <View style={styles.questionNavContainer}>
              <TouchableOpacity
                style={[styles.smallNavButton, currentQuestionIndex === 0 && styles.disabledButton]}
                onPress={() => navigateToQuestion('prev')}
                disabled={currentQuestionIndex === 0}
              >
                <Ionicons name="arrow-back" size={16} color="#fff" />
              </TouchableOpacity>
              
              <TextInput
                style={styles.questionNumberInput}
                keyboardType="number-pad"
                value={(currentQuestionIndex + 1).toString()}
                onChangeText={(text) => {
                  const num = parseInt(text);
                  if (!isNaN(num) && num > 0 && num <= questions.length) {
                    setCurrentQuestionIndex(num - 1);
                  }
                }}
                onSubmitEditing={(event) => {
                  const num = parseInt(event.nativeEvent.text);
                  if (!isNaN(num) && num > 0 && num <= questions.length) {
                    setCurrentQuestionIndex(num - 1);
                  } else {
                    // إذا كان الرقم غير صالح، أعد عرض الرقم الحالي
                    event.target.setNativeProps({ text: (currentQuestionIndex + 1).toString() });
                  }
                }}
              />
              
              <TouchableOpacity
                style={[styles.smallNavButton, currentQuestionIndex === questions.length - 1 && styles.disabledButton]}
                onPress={() => navigateToQuestion('next')}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.questionCount}>
              من {questions.length}
            </Text>
          </View>
        ) : (
          <Text style={styles.noQuestionsText}>لا توجد أسئلة متاحة</Text>
        )}

        {/* أزرار التنقل والحفظ */}
        {questions.length > 0 || isNewQuestion ? (
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity
              style={[styles.navButton, (currentQuestionIndex === 0 || isNewQuestion) && styles.disabledButton]}
              onPress={() => navigateToQuestion('prev')}
              disabled={currentQuestionIndex === 0 || isNewQuestion}
            >
              <Ionicons name="arrow-back" size={20} color="#fff" />
              <Text style={styles.buttonText}>السابق</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.previewButton}
              onPress={previewCurrentQuestion}
              disabled={isNewQuestion && !currentQuestion.question}
            >
              <Ionicons name="eye" size={20} color="#fff" />
              <Text style={styles.buttonText}>معاينة</Text>
            </TouchableOpacity>

            {isNewQuestion ? (
              <TouchableOpacity
                style={[styles.addButton, !hasUnsavedChanges && styles.disabledButton]}
                onPress={saveNewQuestion}
                disabled={!hasUnsavedChanges}
              >
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={styles.buttonText}>حفظ الجديد</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.saveButton, !hasUnsavedChanges && styles.disabledButton]}
                onPress={saveChanges}
                disabled={!hasUnsavedChanges}
              >
                <Ionicons name="save" size={20} color="#fff" />
                <Text style={styles.buttonText}>حفظ</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.navButton, (currentQuestionIndex === questions.length - 1 || isNewQuestion) && styles.disabledButton]}
              onPress={() => navigateToQuestion('next')}
              disabled={currentQuestionIndex === questions.length - 1 || isNewQuestion}
            >
              <Text style={styles.buttonText}>التالي</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            {isNewQuestion ? (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  if (hasUnsavedChanges) {
                    Alert.alert(
                      'إلغاء السؤال الجديد',
                      'هل أنت متأكد من إلغاء السؤال الجديد؟ ستفقد جميع التغييرات.',
                      [
                        {
                          text: 'استمرار التحرير',
                          style: 'cancel'
                        },
                        {
                          text: 'إلغاء السؤال',
                          onPress: () => {
                            setIsNewQuestion(false);
                            if (questions.length > 0) {
                              const question = questions[currentQuestionIndex];
                              setCurrentQuestion(question);
                              setOriginalQuestion({ ...question });
                              setHasUnsavedChanges(false);
                            }
                          }
                        }
                      ]
                    );
                  } else {
                    setIsNewQuestion(false);
                    if (questions.length > 0) {
                      const question = questions[currentQuestionIndex];
                      setCurrentQuestion(question);
                      setOriginalQuestion({ ...question });
                    }
                  }
                }}
              >
                <Ionicons name="close-circle" size={20} color="#fff" />
                <Text style={styles.buttonText}>إلغاء</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.tempSaveButton, !hasUnsavedChanges && styles.disabledButton]}
                onPress={saveTempChanges}
                disabled={!hasUnsavedChanges}
              >
                <Ionicons name="bookmark-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>حفظ مؤقت</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <Text style={styles.noQuestionsText}>لا توجد أسئلة متاحة</Text>
        )}
        
        {/* أزرار إضافة وحذف السؤال */}
        <View style={styles.specialButtonsContainer}>
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={addNewQuestion}
            disabled={isNewQuestion}
          >
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>إضافة سؤال جديد</Text>
          </TouchableOpacity>

          {!isNewQuestion && questions.length > 0 && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={deleteCurrentQuestion}
            >
              <Ionicons name="trash" size={20} color="#fff" />
              <Text style={styles.buttonText}>حذف السؤال</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* زر حفظ جميع التعديلات */}
        {(tempEditsCount > 0 || tempDeletedCount > 0) && (
          <TouchableOpacity
            style={styles.saveAllButton}
            onPress={saveAllChanges}
          >
            <Ionicons name="save" size={24} color="#fff" />
            <Text style={styles.saveAllButtonText}>
              حفظ جميع التعديلات 
              {tempEditsCount > 0 && tempDeletedCount > 0 
                ? `(${tempEditsCount} تعديل و ${tempDeletedCount} حذف)`
                : tempEditsCount > 0 
                  ? `(${tempEditsCount} تعديل)` 
                  : `(${tempDeletedCount} حذف)`
              }
            </Text>
          </TouchableOpacity>
        )}
        
        {/* زر الانتقال إلى محرر الأسئلة الجدولي */}
        <TouchableOpacity
          style={styles.tableEditorButton}
          onPress={() => router.push('/question-table-editor')}
        >
          <MaterialIcons name="table-chart" size={24} color="#fff" />
          <Text style={styles.buttonText}>محرر الأسئلة الجدولي</Text>
        </TouchableOpacity>

        {/* نموذج تحرير السؤال */}
        {questions.length > 0 || isNewQuestion ? (
          <View style={styles.formContainer}>
            {/* صف السؤال والإجابة */}
            <View style={styles.rowContainer}>
              <View style={styles.halfFormGroup}>
                <Text style={styles.label}>الإجابة:</Text>
                <TextInput
                  style={[styles.textInput, styles.answerText]}
                  multiline
                  value={currentQuestion.answer}
                  onChangeText={(text) => handleInputChange('answer', text)}
                />
              </View>

              <View style={styles.halfFormGroup}>
                <Text style={styles.label}>نص السؤال:</Text>
                <TextInput
                  style={[styles.textInput, styles.questionText]}
                  multiline
                  value={currentQuestion.question}
                  onChangeText={(text) => handleInputChange('question', text)}
                />
              </View>
            </View>

            {/* صف الفئة ومستوى الصعوبة */}
            <View style={styles.rowContainer}>
              <View style={styles.halfFormGroup}>
                <Text style={styles.label}>الفئة:</Text>
                <View style={[styles.pickerContainer, styles.categoryPickerContainer]}>
                  <Picker
                    selectedValue={currentQuestion.category}
                    onValueChange={(itemValue) => handleInputChange('category', itemValue)}
                    style={[styles.picker, styles.categoryPicker]}
                    dropdownIconColor="#333"
                  >
                    {categories.map((category, index) => (
                      <Picker.Item key={index} label={category} value={category} color="#333" />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.halfFormGroup}>
                <Text style={styles.label}>مستوى الصعوبة:</Text>
                <View style={[styles.pickerContainer, { backgroundColor: getDifficultyColor(currentQuestion.difficulty), borderColor: getDifficultyColor(currentQuestion.difficulty) }]}>
                  <Picker
                    selectedValue={currentQuestion.difficulty}
                    onValueChange={(itemValue) => handleInputChange('difficulty', itemValue)}
                    style={[styles.picker, { color: '#FFFFFF' }]}
                    dropdownIconColor="#FFFFFF"
                  >
                    {difficultyLevels.map((level, index) => (
                      <Picker.Item key={index} label={level} value={level} color={getDifficultyColor(level)} />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>رابط صورة السؤال:</Text>
              <View style={styles.inputWithButtonsContainer}>
                <TextInput
                  style={[styles.textInput, styles.inputWithButtons, styles.smallInput]}
                  value={currentQuestion.imgQ || ''}
                  onChangeText={(text) => handleInputChange('imgQ', text)}
                />
                <View style={styles.quickButtonsContainer}>
                  {['1.gif', '2.gif', '3.gif', '5.gif', '10.gif'].map((gif, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.quickButton}
                      onPress={() => handleInputChange('imgQ', gif)}
                    >
                      <Text style={styles.quickButtonText}>{gif}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>رابط صورة الإجابة:</Text>
              <TextInput
                style={[styles.textInput, styles.smallInput]}
                value={currentQuestion.imgA || ''}
                onChangeText={(text) => handleInputChange('imgA', text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>رابط فيديو السؤال:</Text>
              <TextInput
                style={[styles.textInput, styles.smallInput]}
                value={currentQuestion.vidQ || ''}
                onChangeText={(text) => handleInputChange('vidQ', text)}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>رابط فيديو الإجابة:</Text>
              <TextInput
                style={[styles.textInput, styles.smallInput]}
                value={currentQuestion.vidA || ''}
                onChangeText={(text) => handleInputChange('vidA', text)}
              />
            </View>
          </View>
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
    </BackgroundSelector>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  searchRow: {
    flexDirection: 'row',
    padding: 4,
    alignItems: 'center',
  },
  filterPickerContainer: {
    flex: 2,
    marginRight: 4,
  },
  filterPickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    height: 36,
    overflow: 'hidden',
  },
  filterPicker: {
    backgroundColor: '#fff',
    color: '#333',
    fontWeight: 'bold',
    height: 36,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 32,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  searchButton: {
    width: 32,
    height: 32,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 4,
  },
  clearButton: {
    width: 32,
    height: 32,
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginLeft: 4,
  },
  questionInfo: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginHorizontal: 4,
    marginVertical: 2,
    elevation: 2,
    height: 32,
  },
  questionCount: {
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 6,
  },
  questionNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 24,
  },
  questionNumberInput: {
    width: 36,
    height: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    textAlign: 'center',
    marginHorizontal: 3,
    fontSize: 12,
    padding: 0,
  },
  smallNavButton: {
    width: 20,
    height: 20,
    backgroundColor: '#3498db',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  noQuestionsText: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 20,
    color: '#777',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 4,
    height: 35,
  },
  navButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  tempSaveButton: {
    flexDirection: 'row',
    backgroundColor: '#f39c12',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  previewButton: {
    flexDirection: 'row',
    backgroundColor: '#9b59b6',
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 22,
  },
  saveAllButton: {
    flexDirection: 'row',
    backgroundColor: '#2ecc71',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 4,
    elevation: 3,
    height: 28,
  },
  saveAllButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 6,
  },
  buttonText: {
    color: '#fff',
    marginHorizontal: 2,
    fontSize: 10,
  },
  disabledButton: {
    opacity: 0.5,
  },
  formContainer: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 7,
  },
  label: {
    fontSize: 12,
    marginBottom: 2,
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#fff',
    minHeight: 40,
    fontSize: 12,
  },
  smallInput: {
    minHeight: 24,
    height: 24,
    padding: 2,
    fontSize: 12,
  },
  picker: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5,
    height: 45,
    color: '#FFFFFF',
  },
  categoryPicker: {
    backgroundColor: '#fff',
    color: '#333',
    fontWeight: 'bold',
    height: 50,
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  categoryPickerContainer: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    height: 50,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 7,
  },
  halfFormGroup: {
    flex: 1,
    marginHorizontal: 2,
  },
  questionText: {
    color: '#27ae60',
    fontWeight: 'bold',
    fontSize: 16,
  },
  answerText: {
    color: '#e74c3c',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quickButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
    justifyContent: 'flex-start',
  },
  quickButton: {
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 5,
    marginBottom: 5,
  },
  quickButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputWithButtonsContainer: {
    width: '100%',
  },
  inputWithButtons: {
    marginBottom: 5,
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  cancelButton: {
    flexDirection: 'row',
    backgroundColor: '#95a5a6',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  deleteButton: {
    flexDirection: 'row',
    backgroundColor: '#e74c3c',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginLeft: 10,
  },
  addNewButton: {
    flexDirection: 'row',
    backgroundColor: '#3498db',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
  },
  specialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 8,
    marginBottom: 10,
  },
  tableEditorButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    marginBottom: 10,
  },
});

export default AdminQuestionEditor;
