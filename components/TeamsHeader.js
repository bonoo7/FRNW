import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, ScrollView, Modal, Dimensions, Alert, Image, ImageBackground } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import PentaPointsService from '../services/pentaPointsService';
import StorageService from '../services/storageService';

// إضافة مكون ContainerBackground
const ContainerBackground = ({ style, children }) => {
  const { theme } = useTheme();
  const imageSource = theme?.colors?.background?.containerImage;

  // استخراج borderRadius وباقي الأنماط من style
  const flatStyle = StyleSheet.flatten(style || {});
  const { borderRadius, height, borderWidth, borderColor, ...restStyle } = flatStyle;

  // نمط الحاوية الخارجية (للقص والحواف الدائرية)
  const wrapperStyle = {
    ...restStyle,
    borderRadius: borderRadius || 0,
    overflow: 'hidden', // ضروري لقص صورة الخلفية
    position: 'relative', // ضروري لتحديد موضع ImageBackground المطلق
    height: height || 'auto', // استخدام الارتفاع المحدد أو auto إذا لم يتم تحديده
    width: '100%', // ضمان امتداد العرض
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
    borderWidth: borderWidth || 1.5,
    borderColor: theme.colors.border?.primary || theme.colors.primary,
    borderRadius: borderRadius || 0,
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
      {children}
    </View>
  );
};

