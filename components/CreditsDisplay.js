import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CreditsService from '../services/creditsService';
import UpaymentModal from './UpaymentModal';

/**
 * مكون عرض وإدارة الرصيد (Credits Display & Purchase)
 */
const CreditsDisplay = ({ onPurchaseComplete }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [purchasing, setPurchasing] = useState(false);

  // باقات الشراء المتاحة (أسعار بالدينار الكويتي KWD)
  const purchasePackages = [
    { id: 'small', credits: 1, price: 0.1, popular: false },
    { id: 'medium', credits: 2, price: 0.15, popular: true, discount: '50%' },
    { id: 'large', credits: 5, price: 0.25, popular: false, discount: '50%' },
    { id: 'unlimited', credits: 20, price: 1.0, popular: false, discount: '50%' }
  ];

  // تحميل الرصيد الحالي
  useEffect(() => {
    loadCredits();
  }, [currentUser]);

  const loadCredits = async () => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const userCredits = await CreditsService.getUserCredits(currentUser.uid);
      setCredits(userCredits);
    } catch (error) {
      console.error('Error loading credits:', error);
    } finally {
      setLoading(false);
    }
  };

  // معالجة الشراء (استخدام Mock Payment)
  const handlePurchase = async (packageData) => {
    setSelectedPackage(packageData);
    setShowPayment(true);
  };

  // معالجة نجاح الدفع
  const handlePaymentSuccess = (packageData) => {
    // تحديث الرصيد
    loadCredits();
    
    // إغلاق النوافذ
    setShowPurchaseModal(false);
    setShowPayment(false);
    
    // استدعاء الـ callback
    onPurchaseComplete?.(credits + packageData.credits);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* عرض الرصيد */}
      <TouchableOpacity
        style={[styles.creditsButton, { backgroundColor: theme.colors.background.card }]}
        onPress={() => setShowPurchaseModal(true)}
      >
        <MaterialIcons name="sports-esports" size={20} color={theme.colors.primary} />
        <Text style={[styles.creditsText, { color: theme.colors.text.primary }]}>
          {credits}
        </Text>
        <MaterialIcons name="add" size={20} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* نافذة الشراء */}
      <Modal
        visible={showPurchaseModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowPurchaseModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background.primary }]}>
            {/* رأس النافذة */}
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
                شراء ألعاب إضافية
              </Text>
              <TouchableOpacity
                onPress={() => setShowPurchaseModal(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color={theme.colors.text.secondary} />
              </TouchableOpacity>
            </View>

            {/* عرض الرصيد الحالي */}
            <View style={[styles.currentCreditsBox, { backgroundColor: theme.colors.background.card }]}>
              <MaterialIcons name="account-balance-wallet" size={32} color={theme.colors.primary} />
              <View style={styles.currentCreditsInfo}>
                <Text style={[styles.currentCreditsLabel, { color: theme.colors.text.secondary }]}>
                  رصيدك الحالي
                </Text>
                <Text style={[styles.currentCreditsValue, { color: theme.colors.text.primary }]}>
                  {credits} {credits === 1 ? 'لعبة' : 'ألعاب'}
                </Text>
              </View>
            </View>

            {/* باقات الشراء */}
            <ScrollView style={styles.packagesContainer}>
              {purchasePackages.map((pkg) => (
                <TouchableOpacity
                  key={pkg.id}
                  style={[
                    styles.packageCard,
                    { 
                      backgroundColor: theme.colors.background.card,
                      borderColor: pkg.popular ? theme.colors.primary : theme.colors.border.primary,
                      borderWidth: pkg.popular ? 2 : 1
                    }
                  ]}
                  onPress={() => handlePurchase(pkg)}
                  disabled={purchasing}
                >
                  {pkg.popular && (
                    <View style={[styles.popularBadge, { backgroundColor: theme.colors.primary }]}>
                      <Text style={styles.popularText}>الأكثر شعبية</Text>
                    </View>
                  )}
                  
                  {pkg.discount && (
                    <View style={[styles.discountBadge, { backgroundColor: theme.colors.accent }]}>
                      <Text style={styles.discountText}>وفر {pkg.discount}</Text>
                    </View>
                  )}

                  <View style={styles.packageInfo}>
                    <MaterialIcons 
                      name="sports-esports" 
                      size={40} 
                      color={pkg.popular ? theme.colors.primary : theme.colors.text.secondary} 
                    />
                    <View style={styles.packageDetails}>
                      <Text style={[styles.packageCredits, { color: theme.colors.text.primary }]}>
                        {pkg.credits} {pkg.credits === 1 ? 'لعبة' : 'ألعاب'}
                      </Text>
                      <Text style={[styles.packagePrice, { color: theme.colors.primary }]}>
                        {pkg.price.toFixed(3)} د.ك
                      </Text>
                      {pkg.discount && (
                        <Text style={[styles.packagePerGame, { color: theme.colors.text.secondary }]}>
                          {(pkg.price / pkg.credits).toFixed(3)} د.ك لكل لعبة
                        </Text>
                      )}
                    </View>
                  </View>

                  {purchasing ? (
                    <ActivityIndicator size="small" color={theme.colors.primary} />
                  ) : (
                    <MaterialIcons name="arrow-forward" size={24} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* معلومات إضافية */}
            <View style={[styles.infoBox, { backgroundColor: theme.colors.background.card }]}>
              <MaterialIcons name="info-outline" size={20} color={theme.colors.text.secondary} />
              <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
                • الألعاب لا تنتهي صلاحيتها أبداً{'\n'}
                • يمكنك اللعب في أي وقت{'\n'}
                • منصة دفع تجريبية آمنة
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* نافذة الدفع */}
      <UpaymentModal
        visible={showPayment}
        packageData={selectedPackage}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  loadingContainer: {
    padding: 8
  },
  creditsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6
  },
  creditsText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end'
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '90%'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  closeButton: {
    padding: 8
  },
  currentCreditsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 12
  },
  currentCreditsInfo: {
    flex: 1
  },
  currentCreditsLabel: {
    fontSize: 14,
    marginBottom: 4
  },
  currentCreditsValue: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  packagesContainer: {
    maxHeight: 400
  },
  packageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    position: 'relative'
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  popularText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  discountBadge: {
    position: 'absolute',
    top: -8,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  packageInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  },
  packageDetails: {
    flex: 1
  },
  packageCredits: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4
  },
  packagePrice: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  packagePerGame: {
    fontSize: 12,
    marginTop: 2
  },
  infoBox: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    gap: 8
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18
  }
});

export default CreditsDisplay;
