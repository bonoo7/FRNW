import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  ScrollView,
  Animated,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import MockPaymentService from '../services/MockPaymentService';

/**
 * نافذة الدفع الوهمية (Mock Payment Modal)
 * محاكاة واقعية لعملية الدفع
 */
const MockPaymentModal = ({ 
  visible, 
  packageData, 
  onClose, 
  onSuccess 
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [step, setStep] = useState('info'); // info, form, processing, success, error
  const [cardNumber, setCardNumber] = useState('4242424242424242');
  const [cardName, setCardName] = useState('Test User');
  const [cardMonth, setCardMonth] = useState('12');
  const [cardYear, setCardYear] = useState('25');
  const [cardCVC, setCardCVC] = useState('123');
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [scaleAnim] = useState(new Animated.Value(0));

  const handlePaymentForm = () => {
    // التحقق من البيانات
    if (!cardNumber || cardNumber.length < 13) {
      setErrorMessage('رقم البطاقة غير صحيح');
      return;
    }
    if (!cardName.trim()) {
      setErrorMessage('اسم صاحب البطاقة مطلوب');
      return;
    }
    setErrorMessage('');
    setStep('form');
  };

  const handleConfirmPayment = async () => {
    try {
      if (!currentUser) {
        Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
        return;
      }

      setProcessing(true);
      setStep('processing');

      // محاكاة الدفع
      const result = await MockPaymentService.processPayment(
        currentUser.uid,
        {
          price: packageData.price,
          credits: packageData.credits,
          packageId: packageData.id,
          paymentMethod: 'mock_card',
          cardLast4: cardNumber.slice(-4),
          cardName
        }
      );

      if (result.success) {
        setTransactionId(result.transactionId);
        setStep('success');
        
        // تأخير قبل الإغلاق التلقائي
        setTimeout(() => {
          onSuccess?.(packageData);
          resetModal();
        }, 3000);
      }
    } catch (error) {
      setErrorMessage(error.message || 'حدث خطأ في الدفع');
      setStep('error');
    } finally {
      setProcessing(false);
    }
  };

  const resetModal = () => {
    setStep('info');
    setCardNumber('4242424242424242');
    setCardName('Test User');
    setCardMonth('12');
    setCardYear('25');
    setCardCVC('123');
    setErrorMessage('');
    setTransactionId('');
    onClose();
  };

  // Animate on success
  React.useEffect(() => {
    if (step === 'success') {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true
      }).start();
    }
  }, [step]);

  if (!visible || !packageData) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={resetModal}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
          {/* رأس النافذة */}
          <View style={[styles.header, { backgroundColor: theme.colors.background.surface }]}>
            <TouchableOpacity onPress={resetModal}>
              <MaterialIcons name="close" size={28} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              {step === 'info' && 'تأكيد الشراء'}
              {step === 'form' && 'بيانات البطاقة'}
              {step === 'processing' && 'جاري المعالجة'}
              {step === 'success' && 'تم بنجاح!'}
              {step === 'error' && 'فشل الدفع'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* خطوة 1: معلومات الشراء */}
            {step === 'info' && (
              <View style={styles.stepContent}>
                <View style={[styles.summaryBox, { backgroundColor: theme.colors.background.card }]}>
                  <View style={styles.summaryRow}>
                    <MaterialIcons name="sports-esports" size={32} color={theme.colors.primary} />
                    <View style={styles.summaryInfo}>
                      <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>
                        عدد الألعاب
                      </Text>
                      <Text style={[styles.summaryValue, { color: theme.colors.text.primary }]}>
                        {packageData.credits} {packageData.credits === 1 ? 'لعبة' : 'ألعاب'}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.divider, { backgroundColor: theme.colors.border.primary }]} />

                  <View style={styles.summaryRow}>
                    <MaterialIcons name="attach-money" size={32} color={theme.colors.primary} />
                    <View style={styles.summaryInfo}>
                      <Text style={[styles.summaryLabel, { color: theme.colors.text.secondary }]}>
                        السعر
                      </Text>
                      <Text style={[styles.summaryValue, { color: theme.colors.text.primary }]}>
                        ${packageData.price}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* ملاحظة عن الدفع الوهمي */}
                <View style={[styles.mockWarning, { backgroundColor: '#fff3cd', borderColor: '#ffc107' }]}>
                  <MaterialIcons name="info" size={20} color="#ff6b00" />
                  <View style={styles.mockWarningText}>
                    <Text style={{ color: '#ff6b00', fontWeight: 'bold', marginBottom: 4 }}>
                      ⚠️ منصة دفع تجريبية
                    </Text>
                    <Text style={{ color: '#333', fontSize: 12, lineHeight: 18 }}>
                      هذه منصة دفع وهمية للاختبار فقط. لن يتم احتساب أي رسوم حقيقية. البيانات التي تدخلها هنا آمنة وتُستخدم للاختبار فقط.
                    </Text>
                  </View>
                </View>

                {/* بيانات اختبار */}
                <View style={[styles.testDataBox, { backgroundColor: theme.colors.background.card }]}>
                  <Text style={[styles.testDataTitle, { color: theme.colors.primary }]}>
                    🧪 بيانات اختبار مملوءة مسبقاً:
                  </Text>
                  <Text style={[styles.testDataText, { color: theme.colors.text.secondary }]}>
                    رقم البطاقة: 4242 4242 4242 4242{'\n'}
                    الاسم: Test User{'\n'}
                    الشهر: 12{'\n'}
                    السنة: 25{'\n'}
                    رمز التحقق: 123
                  </Text>
                </View>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  onPress={handlePaymentForm}
                >
                  <Text style={styles.buttonText}>المتابعة إلى الدفع</Text>
                  <MaterialIcons name="arrow-forward" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* خطوة 2: نموذج البطاقة */}
            {step === 'form' && (
              <View style={styles.stepContent}>
                <View style={[styles.formBox, { backgroundColor: theme.colors.background.card }]}>
                  <Text style={[styles.formLabel, { color: theme.colors.text.primary }]}>
                    رقم البطاقة
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.primary
                    }]}
                    placeholder="1234 5678 9012 3456"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={cardNumber}
                    onChangeText={setCardNumber}
                    keyboardType="numeric"
                    maxLength={19}
                  />

                  <Text style={[styles.formLabel, { color: theme.colors.text.primary, marginTop: 16 }]}>
                    اسم صاحب البطاقة
                  </Text>
                  <TextInput
                    style={[styles.input, { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border.primary,
                      backgroundColor: theme.colors.background.primary
                    }]}
                    placeholder="الاسم الكامل"
                    placeholderTextColor={theme.colors.text.secondary}
                    value={cardName}
                    onChangeText={setCardName}
                  />

                  <View style={styles.cardDateRow}>
                    <View style={styles.cardDateField}>
                      <Text style={[styles.formLabel, { color: theme.colors.text.primary }]}>
                        الشهر
                      </Text>
                      <TextInput
                        style={[styles.input, { 
                          color: theme.colors.text.primary,
                          borderColor: theme.colors.border.primary,
                          backgroundColor: theme.colors.background.primary
                        }]}
                        placeholder="MM"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={cardMonth}
                        onChangeText={setCardMonth}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    <View style={styles.cardDateField}>
                      <Text style={[styles.formLabel, { color: theme.colors.text.primary }]}>
                        السنة
                      </Text>
                      <TextInput
                        style={[styles.input, { 
                          color: theme.colors.text.primary,
                          borderColor: theme.colors.border.primary,
                          backgroundColor: theme.colors.background.primary
                        }]}
                        placeholder="YY"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={cardYear}
                        onChangeText={setCardYear}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    <View style={styles.cardDateField}>
                      <Text style={[styles.formLabel, { color: theme.colors.text.primary }]}>
                        CVC
                      </Text>
                      <TextInput
                        style={[styles.input, { 
                          color: theme.colors.text.primary,
                          borderColor: theme.colors.border.primary,
                          backgroundColor: theme.colors.background.primary
                        }]}
                        placeholder="123"
                        placeholderTextColor={theme.colors.text.secondary}
                        value={cardCVC}
                        onChangeText={setCardCVC}
                        keyboardType="numeric"
                        maxLength={4}
                        secureTextEntry
                      />
                    </View>
                  </View>

                  {errorMessage ? (
                    <View style={[styles.errorBox, { backgroundColor: '#fee' }]}>
                      <MaterialIcons name="error" size={20} color="#c33" />
                      <Text style={{ color: '#c33', marginLeft: 8 }}>
                        {errorMessage}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity
                    style={[styles.buttonSecondary, { 
                      backgroundColor: theme.colors.background.card,
                      borderColor: theme.colors.border.primary
                    }]}
                    onPress={() => setStep('info')}
                  >
                    <Text style={{ color: theme.colors.text.primary }}>رجوع</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.colors.primary, flex: 1 }]}
                    onPress={handleConfirmPayment}
                    disabled={processing}
                  >
                    {processing ? (
                      <ActivityIndicator color="#fff" size="small" />
                    ) : (
                      <>
                        <Text style={styles.buttonText}>تأكيد الدفع</Text>
                        <MaterialIcons name="check" size={20} color="#fff" />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* خطوة 3: جاري المعالجة */}
            {step === 'processing' && (
              <View style={styles.processingContent}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <Text style={[styles.processingText, { color: theme.colors.text.primary }]}>
                  جاري معالجة الدفع...
                </Text>
                <Text style={[styles.processingSubText, { color: theme.colors.text.secondary }]}>
                  يرجى عدم إغلاق النافذة
                </Text>
              </View>
            )}

            {/* خطوة 4: نجح */}
            {step === 'success' && (
              <View style={styles.successContent}>
                <Animated.View 
                  style={[
                    styles.successIcon,
                    { 
                      transform: [{ scale: scaleAnim }],
                      backgroundColor: '#4caf50'
                    }
                  ]}
                >
                  <MaterialIcons name="check" size={64} color="#fff" />
                </Animated.View>

                <Text style={[styles.successTitle, { color: theme.colors.text.primary }]}>
                  تمت العملية بنجاح! 🎉
                </Text>

                <Text style={[styles.successSubTitle, { color: theme.colors.text.secondary }]}>
                  تم إضافة {packageData.credits} {packageData.credits === 1 ? 'لعبة' : 'ألعاب'} إلى رصيدك
                </Text>

                <View style={[styles.receiptBox, { backgroundColor: theme.colors.background.card }]}>
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: theme.colors.text.secondary }]}>
                      معرف المعاملة:
                    </Text>
                    <Text style={[styles.receiptValue, { color: theme.colors.primary }]}>
                      {transactionId}
                    </Text>
                  </View>
                  <View style={[styles.divider, { backgroundColor: theme.colors.border.primary }]} />
                  <View style={styles.receiptRow}>
                    <Text style={[styles.receiptLabel, { color: theme.colors.text.secondary }]}>
                      الوقت:
                    </Text>
                    <Text style={[styles.receiptValue, { color: theme.colors.text.primary }]}>
                      {new Date().toLocaleString('ar-SA')}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.successNote, { color: theme.colors.text.secondary }]}>
                  سيتم إغلاق النافذة تلقائياً بعد قليل...
                </Text>
              </View>
            )}

            {/* خطوة 5: فشل */}
            {step === 'error' && (
              <View style={styles.errorContent}>
                <View style={[styles.errorIcon, { backgroundColor: '#f44336' }]}>
                  <MaterialIcons name="close" size={64} color="#fff" />
                </View>

                <Text style={[styles.errorTitle, { color: theme.colors.text.primary }]}>
                  فشل الدفع ❌
                </Text>

                <Text style={[styles.errorMessage, { color: theme.colors.text.secondary }]}>
                  {errorMessage}
                </Text>

                <TouchableOpacity
                  style={[styles.button, { backgroundColor: theme.colors.primary }]}
                  onPress={() => setStep('form')}
                >
                  <Text style={styles.buttonText}>إعادة المحاولة</Text>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '95%'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center'
  },
  content: {
    padding: 20
  },
  stepContent: {
    gap: 20
  },
  summaryBox: {
    borderRadius: 12,
    padding: 16,
    gap: 16
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  summaryInfo: {
    flex: 1
  },
  summaryLabel: {
    fontSize: 12,
    marginBottom: 4
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  divider: {
    height: 1
  },
  mockWarning: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start'
  },
  mockWarningText: {
    flex: 1
  },
  testDataBox: {
    borderRadius: 12,
    padding: 12
  },
  testDataTitle: {
    fontWeight: 'bold',
    marginBottom: 8
  },
  testDataText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: 'monospace'
  },
  formBox: {
    borderRadius: 12,
    padding: 16,
    gap: 12
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14
  },
  cardDateRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8
  },
  cardDateField: {
    flex: 1
  },
  errorBox: {
    flexDirection: 'row',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center'
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  buttonSecondary: {
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12
  },
  processingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 20
  },
  processingText: {
    fontSize: 18,
    fontWeight: 'bold'
  },
  processingSubText: {
    fontSize: 14
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16
  },
  successIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  successSubTitle: {
    fontSize: 14,
    textAlign: 'center'
  },
  receiptBox: {
    borderRadius: 12,
    padding: 16,
    width: '100%'
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8
  },
  receiptLabel: {
    fontSize: 12
  },
  receiptValue: {
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'right'
  },
  successNote: {
    fontSize: 12,
    textAlign: 'center'
  },
  errorContent: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 16
  },
  errorIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16
  }
});

export default MockPaymentModal;
