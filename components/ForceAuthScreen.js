import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from './BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';

/**
 * صفحة إجبار تسجيل الدخول - تظهر عندما يريد المطور إجبار المستخدمين على التسجيل
 */
const ForceAuthScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <BackgroundPattern>
      <View style={styles.container}>
        <View style={[styles.card, { backgroundColor: theme.colors.background.surface }]}>
          {/* أيقونة كبيرة */}
          <View style={[styles.iconContainer, { backgroundColor: `${theme.colors.primary}20` }]}>
            <MaterialIcons name="account-circle" size={80} color={theme.colors.primary} />
          </View>
          
          {/* العنوان */}
          <Text style={[styles.title, { color: theme.colors.text.primary }]}>
            تسجيل الدخول مطلوب
          </Text>
          
          {/* الوصف */}
          <Text style={[styles.description, { color: theme.colors.text.secondary }]}>
            للاستمتاع بالتجربة الكاملة لتطبيق فكّر والحفاظ على تقدمك، يرجى تسجيل الدخول أو إنشاء حساب جديد
          </Text>

          {/* المميزات */}
          <View style={styles.benefits}>
            <BenefitItem 
              icon="cloud-upload" 
              title="حفظ تلقائي" 
              description="احفظ تقدمك في السحابة" 
              theme={theme}
            />
            <BenefitItem 
              icon="trending-up" 
              title="إحصائيات متقدمة" 
              description="تتبع أداءك وإنجازاتك" 
              theme={theme}
            />
            <BenefitItem 
              icon="devices" 
              title="متعدد الأجهزة" 
              description="الوصول من أي مكان" 
              theme={theme}
            />
          </View>

          {/* أزرار التفاعل */}
          <View style={styles.buttons}>
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
          </View>

          {/* معلومات إضافية */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.text.secondary }]}>
              التسجيل مجاني وآمن تماماً
            </Text>
            <View style={styles.securityIndicator}>
              <MaterialIcons name="security" size={16} color={theme.colors.success} />
              <Text style={[styles.securityText, { color: theme.colors.success }]}>
                محمي بـ Firebase
              </Text>
            </View>
          </View>
        </View>
      </View>
    </BackgroundPattern>
  );
};

const BenefitItem = ({ icon, title, description, theme }) => (
  <View style={styles.benefitItem}>
    <View style={[styles.benefitIcon, { backgroundColor: `${theme.colors.primary}15` }]}>
      <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
    </View>
    <View style={styles.benefitText}>
      <Text style={[styles.benefitTitle, { color: theme.colors.text.primary }]}>
        {title}
      </Text>
      <Text style={[styles.benefitDescription, { color: theme.colors.text.secondary }]}>
        {description}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  card: {
    width: '100%',
    maxWidth: 450,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    textAlign: 'center',
    fontFamily: FONTS.bold,
  },
  description: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: SPACING.xl,
    fontFamily: FONTS.regular,
  },
  benefits: {
    width: '100%',
    marginBottom: SPACING.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  benefitIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: FONTS.bold,
  },
  benefitDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  buttons: {
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
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 20,
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
  },
  secondaryButtonText: {
    fontSize: 18,
    marginRight: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginBottom: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  securityIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityText: {
    fontSize: 12,
    marginRight: 4,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});

export default ForceAuthScreen;