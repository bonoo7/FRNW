import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
  ScrollView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import StorageService from '../services/storageService';
import { SPACING, FONTS } from '../styles/theme';

/**
 * مكون لإدارة إعدادات المصادقة في التطبيق
 * يسمح للمطورين بتكوين سلوك المصادقة
 */
const AuthSettings = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { currentUser } = useAuth();
  const [settings, setSettings] = useState({
    forceAuthForGame: false,        // إجبار المصادقة للعب
    forceAuthForStatistics: true,   // إجبار المصادقة للإحصائيات
    forceAuthForProfile: true,      // إجبار المصادقة للملف الشخصي
    allowGuestMode: true,           // السماح بوضع الضيف
    saveProgressWithoutAuth: true,  // حفظ التقدم بدون مصادقة
    showAuthPrompts: true,          // إظهار تذكيرات المصادقة
    autoSyncOnLogin: true,          // مزامنة تلقائية عند تسجيل الدخول
  });

  useEffect(() => {
    loadAuthSettings();
  }, []);

  const loadAuthSettings = async () => {
    try {
      const savedSettings = await StorageService.getData('authSettings');
      if (savedSettings) {
        setSettings({ ...settings, ...savedSettings });
      }
    } catch (error) {
      console.error('Error loading auth settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await StorageService.saveData('authSettings', newSettings);
      
      // إظهار تأكيد التغيير
      console.log(`Auth setting ${key} updated to:`, value);
    } catch (error) {
      console.error('Error updating auth setting:', error);
      Alert.alert('خطأ', 'حدث خطأ في حفظ الإعدادات');
    }
  };

  const resetToDefaults = () => {
    Alert.alert(
      'إعادة تعيين الإعدادات',
      'هل تريد إعادة تعيين جميع إعدادات المصادقة للقيم الافتراضية؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'إعادة تعيين',
          style: 'destructive',
          onPress: async () => {
            const defaultSettings = {
              forceAuthForGame: false,
              forceAuthForStatistics: true,
              forceAuthForProfile: true,
              allowGuestMode: true,
              saveProgressWithoutAuth: true,
              showAuthPrompts: true,
              autoSyncOnLogin: true,
            };
            setSettings(defaultSettings);
            await StorageService.saveData('authSettings', defaultSettings);
          }
        }
      ]
    );
  };

  const SettingItem = ({ title, description, value, onToggle, icon, warning = false }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.colors.border?.primary }]}>
      <View style={styles.settingHeader}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={warning ? theme.colors.warning : theme.colors.primary} 
        />
        <View style={styles.settingInfo}>
          <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
            {title}
          </Text>
          <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
            {description}
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={value ? '#ffffff' : '#f4f3f4'}
        />
      </View>
      {warning && (
        <View style={styles.warningContainer}>
          <MaterialIcons name="warning" size={16} color={theme.colors.warning} />
          <Text style={[styles.warningText, { color: theme.colors.warning }]}>
            هذا الإعداد قد يؤثر على تجربة المستخدم
          </Text>
        </View>
      )}
    </View>
  );

  if (!visible) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background.primary }]}>
      <ScrollView style={styles.scrollContainer}>
        {/* الهيدر */}
        <View style={[styles.header, { backgroundColor: theme.colors.background.surface }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
            إعدادات المصادقة
          </Text>
          <TouchableOpacity onPress={resetToDefaults} style={styles.resetButton}>
            <MaterialIcons name="refresh" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* معلومات المستخدم الحالي */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            الحالة الحالية
          </Text>
          <View style={styles.statusItem}>
            <MaterialIcons 
              name={currentUser ? "account-circle" : "person-outline"} 
              size={24} 
              color={currentUser ? theme.colors.success : theme.colors.text.secondary} 
            />
            <Text style={[styles.statusText, { color: theme.colors.text.primary }]}>
              {currentUser ? `مسجل دخول: ${currentUser.email}` : 'غير مسجل دخول (ضيف)'}
            </Text>
          </View>
        </View>

        {/* إعدادات اللعبة */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            إعدادات اللعبة
          </Text>
          
          <SettingItem
            title="إجبار المصادقة للعب"
            description="المستخدمون يجب أن يسجلوا دخول قبل بدء أي لعبة"
            value={settings.forceAuthForGame}
            onToggle={(value) => updateSetting('forceAuthForGame', value)}
            icon="gamepad"
            warning={true}
          />
          
          <SettingItem
            title="السماح بوضع الضيف"
            description="المستخدمون يمكنهم اللعب بدون تسجيل دخول"
            value={settings.allowGuestMode}
            onToggle={(value) => updateSetting('allowGuestMode', value)}
            icon="person-outline"
          />
          
          <SettingItem
            title="حفظ التقدم بدون مصادقة"
            description="حفظ نتائج الألعاب محلياً حتى للضيوف"
            value={settings.saveProgressWithoutAuth}
            onToggle={(value) => updateSetting('saveProgressWithoutAuth', value)}
            icon="save"
          />
        </View>

        {/* إعدادات الميزات */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            إعدادات الميزات
          </Text>
          
          <SettingItem
            title="إجبار المصادقة للإحصائيات"
            description="المستخدمون يجب أن يسجلوا دخول لعرض الإحصائيات"
            value={settings.forceAuthForStatistics}
            onToggle={(value) => updateSetting('forceAuthForStatistics', value)}
            icon="bar-chart"
          />
          
          <SettingItem
            title="إجبار المصادقة للملف الشخصي"
            description="المستخدمون يجب أن يسجلوا دخول لعرض الملف الشخصي"
            value={settings.forceAuthForProfile}
            onToggle={(value) => updateSetting('forceAuthForProfile', value)}
            icon="person"
          />
        </View>

        {/* إعدادات التفاعل */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            إعدادات التفاعل
          </Text>
          
          <SettingItem
            title="إظهار تذكيرات المصادقة"
            description="إظهار رسائل تشجيعية لتسجيل الدخول"
            value={settings.showAuthPrompts}
            onToggle={(value) => updateSetting('showAuthPrompts', value)}
            icon="notifications"
          />
          
          <SettingItem
            title="المزامنة التلقائية عند تسجيل الدخول"
            description="مزامنة البيانات المحلية عند تسجيل الدخول"
            value={settings.autoSyncOnLogin}
            onToggle={(value) => updateSetting('autoSyncOnLogin', value)}
            icon="sync"
          />
        </View>

        {/* معلومات إضافية */}
        <View style={[styles.infoSection, { backgroundColor: theme.colors.background.surface }]}>
          <MaterialIcons name="info" size={24} color={theme.colors.primary} />
          <Text style={[styles.infoText, { color: theme.colors.text.secondary }]}>
            هذه الإعدادات تؤثر على سلوك التطبيق بالكامل. تأكد من اختبار التغييرات قبل نشر التطبيق.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  closeButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  resetButton: {
    padding: SPACING.sm,
  },
  section: {
    marginVertical: SPACING.sm,
    marginHorizontal: SPACING.md,
    borderRadius: 12,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    fontFamily: FONTS.bold,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.sm,
  },
  statusText: {
    fontSize: 16,
    marginRight: SPACING.sm,
    fontFamily: FONTS.medium,
  },
  settingItem: {
    marginBottom: SPACING.md,
    borderBottomWidth: 0.5,
    paddingBottom: SPACING.md,
  },
  settingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    marginHorizontal: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: FONTS.bold,
  },
  settingDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
    paddingHorizontal: SPACING.md,
  },
  warningText: {
    fontSize: 12,
    marginRight: SPACING.sm,
    fontFamily: FONTS.regular,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    margin: SPACING.md,
    padding: SPACING.lg,
    borderRadius: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginRight: SPACING.sm,
    fontFamily: FONTS.regular,
  },
});

export default AuthSettings;