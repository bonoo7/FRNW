import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import QuestionEditorService from '../services/QuestionEditorService';
import StorageService from '../services/storageService';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';
import BackgroundPattern from '../components/BackgroundPattern';
import AsyncStorage from '@react-native-async-storage/async-storage';

const difficultyLevels = ['سهل', 'متوسط', 'صعب'];
const difficultyColors = {
  'سهل': '#4CAF50',
  'متوسط': '#2196F3',
  'صعب': '#F44336'
};

const AdminQuestionTableEditor = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const editInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // تحميل الفئات والأسئلة عند تحميل المكون
  useEffect(() => {
    loadData();
  }, []);

  // تحديث الأسئلة المفلترة عند تغيير الفئة المحددة أو نص البحث
  useEffect(() => {
    filterQuestions();
  }, [selectedCategory, questions, searchText]);

  // حفظ موقع التمرير الحالي في التخزين المحلي
  const saveScrollPosition = async () => {
    try {
      // استخدام متغير حالة لتخزين موقع التمرير
      const scrollY = scrollPosition || 0;
      await AsyncStorage.setItem('lastScrollPosition', scrollY.toString());
      console.log('تم حفظ موقع التمرير:', scrollY);
    } catch (error) {
      console.log('خطأ في حفظ موقع التمرير:', error);
    }
  };

  // استعادة موقع التمرير من التخزين المحلي
  const restoreScrollPosition = async () => {
    try {
      const scrollY = await AsyncStorage.getItem('lastScrollPosition');
      if (scrollY && scrollViewRef.current) {
        const position = parseFloat(scrollY);
        console.log('استعادة موقع التمرير:', position);
        
        // استخدام setTimeout لضمان أن التمرير يحدث بعد تحديث واجهة المستخدم
        setTimeout(() => {
          scrollViewRef.current.scrollTo({ y: position, animated: false });
        }, 500);
      }
    } catch (error) {
      console.log('خطأ في استعادة موقع التمرير:', error);
    }
  };

  // تحميل البيانات من الخدمة
  const loadData = async () => {
    try {
      setLoading(true);
      
      // تهيئة خدمة محرر الأسئلة
      await QuestionEditorService.initialize();
      
      // تحميل الفئات
      const categoriesData = await QuestionEditorService.getUniqueCategories();
      setCategories(categoriesData);
      
      // محاولة استعادة الفئة المحددة سابقاً من التخزين المحلي
      let lastSelectedCategory;
      try {
        lastSelectedCategory = await AsyncStorage.getItem('lastSelectedCategory');
      } catch (error) {
        console.log('لم يتم العثور على فئة محفوظة سابقاً');
      }
      
      // التحقق من أن الفئة المحفوظة موجودة في قائمة الفئات
      const categoryToSelect = lastSelectedCategory && categoriesData.includes(lastSelectedCategory)
        ? lastSelectedCategory
        : categoriesData[0];
      
      if (categoriesData.length > 0) {
        setSelectedCategory(categoryToSelect);
        
        // تحميل الأسئلة للفئة المحددة
        const questionsData = await QuestionEditorService.getQuestionsByCategory(categoryToSelect);
        setQuestions(questionsData);
        setFilteredQuestions(questionsData);
      }
      
      setLoading(false);
      
      // استعادة موقع التمرير بعد تحميل البيانات
      setTimeout(() => {
        restoreScrollPosition();
      }, 500);
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تحميل البيانات');
      setLoading(false);
    }
  };

  // تصفية الأسئلة بناءً على الفئة المحددة ونص البحث
  const filterQuestions = () => {
    if (!questions || questions.length === 0) return;
    
    let filtered = [...questions];
    
    // تصفية حسب نص البحث
    if (searchText) {
      const searchLower = searchText.toLowerCase();
      filtered = filtered.filter(q => 
        q.question.toLowerCase().includes(searchLower) || 
        q.answer.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredQuestions(filtered);
  };

  // تغيير الفئة المحددة
  const handleCategoryChange = async (category) => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'تغييرات غير محفوظة',
        'لديك تغييرات غير محفوظة. هل تريد حفظها قبل الانتقال؟',
        [
          {
            text: 'تجاهل التغييرات',
            onPress: async () => {
              // حفظ الفئة المحددة
              setSelectedCategory(category);
              // حفظ الفئة المحددة في التخزين المحلي
              await AsyncStorage.setItem('lastSelectedCategory', category);
              setHasUnsavedChanges(false);
              
              // تحميل الأسئلة للفئة الجديدة
              setLoading(true);
              const questionsData = await QuestionEditorService.getQuestionsByCategory(category);
              setQuestions(questionsData);
              setFilteredQuestions(questionsData);
              setLoading(false);
              
              // التمرير إلى أعلى القائمة
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
              }
            },
            style: 'cancel',
          },
          {
            text: 'حفظ',
            onPress: async () => {
              // حفظ التغييرات الحالية
              await saveAllChanges();
              
              // تغيير الفئة المحددة
              setSelectedCategory(category);
              // حفظ الفئة المحددة في التخزين المحلي
              await AsyncStorage.setItem('lastSelectedCategory', category);
              
              // تحميل الأسئلة للفئة الجديدة
              setLoading(true);
              const questionsData = await QuestionEditorService.getQuestionsByCategory(category);
              setQuestions(questionsData);
              setFilteredQuestions(questionsData);
              setLoading(false);
              
              // التمرير إلى أعلى القائمة
              if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({ y: 0, animated: true });
              }
            },
          },
        ]
      );
    } else {
      // تغيير الفئة المحددة بدون تنبيه
      setSelectedCategory(category);
      // حفظ الفئة المحددة في التخزين المحلي
      await AsyncStorage.setItem('lastSelectedCategory', category);
      
      // تحميل الأسئلة للفئة الجديدة
      setLoading(true);
      const questionsData = await QuestionEditorService.getQuestionsByCategory(category);
      setQuestions(questionsData);
      setFilteredQuestions(questionsData);
      setLoading(false);
      
      // التمرير إلى أعلى القائمة
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: true });
      }
    }
  };

  // بدء تحرير خلية
  const startEditing = (index, field, value) => {
    setEditingCell({ index, field });
    setEditingValue(value);
    
    // التركيز على حقل الإدخال بعد تحديثه
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 100);
  };

  // إنهاء التحرير وتطبيق التغييرات
  const finishEditing = async () => {
    if (editingCell) {
      const { index, field } = editingCell;
      const originalQuestion = { ...filteredQuestions[index] };
      const updatedQuestion = { ...originalQuestion };
      
      // تحديث قيمة الحقل المحرر
      updatedQuestion[field] = editingValue;
      
      // تحديث الأسئلة المفلترة
      const updatedFilteredQuestions = [...filteredQuestions];
      updatedFilteredQuestions[index] = updatedQuestion;
      setFilteredQuestions(updatedFilteredQuestions);
      
      // تحديث مصفوفة الأسئلة الرئيسية
      const questionId = updatedQuestion.id;
      const mainIndex = questions.findIndex(q => q.id === questionId);
      
      if (mainIndex !== -1) {
        const newQuestions = [...questions];
        newQuestions[mainIndex] = updatedQuestion;
        setQuestions(newQuestions);
        setHasUnsavedChanges(true);
        
        // حفظ التغييرات مؤقتاً باستخدام QuestionEditorService
        try {
          await QuestionEditorService.saveTempEdit(originalQuestion, updatedQuestion);
          console.log(`تم حفظ التغييرات مؤقتاً للسؤال: ${updatedQuestion.question}`);
        } catch (error) {
          console.error('خطأ في حفظ التغييرات المؤقتة:', error);
        }
      }
      
      // إعادة تعيين حالة التحرير
      setEditingCell(null);
      setEditingValue('');
      
      console.log(`تم تحديث الحقل "${field}" للسؤال رقم ${index} بالقيمة "${editingValue}"`);
    }
  };

  // إلغاء التحرير
  const cancelEditing = () => {
    setEditingCell(null);
    setEditingValue('');
  };

  // تحديث قيمة التحرير
  const updateEditingValue = (value) => {
    setEditingValue(value);
  };

  // تحديث قيمة عنصر القائمة المنسدلة
  const handlePickerChange = async (value) => {
    setEditingValue(value);
    
    // تطبيق التغيير فوراً على السؤال
    if (editingCell) {
      const { index, field } = editingCell;
      const originalQuestion = { ...filteredQuestions[index] };
      const updatedQuestion = { ...originalQuestion };
      
      // تحديث قيمة الحقل المحرر
      updatedQuestion[field] = value;
      
      // تحديث الأسئلة المفلترة
      const updatedFilteredQuestions = [...filteredQuestions];
      updatedFilteredQuestions[index] = updatedQuestion;
      setFilteredQuestions(updatedFilteredQuestions);
      
      // تحديث مصفوفة الأسئلة الرئيسية
      const questionId = updatedQuestion.id;
      const mainIndex = questions.findIndex(q => q.id === questionId);
      
      if (mainIndex !== -1) {
        const updatedQuestions = [...questions];
        updatedQuestions[mainIndex] = updatedQuestion;
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
        
        // حفظ التغييرات مؤقتاً باستخدام QuestionEditorService
        try {
          await QuestionEditorService.saveTempEdit(originalQuestion, updatedQuestion);
          console.log(`تم حفظ التغييرات مؤقتاً للسؤال: ${updatedQuestion.question}`);
        } catch (error) {
          console.error('خطأ في حفظ التغييرات المؤقتة:', error);
        }
      }
      
      // إعادة تعيين حالة التحرير
      setEditingCell(null);
      setEditingValue('');
      
      console.log(`تم تحديث الحقل "${field}" للسؤال رقم ${index} بالقيمة "${value}"`);
    }
  };

  // حفظ جميع التغييرات
  const saveAllChanges = async () => {
    try {
      setIsSaving(true);
      
      // حفظ موقع التمرير الحالي
      await saveScrollPosition();
      
      // حفظ التغييرات باستخدام خدمة محرر الأسئلة
      const result = await QuestionEditorService.saveAllEditsToFile();
      
      if (result.success) {
        setHasUnsavedChanges(false);
        Alert.alert('تم', result.message || 'تم حفظ التغييرات بنجاح');
        
        // إعادة تحميل الأسئلة مع الحفاظ على الفئة الحالية
        if (selectedCategory) {
          // تأكيد حفظ الفئة الحالية في التخزين المحلي
          await AsyncStorage.setItem('lastSelectedCategory', selectedCategory);
          
          const questionsData = await QuestionEditorService.getQuestionsByCategory(selectedCategory);
          
          // تحديث الأسئلة
          setQuestions(questionsData);
          setFilteredQuestions(questionsData);
          
          // استعادة موقع التمرير بعد تحديث البيانات
          setTimeout(() => {
            restoreScrollPosition();
          }, 300);
        }
      } else {
        Alert.alert('خطأ', result.message || 'حدث خطأ أثناء حفظ التغييرات');
      }
    } catch (error) {
      console.error('خطأ في حفظ التغييرات:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setIsSaving(false);
    }
  };

  // إضافة سؤال جديد
  const addNewQuestion = () => {
    if (!selectedCategory) {
      Alert.alert('تنبيه', 'يرجى اختيار فئة أولاً');
      return;
    }
    
    const newQuestion = {
      id: `new_${Date.now()}`,
      question: 'سؤال جديد',
      answer: 'الإجابة',
      category: selectedCategory,
      difficulty: 'متوسط',
      isNew: true
    };
    
    const updatedQuestions = [newQuestion, ...questions];
    setQuestions(updatedQuestions);
    setHasUnsavedChanges(true);
  };

  // حذف سؤال
  const deleteQuestion = (index) => {
    const questionToDelete = filteredQuestions[index];
    
    Alert.alert(
      'تأكيد الحذف',
      `هل أنت متأكد من حذف السؤال: "${questionToDelete.question}"؟`,
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'حذف',
          style: 'destructive',
          onPress: () => {
            // حذف السؤال من مصفوفة الأسئلة المفلترة
            const updatedFilteredQuestions = [...filteredQuestions];
            updatedFilteredQuestions.splice(index, 1);
            setFilteredQuestions(updatedFilteredQuestions);
            
            // حذف السؤال من مصفوفة الأسئلة الرئيسية
            const questionId = questionToDelete.id;
            const updatedQuestions = questions.filter(q => q.id !== questionId);
            setQuestions(updatedQuestions);
            
            // إضافة السؤال إلى قائمة الأسئلة المحذوفة في الخدمة
            if (!questionToDelete.isNew) {
              QuestionEditorService.saveTempDelete(questionToDelete);
            }
            
            setHasUnsavedChanges(true);
          },
        },
      ]
    );
  };

  // معاينة السؤال
  const previewQuestion = async (index) => {
    try {
      const questionToPreview = filteredQuestions[index];
      
      // تحضير بيانات السؤال للمعاينة
      const questionPreviewData = {
        question: questionToPreview.question,
        answer: questionToPreview.answer,
        category: questionToPreview.category,
        difficulty: questionToPreview.difficulty,
        isPreviewMode: true,
        teamName: 'الفريق الأول',
        // إضافة بيانات الفرق كنصوص وليس ككائنات
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

  // التنقل إلى محرر الأسئلة التقليدي
  const navigateToClassicEditor = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'تغييرات غير محفوظة',
        'لديك تغييرات غير محفوظة. هل تريد حفظها قبل الانتقال؟',
        [
          {
            text: 'تجاهل التغييرات',
            onPress: () => router.push('/question-editor'),
            style: 'cancel',
          },
          {
            text: 'حفظ',
            onPress: async () => {
              await saveAllChanges();
              router.push('/question-editor');
            },
          },
        ]
      );
    } else {
      router.push('/question-editor');
    }
  };

  // تحديث قيمة حقل في الجدول
  const handleDifficultyChange = (index, value) => {
    const updatedQuestions = [...filteredQuestions];
    
    if (updatedQuestions[index]) {
      updatedQuestions[index] = {
        ...updatedQuestions[index],
        difficulty: value
      };
      
      // تحديث الأسئلة المفلترة
      setFilteredQuestions(updatedQuestions);
      
      // تحديث مصفوفة الأسئلة الرئيسية
      const questionId = updatedQuestions[index].id;
      const mainIndex = questions.findIndex(q => q.id === questionId);
      
      if (mainIndex !== -1) {
        const updatedQuestions = [...questions];
        updatedQuestions[mainIndex] = {
          ...updatedQuestions[mainIndex],
          difficulty: value
        };
        
        setQuestions(updatedQuestions);
        setHasUnsavedChanges(true);
      }
    }
  };

  // عرض خلية قابلة للتحرير
  const renderEditableCell = (value, index, field, style = {}) => {
    const isEditing = editingCell && 
                      editingCell.index === index && 
                      editingCell.field === field;
    
    // تحديد نمط الخلية بناءً على نوع الحقل
    const cellStyle = [
      styles.cell,
      field === 'question' && styles.questionCell,
      field === 'answer' && styles.answerCell,
      field === 'difficulty' && styles.difficultyCell,
      field === 'category' && styles.categoryCell,
      style
    ];
    
    // إذا كان الحقل قيد التحرير
    if (isEditing) {
      // إذا كان الحقل هو الصعوبة
      if (field === 'difficulty') {
        return (
          <View style={[cellStyle, styles.editingCell]}>
            <Picker
              selectedValue={editingValue}
              onValueChange={handlePickerChange}
              style={[styles.picker, styles.smallPicker]}
              dropdownIconColor={theme.colors.text}
            >
              {difficultyLevels.map((level) => (
                <Picker.Item key={level} label={level} value={level} />
              ))}
            </Picker>
          </View>
        );
      }
      
      // إذا كان الحقل هو الفئة
      if (field === 'category') {
        return (
          <View style={[cellStyle, styles.editingCell]}>
            <Picker
              selectedValue={editingValue}
              onValueChange={handlePickerChange}
              style={[styles.picker, styles.smallPicker]}
              dropdownIconColor={theme.colors.text}
            >
              {categories.map((category) => (
                <Picker.Item key={category} label={category} value={category} />
              ))}
            </Picker>
          </View>
        );
      }
      
      // للحقول النصية (السؤال والإجابة)
      return (
        <View style={[cellStyle, styles.editingCell]}>
          <TextInput
            style={[
              styles.input, 
              field === 'question' && styles.questionInput,
              field === 'answer' && styles.answerInput
            ]}
            value={editingValue}
            onChangeText={updateEditingValue}
            onBlur={finishEditing}
            onSubmitEditing={finishEditing}
            multiline={field === 'question' || field === 'answer'}
            textAlign="right"
            ref={editInputRef}
          />
        </View>
      );
    }
    
    // عرض خلية عادية (غير قابلة للتحرير)
    // إذا كان الحقل هو الصعوبة، عرض شارة ملونة
    if (field === 'difficulty') {
      let badgeColor = '#4CAF50'; // أخضر لسهل
      if (value === 'متوسط') {
        badgeColor = '#FF9800'; // برتقالي لمتوسط
      } else if (value === 'صعب') {
        badgeColor = '#F44336'; // أحمر لصعب
      }
      
      return (
        <TouchableOpacity 
          style={[cellStyle, { justifyContent: 'center', alignItems: 'center' }]}
          onPress={() => startEditing(index, field, value)}
        >
          <View style={[styles.difficultyBadge, { backgroundColor: badgeColor }]}>
            <Text style={styles.difficultyText}>{value}</Text>
          </View>
        </TouchableOpacity>
      );
    }
    
    // للحقول النصية الأخرى
    return (
      <TouchableOpacity 
        style={cellStyle}
        onPress={() => startEditing(index, field, value)}
      >
        <Text 
          style={[
            field === 'question' 
              ? styles.questionText 
              : field === 'answer' 
                ? styles.answerText 
                : field === 'difficulty' || field === 'category'
                  ? styles.smallText
                  : styles.cellText
          ]}
          numberOfLines={field === 'question' || field === 'answer' ? 0 : 2}
        >
          {value}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* رأس الصفحة */}
      <View style={styles.header}>
        <Text style={styles.title}>محرر الأسئلة الجدولي</Text>
        
        {/* زر العودة إلى المحرر التقليدي */}
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={navigateToClassicEditor}
        >
          <Text style={styles.buttonText}>المحرر التقليدي</Text>
          <Ionicons name="arrow-back" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {/* تصفية الأسئلة */}
      <View style={styles.filterContainer}>
        {/* اختيار الفئة */}
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedCategory}
            onValueChange={handleCategoryChange}
            style={styles.picker}
            dropdownIconColor={theme.colors.text}
          >
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>
        </View>
        
        {/* البحث */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="بحث..."
            value={searchText}
            onChangeText={setSearchText}
          />
          <Ionicons name="search" size={20} color="#888" />
        </View>
      </View>
      
      {/* أزرار الإجراءات */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={addNewQuestion}
        >
          <Text style={styles.buttonText}>إضافة سؤال</Text>
          <Ionicons name="add-circle" size={20} color="#fff" />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton, hasUnsavedChanges ? {} : { opacity: 0.5 }]}
          onPress={saveAllChanges}
          disabled={!hasUnsavedChanges || isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </Text>
          <Ionicons name="save" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text>جاري تحميل الأسئلة...</Text>
        </View>
      ) : filteredQuestions.length === 0 ? (
        <View style={styles.noQuestionsContainer}>
          <Text style={styles.noQuestionsText}>
            لا توجد أسئلة في هذه الفئة. يمكنك إضافة سؤال جديد باستخدام زر "إضافة سؤال".
          </Text>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={addNewQuestion}
          >
            <Text style={styles.buttonText}>إضافة سؤال جديد</Text>
            <Ionicons name="add-circle" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.tableContainer}>
          {/* رأس الجدول */}
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.answerCell]}>
              <Text style={styles.headerText}>الإجابة</Text>
            </View>
            <View style={[styles.headerCell, styles.questionCell]}>
              <Text style={styles.headerText}>السؤال</Text>
            </View>
            <View style={[styles.headerCell, styles.difficultyCell]}>
              <Text style={styles.headerText}>الصعوبة</Text>
            </View>
            <View style={[styles.headerCell, styles.categoryCell]}>
              <Text style={styles.headerText}>الفئة</Text>
            </View>
            <View style={[styles.headerCell, styles.actionsCell]}>
              <Text style={styles.headerText}>إجراءات</Text>
            </View>
          </View>
          
          {/* محتوى الجدول */}
          <ScrollView 
            ref={scrollViewRef} 
            style={{ flex: 1 }} 
            onScroll={(event) => {
              const scrollPosition = event.nativeEvent.contentOffset.y;
              setScrollPosition(scrollPosition);
            }}
          >
            {filteredQuestions.map((question, index) => (
              <View 
                key={question.id || index} 
                style={[
                  styles.row,
                  index % 2 === 0 ? { backgroundColor: '#f9f9f9' } : {}
                ]}
              >
                <View style={[styles.cell, styles.answerCell]}>
                  {renderEditableCell(question.answer, index, 'answer')}
                </View>
                <View style={[styles.cell, styles.questionCell]}>
                  {renderEditableCell(question.question, index, 'question')}
                </View>
                <View style={[styles.cell, styles.difficultyCell]}>
                  {renderEditableCell(question.difficulty, index, 'difficulty')}
                </View>
                <View style={[styles.cell, styles.categoryCell]}>
                  {renderEditableCell(question.category, index, 'category')}
                </View>
                <View style={[styles.cell, styles.actionsCell]}>
                  <View style={styles.actionButtonsContainer}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.dangerButton]}
                      onPress={() => deleteQuestion(index)}
                    >
                      <Ionicons name="trash" size={18} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.infoButton]}
                      onPress={() => previewQuestion(index)}
                    >
                      <Ionicons name="eye" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  title: {
    fontSize: FONTS.sizes.title,
    fontWeight: 'bold',
    color: '#333',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  pickerContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginRight: SPACING.xs,
    backgroundColor: '#fff',
    height: 40,
  },
  picker: {
    height: 40,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: SPACING.xs,
    backgroundColor: '#fff',
    height: 40,
  },
  searchInput: {
    flex: 1,
    height: 40,
    textAlign: 'right',
  },
  tableContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    padding: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: FONTS.sizes.small,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    padding: SPACING.xs,
    justifyContent: 'center',
  },
  questionCell: {
    flex: 4,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  answerCell: {
    flex: 3,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  difficultyCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
    alignItems: 'center',
  },
  categoryCell: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: '#eee',
  },
  actionsCell: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellText: {
    fontSize: FONTS.sizes.small,
    color: '#333',
    textAlign: 'right',
  },
  questionText: {
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  answerText: {
    fontSize: 20,
    color: '#F44336',
    textAlign: 'right',
    fontWeight: '500',
  },
  smallText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
    borderRadius: 5,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryButton: {
    backgroundColor: '#2196F3',
  },
  dangerButton: {
    backgroundColor: '#F44336',
  },
  infoButton: {
    backgroundColor: '#03A9F4',
  },
  buttonText: {
    color: '#fff',
    marginRight: SPACING.xs,
    fontSize: FONTS.sizes.small,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editingCell: {
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    padding: 2,
    textAlign: 'right',
    color: '#333',
    fontSize: FONTS.sizes.small,
  },
  questionInput: {
    fontSize: 22,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  answerInput: {
    fontSize: 20,
    color: '#F44336',
    fontWeight: '500',
  },
  picker: {
    width: '100%',
  },
  smallPicker: {
    fontSize: 14,
  },
  difficultyBadge: {
    padding: 2,
    borderRadius: 4,
    minWidth: 50,
    alignItems: 'center',
  },
  difficultyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  noQuestionsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  noQuestionsText: {
    fontSize: FONTS.sizes.body,
    color: '#888',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.xs,
  },
  actionButton: {
    padding: SPACING.xs,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminQuestionTableEditor;
