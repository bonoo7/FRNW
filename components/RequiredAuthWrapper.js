import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
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
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
          <LinearGradient colors={["#1E40AF", "#3B82F6", "#1E40AF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }} />
        </View>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            جاري التحميل...
          </Text>
        </View>
      </View>
    );
  }

  // إذا لم يكن المستخدم مسجل دخول
  if (!currentUser) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000" }}>
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
          <LinearGradient colors={["#1E40AF", "#3B82F6", "#1E40AF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }} />
        </View>
        
        <ScrollView contentContainerStyle={styles.centerContainer} style={{ zIndex: 1 }}>
          <View style={[styles.authCard, { backgroundColor: `${theme.colors.background.surface}E6` }]}>
            {/* شعار التطبيق */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <Image
                source={require('../assets/logo.png')}
                style={{
                  width: 80,
                  height: 80,
                  resizeMode: 'contain',
                  borderRadius: 20,
                }}
              />
              <Text style={[styles.title, { color: theme.colors.text.primary, marginBottom: 0, marginTop: 15 }]}>
                {title || 'تسجيل الدخول مطلوب'}
              </Text>
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
            <View style={styles.footer}>
              <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
                التسجيل مجاني وآمن تماماً
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
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