export const TeamsHeader = ({ 
  teams = [], 
  currentTeamIndex = 0, 
  scores = {}, 
  onTeamChange, 
  onScoreChange,
  onEndRound, 
  isDoublePoints, 
  onDoublePointsChange,
  usedDoublePoints = {},
  isPentaPoints,
  onPentaPointsChange,
  usedPentaPoints = {}, 
  style,
  vertical = false // إضافة خاصية جديدة للوضع العمودي 
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const isSmallScreen = screenWidth < 768;
  const [pentaPointsEnabled, setPentaPointsEnabled] = useState(true);
  const [isX5Active, setIsX5Active] = useState(false);
  
  const validTeams = Array.isArray(teams) ? teams : [];
  const validScores = typeof scores === 'object' ? scores : {};
  const validDoublePoints = typeof usedDoublePoints === 'object' ? usedDoublePoints : {};
  const validPentaPoints = typeof usedPentaPoints === 'object' ? usedPentaPoints : {};
  const currentTeam = validTeams[currentTeamIndex];

  // التحقق مما إذا كان الفريق هو صاحب أقل نقاط
  const isLowestScoringTeam = (teamName) => {
    return PentaPointsService.isLowestScoringTeam(teamName, validTeams, validScores);
  };

  const primaryColorWithOpacity = `${theme.colors.primary}80`;
  const primaryColorWithLessOpacity = `${theme.colors.primary}40`;

  const getScoreColor = (score) => {
    if (score > 0) return theme.colors.success;
    if (score < 0) return theme.colors.error;
    return theme.colors.text.secondary;
  };

  useEffect(() => {
    // تحميل إعدادات نظام علي وعلى أعدائي
    const loadSettings = async () => {
      try {
        const settings = await StorageService.getSettings();
        setPentaPointsEnabled(settings?.pentaPointsEnabled !== undefined ? settings.pentaPointsEnabled : true);
      } catch (error) {
        console.error('خطأ في تحميل إعدادات نظام علي وعلى أعدائي:', error);
        setPentaPointsEnabled(true); // القيمة الافتراضية هي التفعيل
      }
    };
    
    loadSettings();
  }, []);

  const handleScoreChange = (team, change) => {
    if (onScoreChange) {
      // مضاعفة النقاط إذا كان زر X5 مفعلاً
      if (isX5Active && team === validTeams[currentTeamIndex]) {
        onScoreChange(team, change * 5);
        // إلغاء تفعيل زر X5 بعد استخدامه
        setIsX5Active(false);
      } else if (isDoublePoints && team === validTeams[currentTeamIndex]) {
        onScoreChange(team, change * 2);
      } else {
        onScoreChange(team, change);
      }
    }
  };

  const handleX5Press = () => {
    // التحقق مما إذا كان الفريق الحالي هو صاحب أقل نقاط
    const currentTeam = validTeams[currentTeamIndex];
    if (!validPentaPoints[currentTeam] && isLowestScoringTeam(currentTeam)) {
      // استخدام دالة onPentaPointsChange بدلاً من setIsX5Active
      if (onPentaPointsChange) {
        onPentaPointsChange(!isPentaPoints);
      }
    }
  };

  const handleTeamSelect = (index) => {
    if (onTeamChange) {
      onTeamChange(index);
      setShowTeamSelector(false);
    }
  };

  const handleEndRound = () => {
    if (onEndRound) {
      onEndRound();
    }
  };

  if (!theme) {
    return null;
  }

  if (!validTeams.length) {
    console.log('No valid teams found');
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent', // نجعلها شفافة لتظهر الخلفية
      borderBottomWidth: 0, 
      paddingVertical: 0, 
      minHeight: 0, 
      height: 78, 
      flexDirection: 'column',
      position: 'relative',
      borderRadius: 16, 
      margin: 1, 
      marginTop: 1, 
      borderWidth: 1.5, // زيادة سماكة الإطار 
      borderColor: theme.colors.border?.primary || theme.colors.primary,
      overflow: 'hidden',
      ...Platform.select({
        web: {
          boxShadow: `0 1px 2px rgba(0, 0, 0, 0.1)`, 
        },
        default: {
          elevation: 2, 
          shadowColor: '#000000', 
          shadowOffset: { width: 0, height: 1 }, 
          shadowOpacity: 0.1, 
          shadowRadius: 2, 
        }
      })
    },
    innerBorder: {
      position: 'absolute',
      top: 1,
      left: 1,
      right: 1,
      bottom: 1,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.5)',
      borderRadius: 15, 
      pointerEvents: 'none', 
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center', // توسيط العناصر عمودياً
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingVertical: 0,
      flex: 1,
      position: 'relative',
      zIndex: 2,
    },
    headerFireBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.6,
      zIndex: -1,
      borderRadius: 0, 
    },
    endRoundButton: {
      backgroundColor: '#FF0000', 
      borderRadius: 18, // جعله دائريًا (نصف الارتفاع/العرض الجديد)
      marginRight: SPACING.md, // زيادة الهامش الأيمن
      marginLeft: SPACING.sm, // إضافة هامش أيسر لإبعاده عن الحافة
      height: 36, // زيادة الارتفاع قليلاً
      width: 36, // زيادة العرض قليلاً
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#FF0000', 
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
      borderWidth: 1, // إضافة عرض الإطار
      borderColor: '#000000', // تحديد لون الإطار إلى الأسود
    },
    endRoundButtonText: {
      color: '#fff',
      fontSize: FONTS.sizes.body,
      fontWeight: FONTS.weights.bold,
      fontFamily: 'ReadexPro_700Bold',
      // يمكن إزالة textAlign إذا كان المحتوى سيتم توسيطه دائمًا
    },
    teamsScroll: {
      flex: 1,
    },
    teamsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center', // توسيط البطاقات عمودياً
      flexWrap: 'nowrap',
      paddingHorizontal: 0,
      paddingVertical: 0,
      flex: 1,
    },
    teamContainer: {
      minWidth: 100, // تقليل من 130 إلى 100
      maxWidth: 140, // تقليل من 180 إلى 140
      height: 50, // تقليل من 58 إلى 50
      borderRadius: 6, // تقليل من 8 إلى 6
      borderWidth: 1, 
      marginHorizontal: 2, // تقليل من 3 إلى 2
      padding: 0,
      position: 'relative',
      overflow: 'hidden',
      borderColor: theme.colors.border?.primary || theme.colors.primary,
    },
    teamCardInner: {
      flex: 1,
      borderRadius: 5, // تقليل من 7 إلى 5
      overflow: 'hidden',
      margin: 1,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    teamMainContent: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 1, // تقليل من 2 إلى 1
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      borderRadius: 5, // تقليل من 7 إلى 5
    },
    teamCardContent: {
      flex: 1,
      paddingHorizontal: 4, // تقليل من 6 إلى 4
      paddingVertical: 2, // تقليل من 4 إلى 2
      alignItems: 'center',
      justifyContent: 'center',
    },
    fireBackground: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      opacity: 0.8,
    },
    activeTeamCard: {
      transform: [{ scale: 1.02 }],
      borderColor: theme.colors.primary,
      borderWidth: 1,
      ...Platform.select({
        web: {
          boxShadow: `0 4px 12px ${theme.colors.overlay}`,
        }
      })
    },
    teamName: {
      fontSize: 12, // تقليل من 14 إلى 12
      textAlign: 'center',
      color: theme.colors.text.primary,
      marginTop: 2, // تقليل من 4 إلى 2
      fontWeight: FONTS.weights.semiBold,
      padding: 0,
      fontFamily: 'ReadexPro_600SemiBold'
    },
    teamScore: {
      fontSize: 14, // تقليل من 16 إلى 14
      fontWeight: FONTS.weights.medium,
      textAlign: 'center',
      color: '#00b894',
      marginBottom: 0,
      padding: 0,
      fontFamily: 'ReadexPro_500Medium',
    },
    scoreRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8, // زيادة المسافة بين الأزرار
      backgroundColor: theme.colors.background.card,
      padding: 1,
      borderRadius: 6,
      width: '100%',
    },
    scoreButton: {
      width: 24, // زيادة حجم الأزرار
      height: 24,
      borderRadius: 12, // جعل الأزرار دائرية
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    scoreButtonMinus: {
      backgroundColor: `${theme.colors.error}15`,
      borderColor: theme.colors.error,
    },
    scoreButtonPlus: {
      backgroundColor: `${theme.colors.success}15`,
      borderColor: theme.colors.success,
    },
    scoreButtonText: {
      fontSize: 16, // زيادة حجم نص الأزرار
      fontWeight: 'bold',
      textAlign: 'center',
    },
    scoreText: {
      fontSize: 14, // تقليل من 16 إلى 14
      fontWeight: FONTS.weights.medium,
      textAlign: 'center',
      minWidth: 30, // تحديد عرض أدنى لنص النقاط
    },
    doubleButton: {
      position: 'absolute',
      top: 3,
      right: 3,
      width: 24,
      height: 24,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 193, 7, 0.3)',
      zIndex: 10,
    },
    doubleButtonActive: {
      backgroundColor: 'rgba(255, 193, 7, 1)',
    },
    doubleButtonDisabled: {
      backgroundColor: 'rgba(200, 200, 200, 0.3)',
    },
    doubleButtonText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000',
    },
    doubleButtonTextDisabled: {
      color: 'rgba(0, 0, 0, 0.3)',
    },
    x5Button: {
      position: 'absolute',
      top: 3,
      left: 3,
      width: 24,
      height: 24,
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(76, 175, 80, 0.3)',
      zIndex: 10,
    },
    x5ButtonActive: {
      backgroundColor: 'rgba(76, 175, 80, 1)',
    },
    x5ButtonDisabled: {
      backgroundColor: 'rgba(200, 200, 200, 0.3)',
    },
    x5ButtonText: {
      fontSize: 10,
      fontWeight: 'bold',
      color: '#000',
    },
    x5ButtonTextDisabled: {
      color: 'rgba(0, 0, 0, 0.3)',
    },
    multiplierButtonsContainer: {
      position: 'absolute',
      top: 0,
      right: 0,
      zIndex: 10,
    },
    x5ButtonsContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 10,
    },
    lowestScoreBadge: {
      position: 'absolute',
      top: -8,
      right: 8,
      backgroundColor: '#C70000', 
      borderRadius: 8,
      width: 14,
      height: 14,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    lowestScoreBadgeText: {
      color: 'white',
      fontSize: 8,
      fontWeight: 'bold',
    },
  });

  return (
    <ContainerBackground style={[
      styles.container,
      {
        backgroundColor: 'rgba(255, 255, 255, 0.3)', 
        borderColor: theme.colors.border?.primary || theme.colors.primary,
        borderWidth: 1, 
        borderRadius: style?.borderRadius || 16, 
        height: vertical ? '100%' : 78, // تعديل الارتفاع ليكون كامل الارتفاع في الوضع العمودي
        elevation: 1, 
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05, 
        shadowRadius: 1, 
      },
      style
    ]}>
      <View style={[
        styles.innerBorder,
        {
          borderColor: 'rgba(255, 255, 255, 0.5)',
        }
      ]} />
      <View style={[
        styles.headerContent,
        vertical && {
          flexDirection: 'column',
          height: '100%',
          paddingVertical: 8
        }
      ]}>
        {isPentaPoints && (
          <ImageBackground
            source={require('../assets/images/fire.gif')}
            style={styles.headerFireBackground}
            resizeMode="cover"
          />
        )}
        
        {/* عرض زر الإنهاء في الأعلى إذا كان في الوضع الأفقي، وإلا سيتم عرضه في نهاية المكون */}
        {!vertical && (
          <TouchableOpacity
            style={styles.endRoundButton}
            onPress={handleEndRound}
          >
            <Text style={styles.endRoundButtonText}>إنهاء</Text>
          </TouchableOpacity>
        )}

        <ScrollView 
          horizontal={vertical ? false : true}
          showsHorizontalScrollIndicator={false}
          style={[
            styles.teamsScroll,
            vertical && {
              height: '85%', // تقليل لإفساح المجال لزر الإنهاء في الأسفل
              width: '100%',
              flexGrow: 1
            }
          ]}
          contentContainerStyle={[
            styles.teamsContainer,
            vertical && {
              flexDirection: 'column',
              alignItems: 'center', // جعل البطاقات في المنتصف أفقياً
              justifyContent: 'center', // جعل البطاقات في المنتصف رأسياً
              width: '100%',
              flexGrow: 1,
              paddingVertical: 8
            }
          ]}
        >
          {validTeams.map((teamName, index) => {
            const isCurrentTeam = index === currentTeamIndex;
            const teamScore = validScores[teamName] || 0;
            const usedDouble = validDoublePoints[teamName] || false;
            const usedPenta = validPentaPoints[teamName] || false;
            
            return (
              <TouchableOpacity 
                key={teamName} 
                style={[
                  styles.teamContainer,
                  vertical && {
                    width: '100%',
                    marginRight: 0,
                    marginBottom: 4, // تقليل من 6 إلى 4
                    minHeight: 45, // تقليل من 60 إلى 45
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingVertical: 3, // تقليل الهامش العمودي
                  },
                  isCurrentTeam && styles.activeTeamCard,
                  isCurrentTeam && {
                    borderWidth: 1.5,
                    borderColor: theme.colors.border?.primary || theme.colors.secondary,
                  }
                ]}
                onPress={() => onTeamChange?.(index)}
              >
                {isPentaPoints && (
                  <ImageBackground
                    source={require('../assets/images/fire.gif')}
                    style={styles.fireBackground}
                    resizeMode="cover"
                  />
                )}
                
                <View style={styles.teamCardInner}>
                  <View style={styles.teamMainContent}>
                    <Text style={[
                      styles.teamName,
                      { 
                        color: isPentaPoints ? 
                          'white' : 
                          (isCurrentTeam ? 
                            theme.colors.primary : 
                            theme.colors.text.primary)
                      }
                    ]}>
                      {teamName}
                    </Text>
                    
                    <View style={styles.scoreRow}>
                      <TouchableOpacity 
                        style={[styles.scoreButton, styles.scoreButtonMinus]}
                        onPress={() => handleScoreChange(teamName, (validScores[teamName] || 0) - 50)}
                      >
                        <Text style={[styles.scoreButtonText, { color: theme.colors.error }]}>-</Text>
                      </TouchableOpacity>
                      
                      <Text style={[
                        styles.scoreText,
                        { color: getScoreColor(validScores[teamName] || 0) }
                      ]}>
                        {validScores[teamName] || 0}
                      </Text>
                      
                      <TouchableOpacity 
                        style={[styles.scoreButton, styles.scoreButtonPlus]}
                        onPress={() => handleScoreChange(teamName, (validScores[teamName] || 0) + 50)}
                      >
                        <Text style={[styles.scoreButtonText, { color: theme.colors.success }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {isCurrentTeam && (
                  <>
                    <View style={styles.multiplierButtonsContainer}>
                      <TouchableOpacity
                        style={[
                          styles.doubleButton,
                          isDoublePoints && styles.doubleButtonActive,
                          validDoublePoints[teamName] && styles.doubleButtonDisabled,
                        ]}
                        onPress={() => {
                          if (!validDoublePoints[teamName]) {
                            onDoublePointsChange(!isDoublePoints);
                          }
                        }}
                        disabled={validDoublePoints[teamName]}
                      >
                        <Text style={[
                          styles.doubleButtonText,
                          validDoublePoints[teamName] && styles.doubleButtonTextDisabled,
                        ]}>
                          X2
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* إظهار زر X5 فقط إذا كان نظام علي وعلى أعدائي مفعل في إعدادات اللعبة */}
                    {pentaPointsEnabled && (
                      <View style={styles.x5ButtonsContainer}>
                        <TouchableOpacity
                          style={[
                            styles.x5Button,
                            isPentaPoints && styles.x5ButtonActive,
                            validPentaPoints[teamName] && styles.x5ButtonDisabled,
                            !isLowestScoringTeam(teamName) && styles.x5ButtonDisabled,
                          ]}
                          onPress={handleX5Press}
                          disabled={validPentaPoints[teamName] || !isLowestScoringTeam(teamName)}
                        >
                          <Text style={[
                            styles.x5ButtonText,
                            validPentaPoints[teamName] && styles.x5ButtonTextDisabled,
                            !isLowestScoringTeam(teamName) && styles.x5ButtonTextDisabled,
                          ]}>
                            X5
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        
        {/* عرض زر الإنهاء في النهاية إذا كان في الوضع العمودي */}
        {vertical && (
          <TouchableOpacity
            style={[
              styles.endRoundButton,
              {
                marginTop: 8,
                alignSelf: 'center', // جعل الزر في منتصف المكون أفقياً
                width: '80%', // جعل الزر أعرض قليلاً
                paddingVertical: 10, // زيادة المساحة العمودية
              }
            ]}
            onPress={handleEndRound}
          >
            <Text style={styles.endRoundButtonText}>إنهاء الجولة</Text>
          </TouchableOpacity>
        )}
      </View>
    </ContainerBackground>
  );
}; 