import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import { useRouter } from 'expo-router';
import PentaPointsService from '../services/pentaPointsService';
import StorageService from '../services/storageService';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
  vertical = false
}) => {
  const { theme } = useTheme();
  const router = useRouter();
  const [pentaPointsEnabled, setPentaPointsEnabled] = useState(true);
  
  const validTeams = Array.isArray(teams) ? teams : [];
  const validScores = typeof scores === 'object' ? scores : {};
  const validDoublePoints = typeof usedDoublePoints === 'object' ? usedDoublePoints : {};
  const validPentaPoints = typeof usedPentaPoints === 'object' ? usedPentaPoints : {};
  const currentTeam = validTeams[currentTeamIndex];

  const isLowestScoringTeam = (teamName) => {
    return PentaPointsService.isLowestScoringTeam(teamName, validTeams, validScores);
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await StorageService.getSettings();
        setPentaPointsEnabled(settings?.pentaPointsEnabled !== undefined ? settings.pentaPointsEnabled : true);
      } catch (error) {
        console.error('خطأ في تحميل الإعدادات:', error);
        setPentaPointsEnabled(true);
      }
    };
    
    loadSettings();
  }, []);

  const handleDoublePointsChange = (newValue) => {
    if (newValue && validDoublePoints[currentTeam]) {
      return;
    }
    if (onDoublePointsChange) {
      onDoublePointsChange(newValue);
    }
  };

  const handlePentaPointsChange = (newValue) => {
    if (!pentaPointsEnabled) return;
    
    if (newValue && validPentaPoints[currentTeam]) {
      return;
    }
    
    if (newValue && !isLowestScoringTeam(currentTeam)) {
      return;
    }
    
    if (onPentaPointsChange) {
      onPentaPointsChange(newValue);
    }
  };

  const handleEndRound = () => {
    if (onEndRound) {
      onEndRound();
    }
  };

  if (!theme || !validTeams.length) {
    return null;
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'transparent',
      flexDirection: vertical ? 'column' : 'row',
      alignItems: vertical ? 'stretch' : 'center',
      justifyContent: vertical ? 'flex-start' : 'space-between',
      paddingHorizontal: vertical ? 1 : SPACING.md,
      paddingVertical: vertical ? 1 : SPACING.xs,
      width: vertical ? '100%' : '100%',
      height: vertical ? '100%' : 'auto',
      gap: vertical ? 1 : SPACING.xs,
    },
    teamsScrollContainer: {
      flex: vertical ? 1 : 0,
      maxHeight: vertical ? undefined : 62,
      width: vertical ? '100%' : 'auto',
    },
    teamsScroll: {
      flexDirection: vertical ? 'column' : 'row',
      alignItems: 'center',
      gap: vertical ? 0.8 : SPACING.xxs,
      paddingVertical: vertical ? 1 : 2,
      paddingHorizontal: 0,
    },
    teamCard: {
      minWidth: vertical ? '100%' : 85,
      minHeight: vertical ? 32 : 60,
      borderRadius: 8,
      overflow: 'hidden',
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 1.5,
      borderWidth: 1.5,
      marginBottom: vertical ? 1 : 0,
    },
    teamCardContent: {
      paddingVertical: vertical ? 2 : SPACING.xxs,
      paddingHorizontal: vertical ? 3 : SPACING.xs,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: vertical ? 32 : 60,
      flex: 1,
    },
    teamName: {
      fontSize: vertical ? 6 : 9,
      fontWeight: FONTS.weights.bold,
      fontFamily: 'ReadexPro_700Bold',
      marginBottom: 0.5,
      textAlign: 'center',
    },
    teamScore: {
      fontSize: vertical ? 9 : 16,
      fontWeight: FONTS.weights.bold,
      fontFamily: 'ReadexPro_700Bold',
      marginBottom: 0.5,
    },
    activeTeamBadge: {
      paddingHorizontal: 1.5,
      paddingVertical: 0.2,
      backgroundColor: 'rgba(255, 255, 255, 0.15)',
      borderRadius: 2,
      borderWidth: 0.5,
      borderColor: 'rgba(255, 255, 255, 0.25)',
    },
    activeTeamBadgeText: {
      fontSize: 4,
      fontWeight: FONTS.weights.bold,
      color: '#FFFFFF',
      fontFamily: 'ReadexPro_700Bold',
    },
    controlsContainer: {
      flexDirection: vertical ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: vertical ? 'center' : 'flex-start',
      gap: vertical ? 0.8 : 2,
      width: vertical ? '100%' : 'auto',
    },
    actionButton: {
      paddingVertical: vertical ? 1 : 4,
      paddingHorizontal: vertical ? 2.5 : 6,
      borderRadius: 4,
      overflow: 'hidden',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: vertical ? 20 : 34,
      minWidth: vertical ? 32 : 34,
      elevation: 1,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 0.5 },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      borderWidth: 0.8,
      borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    actionButtonText: {
      fontSize: vertical ? 6 : 11,
      fontWeight: FONTS.weights.bold,
      fontFamily: 'ReadexPro_700Bold',
      color: '#FFF',
      textAlign: 'center',
    },
    actionButtonIcon: {
      marginBottom: vertical ? 0 : 1,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {/* قسم الفرق - على اليسار */}
      <ScrollView
        horizontal={!vertical}
        scrollEnabled={vertical ? true : true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={vertical}
        style={styles.teamsScrollContainer}
        contentContainerStyle={styles.teamsScroll}
      >
        {validTeams.map((teamName, index) => {
          const isCurrentTeam = index === currentTeamIndex;
          const teamScore = validScores[teamName] || 0;
          
          return (
            <TouchableOpacity 
              key={teamName} 
              style={[
                styles.teamCard,
                {
                  backgroundColor: isCurrentTeam ? '#4A90E2' : '#FFFFFF',
                  borderColor: isCurrentTeam ? '#2E5DB8' : '#D0D0D0',
                }
              ]}
              onPress={() => onTeamChange?.(index)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isCurrentTeam ? ['#5BA3F5', '#3D7EC8'] : ['#F8FAFB', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.teamCardContent}
              >
                <Text style={[
                  styles.teamName,
                  { color: isCurrentTeam ? '#FFFFFF' : '#333333' }
                ]}>
                  {teamName}
                </Text>
                <Text style={[
                  styles.teamScore,
                  { color: isCurrentTeam ? '#FFFFFF' : '#4A90E2' }
                ]}>
                  {teamScore}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 2, marginTop: 0.5 }}>
                  <TouchableOpacity
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: isCurrentTeam ? 'rgba(255, 255, 255, 0.2)' : '#FF6B6B',
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 1,
                    }}
                    onPress={() => onScoreChange?.(teamName, (validScores[teamName] || 0) - 50)}
                  >
                    <Text style={{ color: '#FFF', fontSize: 8, fontWeight: 'bold', lineHeight: 12 }}>−</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: isCurrentTeam ? 'rgba(255, 255, 255, 0.2)' : '#51CF66',
                      alignItems: 'center',
                      justifyContent: 'center',
                      elevation: 1,
                    }}
                    onPress={() => onScoreChange?.(teamName, (validScores[teamName] || 0) + 50)}
                  >
                    <Text style={{ color: '#FFF', fontSize: 9, fontWeight: 'bold', lineHeight: 14 }}>+</Text>
                  </TouchableOpacity>
                </View>
                {isCurrentTeam && (
                  <View style={styles.activeTeamBadge}>
                    <Text style={styles.activeTeamBadgeText}>
                      نشط
                    </Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* الأزرار - على اليمين */}
      <View style={[styles.controlsContainer, { flexDirection: vertical ? 'row' : 'column', marginBottom: vertical ? 2 : 0 }]}>
        {/* زر مضاعفة النقاط ×2 */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              backgroundColor: isDoublePoints ? '#FFB300' : '#FFC107',
              opacity: validDoublePoints[currentTeam] ? 0.4 : 1,
              flex: vertical ? 1 : undefined,
              marginRight: vertical ? 2 : 0,
            }
          ]}
          onPress={() => handleDoublePointsChange(!isDoublePoints)}
          disabled={validDoublePoints[currentTeam]}
          activeOpacity={0.8}
        >
          <Text style={styles.actionButtonText}>×2</Text>
        </TouchableOpacity>

        {/* زر مضاعفة النقاط ×5 */}
        {pentaPointsEnabled && (
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                backgroundColor: isPentaPoints ? '#43A047' : '#66BB6A',
                opacity: validPentaPoints[currentTeam] || !isLowestScoringTeam(currentTeam) ? 0.4 : 1,
                flex: vertical ? 1 : undefined,
              }
            ]}
            onPress={() => handlePentaPointsChange(!isPentaPoints)}
            disabled={validPentaPoints[currentTeam] || !isLowestScoringTeam(currentTeam)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>×5</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* زر إنهاء الجولة - منفصل */}
      <TouchableOpacity
        style={[
          styles.actionButton,
          {
            backgroundColor: '#EF5350',
            width: vertical ? '100%' : 34,
            marginTop: vertical ? 2 : 0,
          }
        ]}
        onPress={handleEndRound}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name="flag-checkered" size={14} color="#FFFFFF" style={styles.actionButtonIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default TeamsHeader;
