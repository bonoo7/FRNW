import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { SPACING, FONTS } from '../styles/theme';
import CreditsService from '../services/creditsService';

/**
 * مكون موحد يدمج معلومات المستخدم مع عدد الألعاب المتبقية
 * في واجهة احترافية سهلة الاستخدام
 */
const IntegratedUserProfile = ({ style, onPressCredits }) => {
  const { theme } = useTheme();
  const { currentUser, userProfile, logout } = useAuth();
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [credits, setCredits] = useState(0);
  const [creditsLoading, setCreditsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadCredits();
      // تحديث الرصيد كل 5 ثوانٍ
      const interval = setInterval(loadCredits, 5000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const loadCredits = async () => {
    try {
      const userCredits = await CreditsService.getUserCredits(currentUser.uid);
      setCredits(userCredits);
    } catch (error) {
      console.error('Error loading credits:', error);
      setCredits(0);
    } finally {
      setCreditsLoading(false);
    }
  };


  const handleSettingsPress = () => {
    setIsMenuVisible(false);
    router.push('/settings');
  };

  const handleLogout = async () => {
    setIsMenuVisible(false);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const handleLoginPress = () => {
    setIsMenuVisible(false);
    router.push('/auth');
  };

  const MenuItem = ({ icon, title, onPress, color = theme.colors.text.primary }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border?.primary }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  if (!currentUser) {
    return (
      <View style={[styles.container, style]}>
        <TouchableOpacity
          onPress={() => setIsMenuVisible(true)}
          style={[styles.userButton, { backgroundColor: `${theme.colors.background.surface}E6` }]}
        >
          <MaterialIcons name="account-circle" size={32} color={theme.colors.text.secondary} />
          <Text style={[styles.guestText, { color: theme.colors.text.primary }]}>
            ضيف
          </Text>
          <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.text.secondary} />
        </TouchableOpacity>

        <Modal
          visible={isMenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <Pressable
            style={styles.modalOverlay}
            onPress={() => setIsMenuVisible(false)}
          >
            <View
              style={[
                styles.menuContainer,
                {
                  backgroundColor: theme.colors.background.surface,
                  borderColor: theme.colors.border?.primary,
                  position: 'absolute',
                  top: Platform.OS === 'web' ? 70 : 100,
                  right: 20,
                  left: undefined,
                }
              ]}
            >
              <MenuItem
                icon="login"
                title="تسجيل الدخول"
                onPress={handleLoginPress}
                color={theme.colors.primary}
              />
              <MenuItem
                icon="person-add"
                title="إنشاء حساب"
                onPress={handleLoginPress}
              />
              <MenuItem
                icon="settings"
                title="الإعدادات"
                onPress={handleSettingsPress}
              />
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setIsMenuVisible(true)}
        style={{
          backgroundColor: theme.colors.button?.primary || theme.colors.primary,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 10,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          shadowColor: theme.colors.button?.primary || theme.colors.primary,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{
            uri: currentUser.photoURL || 
                 `https://via.placeholder.com/40/${(theme.colors.button?.primary || theme.colors.primary).replace('#', '')}/FFFFFF?text=${(userProfile?.displayName?.charAt(0) || 'U')}`
          }}
          style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.5)'
          }}
        />
        
        <Text style={{
          fontSize: 13,
          color: theme.colors.button?.text || '#FFF',
          fontFamily: FONTS.families.secondary,
          fontWeight: 'bold',
          maxWidth: 100
        }} numberOfLines={1}>
          {userProfile?.displayName || 'مستخدم'}
        </Text>

        {/* قسم الألعاب المتبقية كشارة */}
        <TouchableOpacity
          style={{
            backgroundColor: '#FF6B6B',
            borderRadius: 10,
            paddingHorizontal: 8,
            paddingVertical: 2,
            marginLeft: 4,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4
          }}
          onPress={(e) => {
            e.stopPropagation();
            onPressCredits();
          }}
          activeOpacity={0.7}
        >
          {creditsLoading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <>
              <MaterialIcons name="sports-esports" size={12} color="#FFF" />
              <Text style={{
                fontSize: 12,
                color: '#FFF',
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                {credits}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>

      <Modal
        visible={isMenuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsMenuVisible(false)}
        >
          <View
            style={[
              styles.menuContainer,
              {
                backgroundColor: theme.colors.background.surface,
                borderColor: theme.colors.border?.primary,
                position: 'absolute',
                top: Platform.OS === 'web' ? 70 : 100,
                right: 20,
                left: undefined,
              }
            ]}
          >
            {/* معلومات المستخدم في الأعلى */}
            <View style={[styles.userHeader, { borderBottomColor: theme.colors.border?.primary }]}>
              <Image
                source={{
                  uri: currentUser.photoURL || 
                       `https://via.placeholder.com/48/${theme.colors.primary.replace('#', '')}/FFFFFF?text=${(userProfile?.displayName?.charAt(0) || 'U')}`
                }}
                style={styles.headerAvatar}
              />
              <View style={styles.headerInfo}>
                <Text style={[styles.headerName, { color: theme.colors.text.primary }]}>
                  {userProfile?.displayName || 'مستخدم'}
                </Text>
                <Text style={[styles.headerEmail, { color: theme.colors.text.secondary }]}>
                  {currentUser.email}
                </Text>
              </View>
            </View>

            {/* عرض الرصيد في القائمة */}

            {/* خيارات القائمة */}
            <MenuItem
              icon="settings"
              title="الإعدادات"
              onPress={handleSettingsPress}
            />
            <MenuItem
              icon="logout"
              title="تسجيل الخروج"
              onPress={handleLogout}
              color={theme.colors.error}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  userButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 120,
    maxWidth: 180,
  },
  userButtonLoggedIn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    maxWidth: 280,
    gap: 8,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  creditsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    gap: 4,
    minWidth: 50,
  },
  creditsText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  guestText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    marginRight: 8,
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    minWidth: 240,
    maxWidth: 300,
    overflow: 'hidden',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#E0E0E0',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  headerEmail: {
    fontSize: 12,
    marginTop: 2,
    fontFamily: FONTS.regular,
  },
  creditsInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    gap: 12,
  },
  creditsLabel: {
    fontSize: 11,
    marginBottom: 2,
  },
  creditsValueMenu: {
    fontSize: 14,
    fontWeight: '700',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
    flex: 1,
    fontFamily: FONTS.medium,
    textAlign: 'right',
  },
});

export default IntegratedUserProfile;
