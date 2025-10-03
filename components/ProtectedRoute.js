import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from './BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';

const ProtectedRoute = ({ children, requireAuth = true, fallbackMessage }) => {
  const { currentUser, loading } = useAuth();
  const { theme } = useTheme();
  const router = useRouter();

  // إذا كان التطبيق يحمل معلومات المصادقة
  if (loading) {
    return (
      <BackgroundPattern>
        <View style={styles.centerContainer}>
          <MaterialIcons name="hourglass-empty" size={48} color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            جاري التحميل...
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  // إذا كانت الصفحة تتطلب تسجيل دخول والمستخدم غير مسجل
  if (requireAuth && !currentUser) {
    return (
      <BackgroundPattern>
        <View style={styles.centerContainer}>
          <MaterialIcons name="lock" size={64} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            تسجيل الدخول مطلوب
          </Text>
          <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
            {fallbackMessage || 'يجب تسجيل الدخول للوصول إلى هذه الصفحة'}
          </Text>
          
          <TouchableOpacity
            style={[styles.loginButton, { backgroundColor: theme.colors.primary }]}
            onPress={() => router.push('/auth')}
          >
            <MaterialIcons name="login" size={24} color="white" />
            <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.colors.border?.primary }]}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color={theme.colors.text.primary} />
            <Text style={[styles.backButtonText, { color: theme.colors.text.primary }]}>
              العودة
            </Text>
          </TouchableOpacity>
        </View>
      </BackgroundPattern>
    );
  }

  // إذا كانت الصفحة للضيوف فقط والمستخدم مسجل دخول
  if (!requireAuth && currentUser) {
    return (
      <BackgroundPattern>
        <View style={styles.centerContainer}>
          <MaterialIcons name="person" size={64} color={theme.colors.success} />
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            أنت مسجل دخول بالفعل
          </Text>
          <Text style={[styles.message, { color: theme.colors.text.secondary }]}>
            هذه الصفحة للضيوف فقط
          </Text>
          
          <TouchableOpacity
            style={[styles.backButton, { borderColor: theme.colors.border?.primary }]}
            onPress={() => router.replace('/')}
          >
            <MaterialIcons name="home" size={24} color={theme.colors.text.primary} />
            <Text style={[styles.backButtonText, { color: theme.colors.text.primary }]}>
              الصفحة الرئيسية
            </Text>
          </TouchableOpacity>
        </View>
      </BackgroundPattern>
    );
  }

  // إذا كانت الشروط مستوفية، عرض المحتوى
  return children;
};

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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 24,
    fontFamily: FONTS.regular,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.md,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    borderWidth: 2,
  },
  backButtonText: {
    fontSize: 16,
    marginRight: SPACING.sm,
    fontFamily: FONTS.medium,
  },
});

export default ProtectedRoute;