import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CreditsService from '../services/creditsService';

/**
 * مكون التحقق من الرصيد قبل بدء اللعبة
 * يعرض رسالة تطلب الشراء إذا نفذ الرصيد
 */
const CreditGate = ({ onAllow, onDeny, children }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [checking, setChecking] = useState(false);
  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [remainingCredits, setRemainingCredits] = useState(0);

  /**
   * التحقق من توفر الرصيد ومحاولة بدء اللعبة
   */
  const checkAndConsumeCredit = async () => {
    if (!currentUser) {
      Alert.alert('خطأ', 'يجب تسجيل الدخول للعب');
      onDeny?.();
      return;
    }

    try {
      setChecking(true);

      // محاولة استهلاك رصيد للعبة
      const result = await CreditsService.consumeCreditForGame(currentUser.uid);

      if (result.success) {
        // الرصيد كافٍ، اسمح ببدء اللعبة
        setRemainingCredits(result.remaining);
        
        // عرض رسالة للمستخدم
        Alert.alert(
          'بدء اللعبة 🎮',
          `${result.message}\n\n${result.remaining === 0 ? '⚠️ هذه آخر لعبة متبقية لديك!' : ''}`,
          [
            {
              text: 'ابدأ اللعب!',
              onPress: () => onAllow?.(result)
            }
          ]
        );
      } else {
        // الرصيد غير كافٍ، اعرض نافذة الشراء
        setRemainingCredits(result.remaining);
        setShowInsufficientModal(true);
        onDeny?.();
      }
    } catch (error) {
      console.error('Error checking credits:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء التحقق من الرصيد');
      onDeny?.();
    } finally {
      setChecking(false);
    }
  };

  const handlePurchaseRedirect = () => {
    setShowInsufficientModal(false);
    // يمكن إضافة navigation للانتقال لصفحة الشراء
    // navigation.navigate('PurchaseScreen');
  };

  return (
    <>
      {/* زر بدء اللعبة مع التحقق */}
      <TouchableOpacity
        onPress={checkAndConsumeCredit}
        disabled={checking}
        style={styles.triggerButton}
      >
        {checking ? (
          <ActivityIndicator color="#fff" />
        ) : (
          children || <Text style={styles.triggerButtonText}>ابدأ اللعب</Text>
        )}
      </TouchableOpacity>

      {/* نافذة عدم كفاية الرصيد */}
      <Modal
        visible={showInsufficientModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowInsufficientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background.primary }]}>
            {/* أيقونة */}
            <View style={[styles.iconContainer, { backgroundColor: theme.colors.accent + '20' }]}>
              <MaterialIcons name="block" size={60} color={theme.colors.accent} />
            </View>

            {/* العنوان */}
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              رصيدك غير كافٍ! 😔
            </Text>

            {/* الرسالة */}
            <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
              لقد استخدمت جميع ألعابك المجانية.{'\n'}
              قم بشراء المزيد من الألعاب للمتابعة!
            </Text>

            {/* الرصيد الحالي */}
            <View style={[styles.creditsBox, { backgroundColor: theme.colors.background.card }]}>
              <MaterialIcons name="sports-esports" size={24} color={theme.colors.text.secondary} />
              <Text style={[styles.creditsText, { color: theme.colors.text.primary }]}>
                الرصيد الحالي: {remainingCredits} {remainingCredits === 1 ? 'لعبة' : 'ألعاب'}
              </Text>
            </View>

            {/* الأزرار */}
            <View style={styles.buttonsContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                onPress={handlePurchaseRedirect}
              >
                <MaterialIcons name="shopping-cart" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>شراء ألعاب</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.colors.border.primary }]}
                onPress={() => setShowInsufficientModal(false)}
              >
                <Text style={[styles.secondaryButtonText, { color: theme.colors.text.primary }]}>
                  لاحقاً
                </Text>
              </TouchableOpacity>
            </View>

            {/* معلومات إضافية */}
            <View style={styles.infoContainer}>
              <MaterialIcons name="info-outline" size={16} color={theme.colors.text.secondary} />
              <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                الألعاب المشتراة لا تنتهي صلاحيتها أبداً
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    // يمكن تخصيص الستايل حسب الحاجة
  },
  triggerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center'
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20
  },
  creditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    gap: 8,
    width: '100%'
  },
  creditsText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  buttonsContainer: {
    width: '100%',
    gap: 12
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },
  secondaryButton: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center'
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600'
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6
  },
  infoText: {
    fontSize: 12
  }
});

export default CreditGate;
