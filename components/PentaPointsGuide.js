import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';

const PentaPointsGuide = ({ visible, onClose }) => {
  const { theme } = useTheme();

  const pentaPointsGuideText = {
    title: "نظام علي وعلى أعدائي (×5)",
    description: `
      نظام "علي وعلى أعدائي" هو نظام مضاعفة النقاط ×5 أضعاف، يمكن للفريق صاحب أقل نقاط استخدامه مرة واحدة فقط خلال اللعبة.

      كيفية عمل النظام:
      
      • يمكن للفريق صاحب أقل نقاط فقط استخدام هذا النظام
      • يمكن استخدام النظام مرة واحدة فقط لكل فريق خلال اللعبة
      • عند تفعيل النظام، تتضاعف نقاط السؤال ×5 أضعاف
      • يظهر زر "علي وعلى أعدائي ×5" في بطاقة الفريق صاحب أقل نقاط
      • عند تفعيل النظام، تظهر خلفية نار متحركة في بطاقة الفريق
      • لا يمكن الجمع بين نظام "علي وعلى أعدائي" ونظام مضاعفة النقاط العادي (×2)

      ملاحظات:
      • يمكن تفعيل/تعطيل النظام من الشاشة الرئيسية
      • النظام مصمم لمساعدة الفريق المتأخر في النقاط على تقليص الفارق
      • يمكن استخدام النظام مع أي سؤال بغض النظر عن مستوى صعوبته
      • يتم تطبيق المضاعفة على النقاط الأساسية للسؤال قبل إضافة أي مكافآت
    `,
    examples: [
      {
        type: "سؤال صعب (200 نقطة)",
        rewards: [
          "مع تفعيل علي وعلى أعدائي = 1000 نقطة (200 × 5)",
          "مع تفعيل علي وعلى أعدائي + تثبيت ممتاز = 1040 نقطة (1000 + 40)"
        ]
      },
      {
        type: "سؤال متوسط (100 نقطة)",
        rewards: [
          "مع تفعيل علي وعلى أعدائي = 500 نقطة (100 × 5)",
          "مع تفعيل علي وعلى أعدائي + تثبيت ممتاز = 520 نقطة (500 + 20)"
        ]
      },
      {
        type: "سؤال سهل (50 نقطة)",
        rewards: [
          "مع تفعيل علي وعلى أعدائي = 250 نقطة (50 × 5)",
          "مع تفعيل علي وعلى أعدائي + تثبيت ممتاز = 260 نقطة (250 + 10)"
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
              colors={['#F44336', '#D32F2F']} // ألوان حمراء تناسب نظام علي وعلى أعدائي
              style={styles.header}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={[styles.title, { color: theme.colors.text.light }]}>
                {pentaPointsGuideText.title}
              </Text>
            </LinearGradient>

            {/* الوصف */}
            <Text style={[styles.description, { color: theme.colors.text.primary }]}>
              {pentaPointsGuideText.description}
            </Text>

            {/* الأمثلة */}
            <View style={styles.examplesContainer}>
              {pentaPointsGuideText.examples.map((example, index) => (
                <View key={index} style={[styles.exampleCard, { backgroundColor: theme.colors.background.surface }]}>
                  <Text style={[styles.exampleTitle, { color: theme.colors.text.primary }]}>
                    {example.type}
                  </Text>
                  {example.rewards.map((reward, rewardIndex) => (
                    <Text 
                      key={rewardIndex} 
                      style={[
                        styles.exampleText, 
                        { color: theme.colors.text.secondary }
                      ]}
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
              إغلاق
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
    padding: SPACING.md,
  },
  content: {
    width: '90%',
    maxWidth: 500,
    maxHeight: '90%',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  scrollView: {
    padding: SPACING.md,
  },
  header: {
    padding: SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    marginHorizontal: -SPACING.md,
    marginTop: -SPACING.md,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: FONTS.sizes.large,
    fontWeight: FONTS.weights.bold,
    textAlign: 'center',
  },
  description: {
    fontSize: FONTS.sizes.small,
    lineHeight: FONTS.sizes.small * 1.5,
    textAlign: 'right',
    marginBottom: SPACING.md,
  },
  examplesContainer: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  exampleCard: {
    padding: SPACING.sm,
    borderRadius: 8,
    marginBottom: SPACING.sm,
  },
  exampleTitle: {
    fontSize: FONTS.sizes.small,
    fontWeight: FONTS.weights.bold,
    marginBottom: SPACING.xs,
    textAlign: 'right',
  },
  exampleText: {
    fontSize: FONTS.sizes.small,
    marginBottom: 4,
    textAlign: 'right',
  },
  closeButton: {
    padding: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  closeButtonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: FONTS.weights.medium,
  },
});

export default PentaPointsGuide;
