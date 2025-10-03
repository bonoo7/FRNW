import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import BackgroundPattern from '../../components/BackgroundPattern';
import AuthGuard from '../../components/AuthGuard';
import ProtectedRoute from '../../components/ProtectedRoute';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';
import ForceAuthScreen from '../../components/ForceAuthScreen';
import AuthSettings from '../../components/AuthSettings';
import { SPACING, FONTS } from '../../styles/theme';

/**
 * صفحة تجريبية لعرض مختلف مكونات المصادقة
 * مفيدة للمطورين لفهم كيفية عمل كل مكون
 */
export default function AuthDemoPage() {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const router = useRouter();
  const [showSettings, setShowSettings] = useState(false);
  const [demoMode, setDemoMode] = useState(null);

  const DemoCard = ({ title, description, icon, onPress, color = theme.colors.primary }) => (
    <TouchableOpacity
      style={[styles.demoCard, { backgroundColor: theme.colors.background.surface }]}
      onPress={onPress}
    >
      <View style={[styles.cardIcon, { backgroundColor: `${color}15` }]}>
        <MaterialIcons name={icon} size={32} color={color} />
      </View>
      <View style={styles.cardContent}>
        <Text style={[styles.cardTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        <Text style={[styles.cardDescription, { color: theme.colors.text.secondary }]}>
          {description}
        </Text>
      </View>
      <MaterialIcons name="chevron-right" size={24} color={theme.colors.text.secondary} />
    </TouchableOpacity>
  );

  const StatusCard = () => (
    <View style={[styles.statusCard, { backgroundColor: theme.colors.background.surface }]}>
      <View style={styles.statusHeader}>
        <MaterialIcons 
          name={currentUser ? "account-circle" : "person-outline"} 
          size={32} 
          color={currentUser ? theme.colors.success : theme.colors.text.secondary} 
        />
        <View>
          <Text style={[styles.statusTitle, { color: theme.colors.text.primary }]}>
            {currentUser ? 'مسجل دخول' : 'ضيف'}
          </Text>
          <Text style={[styles.statusSubtitle, { color: theme.colors.text.secondary }]}>
            {currentUser ? currentUser.email : 'غير مسجل دخول'}
          </Text>
        </View>
      </View>
      
      {!currentUser && (
        <TouchableOpacity
          style={[styles.loginPrompt, { backgroundColor: theme.colors.primary }]}
          onPress={() => router.push('/auth')}
        >
          <MaterialIcons name="login" size={20} color="white" />
          <Text style={styles.loginPromptText}>تسجيل الدخول</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  // عرض الـ demo modes المختلفة
  if (demoMode === 'authGuard') {
    return (
      <AuthGuard forceAuth={true}>
        <BackgroundPattern>
          <View style={styles.demoContent}>
            <Text style={[styles.demoTitle, { color: theme.colors.text.primary }]}>
              AuthGuard Demo - مع forceAuth=true
            </Text>
            <Text style={[styles.demoText, { color: theme.colors.text.secondary }]}>
              إذا رأيت هذا النص، فأنت مسجل دخول!
            </Text>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDemoMode(null)}
            >
              <Text style={styles.backButtonText}>العودة</Text>
            </TouchableOpacity>
          </View>
        </BackgroundPattern>
      </AuthGuard>
    );
  }

  if (demoMode === 'protectedRoute') {
    return (
      <ProtectedRoute requireAuth={true} fallbackMessage="هذا مثال على ProtectedRoute">
        <BackgroundPattern>
          <View style={styles.demoContent}>
            <Text style={[styles.demoTitle, { color: theme.colors.text.primary }]}>
              ProtectedRoute Demo
            </Text>
            <Text style={[styles.demoText, { color: theme.colors.text.secondary }]}>
              هذا المحتوى محمي بـ ProtectedRoute
            </Text>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDemoMode(null)}
            >
              <Text style={styles.backButtonText}>العودة</Text>
            </TouchableOpacity>
          </View>
        </BackgroundPattern>
      </ProtectedRoute>
    );
  }

  if (demoMode === 'requiredAuth') {
    return (
      <RequiredAuthWrapper 
        title="RequiredAuthWrapper Demo"
        message="هذا مثال على RequiredAuthWrapper مع رسالة مخصصة"
      >
        <BackgroundPattern>
          <View style={styles.demoContent}>
            <Text style={[styles.demoTitle, { color: theme.colors.text.primary }]}>
              RequiredAuthWrapper Demo
            </Text>
            <Text style={[styles.demoText, { color: theme.colors.text.secondary }]}>
              هذا المحتوى يتطلب مصادقة إجبارية
            </Text>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setDemoMode(null)}
            >
              <Text style={styles.backButtonText}>العودة</Text>
            </TouchableOpacity>
          </View>
        </BackgroundPattern>
      </RequiredAuthWrapper>
    );
  }

  if (demoMode === 'forceAuth') {
    return <ForceAuthScreen />;
  }

  // الصفحة الرئيسية للـ demo
  return (
    <BackgroundPattern>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'تجريب مكونات المصادقة',
          headerTitleStyle: {
            color: theme.colors.text.primary,
            fontFamily: FONTS.bold,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingLeft: 16 }}
            >
              <MaterialIcons name="arrow-back" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowSettings(true)}
              style={{ paddingRight: 16 }}
            >
              <MaterialIcons name="settings" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* بطاقة الحالة */}
        <StatusCard />

        {/* العنوان */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          اختبار مكونات المصادقة
        </Text>

        {/* AuthGuard */}
        <DemoCard
          title="AuthGuard"
          description="يسمح أو يمنع الوصول حسب حالة المصادقة"
          icon="security"
          onPress={() => setDemoMode('authGuard')}
          color={theme.colors.primary}
        />

        {/* ProtectedRoute */}
        <DemoCard
          title="ProtectedRoute"
          description="حماية الروتات مع رسائل مخصصة"
          icon="route"
          onPress={() => setDemoMode('protectedRoute')}
          color={theme.colors.success}
        />

        {/* RequiredAuthWrapper */}
        <DemoCard
          title="RequiredAuthWrapper"
          description="إجبار المصادقة مع واجهة جميلة"
          icon="login"
          onPress={() => setDemoMode('requiredAuth')}
          color={theme.colors.warning}
        />

        {/* ForceAuthScreen */}
        <DemoCard
          title="ForceAuthScreen"
          description="شاشة إجبار المصادقة المستقلة"
          icon="lock"
          onPress={() => setDemoMode('forceAuth')}
          color={theme.colors.error}
        />

        {/* صفحات محمية فعلية */}
        <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
          الصفحات المحمية
        </Text>

        <DemoCard
          title="الملف الشخصي"
          description="يستخدم RequiredAuthWrapper"
          icon="person"
          onPress={() => router.push('/profile')}
          color={theme.colors.primary}
        />

        <DemoCard
          title="الإحصائيات"
          description="يستخدم RequiredAuthWrapper"
          icon="bar-chart"
          onPress={() => router.push('/statistics')}
          color={theme.colors.success}
        />

        <DemoCard
          title="اللعبة (محمية)"
          description="يستخدم RequiredAuthWrapper"
          icon="gamepad"
          onPress={() => router.push('/auth-required')}
          color={theme.colors.warning}
        />

        {/* معلومات إضافية */}
        <View style={[styles.infoCard, { backgroundColor: theme.colors.background.surface }]}>
          <MaterialIcons name="info" size={24} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            جرب الدخول والخروج لترى كيف تتصرف المكونات المختلفة. 
            استخدم أيقونة الإعدادات لتخصيص سلوك المصادقة.
          </Text>
        </View>
      </ScrollView>

      {/* مودال الإعدادات */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <AuthSettings
          visible={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </Modal>
    </BackgroundPattern>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingTop: 100, // مساحة للهيدر
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  statusCard: {
    borderRadius: 16,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: SPACING.md,
    fontFamily: FONTS.bold,
  },
  statusSubtitle: {
    fontSize: 14,
    marginRight: SPACING.md,
    fontFamily: FONTS.regular,
  },
  loginPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    borderRadius: 8,
  },
  loginPromptText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.lg,
    marginTop: SPACING.md,
    fontFamily: FONTS.bold,
  },
  demoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.lg,
    borderRadius: 12,
    marginBottom: SPACING.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  cardIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.md,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: FONTS.bold,
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.lg,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginRight: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  demoContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  demoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: SPACING.lg,
    fontFamily: FONTS.bold,
  },
  demoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    fontFamily: FONTS.regular,
  },
  backButton: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 12,
  },
  backButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
});