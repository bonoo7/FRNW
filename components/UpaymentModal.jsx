import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import UpaymentService from '../services/UpaymentService';

// استيراد WebView فقط في المنصات المدعومة
let WebView;
if (Platform.OS !== 'web') {
  WebView = require('react-native-webview').WebView;
}

const UpaymentModal = ({ 
  visible, 
  packageData, 
  onClose, 
  onSuccess 
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const paymentWindowRef = React.useRef(null);
  const pollIntervalRef = React.useRef(null);

  // مراقبة نافذة الدفع المنفصلة
  React.useEffect(() => {
    if (Platform.OS === 'web' && paymentWindowRef.current && showConfirm) {
      // التحقق من إغلاق النافذة أو إعادة التوجيه إلى الرابط الصحيح
      pollIntervalRef.current = setInterval(() => {
        try {
          if (!paymentWindowRef.current || paymentWindowRef.current.closed) {
            clearInterval(pollIntervalRef.current);
            // قد تكون النافذة قد أغلقت بعد الدفع الناجح
            setTimeout(() => {
              handlePaymentWindowClosed();
            }, 1000);
          }
        } catch (e) {
          console.error('Error checking payment window:', e);
        }
      }, 500);

      return () => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      };
    }
  }, [showConfirm]);

  const handlePaymentWindowClosed = async () => {
    setShowConfirm(false);
    // بعد إغلاق النافذة، نطلب من المستخدم التأكيد
    Alert.alert(
      'تأكيد الدفع',
      'هل اكتملت عملية الدفع بنجاح؟',
      [
        {
          text: 'لا، حاول مجدداً',
          onPress: () => {
            setShowConfirm(false);
          }
        },
        {
          text: 'نعم، تم الدفع',
          onPress: async () => {
            setLoading(true);
            try {
              await UpaymentService.handlePaymentSuccess(
                currentUser.uid,
                packageData,
                transactionId
              );
              Alert.alert('نجاح', 'تمت عملية الدفع بنجاح وإضافة الرصيد!', [
                { text: 'حسناً', onPress: () => {
                  onSuccess?.(packageData);
                  resetModal();
                }}
              ]);
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ في إضافة الرصيد. يرجى التواصل مع الدعم.');
              console.error(error);
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const startPayment = async () => {
    if (!currentUser) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول أولاً');
      return;
    }

    setLoading(true);
    try {
      const result = await UpaymentService.createPaymentLink({
        amount: packageData.price,
        currency: 'KWD',
        description: `Purchase ${packageData.credits} Credits`
      });

      if (result.success) {
        setTransactionId(result.transactionId);
        
        if (Platform.OS === 'web') {
          // فتح النافذة وتتبعها
          paymentWindowRef.current = window.open(
            result.paymentLink,
            'Upayment Payment',
            'width=600,height=700,menubar=no,toolbar=no'
          );
          
          if (paymentWindowRef.current) {
            setShowConfirm(true);
          } else {
            Alert.alert('خطأ', 'تعذر فتح نافذة الدفع. يرجى السماح بالنوافذ المنبثقة.');
          }
        } else {
          // للهواتف - استخدم WebView
          setPaymentUrl(result.paymentLink);
        }
      }
    } catch (error) {
      Alert.alert('خطأ', error.message || 'فشل في إنشاء رابط الدفع');
    } finally {
      setLoading(false);
    }
  };

  const handleNavigationStateChange = async (navState) => {
    const { url } = navState;
    
    if (url.includes('payment/success')) {
      setPaymentUrl(null);
      setLoading(true);
      
      try {
        await UpaymentService.handlePaymentSuccess(
          currentUser.uid,
          packageData,
          transactionId
        );
        
        Alert.alert('نجاح', 'تمت عملية الدفع بنجاح وإضافة الرصيد!', [
          { text: 'حسناً', onPress: () => {
            onSuccess?.(packageData);
            resetModal();
          }}
        ]);
      } catch (error) {
        Alert.alert('تنبيه', 'تم الدفع ولكن حدث خطأ في إضافة الرصيد.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else if (url.includes('payment/cancel')) {
      setPaymentUrl(null);
      Alert.alert('إلغاء', 'تم إلغاء عملية الدفع');
    }
  };

  const resetModal = () => {
    setShowConfirm(false);
    setTransactionId(null);
    setLoading(false);
    if (paymentWindowRef.current) {
      paymentWindowRef.current.close();
      paymentWindowRef.current = null;
    }
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    onClose();
  };

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
              {paymentUrl ? 'الدفع الإلكتروني' : 'تأكيد الشراء'}
            </Text>
            <View style={{ width: 28 }} />
          </View>

          {Platform.OS === 'web' && showConfirm ? (
            <View style={styles.processingContent}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
              <Text style={[styles.processingText, { color: theme.colors.text.primary }]}>
                جاري معالجة الدفع...
              </Text>
              <Text style={[styles.processingSubText, { color: theme.colors.text.secondary }]}>
                أكمل عملية الدفع في النافذة المنفصلة
              </Text>
            </View>
          ) : Platform.OS !== 'web' && paymentUrl ? (
            <View style={{ flex: 1, height: Dimensions.get('window').height * 0.8 }}>
              {Platform.OS === 'web' ? (
                <iframe
                  ref={iframeRef}
                  src={paymentUrl}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                />
              ) : (
                <WebView
                  source={{ uri: paymentUrl }}
                  onNavigationStateChange={handleNavigationStateChange}
                  startInLoadingState={true}
                  renderLoading={() => (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="large" color={theme.colors.primary} />
                    </View>
                  )}
                />
              )}
            </View>
          ) : (
            <View style={styles.content}>
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
                      {packageData.price.toFixed(3)} د.ك
                    </Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={startPayment}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>الدفع الآن</Text>
                    <MaterialIcons name="payment" size={20} color="#fff" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          )}
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
    height: '90%',
    overflow: 'hidden'
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
    padding: 20,
    flex: 1
  },
  summaryBox: {
    borderRadius: 12,
    padding: 16,
    gap: 16,
    marginBottom: 24
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
  button: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)'
  }
});

export default UpaymentModal;
