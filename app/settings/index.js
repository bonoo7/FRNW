import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { ThemeSelector } from '../../components/ThemeSelector';
import BackgroundPattern from '../../components/BackgroundPattern';
import StorageService from '../../services/storageService';
import EnhancedStorageService from '../../services/enhancedStorageService';
import { SPACING, FONTS } from '../../styles/theme';

export default function SettingsPage() {
  const { theme } = useTheme();
  const { currentUser, updateUserProfile } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState({
    rewardsEnabled: true,
    pentaPointsEnabled: true,
    soundEnabled: true,
    notifications: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await StorageService.getSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const updateSetting = async (key, value) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      
      // حفظ الإعدادات
      await EnhancedStorageService.updateSettings(newSettings, currentUser?.uid);
      
      // إذا كان المستخدم مسجل دخول، حدث preferences في البروفايل
      if (currentUser) {
        await updateUserProfile({ 
          preferences: newSettings,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      Alert.alert('خطأ', 'حدث خطأ في حفظ الإعدادات');
    }
  };

  const clearData = () => {
    Alert.alert(
      'مسح البيانات',
      'هل أنت متأكد من مسح جميع البيانات المحلية؟ لا يمكن التراجع عن هذا الإجراء.',
      [
        { text: 'إلغاء', style: 'cancel' },
        {
          text: 'مسح',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await StorageService.clearCurrentGame();
              await StorageService.clearHistory();
              await StorageService.clearStatistics();
              Alert.alert('تم', 'تم مسح البيانات المحلية بنجاح');
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ في مسح البيانات');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const syncData = async () => {
    if (!currentUser) {
      Alert.alert('تسجيل الدخول مطلوب', 'يجب تسجيل الدخول لمزامنة البيانات');
      return;
    }

    try {
      setLoading(true);
      const result = await EnhancedStorageService.syncWithFirebase(currentUser.uid);
      if (result) {
        Alert.alert('تم', 'تم مزامنة البيانات بنجاح');
      } else {
        Alert.alert('خطأ', 'حدث خطأ في المزامنة');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ في مزامنة البيانات');
    } finally {
      setLoading(false);
    }
  };

  const SettingItem = ({ title, description, value, onToggle, type = 'switch' }) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.colors.border?.primary }]}>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
          {title}
        </Text>
        {description && (
          <Text style={[styles.settingDescription, { color: theme.colors.text.secondary }]}>
            {description}
          </Text>
        )}
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onToggle}
          trackColor={{ false: '#767577', true: theme.colors.primary }}
          thumbColor={value ? '#ffffff' : '#f4f3f4'}
        />
      )}
    </View>
  );

  const ActionButton = ({ title, description, onPress, icon, color = theme.colors.primary, destructive = false }) => (
    <TouchableOpacity
      style={[styles.actionButton, { 
        borderColor: destructive ? theme.colors.error : theme.colors.border?.primary 
      }]}
      onPress={onPress}
      disabled={loading}
    >
      <View style={styles.actionInfo}>
        <MaterialIcons 
          name={icon} 
          size={24} 
          color={destructive ? theme.colors.error : color} 
        />
        <View style={styles.actionText}>
          <Text style={[styles.actionTitle, { 
            color: destructive ? theme.colors.error : theme.colors.text.primary 
          }]}>
            {title}
          </Text>
          {description && (
            <Text style={[styles.actionDescription, { color: theme.colors.text.secondary }]}>
              {description}
            </Text>
          )}
        </View>
      </View>
      <MaterialIcons 
        name="chevron-right" 
        size={24} 
        color={theme.colors.text.secondary} 
      />
    </TouchableOpacity>
  );

  return (
    <BackgroundPattern>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: 'الإعدادات',
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
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        {/* قسم الثيم */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            المظهر
          </Text>
          <View style={styles.themeContainer}>
            <Text style={[styles.settingTitle, { color: theme.colors.text.primary }]}>
              اختيار الثيم
            </Text>
            <ThemeSelector />
          </View>
        </View>

        {/* قسم اللعبة */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            إعدادات اللعبة
          </Text>
          
          <SettingItem
            title="نظام المكافآت"
            description="مكافآت إضافية للإجابات السريعة"
            value={settings.rewardsEnabled}
            onToggle={(value) => updateSetting('rewardsEnabled', value)}
          />
          
          <SettingItem
            title="نظام علي وعلى أعدائي"
            description="مضاعفة النقاط ×5 للفريق الأخير"
            value={settings.pentaPointsEnabled}
            onToggle={(value) => updateSetting('pentaPointsEnabled', value)}
          />
          
          <SettingItem
            title="الأصوات"
            description="تشغيل المؤثرات الصوتية"
            value={settings.soundEnabled}
            onToggle={(value) => updateSetting('soundEnabled', value)}
          />
        </View>

        {/* قسم الإشعارات */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            الإشعارات
          </Text>
          
          <SettingItem
            title="الإشعارات"
            description="إشعارات التحديثات والميزات الجديدة"
            value={settings.notifications}
            onToggle={(value) => updateSetting('notifications', value)}
          />
        </View>

        {/* قسم البيانات */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            إدارة البيانات
          </Text>
          
          {currentUser && (
            <ActionButton
              title="مزامنة البيانات"
              description="مزامنة البيانات مع السحابة"
              icon="sync"
              onPress={syncData}
            />
          )}
          
          <ActionButton
            title="مسح البيانات المحلية"
            description="مسح جميع البيانات المحفوظة على الجهاز"
            icon="delete-sweep"
            onPress={clearData}
            destructive={true}
          />
        </View>

        {/* قسم حول التطبيق */}
        <View style={[styles.section, { backgroundColor: theme.colors.background.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
            حول التطبيق
          </Text>
          
          <ActionButton
            title="سياسة الخصوصية"
            description="اقرأ سياسة الخصوصية"
            icon="privacy-tip"
            onPress={() => router.push('/privacy-policy')}
          />
          
          <View style={styles.versionInfo}>
            <Text style={[styles.versionText, { color: theme.colors.text.secondary }]}>
              إصدار التطبيق: 1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
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
  section: {
    borderRadius: 12,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    padding: SPACING.md,
    paddingBottom: 0,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 0.5,
  },
  settingInfo: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  settingDescription: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 0.5,
  },
  actionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionText: {
    marginRight: SPACING.md,
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  actionDescription: {
    fontSize: 14,
    marginTop: 4,
    fontFamily: FONTS.regular,
  },
  versionInfo: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  versionText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
});