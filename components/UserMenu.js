import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Image,
  Alert,
  Platform
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'expo-router';
import { SPACING, FONTS } from '../styles/theme';

const UserMenu = ({ style }) => {
  const { theme } = useTheme();
  const { currentUser, userProfile, logout } = useAuth();
  const router = useRouter();
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const handleSettingsPress = () => {
    console.log('Settings pressed');
    setIsMenuVisible(false);
    router.push('/settings');
  };

  const handleLogout = async () => {
    console.log('Logout pressed');
    setIsMenuVisible(false);
    
    try {
      console.log('Logging out...');
      await logout();
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
    }
  };

  const handleLoginPress = () => {
    console.log('Login pressed');
    setIsMenuVisible(false);
    router.push('/auth');
  };

  const MenuItem = ({ icon, title, onPress, color = theme.colors.text.primary }) => (
    <TouchableOpacity
      style={[styles.menuItem, { borderBottomColor: theme.colors.border?.primary }]}
      onPress={() => {
        console.log(`MenuItem ${title} pressed`);
        if (onPress) {
          onPress();
        }
      }}
      activeOpacity={0.7}
    >
      <MaterialIcons name={icon} size={24} color={color} />
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        onPress={() => setIsMenuVisible(true)}
        style={[styles.userButton, { backgroundColor: `${theme.colors.background.surface}E6` }]}
      >
        {currentUser ? (
          <>
            <Image
              source={{
                uri: currentUser.photoURL || 
                     `https://via.placeholder.com/32/${theme.colors.primary.replace('#', '')}/FFFFFF?text=${(userProfile?.displayName?.charAt(0) || 'U')}`
              }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={[styles.userName, { color: theme.colors.text.primary }]} numberOfLines={1}>
                {userProfile?.displayName || 'مستخدم'}
              </Text>
              {userProfile?.statistics?.totalScore > 0 && (
                <Text style={[styles.userScore, { color: theme.colors.text.secondary }]}>
                  {userProfile.statistics.totalScore} نقطة
                </Text>
              )}
            </View>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.text.secondary} />
          </>
        ) : (
          <>
            <MaterialIcons name="account-circle" size={32} color={theme.colors.text.secondary} />
            <Text style={[styles.guestText, { color: theme.colors.text.primary }]}>
              ضيف
            </Text>
            <MaterialIcons name="keyboard-arrow-down" size={20} color={theme.colors.text.secondary} />
          </>
        )}
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
                // تموضع القائمة في الأعلى يسار الشاشة
                position: 'absolute',
                top: Platform.OS === 'web' ? 70 : 100,
                left: 20,
                right: undefined,
              }
            ]}
          >
            {currentUser ? (
              <>
                {/* معلومات المستخدم */}
                <View style={[styles.userHeader, { borderBottomColor: theme.colors.border?.primary }]}>
                  <Image
                    source={{
                      uri: currentUser.photoURL || 
                           `https://via.placeholder.com/48/${theme.colors.primary.replace('#', '')}/FFFFFF?text=${(userProfile?.displayName?.charAt(0) || 'U')}`
                    }}
                    style={styles.headerAvatar}
                  />
                  <View>
                    <Text style={[styles.headerName, { color: theme.colors.text.primary }]}>
                      {userProfile?.displayName || 'مستخدم'}
                    </Text>
                    <Text style={[styles.headerEmail, { color: theme.colors.text.secondary }]}>
                      {currentUser.email}
                    </Text>
                    {userProfile?.statistics?.totalScore > 0 && (
                      <Text style={[styles.headerScore, { color: theme.colors.primary }]}>
                        {userProfile.statistics.totalScore} نقطة إجمالية
                      </Text>
                    )}
                  </View>
                </View>

                {/* خيارات القائمة للمستخدم المسجل */}
                <MenuItem
                  icon="settings"
                  title="الإعدادات"
                  onPress={handleSettingsPress}
                />
                {/* خيار تجريب المصادقة للمطورين */}
                <MenuItem
                  icon="security"
                  title="تجريب المصادقة"
                  onPress={() => {
                    setIsMenuVisible(false);
                    router.push('/auth-demo');
                  }}
                  color={theme.colors.warning}
                />
                <MenuItem
                  icon="logout"
                  title="تسجيل الخروج"
                  onPress={handleLogout}
                  color={theme.colors.error}
                />
              </>
            ) : (
              <>
                {/* خيارات الضيف */}
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
                {/* خيار تجريب المصادقة للضيوف أيضاً */}
                <MenuItem
                  icon="security"
                  title="تجريب المصادقة"
                  onPress={() => {
                    setIsMenuVisible(false);
                    router.push('/auth-demo');
                  }}
                  color={theme.colors.warning}
                />
              </>
            )}
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
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
    backgroundColor: '#E0E0E0',
  },
  userInfo: {
    flex: 1,
    marginRight: 4,
  },
  userName: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  userScore: {
    fontSize: 10,
    fontFamily: FONTS.regular,
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
    minWidth: 220,
    maxWidth: 280,
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
  headerScore: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 0.5,
  },
  menuItemText: {
    fontSize: 16,
    marginRight: 12,
    fontFamily: FONTS.medium,
  },
});

export default UserMenu;