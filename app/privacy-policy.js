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
            <Text style={styles.lastUpdated}>آخر تحديث: 1 ديسمبر 2025</Text>

            <Text style={styles.sectionTitle}>1. مقدمة</Text>
            <Text style={styles.text}>تقدّر فاكر خصوصيتك وترتزم بحماية بيانات المستخدمين. توضح هذه السياسة كيفية جمع واستخدام ومعالجة معلوماتك الشخصية.</Text>

            <Text style={styles.sectionTitle}>2. البيانات المجمعة</Text>
            <Text style={styles.text}>
{'\n'}2.1 بيانات المصادقة والحساب:{'\n'}• البريد الإلكتروني • كلمة المرور (مشفرة) • اسم المستخدم • صورة الملف الشخصي
{'\n'}2.2 بيانات الألعاب والجلسات:{'\n'}• أسماء الفرق • النقاط والنتائج • الإجابات على الأسئلة • الألعاب المحفوظة
{'\n'}2.3 بيانات الرصيد والمشتريات:{'\n'}• عدد الألعاب المتاحة • سجل المشتريات • معرف فريد للمعاملات • طريقة الدفع (آخر 4 أرقام فقط)
{'\n'}2.4 بيانات الاستخدام:{'\n'}• وقت الوصول والتاريخ • المميزات المستخدمة • نوع الجهاز والنظام
            </Text>

            <Text style={styles.sectionTitle}>3. نظام الدفع الوهمي</Text>
            <Text style={styles.text}>يستخدم التطبيق حالياً نظام دفع وهمي لأغراض الاختبار:{'\n'}• المعاملات وهمية وآمنة 100%{'\n'}• لا توجد عمليات دفع فعلية{'\n'}• جميع البيانات المالية وهمية بحتة{'\n'}• عند الانتقال لدفع حقيقي، ستُحدّث السياسة</Text>

            <Text style={styles.sectionTitle}>4. كيف نستخدم بياناتك</Text>
            <Text style={styles.text}>• إنشاء وإدارة حسابك والمصادقة الآمنة{'\n'}• حفظ تقدم اللعب والجلسات السابقة{'\n'}• إدارة نظام الرصيد والمشتريات{'\n'}• تحسين الخدمة وفهم سلوك المستخدمين{'\n'}• لا نبيع بياناتك مع جهات خارجية</Text>

            <Text style={styles.sectionTitle}>5. تخزين البيانات</Text>
            <Text style={styles.text}>• Firebase Firestore: تخزين البيانات الرئيسية{'\n'}• Firebase Authentication: معالجة المصادقة الآمنة{'\n'}• التخزين المحلي: معلومات مؤقتة على جهازك{'\n'}• التشفير: جميع البيانات مشفرة أثناء النقل والتخزين</Text>

            <Text style={styles.sectionTitle}>6. حقوقك</Text>
            <Text style={styles.text}>• الوصول: الحصول على نسخة من بياناتك الشخصية{'\n'}• التعديل: تحديث معلوماتك في أي وقت{'\n'}• الحذف: طلب حذف حسابك وجميع البيانات المتعلقة{'\n'}• التواصل معنا: privacy@fakker.net</Text>

            <Text style={styles.sectionTitle}>7. الأمان</Text>
            <Text style={styles.text}>نحن نتخذ إجراءات أمنية عديدة:{'\n'}• التشفير الكامل للبيانات{'\n'}• المصادقة القوية والجلسات الآمنة{'\n'}• لا تُعرض الكلمات السرية أبداً{'\n'}• تحديثات أمنية مستمرة</Text>

            <Text style={styles.sectionTitle}>8. التواصل والدعم</Text>
            <Text style={styles.text}>للأسئلة أو الشكاوى:{'\n'}البريد: privacy@fakker.net{'\n'}الدعم: support@fakker.net{'\n'}وقت الرد: خلال 7 أيام عمل</Text>

            <View style={styles.divider} />

            <Text style={styles.title}>Privacy Policy</Text>
            <Text style={styles.lastUpdated}>Last Updated: December 1, 2025</Text>

            <Text style={styles.sectionTitle}>1. Introduction</Text>
            <Text style={styles.text}>Fakker respects your privacy and is committed to protecting your personal data. This policy explains how we collect, use, and process your information.</Text>

            <Text style={styles.sectionTitle}>2. Data We Collect</Text>
            <Text style={styles.text}>
{'\n'}2.1 Authentication and Account Data:{'\n'}• Email • Encrypted Password • Username • Profile Picture
{'\n'}2.2 Games and Sessions Data:{'\n'}• Team Names • Scores and Results • Quiz Answers • Saved Games
{'\n'}2.3 Credits and Purchase Data:{'\n'}• Available Games Balance • Purchase History • Unique Transaction IDs • Payment Method (last 4 digits only)
{'\n'}2.4 Usage Data:{'\n'}• Access Time and Date • Features Used • Device and System Type
            </Text>

            <Text style={styles.sectionTitle}>3. Mock Payment System</Text>
            <Text style={styles.text}>The app currently uses a mock payment system for testing purposes:{'\n'}• All transactions are fake and 100% safe{'\n'}• No real payments are processed{'\n'}• All financial data is dummy data only{'\n'}• Policy will be updated when real payment is implemented</Text>

            <Text style={styles.sectionTitle}>4. How We Use Your Data</Text>
            <Text style={styles.text}>• Create and manage your account with secure authentication{'\n'}• Save your game progress and previous sessions{'\n'}• Manage credits and purchases system{'\n'}• Improve our service and understand user behavior{'\n'}• We never sell your data to third parties</Text>

            <Text style={styles.sectionTitle}>5. Data Storage</Text>
            <Text style={styles.text}>• Firebase Firestore: Main data storage{'\n'}• Firebase Authentication: Secure authentication{'\n'}• Local Storage: Temporary data on your device{'\n'}• Encryption: All data encrypted during transit and storage</Text>

            <Text style={styles.sectionTitle}>6. Your Rights</Text>
            <Text style={styles.text}>• Access: Get a copy of your personal data{'\n'}• Modify: Update your information anytime{'\n'}• Delete: Request account and data deletion{'\n'}• Contact Us: privacy@fakker.net</Text>

            <Text style={styles.sectionTitle}>7. Security</Text>
            <Text style={styles.text}>We take multiple security measures:{'\n'}• Complete data encryption{'\n'}• Strong authentication and secure sessions{'\n'}• Passwords never exposed{'\n'}• Continuous security updates</Text>

            <Text style={styles.sectionTitle}>8. Contact and Support</Text>
            <Text style={styles.text}>For questions or complaints:{'\n'}Email: privacy@fakker.net{'\n'}Support: support@fakker.net{'\n'}Response Time: Within 7 business days</Text>

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
