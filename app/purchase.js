import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import CreditsService from '../services/creditsService';
import UpaymentModal from '../components/UpaymentModal';

export default function PurchasePage() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [credits, setCredits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  const logoSource = require('../assets/logo.png');

  // باقات الشراء المتاحة (أسعار بالدينار الكويتي KWD)
  const purchasePackages = [
    { id: 'small', credits: 1, price: 0.1, popular: false, icon: 'sports-esports' },
    { id: 'medium', credits: 2, price: 0.15, popular: true, icon: 'star' },
    { id: 'large', credits: 5, price: 0.25, popular: false, icon: 'whatshot' },
    { id: 'unlimited', credits: 20, price: 1.0, popular: false, discount: '50%', icon: 'favorite' }
  ];

  React.useEffect(() => {
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

  const handlePurchase = (packageData) => {
    setSelectedPackage(packageData);
    setShowPayment(true);
  };

  const handlePaymentSuccess = (packageData) => {
    loadCredits();
    setShowPayment(false);
    
    Alert.alert(
      'تمت العملية بنجاح! 🎉',
      `تم إضافة ${packageData.credits} ${packageData.credits === 1 ? 'لعبة' : 'ألعاب'} إلى رصيدك`,
      [
        { 
          text: 'العودة',
          onPress: () => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/');
            }
          }
        }
      ]
    );
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background.primary }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
      {/* رأس الصفحة مع الشعار */}
      <View style={[styles.header, { backgroundColor: theme.colors.background.surface, borderBottomColor: theme.colors.border.primary }]}>
        <TouchableOpacity onPress={handleBackPress}>
          <MaterialIcons name="arrow-back" size={24} color={theme.colors.text.primary} />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Image
            source={logoSource}
            style={styles.headerLogo}
          />
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            شراء ألعاب
          </Text>
        </View>
        
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
        {/* الشعار الرئيسي في أعلى الصفحة */}
        <View style={styles.logoContainer}>
          <Image
            source={logoSource}
            style={styles.mainLogo}
          />
        </View>

        {/* خط فاصل */}
        <View style={[styles.divider, { backgroundColor: theme.colors.border.primary }]} />

        {/* الرصيد الحالي */}
        <View style={[styles.creditsCard, { backgroundColor: theme.colors.background.card }]}>
          <View style={styles.creditsContent}>
            <MaterialIcons name="account-balance-wallet" size={32} color={theme.colors.primary} />
            <View style={styles.creditsInfo}>
              <Text style={[styles.creditsLabel, { color: theme.colors.text.secondary }]}>
                رصيدك الحالي
              </Text>
              <Text style={[styles.creditsValue, { color: theme.colors.text.primary }]}>
                {credits} {credits === 1 ? 'لعبة' : 'ألعاب'}
              </Text>
            </View>
          </View>
        </View>

        {/* الباقات */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          اختر الباقة المناسبة
        </Text>

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

            <View style={styles.packageContent}>
              <View style={styles.packageLeft}>
                <MaterialIcons 
                  name={pkg.icon} 
                  size={40} 
                  color={pkg.popular ? theme.colors.primary : theme.colors.text.secondary} 
                />
              </View>

              <View style={styles.packageMiddle}>
                <Text style={[styles.packageCredits, { color: theme.colors.text.primary }]}>
                  {pkg.credits}
                </Text>
                <Text style={[styles.packageSubtext, { color: theme.colors.text.secondary }]}>
                  {pkg.credits === 1 ? 'لعبة' : 'ألعاب'}
                </Text>
              </View>

              <View style={styles.packageRight}>
                <Text style={[styles.packagePrice, { color: theme.colors.primary }]}>
                  {pkg.price.toFixed(3)} د.ك
                </Text>
                {pkg.discount && (
                  <Text style={[styles.pricePerGame, { color: theme.colors.text.secondary }]}>
                    {(pkg.price / pkg.credits).toFixed(3)} د.ك/لعبة
                  </Text>
                )}
              </View>
            </View>

            <MaterialIcons name="arrow-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        ))}

        {/* معلومات */}
        <View style={[styles.infoBox, { backgroundColor: theme.colors.background.card }]}>
          <MaterialIcons name="info-outline" size={20} color={theme.colors.text.secondary} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            • الألعاب لا تنتهي صلاحيتها{'\n'}
            • منصة دفع آمنة{'\n'}
            • تفعيل فوري
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* نافذة الدفع */}
      <UpaymentModal
        visible={showPayment}
        packageData={selectedPackage}
        onClose={() => setShowPayment(false)}
        onSuccess={handlePaymentSuccess}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 8,
    flexDirection: 'row',
  },
  headerLogo: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    paddingVertical: 20,
  },
  mainLogo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  divider: {
    height: 1,
    marginBottom: 20,
  },
  creditsCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  creditsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  creditsInfo: {
    flex: 1,
  },
  creditsLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  creditsValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 8,
  },
  packageCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'relative',
  },
  popularBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  popularText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 10,
  },
  discountText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  packageContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  packageLeft: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  packageMiddle: {
    flex: 1,
  },
  packageCredits: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  packageSubtext: {
    fontSize: 12,
  },
  packageRight: {
    alignItems: 'flex-end',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pricePerGame: {
    fontSize: 11,
  },
  infoBox: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
  },
});
