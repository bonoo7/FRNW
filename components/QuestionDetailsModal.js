import React, { useState, useEffect } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView, Platform, Dimensions } from 'react-native';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from './BackgroundPattern';

const isLandscape = () => {
  const dim = Dimensions.get('window');
  return dim.width > dim.height;
};

const createStyles = (theme, isVisible, pressed) => {
  const dim = Dimensions.get('window');
  const isLandscapeMode = dim.width > dim.height;
  
  return StyleSheet.create({
    footer: {
      gap: 2,
      paddingHorizontal: SPACING.xs,
      writingDirection: 'rtl',
      backgroundColor: `${theme.colors.background.surface}40`,
      padding: 4,
      borderRadius: 8,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
      marginTop: 0,
      borderWidth: 1,
      borderColor: theme.colors.border?.primary ? `rgba(${parseInt(theme.colors.border.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.border.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.border.primary.slice(5, 7), 16)}, 0.8)` : 'rgba(255, 255, 255, 0.8)',
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 4,
      width: '100%',
      paddingHorizontal: 2,
      paddingVertical: 2,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border?.primary ? `rgba(${parseInt(theme.colors.border.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.border.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.border.primary.slice(5, 7), 16)}, 0.4)` : 'rgba(255, 255, 255, 0.4)',
      marginBottom: 0,
    },
    footerItem: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: `${theme.colors.background.surface}30`,
      borderRadius: 4,
      padding: 2,
    },
    footerItemRight: {
      justifyContent: 'flex-end',
      marginLeft: 4,
    },
    footerItemLeft: {
      justifyContent: 'flex-start',
      marginRight: 4,
    },
    footerLabel: {
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
      marginLeft: SPACING.xs,
      marginRight: SPACING.xs,
    },
    footerValue: {
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.primary,
      backgroundColor: `${theme.colors.background.surface}40`,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
      minWidth: 40,
      textAlign: 'center',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: SPACING.xs,
    },
    modalContent: {
      width: '100%',
      maxWidth: Platform.OS === 'web' ? 700 : 600,
      height: Platform.OS === 'web' ? '60vh' : '60%',
      maxHeight: '85%',
      marginVertical: 0,
      borderRadius: 16,
      borderWidth: 2,
      overflow: 'hidden',
      writingDirection: 'rtl',
      alignSelf: 'center',
      transform: [{ scale: isVisible ? 1 : 0.95 }],
      opacity: isVisible ? 1 : 0,
      transition: 'all 0.2s ease',
      position: 'relative',
    },
    innerBorder: {
      position: 'absolute',
      top: 4,
      left: 4,
      right: 4,
      bottom: 4,
      borderWidth: 1,
      borderRadius: 12,
      borderColor: theme.colors.border?.primary || 'rgba(255, 255, 255, 0.15)',
      zIndex: -1,
    },
    container: {
      flex: 1,
      padding: SPACING.xs,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      textAlign: 'center',
      marginBottom: SPACING.xs,
      width: '100%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: SPACING.xs,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
    },
    headerDivider: {
      flex: 1,
      height: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    mainContent: {
      flex: 0,
      justifyContent: 'center',
      paddingVertical: SPACING.xs,
      gap: SPACING.xs,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.colors.border?.primary ? `rgba(${parseInt(theme.colors.border.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.border.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.border.primary.slice(5, 7), 16)}, 0.5)` : 'rgba(255, 255, 255, 0.5)',
      marginVertical: SPACING.xs,
      backgroundColor: `${theme.colors.background.surface}20`,
      minHeight: Dimensions.get('window').width > Dimensions.get('window').height 
        ? 80  
        : Platform.OS === 'web' 
          ? 120  
          : 100,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
      borderRadius: 12,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    detailRow: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 2,
      paddingHorizontal: 2,
    },
    rowText: {
      flex: 1,
      gap: 2,
    },
    label: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
      minWidth: 120,
      textAlign: 'right',
    },
    value: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.regular,
      flex: 1,
      textAlign: 'right',
      marginRight: SPACING.sm,
    },
    largeLabel: {
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.error,
      marginBottom: 2,
      textAlign: 'center',
      backgroundColor: `${theme.colors.error}10`,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
    },
    largeValue: {
      fontSize: FONTS.sizes.caption,
      color: theme.colors.text.primary,
      textAlign: 'center',
    },
    multilineValue: {
      lineHeight: 20,
      color: theme.colors.success,
      backgroundColor: `${theme.colors.success}10`,
      borderRadius: 4,
      paddingHorizontal: 4,
      paddingVertical: 2,
      borderWidth: 1,
      borderColor: theme.colors.success ? `rgba(${parseInt(theme.colors.success.slice(1, 3), 16)}, ${parseInt(theme.colors.success.slice(3, 5), 16)}, ${parseInt(theme.colors.success.slice(5, 7), 16)}, 0.3)` : 'rgba(76, 175, 80, 0.3)',
    },
    doublePoints: {
      padding: 2,
      borderRadius: 8,
      alignItems: 'center',
      marginVertical: 2,
      writingDirection: 'rtl',
      backgroundColor: `${theme.colors.success}33`,
      borderWidth: 1,
      borderColor: theme.colors.success ? `rgba(${parseInt(theme.colors.success.slice(1, 3), 16)}, ${parseInt(theme.colors.success.slice(3, 5), 16)}, ${parseInt(theme.colors.success.slice(5, 7), 16)}, 0.4)` : 'rgba(76, 175, 80, 0.4)',
    },
    doublePointsText: {
      fontSize: FONTS.sizes.caption,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.success,
    },
    closeButton: {
      padding: SPACING.xs,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 0,
      width: '90%',
      maxWidth: Platform.OS === 'web' ? 600 : 500,
      alignSelf: 'center',
      transform: [{ scale: pressed ? 0.98 : 1 }],
      opacity: pressed ? 0.9 : 1,
      borderRadius: 8,
    },
    closeButtonText: {
      color: '#FFFFFF',
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
    },
    questionLabelContainer: {
      position: 'absolute',
      top: SPACING.xs,
      right: SPACING.sm,
      zIndex: 1,
    },
    pointsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: SPACING.xs,
    },
    pointsValue: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
    },
    pointsLabel: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
    },
    expandedText: {
      // Add appropriate styles for expanded text
    },
    infoCard: {
      backgroundColor: `${theme.colors.background.surface}30`,
      borderRadius: 8,
      padding: SPACING.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border?.primary ? `rgba(${parseInt(theme.colors.border.primary.slice(1, 3), 16)}, ${parseInt(theme.colors.border.primary.slice(3, 5), 16)}, ${parseInt(theme.colors.border.primary.slice(5, 7), 16)}, 0.5)` : 'rgba(255, 255, 255, 0.5)',
    },
    infoCardLabel: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.medium,
      color: theme.colors.text.secondary,
      marginLeft: SPACING.xs,
    },
    infoCardValue: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.text.primary,
    },
    headerCards: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '90%',
      gap: SPACING.md,
      marginBottom: SPACING.md,
    },
    footerCards: {
      width: '90%',
      gap: SPACING.md,
    },
    questionText: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: SPACING.xs,
      lineHeight: 24,
      backgroundColor: `${theme.colors.error}10`,
      borderRadius: 8,
      padding: SPACING.xs,
      borderWidth: 1,
      borderColor: theme.colors.error ? `rgba(${parseInt(theme.colors.error.slice(1, 3), 16)}, ${parseInt(theme.colors.error.slice(3, 5), 16)}, ${parseInt(theme.colors.error.slice(5, 7), 16)}, 0.3)` : 'rgba(244, 67, 54, 0.3)',
    },
    answerText: {
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.success,
      textAlign: 'center',
      marginBottom: SPACING.xs,
      lineHeight: 24,
      backgroundColor: `${theme.colors.success}10`,
      borderRadius: 8,
      padding: SPACING.xs,
      borderWidth: 1,
      borderColor: theme.colors.success ? `rgba(${parseInt(theme.colors.success.slice(1, 3), 16)}, ${parseInt(theme.colors.success.slice(3, 5), 16)}, ${parseInt(theme.colors.success.slice(5, 7), 16)}, 0.3)` : 'rgba(76, 175, 80, 0.3)',
    },
  });
};

