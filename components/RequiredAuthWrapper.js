import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from './BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';

/**
 * RequiredAuthWrapper - يجبر المستخدم على تسجيل الدخول
 * يختلف عن AuthGuard في أنه لا يقبل forceAuth كمعطى، بل يجبر المصادقة دائماً
 */
const RequiredAuthWrapper = ({ children, title, message, showGuestOption = false }) => {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // إذا كان التطبيق يحمل
  if (loading) {
    return (
      <BackgroundPattern>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            جاري التحميل...
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول
  if (!currentUser) {
    return (
      <BackgroundPattern>
        <View style={styles.centerContainer}>
          <View style={[styles.authCard, { backgroundColor: theme.colors.background.surface }]}>
            {/* أيقونة القفل */}
            <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}15` }]}>
              <MaterialIcons name="lock" size={64} color={theme.colors.primary} />
            </View>
            
            {/* العنوان المخصص */}
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              {title || 'تسجيل الدخول مطلوب'}
            </Text>
            
            {/* الرسالة المخصصة */}
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              {message || 'للوصول إلى هذه الميزة، يجب تسجيل الدخول أو إنشاء حساب جديد'}
            </Text>

            {/* مميزات التسجيل */}
            <View style={styles.features}>
              <FeatureItem 
                icon="cloud-done" 
                text="حفظ تلقائي للبيانات" 
                theme={theme} 
              />
              <FeatureItem 
                icon="trending-up" 
                text="تتبع التقدم والإحصائيات" 
                theme={theme} 
              />
              <FeatureItem 
                icon="devices" 
                text="المزامنة عبر الأجهزة" 
                theme={theme} 
              />
            </View>

            {/* أزرار التفاعل */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => router.push('/auth')}
              >
                <MaterialIcons name="login" size={24} color="white" />
                <Text style={styles.primaryButtonText}>تسجيل الدخول</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.secondaryButton, { 
                  borderColor: theme.colors.border?.primary || theme.colors.primary 
                }]}
                onPress={() => router.push('/auth')}
              >
                <MaterialIcons name="person-add" size={24} color={theme.colors.text.primary} />
                <Text style={[styles.secondaryButtonText, { color: theme.colors.text.primary }]}>
                  إنشاء حساب جديد
                </Text>
              </TouchableOpacity>

              {/* خيار المتابعة كضيف (اختياري) */}
              {showGuestOption && (
                <TouchableOpacity
                  style={styles.guestButton}
                  onPress={() => router.back()}
                >
                  <Text style={[styles.guestButtonText, { color: theme.colors.text.secondary }]}>
                    العودة
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* مؤشر الأمان */}
            <View style={styles.securityIndicator}>
              <MaterialIcons name="security" size={16} color={theme.colors.success} />
              <Text style={[styles.securityText, { color: theme.colors.success }]}>
                محمي بـ Firebase Authentication
              </Text>
            </View>
          </View>
        </View>
      </BackgroundPattern>
    );
  }

  // إذا كان المستخدم مسجل دخول، عرض المحتوى
  return children;
};

const FeatureItem = ({ icon, text, theme }) => (
  <View style={styles.featureItem}>
    <MaterialIcons name={icon} size={20} color={theme.colors.primary} />
    <Text style={[styles.featureText, { color: theme.colors.text.secondary }]}>
      {text}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    fontSize: 18,
    marginTop: SPACING.md,
    fontFamily: FONTS.medium,
  },
  authCard: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.1,
    shadowRadius: 25,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
  features: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm,
  },
  featureText: {
    fontSize: 14,
    marginRight: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 16,
    marginBottom: SPACING.md,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.lg,
    borderRadius: 16,
    borderWidth: 2,
    marginBottom: SPACING.md,
  },
  secondaryButtonText: {
    fontSize: 16,
    marginRight: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  guestButton: {
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  guestButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: FONTS.regular,
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  securityText: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});

export default RequiredAuthWrapper;