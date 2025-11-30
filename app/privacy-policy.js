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
            <Text style={styles.lastUpdated}>آخر تحديث: 30 نوفمبر 2025</Text>

            <Text style={styles.sectionTitle}>1. مقدمة</Text>
            <Text style={styles.text}>نحن في تطبيق "فكّر" نحترم خصوصيتك ونلتزم بحماية بياناتك الشخصية. توضح هذه السياسة كيفية تعاملنا مع معلوماتك.</Text>

            <Text style={styles.sectionTitle}>2. البيانات التي نجمعها</Text>
            <Text style={styles.text}>• معلومات الحساب: البريد الإلكتروني والاسم (عند إنشاء حساب فقط){'\n'}• بيانات اللعب: النقاط، الألعاب المحفوظة، الإحصائيات{'\n'}• بيانات تقنية مجهولة: نوع الجهاز، إصدار التطبيق (لتحسين الأداء)</Text>

            <Text style={styles.sectionTitle}>3. كيف نستخدم بياناتك</Text>
            <Text style={styles.text}>• حفظ تقدمك في اللعبة ومزامنته بين أجهزتك{'\n'}• تحسين تجربة المستخدم وأداء التطبيق{'\n'}• إرسال إشعارات مهمة (اختياري){'\n'}• لا نبيع أو نشارك بياناتك مع أطراف ثالثة</Text>

            <Text style={styles.sectionTitle}>4. تخزين البيانات</Text>
            <Text style={styles.text}>• بيانات اللعب تُخزن محلياً على جهازك وفي Firebase السحابي{'\n'}• نستخدم تشفير SSL لحماية البيانات أثناء النقل{'\n'}• يمكنك اللعب كضيف بدون حساب (البيانات محلية فقط)</Text>

            <Text style={styles.sectionTitle}>5. حقوقك</Text>
            <Text style={styles.text}>• حذف حسابك وبياناتك في أي وقت من الإعدادات{'\n'}• مسح البيانات المحلية من إعدادات جهازك{'\n'}• طلب نسخة من بياناتك عبر التواصل معنا</Text>

            <Text style={styles.sectionTitle}>6. أمان البيانات</Text>
            <Text style={styles.text}>• قواعد Firestore صارمة تمنع الوصول غير المصرح{'\n'}• لا نطلب أذونات غير ضرورية{'\n'}• تحديثات أمنية مستمرة</Text>

            <Text style={styles.sectionTitle}>7. التواصل</Text>
            <Text style={styles.text}>للاستفسارات حول الخصوصية:{'\n'}البريد: diwandevlab@gmail.com</Text>

            <View style={styles.divider} />

            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last Updated: November 30, 2025</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>At "Fakker" app, we respect your privacy and are committed to protecting your personal data. This policy explains how we handle your information.</Text>

            <Text style={styles.sectionTitle}>2. Data We Collect</Text>
            <Text style={styles.text}>• Account info: Email and name (only when creating an account){'\n'}• Game data: Points, saved games, statistics{'\n'}• Anonymous technical data: Device type, app version (for performance improvement)</Text>

            <Text style={styles.sectionTitle}>3. How We Use Your Data</Text>
            <Text style={styles.text}>• Save your game progress and sync across devices{'\n'}• Improve user experience and app performance{'\n'}• Send important notifications (optional){'\n'}• We do not sell or share your data with third parties</Text>

            <Text style={styles.sectionTitle}>4. Data Storage</Text>
            <Text style={styles.text}>• Game data is stored locally and in Firebase cloud{'\n'}• We use SSL encryption to protect data in transit{'\n'}• You can play as guest without an account (local data only)</Text>

            <Text style={styles.sectionTitle}>5. Your Rights</Text>
            <Text style={styles.text}>• Delete your account and data anytime from settings{'\n'}• Clear local data from device settings{'\n'}• Request a copy of your data by contacting us</Text>

            <Text style={styles.sectionTitle}>6. Data Security</Text>
            <Text style={styles.text}>• Strict Firestore rules prevent unauthorized access{'\n'}• We don't request unnecessary permissions{'\n'}• Continuous security updates</Text>

            <Text style={styles.sectionTitle}>7. Contact</Text>
            <Text style={styles.text}>For privacy inquiries:{'\n'}Email: diwandevlab@gmail.com</Text>

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
    lastUpdated: {
      fontSize: FONTS.sizes.xs,
      color: theme.colors.text?.secondary || '#666',
      textAlign: 'center',
      marginBottom: SPACING.md,
      fontFamily: FONTS.families.secondary || 'sans-serif',
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border?.primary || '#CCC',
      marginVertical: SPACING.lg,
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
