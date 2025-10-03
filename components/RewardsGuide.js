import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';

const RewardsGuide = ({ visible, onClose }) => {
  const { theme } = useTheme();

  const rewardsGuideText = {
    title: "نظام المكافآت",
    description: `
      يعتمد نظام المكافآت على سرعة تثبيت الإجابة من قبل الفريق. كلما كان التثبيت أسرع، كانت المكافأة أكبر.

      المكافآت تحسب كنسبة من نقاط السؤال الأساسية:

      • تثبيت ممتاز (باقي 80% من الوقت أو أكثر):
        - مكافأة 20% من نقاط السؤال
        مثال: سؤال صعب (200 نقطة) = 40 نقطة إضافية

      • تثبيت سريع جداً (باقي 60-79% من الوقت):
        - مكافأة 15% من نقاط السؤال
        مثال: سؤال صعب (200 نقطة) = 30 نقطة إضافية

      • تثبيت سريع (باقي 40-59% من الوقت):
        - مكافأة 10% من نقاط السؤال
        مثال: سؤال صعب (200 نقطة) = 20 نقطة إضافية

      • تثبيت جيد (باقي 20-39% من الوقت):
        - مكافأة 5% من نقاط السؤال
        مثال: سؤال صعب (200 نقطة) = 10 نقاط إضافية

      • تثبيت متأخر (أقل من 20% من الوقت):
        - لا توجد مكافأة إضافية

      ملاحظات:
      - يمكن تفعيل/تعطيل نظام المكافآت من الشاشة الرئيسية
      - المكافآت تضاف فقط للإجابات الصحيحة
      - يتم احتساب النسبة من الوقت المتبقي مقارنة بالوقت الكلي للسؤال
    `,
    examples: [
      {
        type: "سؤال صعب (200 نقطة)",
        rewards: [
          "تثبيت ممتاز = 240 نقطة (200 + 40)",
          "تثبيت سريع جداً = 230 نقطة (200 + 30)",
          "تثبيت سريع = 220 نقطة (200 + 20)",
          "تثبيت جيد = 210 نقاط (200 + 10)"
        ]
      },
      {
        type: "سؤال متوسط (100 نقطة)",
        rewards: [
          "تثبيت ممتاز = 120 نقطة (100 + 20)",
          "تثبيت سريع جداً = 115 نقطة (100 + 15)",
          "تثبيت سريع = 110 نقاط (100 + 10)",
          "تثبيت جيد = 105 نقاط (100 + 5)"
        ]
      },
      {
        type: "سؤال سهل (50 نقطة)",
        rewards: [
          "تثبيت ممتاز = 60 نقطة (50 + 10)",
          "تثبيت سريع جداً = 58 نقطة (50 + 8)",
          "تثبيت سريع = 55 نقطة (50 + 5)",
          "تثبيت جيد = 53 نقطة (50 + 3)"
        ]
      }
    ]
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={[styles.modalContainer, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
        <View style={[styles.content, { backgroundColor: theme.colors.background.card }]}>
          <ScrollView style={styles.scrollView}>
            {/* العنوان */}
            <LinearGradient
              colors={theme.colors.gradient.primary}
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.title, { color: theme.colors.text.light }]}>
                {rewardsGuideText.title}
              </Text>
            </LinearGradient>

            {/* الوصف */}
            <Text style={[styles.description, { color: theme.colors.text.primary }]}>
              {rewardsGuideText.description}
            </Text>

            {/* الأمثلة */}
            <View style={styles.examplesContainer}>
              {rewardsGuideText.examples.map((example, index) => (
                <View 
                  key={index} 
                  style={[styles.exampleCard, { backgroundColor: theme.colors.background.surface }]}
                >
                  <Text style={[styles.exampleType, { color: theme.colors.primary }]}>
                    {example.type}
                  </Text>
                  {example.rewards.map((reward, rewardIndex) => (
                    <Text 
                      key={rewardIndex}
                      style={[styles.rewardText, { color: theme.colors.text.secondary }]}
                    >
                      {reward}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* زر الإغلاق */}
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.text.light }]}>
              فهمت
            </Text>
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
    padding: SPACING.lg,
  },
  content: {
    width: '100%',
    maxWidth: 600,
    maxHeight: '90%',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      }
    }),
  },
  scrollView: {
    maxHeight: '80%',
  },
  header: {
    padding: SPACING.sm,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
  },
  description: {
    fontSize: FONTS.sizes.body,
    lineHeight: FONTS.sizes.body * 1.5,
    padding: SPACING.lg,
    textAlign: 'right',
  },
  examplesContainer: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  exampleCard: {
    padding: SPACING.md,
    borderRadius: 12,
    gap: SPACING.xs,
  },
  exampleType: {
    fontSize: FONTS.sizes.h3,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
  },
  rewardText: {
    fontSize: FONTS.sizes.body,
    paddingRight: SPACING.md,
  },
  closeButton: {
    padding: SPACING.xs,
    alignItems: 'center',
    margin: SPACING.md,
    borderRadius: 8,
  },
  closeButtonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  }
});

export default RewardsGuide; 