const QuestionDetailsModal = ({ visible, onClose, details, theme }) => {
  const [isVisible, setIsVisible] = useState(visible);
  const [pressed, setPressed] = useState(false);
  const styles = createStyles(theme, isVisible, pressed);

  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  if (!details) return null;

  const {
    question,
    answer,
    category,
    difficulty,
    answeredBy = 'لم يجب أحد',
    wasDoublePoints = false,
    earnedPoints = 0,
    answeredAt
  } = details;

  const formattedDate = answeredAt 
    ? new Date(answeredAt).toLocaleString('ar-SA')
    : 'غير معروف';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[styles.modalOverlay, { paddingVertical: 10 }]}>
        <BackgroundPattern
          style={[
            styles.modalContent,
            { 
              backgroundColor: `${theme.colors.background.card}F0`,
              borderColor: `${theme.colors.primary}80`,
              shadowColor: theme.colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }
          ]}
          patternId="modalPattern"
        >
          <ScrollView 
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.container}>
              <Text style={[styles.title, { color: theme.colors.text.primary }]}>
                تفاصيل السؤال
              </Text>

              <View style={styles.mainContent}>
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <Text style={styles.questionText}>
                    {question}
                  </Text>
                  <Text style={styles.answerText}>
                    {answer}
                  </Text>
                </View>
              </View>

              <View style={styles.footer}>
                <View style={[styles.footerRow, { backgroundColor: `${theme.colors.background.surface}60` }]}>
                  <View style={[styles.footerItem, styles.footerItemRight]}>
                    <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                      الفئة:
                    </Text>
                    <Text style={[styles.footerValue, { color: theme.colors.primary }]}>
                      {category}
                    </Text>
                  </View>
                  <View style={[styles.footerItem, styles.footerItemLeft]}>
                    <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                      المستوى:
                    </Text>
                    <Text style={[
                      styles.footerValue, 
                      { 
                        color: difficulty === 'سهل' 
                          ? theme.colors.success 
                          : difficulty === 'متوسط' 
                            ? theme.colors.warning 
                            : theme.colors.error,
                        backgroundColor: difficulty === 'سهل' 
                          ? `${theme.colors.success}20` 
                          : difficulty === 'متوسط' 
                            ? `${theme.colors.warning}20` 
                            : `${theme.colors.error}20`,
                      }
                    ]}>
                      {difficulty}
                    </Text>
                  </View>
                </View>

                <View style={styles.footerRow}>
                  <View style={[styles.footerItem, styles.footerItemRight]}>
                    <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                      أجاب عليه:
                    </Text>
                    <Text style={[styles.footerValue, { color: theme.colors.primary }]}>
                      {answeredBy}
                    </Text>
                  </View>
                  <View style={[styles.footerItem, styles.footerItemLeft]}>
                    <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                      النقاط:
                    </Text>
                    <Text style={[styles.footerValue, { 
                      color: theme.colors.primary,
                      fontWeight: FONTS.weights.bold,
                    }]}>
                      {earnedPoints}
                    </Text>
                  </View>
                </View>

                {wasDoublePoints && (
                  <View style={styles.doublePoints}>
                    <Text style={styles.doublePointsText}>
                      تم استخدام مضاعفة النقاط
                    </Text>
                  </View>
                )}

                <View style={[styles.footerRow, { borderBottomWidth: 0 }]}>
                  <View style={[styles.footerItem, { flex: 1 }]}>
                    <Text style={[styles.footerLabel, { color: theme.colors.text.secondary }]}>
                      تاريخ الإجابة:
                    </Text>
                    <Text style={[styles.footerValue, { 
                      color: theme.colors.primary,
                      flex: 1,
                      textAlign: 'right',
                    }]}>
                      {formattedDate}
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { 
                    backgroundColor: theme.colors.primary,
                    shadowColor: theme.colors.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }
                ]}
                onPress={handleClose}
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
              >
                <Text style={styles.closeButtonText}>إغلاق</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </BackgroundPattern>
      </View>
    </Modal>
  );
};

export default QuestionDetailsModal;