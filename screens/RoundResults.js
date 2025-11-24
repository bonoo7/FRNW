import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  useWindowDimensions,
  BackHandler,
  SafeAreaView
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import BackgroundSelector from '../components/BackgroundSelector';
import { useTheme } from '../contexts/ThemeContext';
import { FONTS } from '../styles/theme';
import WinnerCelebration from '../components/WinnerCelebration';

export default function RoundResults() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [isLoading, setIsLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const gameData = params.gameData ? JSON.parse(params.gameData) : null;
  const scores = gameData?.scores || {};
  const roundName = gameData?.roundName || 'النتائج';
  const stats = gameData?.statistics || {};

  // Sort teams
  const sortedTeams = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([team, score], index) => ({
      name: team,
      score: score,
      position: index + 1
    }));

  const winner = sortedTeams[0];

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
    if (gameData) {
      setTimeout(() => setShowCelebration(true), 500);
    }
    return () => backHandler.remove();
  }, []);

  const handleNewRound = async () => {
    if (isLoading) return;
    setIsLoading(true);
    // Prevent double tap and simulate loading
    setTimeout(() => {
      router.push('/');
    }, 500);
  };

  const StatBox = ({ icon, label, value }) => (
    <View style={{ 
      width: '48%', 
      backgroundColor: 'rgba(0,0,0,0.05)', 
      padding: 8, 
      borderRadius: 8, 
      alignItems: 'center',
      marginBottom: 8,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)'
    }}>
      <MaterialIcons name={icon} size={18} color={theme.colors.primary} style={{ marginBottom: 4 }} />
      <Text style={{ 
        fontSize: 10, 
        color: theme.colors.text.secondary, 
        fontFamily: FONTS.families.secondary,
        textAlign: 'center'
      }}>
        {label}
      </Text>
      <Text style={{ 
        fontSize: 14, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary,
        marginTop: 2
      }}>
        {value}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      {/* Background Layer */}
      <View style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 0,
        pointerEvents: 'none'
      }}>
        <LinearGradient
          colors={['#1E40AF', '#3B82F6', '#1E40AF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ 
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            zIndex: 0
          }}
        />
        <BackgroundSelector
          lightConfig={{
            squareSize: 4,
            gridGap: 6,
            flickerChance: 0.3,
            color: 'rgb(59, 130, 246)',
            maxOpacity: 0.35,
            animationSpeed: 'medium',
          }}
          darkConfig={{
            direction: 'right',
            speed: 1,
            borderColor: '#404040',
            squareSize: 40,
            hoverFillColor: '#222',
          }}
        />
      </View>

      {showCelebration && <WinnerCelebration />}

      <View style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <View style={{
            backgroundColor: theme.colors.background.card,
            borderRadius: 15,
            padding: 20,
            borderWidth: 2,
            borderColor: theme.colors.border.primary,
            width: '100%',
            maxWidth: isLandscape ? 800 : 500,
            alignSelf: 'center',
            maxHeight: isLandscape ? '90%' : '95%',
            shadowColor: theme.colors.border.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 15,
            elevation: 20,
            flexDirection: isLandscape ? 'row' : 'column',
            gap: 20,
            overflow: 'hidden'
        }}>
            {/* Left Side (Portrait: Top) - Winner & Actions */}
            <View style={{ 
              flex: isLandscape ? 0.45 : undefined, 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRightWidth: isLandscape ? 1 : 0,
              borderBottomWidth: isLandscape ? 0 : 1,
              borderColor: 'rgba(0,0,0,0.1)',
              paddingBottom: isLandscape ? 0 : 16,
              paddingRight: isLandscape ? 16 : 0,
              marginBottom: isLandscape ? 0 : 10
            }}>
                <Image 
                  source={require('../assets/logo.png')} 
                  style={{ width: isLandscape ? 100 : 80, height: isLandscape ? 100 : 80, resizeMode: 'contain', marginBottom: 10 }} 
                />
                <Text style={{ 
                  fontSize: 18, 
                  fontWeight: 'bold', 
                  color: theme.colors.text.primary, 
                  fontFamily: FONTS.families.secondary, 
                  marginBottom: 5 
                }}>
                  {roundName}
                </Text>

                {winner && (
                    <View style={{ alignItems: 'center', marginVertical: 10 }}>
                        <Text style={{ fontSize: 32, marginBottom: 5 }}>👑</Text>
                        <Text style={{ 
                          fontSize: 20, 
                          fontWeight: 'bold', 
                          color: theme.colors.text.primary, 
                          fontFamily: FONTS.families.secondary,
                          textAlign: 'center'
                        }}>
                          {winner.name}
                        </Text>
                        <Text style={{ 
                          fontSize: 32, 
                          fontWeight: 'bold', 
                          color: theme.colors.primary 
                        }}>
                          {winner.score}
                        </Text>
                    </View>
                )}

                {isLandscape && (
                    <TouchableOpacity
                        onPress={handleNewRound}
                        disabled={isLoading}
                        style={{
                            backgroundColor: theme.colors.primary,
                            paddingHorizontal: 20,
                            paddingVertical: 12,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            marginTop: 'auto',
                            width: '100%',
                            justifyContent: 'center',
                            shadowColor: theme.colors.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 4
                        }}
                    >
                        {isLoading ? <ActivityIndicator color='#FFF' /> : (
                            <>
                                <MaterialIcons name='refresh' size={20} color='#FFF' style={{ marginRight: 8 }} />
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16, fontFamily: FONTS.families.secondary }}>جولة جديدة</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Right Side (Portrait: Bottom) - Details & Stats */}
            <View style={{ flex: isLandscape ? 0.55 : 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
                    
                    {/* Stats Grid */}
                    <View style={{ marginBottom: 16 }}>
                      <Text style={{ 
                        color: theme.colors.text.secondary, 
                        marginBottom: 8, 
                        textAlign: 'right', 
                        fontFamily: FONTS.families.secondary,
                        fontSize: 13
                      }}>
                        إحصائيات الجولة
                      </Text>
                      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <StatBox icon='people' label='عدد الفرق' value={sortedTeams.length} />
                        <StatBox icon='help' label='الأسئلة' value={stats.totalQuestions || 0} />
                        <StatBox icon='check-circle' label='إجابات صحيحة' value={stats.correctAnswers || 0} />
                        <StatBox icon='trending-up' label='نسبة الدقة' value={`${stats.accuracy || 0}%`} />
                      </View>
                    </View>

                    {/* Rankings */}
                    {sortedTeams.length > 1 && (
                      <View>
                          <Text style={{ 
                            color: theme.colors.text.secondary, 
                            marginBottom: 8, 
                            textAlign: 'right', 
                            fontFamily: FONTS.families.secondary,
                            fontSize: 13
                          }}>
                            باقي الفرق
                          </Text>
                          {sortedTeams.slice(1).map((team) => (
                              <View key={team.name} style={{
                                  flexDirection: 'row-reverse',
                                  alignItems: 'center',
                                  backgroundColor: 'rgba(0,0,0,0.03)',
                                  padding: 10,
                                  borderRadius: 8,
                                  marginBottom: 6,
                                  borderRightWidth: 3,
                                  borderRightColor: theme.colors.border.secondary || '#ccc'
                              }}>
                                  <View style={{ 
                                    width: 20, 
                                    height: 20, 
                                    borderRadius: 10, 
                                    backgroundColor: 'rgba(0,0,0,0.1)', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    marginLeft: 8 
                                  }}>
                                      <Text style={{ color: theme.colors.text.primary, fontSize: 10, fontWeight: 'bold' }}>{team.position}</Text>
                                  </View>
                                  <Text style={{ 
                                    flex: 1, 
                                    textAlign: 'right', 
                                    color: theme.colors.text.primary, 
                                    fontWeight: 'bold', 
                                    fontFamily: FONTS.families.secondary,
                                    fontSize: 13
                                  }}>
                                    {team.name}
                                  </Text>
                                  <Text style={{ 
                                    fontWeight: 'bold', 
                                    color: theme.colors.primary,
                                    fontSize: 14
                                  }}>
                                    {team.score}
                                  </Text>
                              </View>
                          ))}
                      </View>
                    )}
                </ScrollView>

                {!isLandscape && (
                    <TouchableOpacity
                        onPress={handleNewRound}
                        disabled={isLoading}
                        style={{
                            backgroundColor: theme.colors.primary,
                            paddingVertical: 14,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 8,
                            shadowColor: theme.colors.primary,
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 4,
                            elevation: 4
                        }}
                    >
                        {isLoading ? <ActivityIndicator color='#FFF' /> : (
                            <>
                                <MaterialIcons name='refresh' size={22} color='#FFF' style={{ marginRight: 10 }} />
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 16, fontFamily: FONTS.families.secondary }}>جولة جديدة</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
