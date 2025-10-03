import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from './BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';

/**
 * AuthGuard - يجبر المستخدم على تسجيل الدخول قبل الوصول للتطبيق
 */
const AuthGuard = ({ children, forceAuth = false }) => {
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

  // إذا كان forceAuth مفعل والمستخدم غير مسجل دخول
  if (forceAuth && !currentUser) {
    return (
      <BackgroundPattern>
        <View style={styles.centerContainer}>
          <View style={[styles.authCard, { backgroundColor: theme.colors.background.surface }]}>
            <MaterialIcons name="security" size={80} color={theme.colors.primary} />
            
            <Text style={[styles.title, { color: theme.colors.text.primary }]}>
              مرحباً بك في تطبيق فكّر
            </Text>
            
            <Text style={[styles.subtitle, { color: theme.colors.text.secondary }]}>
              للاستمتاع بالتجربة الكاملة والحفاظ على تقدمك، يرجى تسجيل الدخول أو إنشاء حساب جديد
            </Text>

            <View style={styles.features}>
              <FeatureItem 
                icon="save" 
                text="حفظ تقدمك في السحابة" 
                theme={theme} 
              />
              <FeatureItem 
                icon="bar-chart" 
                text="تتبع إحصائياتك وإنجازاتك" 
                theme={theme} 
              />
              <FeatureItem 
                icon="sync" 
                text="الوصول من أي جهاز" 
                theme={theme} 
              />
              <FeatureItem 
                icon="group" 
                text="التنافس مع الأصدقاء" 
                theme={theme} 
              />
            </View>

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

            <TouchableOpacity
              style={styles.skipButton}
              onPress={() => {
                // يمكن إضافة منطق للمتابعة كضيف
                // setForceAuth(false) أو navigation لصفحة محدودة
              }}
            >
              <Text style={[styles.skipButtonText, { color: theme.colors.text.secondary }]}>
                المتابعة كضيف (محدود)
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BackgroundPattern>
    );
  }

  // إذا كان المستخدم مسجل دخول أو forceAuth غير مفعل
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
    maxWidth: 400,
    borderRadius: 20,
    padding: SPACING.xl,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
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
    marginBottom: SPACING.sm,
  },
  featureText: {
    fontSize: 14,
    marginRight: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
    width: '100%',
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
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: SPACING.lg,
    width: '100%',
  },
  secondaryButtonText: {
    fontSize: 16,
    marginRight: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  skipButton: {
    paddingVertical: SPACING.sm,
  },
  skipButtonText: {
    fontSize: 14,
    textDecorationLine: 'underline',
    fontFamily: FONTS.regular,
  },
});

export default AuthGuard;