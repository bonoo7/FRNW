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
  Image,
  Dimensions
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { doc, getDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient';
import { db } from '../firebase/config';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import EnhancedStorageService from '../services/enhancedStorageService';
import BackgroundPattern from './BackgroundPattern';
import UserCreditsHeader from './UserCreditsHeader';
import CreditsService from '../services/creditsService';
import { SPACING, FONTS } from '../styles/theme';

const UserProfile = ({ visible, onClose }) => {
  const { theme } = useTheme();
  const { currentUser, userProfile, logout, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [userGames, setUserGames] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [credits, setCredits] = useState(0);
  const [stats, setStats] = useState(null);
  const window = Dimensions.get('window');
  const isLandscape = window.width > window.height;

  useEffect(() => {
    if (userProfile && visible) {
      setDisplayName(userProfile.displayName || '');
      loadUserData();
    }
  }, [userProfile, visible]);

  // Refresh user data every time profile modal opens
  useEffect(() => {
    if (visible && currentUser) {
      loadUserData();
    }
  }, [visible]);

  const loadUserData = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      // Reload the profile from Firestore to get latest statistics
      const userRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userRef);
      
      if (userSnap.exists()) {
        const latestData = userSnap.data();
        setStats({
          gamesPlayed: latestData.statistics?.totalGames || 0,
          questionsAnswered: latestData.statistics?.totalQuestionsAnswered || 0,
          correctAnswers: latestData.statistics?.totalCorrectAnswers || 0,
          totalScore: latestData.statistics?.totalScore || 0,
          averageScore: latestData.statistics?.averageScore || 0,
          accuracy: latestData.statistics?.totalQuestionsAnswered 
            ? Math.round((latestData.statistics?.totalCorrectAnswers || 0) / latestData.statistics.totalQuestionsAnswered * 100)
            : 0
        });
      }

      // Load credits
      const userCredits = await CreditsService.getUserCredits(currentUser.uid);
      setCredits(userCredits);

      // Load recent games from local storage
      const games = await EnhancedStorageService.getGameHistory(5);
      setUserGames(games || []);

      // Load achievements (simplified)
      const achievements = Object.entries(userProfile?.achievements || {})
        .filter(([_, achieved]) => achieved)
        .map(([key]) => ({
          id: key,
          name: getAchievementName(key),
          description: getAchievementDescription(key)
        }));
      setAchievements(achievements);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for achievements
  const getAchievementName = (key) => {
    const achievements = {
      firstGame: 'أول لعبة',
      first100Points: '100 نقطة',
      first500Points: '500 نقطة',
      first1000Points: '1000 نقطة',
      categoryMaster: 'خبير الفئات',
      speedDemon: 'سرعة البرق',
      perfectGame: 'اللعبة المثالية',
      socialPlayer: 'لاعب اجتماعي'
    };
    return achievements[key] || key;
  };

  const getAchievementDescription = (key) => {
    const descriptions = {
      firstGame: 'أكمل أول لعبة لك',
      first100Points: 'احصل على 100 نقطة',
      first500Points: 'احصل على 500 نقطة',
      first1000Points: 'احصل على 1000 نقطة',
      categoryMaster: 'أتقن جميع الفئات',
      speedDemon: 'أجب بسرعة على الأسئلة',
      perfectGame: 'أجب على جميع الأسئلة بشكل صحيح',
      socialPlayer: 'العب مع الأصدقاء'
    };
    return descriptions[key] || 'إنجاز مميز';
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

  const StatCard = ({ title, value, icon, color = theme.colors.primary }) => (
    <LinearGradient
      colors={[`${color}20`, `${color}10`]}
      style={[
        styles.statCard,
        {
          borderColor: color,
          borderWidth: 1
        }
      ]}
    >
      <View style={styles.statCardContent}>
        <MaterialIcons name={icon} size={28} color={color} />
        <View style={styles.statTextContainer}>
          <Text style={[styles.statTitle, { color: theme.colors.text.secondary }]}>
            {title}
          </Text>
          <Text style={[styles.statValue, { color: color, fontWeight: 'bold' }]}>
            {value}
          </Text>
        </View>
      </View>
    </LinearGradient>
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

  if (!userProfile || !stats) return null;

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
            {/* Profile Header Card */}
            <LinearGradient
              colors={[theme.colors.primary, `${theme.colors.primary}CC`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.profileHeaderCard, { backgroundColor: theme.colors.primary }]}
            >
              <Image 
                source={{ uri: currentUser?.photoURL || 'https://via.placeholder.com/100' }} 
                style={styles.avatar}
              />
              
              {editMode ? (
                <View style={styles.editNameContainer}>
                  <TextInput
                    style={[styles.nameInput, { 
                      color: theme.colors.text.primary,
                      borderColor: theme.colors.border?.primary || theme.colors.primary,
                      backgroundColor: theme.colors.background.surface
                    }]}
                    value={displayName}
                    onChangeText={setDisplayName}
                    placeholder="الاسم"
                    placeholderTextColor={theme.colors.text.secondary}
                  />
                  <TouchableOpacity 
                    style={[styles.saveButton, { backgroundColor: theme.colors.success || '#4CAF50' }]}
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
                <>
                  <Text style={[styles.displayName, { color: '#FFF' }]}>
                    {userProfile.displayName || 'مستخدم جديد'}
                  </Text>
                  <Text style={[styles.email, { color: 'rgba(255,255,255,0.8)' }]}>
                    {currentUser?.email}
                  </Text>
                </>
              )}
            </LinearGradient>

            {/* Credits Banner */}
            <View style={[styles.creditsBanner, { backgroundColor: theme.colors.success || '#4CAF50' }]}>
              <MaterialIcons name="sports-esports" size={32} color="white" />
              <View style={styles.creditsContent}>
                <Text style={styles.creditsLabel}>الألعاب المتبقية</Text>
                <Text style={styles.creditsValue}>{credits}</Text>
              </View>
              <MaterialIcons 
                name={credits === 0 ? "error" : credits <= 2 ? "warning" : "check-circle"} 
                size={32} 
                color="white" 
              />
            </View>

            {/* Statistics Grid */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                الإحصائيات
              </Text>
              <View style={styles.statsGrid}>
                <StatCard 
                  title="الألعاب" 
                  value={stats.gamesPlayed}
                  icon="sports-esports"
                  color={theme.colors.primary}
                />
                <StatCard 
                  title="النقاط الإجمالية" 
                  value={stats.totalScore}
                  icon="star"
                  color="#FFD700"
                />
                <StatCard 
                  title="الإجابات الصحيحة" 
                  value={stats.correctAnswers}
                  icon="check-circle"
                  color="#4CAF50"
                />
                <StatCard 
                  title="معدل الدقة" 
                  value={`${stats.accuracy}%`}
                  icon="trending-up"
                  color="#FF9800"
                />
              </View>
            </View>

            {/* Details Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                التفاصيل
              </Text>
              <View style={[styles.detailsCard, { backgroundColor: theme.colors.background.surface }]}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    إجمالي الأسئلة
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {stats.questionsAnswered}
                  </Text>
                </View>
                <View style={[styles.divider, { backgroundColor: theme.colors.border?.primary }]} />
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: theme.colors.text.secondary }]}>
                    متوسط النقاط
                  </Text>
                  <Text style={[styles.detailValue, { color: theme.colors.text.primary }]}>
                    {stats.averageScore}
                  </Text>
                </View>
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

            {/* Recent Games */}
            {userGames.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text.primary }]}>
                  آخر الألعاب
                </Text>
                {userGames.slice(0, 5).map((game, index) => (
                  <View key={index} style={[styles.gameCard, { backgroundColor: theme.colors.background.surface }]}>
                    <View style={styles.gameInfo}>
                      <Text style={[styles.gameName, { color: theme.colors.text.primary }]}>
                        {game.roundName || `الجولة ${index + 1}`}
                      </Text>
                      <Text style={[styles.gameDetails, { color: theme.colors.text.secondary }]}>
                        {game.teamCount || game.teams?.length || 2} فرق • {game.categories?.length || 0} فئات
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: theme.colors.success || '#4CAF50' }]}>
                      <Text style={styles.statusText}>مكتملة</Text>
                    </View>
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
  profileHeaderCard: {
    alignItems: 'center',
    padding: SPACING.xl,
    borderRadius: 16,
    marginBottom: SPACING.lg,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#E0E0E0',
    marginBottom: SPACING.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  displayName: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
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
    width: '100%',
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
  creditsBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
  },
  creditsContent: {
    flex: 1,
    marginHorizontal: SPACING.md,
    alignItems: 'flex-end',
  },
  creditsLabel: {
    color: 'white',
    fontSize: 12,
    fontFamily: FONTS.regular,
    opacity: 0.9,
  },
  creditsValue: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    fontFamily: FONTS.bold,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  statCard: {
    width: '48%',
    padding: SPACING.md,
    borderRadius: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
  },
  statCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statTextContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: SPACING.xs,
  },
  statTitle: {
    fontSize: 12,
  },
  detailsCard: {
    borderRadius: 12,
    padding: SPACING.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  divider: {
    height: 1,
    marginVertical: SPACING.sm,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#FFD700',
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
  gameCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 12,
    marginBottom: SPACING.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1.84,
  },
  gameInfo: {
    flex: 1,
  },
  gameName: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
    marginBottom: SPACING.xs,
  },
  gameDetails: {
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 6,
    marginLeft: SPACING.md,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
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
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.84,
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