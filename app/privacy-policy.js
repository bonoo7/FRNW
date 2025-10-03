import React from 'react';
import { ScrollView, View, Text, StyleSheet, ImageBackground, TouchableOpacity } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from '../components/BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';
import { useRouter } from 'expo-router';

// مكون الحاوية المشابه للشاشة الرئيسية
const ContainerBackground = ({ style, children }) => {
  const { theme } = useTheme();
  const imageSource = theme?.colors?.background?.containerImage;

  // استخراج borderRadius وباقي الأنماط من style
  const flatStyle = StyleSheet.flatten(style || {});
  const { borderRadius, ...restStyle } = flatStyle;

  // نمط الحاوية الخارجية (للقص والحواف الدائرية)
  const wrapperStyle = {
    ...restStyle,
    borderRadius: borderRadius || 16, // استخدام حواف دائرية بشكل افتراضي
    overflow: 'hidden', // ضروري لقص صورة الخلفية
    position: 'relative', // ضروري لتحديد موضع العناصر المطلقة
  };

  // نمط الخلفية الموحدة
  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.background?.card || 
                    theme.colors.background?.light || 
                    theme.colors.secondary || 
                    '#A0C6FF', // احتياطي في حال عدم وجود الألوان
    borderWidth: 1.5,
    borderColor: theme.currentTheme === 'dark' ? 
                theme.colors.shadow?.color || '#8B5CF6' : 
                theme.colors.primary || '#1E40AF',
    opacity: 0.9, // جعل الخلفية شبه شفافة
  };

  return (
    <View style={wrapperStyle}>
      {/* خلفية موحدة بلون الثيم */}
      <View style={backgroundStyle} />
      
      {/* صورة الخلفية (إذا كانت موجودة) */}
      {imageSource && (
        <ImageBackground
          source={imageSource}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.2, // تقليل الشفافية لتظهر الخلفية الملونة
          }}
          imageStyle={{ opacity: 0.5 }}
          resizeMode="cover"
        />
      )}
      
      {/* عرض المحتوى فوق الخلفية */}
      {children}
    </View>
  );
};

export default function PrivacyPolicy() {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const router = useRouter();

  return (
    <BackgroundPattern style={styles.container}>
      <View style={styles.innerContainer}>
        <ContainerBackground style={styles.contentWrapper}>
          <ScrollView contentContainerStyle={styles.contentContainer}>
            <Text style={styles.title}>سياسة الخصوصية</Text>

            <Text style={styles.sectionTitle}>1. المعلومات التي نجمعها</Text>
            <Text style={styles.text}>لا نجمع أي معلومات تعريفية (لا بريد إلكتروني، لا اسم، لا رقم هاتف). بياناتك جميعها تخزن محليًا على جهازك دون إرسال للخادم.</Text>

            <Text style={styles.sectionTitle}>2. البيانات التقنية (اختياري)</Text>
            <Text style={styles.text}>قد نجمع معلومات تقنية مجهولة مثل إصدار التطبيق ونوع الجهاز لتحسين الأداء وجودة التطبيق، دون ربطها بهويتك.</Text>

            <Text style={styles.sectionTitle}>3. الأمان</Text>
            <Text style={styles.text}>جميع العمليات داخل التطبيق تتم محليًا دون إرسال بياناتك. لا يحتاج التطبيق لأي أذونات خاصة.</Text>

            <Text style={styles.sectionTitle}>4. حقوقك</Text>
            <Text style={styles.text}>يمكنك مسح بيانات التطبيق في إعدادات جهازك لإعادة ضبط كل شيء في أي وقت.</Text>

            <Text style={styles.sectionTitle}>5. التواصل</Text>
            <Text style={styles.text}>للاستفسارات حول الخصوصية: diwandevlab@gmail.com</Text>

            <Text style={styles.title}>Privacy Policy</Text>

            <Text style={styles.sectionTitle}>1. What We Collect</Text>
            <Text style={styles.text}>No personal identifiers (no email, name, or phone number). All your data remains local on your device and is never sent to any server.</Text>

            <Text style={styles.sectionTitle}>2. Technical Data (Optional)</Text>
            <Text style={styles.text}>We may collect anonymous technical metrics (app version, device model) solely to improve performance and app quality, without linking to your identity.</Text>

            <Text style={styles.sectionTitle}>3. Security</Text>
            <Text style={styles.text}>All operations run entirely on your device without transmitting personal data. No special permissions are required.</Text>

            <Text style={styles.sectionTitle}>4. Your Rights</Text>
            <Text style={styles.text}>You can clear the app's local data via your device settings at any time to reset everything.</Text>

            <Text style={styles.sectionTitle}>5. Contact</Text>
            <Text style={styles.text}>For privacy inquiries: diwandevlab@gmail.com</Text>

            <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}> 
              <Text style={styles.backButtonText}>العودة للرئيسية</Text>
            </TouchableOpacity>
          </ScrollView>
        </ContainerBackground>
      </View>
    </BackgroundPattern>
  );
}

const getStyles = (theme) =>
  StyleSheet.create({
    container: { 
      flex: 1,
    },
    innerContainer: {
      flex: 1,
      width: '90%',
      alignSelf: 'center',
      paddingVertical: SPACING.md,
    },
    contentWrapper: {
      flex: 1,
      borderRadius: 16,
      overflow: 'hidden',
    },
    contentContainer: { 
      padding: SPACING.md,
      paddingBottom: SPACING.xl,
    },
    title: {
      fontSize: FONTS.sizes.h3,
      fontWeight: FONTS.weights.bold,
      color: theme.colors.text,
      marginBottom: SPACING.sm,
      textAlign: 'center',
      fontFamily: FONTS.families.secondary || 'sans-serif',
    },
    sectionTitle: {
      fontSize: FONTS.sizes.h5,
      fontWeight: FONTS.weights.semiBold,
      color: theme.colors.text,
      marginTop: SPACING.sm,
      marginBottom: SPACING.xxs,
      fontFamily: FONTS.families.secondary || 'sans-serif',
    },
    text: {
      fontSize: FONTS.sizes.body,
      color: theme.colors.text,
      marginBottom: SPACING.sm,
      lineHeight: FONTS.sizes.body * 1.3,
      fontFamily: FONTS.families.secondary || 'sans-serif',
    },
    backButton: {
      marginTop: SPACING.md,
      paddingVertical: SPACING.sm,
      paddingHorizontal: SPACING.md,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignSelf: 'center',
    },
    backButtonText: {
      color: '#fff',
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      textAlign: 'center',
    },
  });
