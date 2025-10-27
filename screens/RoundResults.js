import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { SPACING, FONTS } from '../styles/theme';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import ResponsiveView from '../components/ResponsiveView';
import { wp, hp } from '../styles/responsive';
import StorageService from '../services/storageService';
import { Alert } from 'react-native';
import WinnerCelebration from '../components/WinnerCelebration';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import BackgroundPattern from '../components/BackgroundPattern';

const staticStyles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: FONTS.sizes.h2,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  subtitle: {
    fontSize: FONTS.sizes.body,
    opacity: 0.8,
  },
  teamContainer: {
    marginBottom: SPACING.lg,
    borderRadius: 16,
    padding: SPACING.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  teamHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxs,
    borderRadius: 12,
    padding: SPACING.xs,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  teamName: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
  },
  scoreText: {
    fontSize: FONTS.sizes.h3,
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: SPACING.xl,
  },
  button: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  glowButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: 16,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFD700',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 8,
    marginVertical: SPACING.md,
  },
  buttonText: {
    fontSize: FONTS.sizes.body,
    fontWeight: 'bold',
  },
  teamContent: {
    padding: SPACING.md,
  },
  position: {
    fontSize: FONTS.sizes.body,
    opacity: 0.8,
  },
  teamsSection: {
    marginBottom: SPACING.lg,
  },
  winnerContainer: {
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  teamsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: SPACING.md,
  },
});

