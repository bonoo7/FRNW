import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Modal,
  TextInput,
  ActivityIndicator,
  Image
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import FirebaseStorageService from '../services/firebaseStorageService';
import BackgroundPattern from './BackgroundPattern';
import { SPACING, FONTS } from '../styles/theme';

const UserProfile = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userGames, setUserGames] = useState([]);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    if (userProfile && visible) {
      setDisplayName(userProfile.displayName || '');
      loadUserData();
    }
  }, [userProfile, visible]);

  const loadUserData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Load recent games
      const games = await FirebaseStorageService.getUserGames(currentUser.uid, 'all', 10);
      setUserGames(games);

      // Load achievements
      const userAchievements = Object.entries(userProfile?.achievements || {})
        .filter(([_, achieved]) => achieved)
        .map(([key]) => ({
          id: key,
          name: FirebaseStorageService.getAchievementName(key),
          description: FirebaseStorageService.getAchievementDescription(key)
        }));
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('خطأ', 'يرجى إدخال الاسم');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({ displayName: displayName.trim() });
      setEditMode(false);
      Alert.alert('نجح', 'تم تحديث الملف الشخصي بنجاح');
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء تحديث الملف الشخصي');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'تسجيل الخروج',
      'هل أنت متأكد من تسجيل الخروج؟',
      [
        { text: 'إلغاء', style: 'cancel' },
        { 
          text: 'تسجيل الخروج', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              onClose();
            } catch (error) {
              Alert.alert('خطأ', 'حدث خطأ أثناء تسجيل الخروج');
            }
          }
        }
      ]
    );
  };

  const StatCard = ({ title, value, icon }) => (
    <View style={[styles.statCard, { backgroundColor: theme.colors.background.surface }]}>
      <MaterialIcons name={icon} size={24} color={theme.colors.primary} />
      <Text style={[styles.statValue, { color: theme.colors.text.primary }]}>{value}</Text>
      <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>{title}</Text>
    </View>
  );

  const AchievementCard = ({ achievement }) => (
    <View style={[styles.achievementCard, { backgroundColor: theme.colors.background.surface }]}>
      <MaterialIcons name="stars" size={24} color="#FFD700" />
      <View style={styles.achievementText}>
        <Text style={[styles.achievementName, { color: theme.colors.text.primary }]}>
          {achievement.name}
        </Text>
        <Text style={[styles.achievementDesc, { color: theme.colors.text.secondary }]}>
          {achievement.description}
        </Text>
      </View>
    </View>
  );

  if (!userProfile) return null;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <BackgroundPattern>
        <View style={[styles.container, { backgroundColor: 'transparent' }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.colors.background.surface }]}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={theme.colors.text.primary} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text.primary }]}>
              الملف الشخصي
            </Text>
            <TouchableOpacity onPress={() => setEditMode(!editMode)} style={styles.editButton}>
              <MaterialIcons 
                name={editMode ? "check" : "edit"} 
                size={24} 
                color={theme.colors.primary} 
              />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Profile Info */}
            <View style={[styles.profileSection, { backgroundColor: theme.colors.background.surface }]}>
              <Image 
                source={{ uri: currentUser?.photoURL || 'https://via.placeholder.com/80' }} 
                style={styles.avatar}
              />
              
              {editMode ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    style={[styles.nameInput, { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border?.primary || theme.colors.primary
                    }]}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="الاسم"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                  <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: theme.colors.primary }]}
                    onPress={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text style={styles.saveButtonText}>حفظ</Text>
                    )}
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={[styles.displayName, { color: theme.colors.text.primary }]}>
                  {userProfile.displayName || 'مستخدم جديد'}
                </Text>
              )}
              
              <Text style={[styles.email, { color: theme.colors.text.secondary }]}>
                {currentUser?.email}
              </Text>
            </View>

            {/* Statistics */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                الإحصائيات
              </Text>
              <View style={styles.statsGrid}>
                <StatCard 
                  title="الألعاب" 
                  value={userProfile.statistics?.totalGames || 0}
                  icon="sports-esports"
                />
                <StatCard 
                  title="النقاط الإجمالية" 
                  value={userProfile.statistics?.totalScore || 0}
                  icon="star"
                />
                <StatCard 
                  title="الإجابات الصحيحة" 
                  value={userProfile.statistics?.totalCorrectAnswers || 0}
                  icon="check-circle"
                />
                <StatCard 
                  title="معدل النقاط" 
                  value={userProfile.statistics?.averageScore || 0}
                  icon="trending-up"
                />
              </View>
            </View>

            {/* Achievements */}
            {achievements.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  الإنجازات ({achievements.length})
                </Text>
                {achievements.map((achievement, index) => (
                  <AchievementCard key={index} achievement={achievement} />
                ))}
              </View>
            )}

            {/* Favorite Categories */}
            {userProfile.statistics?.favoriteCategories?.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  الفئات المفضلة
                </Text>
                {userProfile.statistics.favoriteCategories.slice(0, 5).map((category, index) => (
                  <View key={index} style={[styles.categoryCard, { backgroundColor: theme.colors.background.surface }]}>
                    <Text style={[styles.categoryName, { color: theme.colors.text.primary }]}>
                      {category.name}
                    </Text>
                    <Text style={[styles.categoryCount, { color: theme.colors.text.secondary }]}>
                      {category.count} لعبة
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Recent Games */}
            {userGames.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  الألعاب الأخيرة
                </Text>
                {userGames.slice(0, 5).map((game, index) => (
                  <View key={index} style={[styles.gameCard, { backgroundColor: theme.colors.background.surface }]}>
                    <View style={styles.gameInfo}>
                      <Text style={[styles.gameDate, { color: theme.colors.text.primary }]}>
                        {new Date(game.createdAt?.toDate?.() || game.createdAt).toLocaleDateString('ar')}
                      </Text>
                      <Text style={[styles.gameDetails, { color: theme.colors.text.secondary }]}>
                        {game.teamCount} فرق • {game.categories?.length || 0} فئات
                      </Text>
                    </View>
                    <Text style={[styles.gameStatus, { 
                      color: game.status === 'completed' ? theme.colors.success : theme.colors.warning 
                    }]}>
                      {game.status === 'completed' ? 'مكتملة' : 'متوقفة'}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Logout Button */}
            <TouchableOpacity 
              style={[styles.logoutButton, { backgroundColor: theme.colors.error }]}
              onPress={handleLogout}
            >
              <MaterialIcons name="logout" size={24} color="white" />
              <Text style={styles.logoutButtonText}>تسجيل الخروج</Text>
            </TouchableOpacity>

            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </BackgroundPattern>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    paddingTop: SPACING.xl,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  editButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  profileSection: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderRadius: 16,
    marginBottom: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0E0E0',
    marginBottom: SPACING.md,
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  editNameContainer: {
    width: '100%',
    alignItems: 'center',
  },
  nameInput: {
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: SPACING.md,
    width: '80%',
    fontFamily: FONTS.regular,
  },
  saveButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    fontFamily: FONTS.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: SPACING.xs,
    fontFamily: FONTS.bold,
  },
  statTitle: {
    fontSize: 14,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    alignItems: 'center',
  },
  achievementText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  achievementName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  achievementDesc: {
    fontSize: 14,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  categoryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  categoryName: {
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  gameCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  gameInfo: {
    flex: 1,
  },
  gameDate: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  gameDetails: {
    fontSize: 14,
    marginTop: SPACING.xs,
    fontFamily: FONTS.regular,
  },
  gameStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: SPACING.sm,
    fontFamily: FONTS.bold,
  },
  bottomSpacer: {
    height: SPACING.xl,
  },
});

export default UserProfile;