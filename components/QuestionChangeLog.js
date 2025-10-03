import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';
import QuestionManagementService from '../services/QuestionManagementService';

const QuestionChangeLog = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const [modifiedQuestions, setModifiedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (visible) {
      loadModifiedQuestions();
    }
  }, [visible]);

  const loadModifiedQuestions = async () => {
    try {
      setLoading(true);
      const questions = await QuestionManagementService.exportModifiedQuestions();
      setModifiedQuestions(questions);
      setLoading(false);
    } catch (error) {
      console.error('خطأ في تحميل الأسئلة المعدلة:', error);
      setLoading(false);
    }
  };

  const getActionText = (question) => {
    if (question.isDeleted) {
      return 'تم حذف السؤال';
    }
    
    // التحقق مما إذا كان السؤال جديداً
    const isNewQuestion = !question.originalQuestion;
    
    if (isNewQuestion) {
      return 'تمت إضافة السؤال';
    }
    
    return 'تم تعديل السؤال';
  };

  const getActionColor = (question) => {
    if (question.isDeleted) {
      return theme.colors.error;
    }
    
    const isNewQuestion = !question.originalQuestion;
    
    if (isNewQuestion) {
      return theme.colors.success;
    }
    
    return theme.colors.primary;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: `${theme.colors.background.primary}E6` }]}>
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <MaterialIcons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              سجل تغييرات الأسئلة
            </Text>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={[styles.loadingText, { color: theme.colors.text.secondary }]}>
                جاري تحميل التغييرات...
              </Text>
            </View>
          ) : modifiedQuestions.length > 0 ? (
            <FlatList
              data={modifiedQuestions}
              keyExtractor={(item, index) => `${item.question}-${index}`}
              renderItem={({ item }) => (
                <View style={[styles.questionItem, { borderColor: theme.colors.border }]}>
                  <View style={styles.questionHeader}>
                    <Text style={[styles.actionText, { color: getActionColor(item) }]}>
                      {getActionText(item)}
                    </Text>
                    <Text style={[styles.categoryText, { color: theme.colors.text.secondary }]}>
                      {item.category} - {item.difficulty}
                    </Text>
                  </View>
                  <Text style={[styles.questionText, { color: theme.colors.text.primary }]}>
                    {item.question}
                  </Text>
                  <Text style={[styles.answerText, { color: theme.colors.text.secondary }]}>
                    الإجابة: {item.answer}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.listContent}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.colors.text.secondary }]}>
                لا توجد تغييرات على الأسئلة
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.clearButton}
            onPress={async () => {
              await QuestionManagementService.clearAllModifications();
              loadModifiedQuestions();
            }}
          >
            <LinearGradient
              colors={theme.colors.gradient.error || ['#ff6b6b', '#ee5253']}
              style={styles.clearButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.clearButtonText}>مسح جميع التغييرات</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.md,
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    borderRadius: 12,
    padding: SPACING.md,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  title: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold,
  },
  closeButton: {
    position: 'absolute',
    left: 0,
  },
  loadingContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONTS.sizes.medium,
  },
  listContent: {
    paddingBottom: SPACING.md,
  },
  questionItem: {
    padding: SPACING.sm,
    borderBottomWidth: 1,
    marginBottom: SPACING.sm,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.bold,
  },
  categoryText: {
    fontSize: FONTS.sizes.small,
  },
  questionText: {
    fontSize: FONTS.sizes.medium,
    marginBottom: SPACING.xs,
  },
  answerText: {
    fontSize: FONTS.sizes.small,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONTS.sizes.medium,
  },
  clearButton: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  clearButtonGradient: {
    padding: SPACING.sm,
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: FONTS.weights.bold,
  },
});

export default QuestionChangeLog;