const RoundResults = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const window = Dimensions.get('window');
  const isLandscape = window.width > window.height;
  const [showCelebration, setShowCelebration] = useState(false);
  
  // متغير للحركة
  const glowAnimation = useRef(new Animated.Value(0)).current;
  
  // تنفيذ تأثير الوميض بشكل متكرر
  useEffect(() => {
    let animationId = null;
    let isMounted = true;
    
    const pulse = () => {
      if (!isMounted) return;
      
      Animated.sequence([
        Animated.timing(glowAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        })
      ]).start(({ finished }) => {
        if (finished && isMounted) {
          animationId = setTimeout(() => pulse(), 0);
        }
      });
    };
    
    pulse();
    
    return () => {
      isMounted = false;
      if (animationId) clearTimeout(animationId);
      glowAnimation.setValue(0);
      glowAnimation.stopAnimation();
    };
  }, [glowAnimation]);
  
  // قيم الظل الرسومية المتغيرة بناءً على الحركة
  const glowShadowOpacity = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1]
  });
  
  const glowShadowRadius = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [3, 10]
  });
  
  const glowElevation = glowAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 10]
  });
  
  // نمط الظل المتغير
  const animatedGlowStyle = {
    shadowOpacity: glowShadowOpacity,
    shadowRadius: glowShadowRadius,
    elevation: Platform.OS === 'android' ? glowElevation : undefined,
  };

  const gameData = params.gameData ? JSON.parse(params.gameData) : null;
  const scores = gameData?.scores || {};
  const teams = gameData?.teams || [];
  const roundName = gameData?.roundName || 'نتائج الجولة';

  useEffect(() => {
    if (gameData) {
      setTimeout(() => setShowCelebration(true), 500);
    }
  }, [gameData]);

  if (!gameData) {
    return (
      <BackgroundPattern>
        <ResponsiveView style={[staticStyles.container, { backgroundColor: 'transparent' }]}>
          <Text style={{ color: theme.colors.text.primary }}>لا توجد بيانات متاحة</Text>
        </ResponsiveView>
      </BackgroundPattern>
    );
  }

  const handleNewRound = async () => {
    try {
      // إيقاف الحركات
      glowAnimation.setValue(0);
      glowAnimation.stopAnimation();
      
      // حذف بيانات اللعبة الحالية
      await StorageService.clearCurrentGame();
      
      // الانتقال إلى الشاشة الرئيسية
      router.push('/');
    } catch (error) {
      console.error('خطأ في بدء جولة جديدة:', error);
      Alert.alert('خطأ', 'حدث خطأ في بدء جولة جديدة');
    }
  };

  const sortedTeams = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([team, score], index, array) => ({
      name: team,
      score: score,
      // التحقق من التعادل مع الفريق السابق
      isTied: index > 0 && score === array[index - 1][1],
      // التحقق من التعادل مع الفريق الأول
      isWinner: score === array[0][1]
    }));

  const getTeamPosition = (index, team) => {
    if (team.isWinner && (index > 0 || team.isTied)) {
      return 'تعادل في المركز الأول';
    } else if (team.isTied) {
      const position = sortedTeams.findIndex(t => t.score === team.score) + 1;
      const arabicPosition = ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'][position - 1];
      return `تعادل في المركز ${arabicPosition}`;
    }
    return ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس'][index];
  };

  const getWinnerText = () => {
    const winners = sortedTeams.filter(team => team.isWinner);
    if (winners.length > 1) {
      return {
        title: "تعادل في المركز الأول",
        subtitle: `${winners.length} فرق - ${winners[0].score} نقطة`
      };
    }
    return {
      title: `الفائز: ${winners[0].name}`,
      subtitle: `${winners[0].score} نقطة`
    };
  };

  const styles = StyleSheet.create({
    teamsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: SPACING.xs,
    },
    teamCardContainer: {
      flex: 1,
      minWidth: 80,
      maxWidth: isLandscape ? 150 : 120,
      margin: SPACING.xxs,
    },
    teamInfo: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
    },
    teamHeader: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: SPACING.xxs,
      borderRadius: 12,
      padding: SPACING.xs,
      borderWidth: 1,
      borderColor: '#FFD700',
    },
    teamItem: {
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      borderRadius: 20,
      padding: SPACING.lg,
      marginBottom: SPACING.lg,
      borderWidth: 1,
      borderColor: '#FFD700',
    },
    teamScore: {
      fontSize: FONTS.sizes.h3,
      fontWeight: 'bold',
    },
  });

  const TeamsSection = () => (
    <View style={staticStyles.teamsSection}>
      <View style={styles.teamsGrid}>
        {sortedTeams.map((team, index) => (
          <View key={team.name} style={styles.teamCardContainer}>
            <LinearGradient
              colors={[
                team.isWinner ? `${theme.colors.primary}90` :
                team.isTied ? `${theme.colors.primary}90` :
                `${theme.colors.primary}90`,
                team.isWinner ? `${theme.colors.primary}70` :
                team.isTied ? `${theme.colors.primary}70` :
                `${theme.colors.primary}70`
              ]}
              style={[styles.teamHeader, { 
                borderRadius: 12,
                borderColor: '#FFD700',
                borderWidth: 1,
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: SPACING.xs
              }]}
            >
              <Text style={[staticStyles.teamName, { 
                color: '#FFD700',
                fontSize: FONTS.sizes.subtitle,
                textAlign: 'center',
                marginBottom: SPACING.xs
              }]}>
                {team.name}
              </Text>
              <Text style={[staticStyles.scoreText, { 
                color: '#FFD700',
                fontSize: FONTS.sizes.h3,
                fontWeight: 'bold',
                textAlign: 'center'
              }]}>
                {team.score}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </View>
    </View>
  );

  const WinnerSection = () => {
    const winnerInfo = getWinnerText();
    return (
      <LinearGradient
        colors={[
          `${theme.colors.primary}90`,
          `${theme.colors.primary}70`
        ]}
        style={[staticStyles.winnerContainer, { borderRadius: 20, borderColor: '#FFD700' }]}
      >
        <MaterialCommunityIcons
          name={sortedTeams.filter(team => team.isWinner).length > 1 ? "trophy-variant" : "trophy"}
          size={40}
          color={theme.colors.success}
          style={{ marginBottom: SPACING.xs }}
        />
        <Text style={[staticStyles.teamName, { 
          fontSize: FONTS.sizes.h3,
          color: theme.colors.success,
          textAlign: 'center'
        }]}>
          {winnerInfo.title}
        </Text>
        <Text style={[staticStyles.scoreText, { 
          color: theme.colors.text.secondary,
          textAlign: 'center'
        }]}>
          {winnerInfo.subtitle}
        </Text>
      </LinearGradient>
    );
  };

  const LandscapeLayout = () => (
    <View style={{ flexDirection: 'row', flex: 1, padding: SPACING.md }}>
      {/* العمود الأول: النتائج */}
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <WinnerSection />
        <TeamsSection />
      </View>

      {/* العمود الثاني: الإحصائيات */}
      <View style={{ flex: 1, marginHorizontal: SPACING.md }}>
        <LinearGradient
          colors={[
            `${theme.colors.primary}90`,
            `${theme.colors.primary}70`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20, borderColor: '#FFD700' }]}
        >
          <Text style={[staticStyles.title, { color: '#FFD700' }]}>
            إحصائيات الجولة
          </Text>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="question-answer" 
              size={20} 
              color="#FFD700"
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { color: '#FFD700' }]}>
              {`الأسئلة: ${gameData.statistics.answeredQuestions}/${gameData.statistics.totalQuestions}`}
            </Text>
          </View>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="star" 
              size={20} 
              color="#FFD700"
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { color: '#FFD700' }]}>
              {`النقاط المضاعفة: ${gameData.statistics.doublePointsUsed}`}
            </Text>
          </View>
        </LinearGradient>

        <TouchableOpacity
          style={[
            staticStyles.glowButton,
            animatedGlowStyle,
            { 
              backgroundColor: theme.colors.primary,
              marginTop: SPACING.md,
              borderRadius: 12,
              borderColor: '#FFD700'
            }
          ]}
          onPress={handleNewRound}
        >
          <MaterialIcons name="refresh" size={20} color="#FFD700" />
          <Text style={[staticStyles.buttonText, { 
            color: '#FFD700',
            fontSize: FONTS.sizes.body
          }]}>
            جولة جديدة
          </Text>
        </TouchableOpacity>
      </View>

      {/* العمود الثالث: إحصائيات الفئات */}
      <View style={{ flex: 1, marginLeft: SPACING.md }}>
        <LinearGradient
          colors={[
            `${theme.colors.primary}90`,
            `${theme.colors.primary}70`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20, borderColor: '#FFD700' }]}
        >
          <Text style={[staticStyles.title, { color: '#FFD700' }]}>
            إحصائيات الفئات
          </Text>
          <ScrollView style={{ maxHeight: window.height * 0.6 }}>
            {Object.entries(gameData.statistics.categoryStats || {}).map(([category, stats]) => (
              <View key={category} style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
                <Text style={[staticStyles.teamName, { 
                  color: '#FFD700',
                  fontSize: FONTS.sizes.small
                }]}>
                  {category}
                </Text>
                <Text style={[staticStyles.scoreText, { 
                  color: '#FFD700',
                  fontSize: FONTS.sizes.small
                }]}>
                  {`${stats.answered}/${stats.total}`}
                </Text>
              </View>
            ))}
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );

  const PortraitLayout = () => (
    <ScrollView 
      style={staticStyles.container}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={[
        staticStyles.card,
        { 
          borderColor: theme.colors.border,
          backgroundColor: theme.colors.background.card,
          borderWidth: 1,
          shadowColor: theme.colors.text.primary,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 3,
          borderRadius: 20,
        }
      ]}>
        <View style={staticStyles.header}>
          <View>
            <Text style={[staticStyles.title, { color: theme.colors.text.primary }]}>
              نتائج الجولة
            </Text>
            <Text style={[staticStyles.subtitle, { color: theme.colors.text.secondary }]}>
              {roundName}
            </Text>
          </View>
        </View>

        {/* عرض الفائز */}
        <WinnerSection />

        {/* عرض نتائج جميع الفرق */}
        <TeamsSection />

        {/* عرض الإحصائيات */}
        <LinearGradient
          colors={[
            `${theme.colors.primary}90`,
            `${theme.colors.primary}70`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20, borderColor: '#FFD700' }]}
        >
          <Text style={[staticStyles.title, { color: '#FFD700' }]}>
            إحصائيات الجولة
          </Text>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="question-answer" 
              size={24} 
              color="#FFD700"
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { color: '#FFD700' }]}>
              {`الأسئلة المجاب عنها: ${gameData.statistics.answeredQuestions} من ${gameData.statistics.totalQuestions}`}
            </Text>
          </View>
          <View style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
            <MaterialIcons 
              name="star" 
              size={24} 
              color="#FFD700"
              style={{ marginRight: SPACING.sm }}
            />
            <Text style={[staticStyles.scoreText, { color: '#FFD700' }]}>
              {`النقاط المضاعفة المستخدمة: ${gameData.statistics.doublePointsUsed}`}
            </Text>
          </View>
        </LinearGradient>

        {/* عرض إحصائيات الفئات */}
        <LinearGradient
          colors={[
            `${theme.colors.primary}90`,
            `${theme.colors.primary}70`
          ]}
          style={[staticStyles.teamContainer, { borderRadius: 20, borderColor: '#FFD700' }]}
        >
          <Text style={[staticStyles.title, { color: '#FFD700' }]}>
            إحصائيات الفئات
          </Text>
          {Object.entries(gameData.statistics.categoryStats || {}).map(([category, stats]) => (
            <View key={category} style={[staticStyles.teamHeader, { borderRadius: 16 }]}>
              <Text style={[staticStyles.teamName, { 
                color: '#FFD700',
                fontSize: FONTS.sizes.small
              }]}>
                {category}
              </Text>
              <Text style={[staticStyles.scoreText, { 
                color: '#FFD700',
                fontSize: FONTS.sizes.small
              }]}>
                {`${stats.answered}/${stats.total}`}
              </Text>
            </View>
          ))}
        </LinearGradient>

        {/* زر جولة جديدة */}
        <View style={staticStyles.buttonsContainer}>
          <TouchableOpacity
            style={[
              staticStyles.glowButton,
              animatedGlowStyle,
              { 
                backgroundColor: theme.colors.primary,
                borderRadius: 12,
                borderColor: '#FFD700'
              }
            ]}
            onPress={handleNewRound}
          >
            <MaterialIcons name="refresh" size={24} color="#FFD700" />
            <Text style={[staticStyles.buttonText, { color: '#FFD700' }]}>
              جولة جديدة
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  return (
    <BackgroundPattern>
      <WinnerCelebration isVisible={showCelebration} />
      <ResponsiveView style={[staticStyles.container, { backgroundColor: 'transparent' }]}>
        {isLandscape ? <LandscapeLayout /> : <PortraitLayout />}
      </ResponsiveView>
    </BackgroundPattern>
  );
};

export default RoundResults;