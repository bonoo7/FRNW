import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';

const { width, height } = Dimensions.get('window');

/**
 * صفحة إجبار تسجيل الدخول - تظهر عندما يريد المطور إجبار المستخدمين على التسجيل
 */
const ForceAuthScreen = () => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, pointerEvents: "none" }}>
        <LinearGradient colors={["#1E40AF", "#3B82F6", "#1E40AF"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, zIndex: 0 }} />
      </View>
      
      <ScrollView contentContainerStyle={styles.container} style={{ zIndex: 1 }}>
        <View style={[styles.card, { backgroundColor: `${theme.colors.background.surface}E6` }]}>
            {/* شعار التطبيق */}
            <View style={{ alignItems: 'center', marginBottom: 30 }}>
              <Image
                source={require('../assets/logo.png')}
                style={{
                  width: 100,
                  height: 100,
                  resizeMode: 'contain',
                  borderRadius: 25,
                }}
              />
              <Text style={[styles.title, { color: theme.colors.text.primary, marginBottom: 0, marginTop: 15 }]}>
                تسجيل الدخول مطلوب
              </Text>
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
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    minHeight: '100%',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: SPACING.lg,
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
