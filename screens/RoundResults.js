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
      padding: 6, 
      borderRadius: 8, 
      alignItems: 'center',
      marginBottom: 6,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.05)'
    }}>
      <MaterialIcons name={icon} size={16} color={theme.colors.primary} style={{ marginBottom: 3 }} />
      <Text style={{ 
        fontSize: 9, 
        color: theme.colors.text.secondary, 
        fontFamily: FONTS.families.secondary,
        textAlign: 'center'
      }}>
        {label}
      </Text>
      <Text style={{ 
        fontSize: 12, 
        fontWeight: 'bold', 
        color: theme.colors.text.primary,
        marginTop: 2
      }}>
        {value}
      </Text>
    </View>
  );

  return (
    <BackgroundSelector>
      {showCelebration && <WinnerCelebration />}

      <View style={{ flex: 1, justifyContent: 'flex-start', paddingVertical: 8, paddingHorizontal: 8 }}>
        <View style={{
            backgroundColor: theme.colors.background.card,
            borderRadius: 15,
            padding: 14,
            borderWidth: 2,
            borderColor: theme.colors.border.primary,
            width: '100%',
            maxWidth: isLandscape ? 800 : '96%',
            alignSelf: 'center',
            flex: isLandscape ? undefined : 1,
            maxHeight: isLandscape ? '90%' : undefined,
            shadowColor: theme.colors.border.primary,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: 15,
            elevation: 20,
            flexDirection: isLandscape ? 'row' : 'column',
            gap: 16,
            overflow: 'hidden'
        }}>
            {/* Left Side (Portrait: Top) - Winner & Actions */}
            <View style={{ 
              flex: isLandscape ? 0.45 : undefined,
              height: isLandscape ? undefined : 'auto',
              alignItems: 'center', 
              justifyContent: 'center',
              borderRightWidth: isLandscape ? 1 : 0,
              borderBottomWidth: isLandscape ? 0 : 1,
              borderColor: 'rgba(0,0,0,0.1)',
              paddingBottom: isLandscape ? 0 : 10,
              paddingRight: isLandscape ? 12 : 0,
              paddingTop: isLandscape ? 0 : 6,
              marginBottom: isLandscape ? 0 : 6
            }}>
                <View style={{
                  width: isLandscape ? 120 : 80,
                  height: isLandscape ? 120 : 80,
                  borderRadius: isLandscape ? 60 : 40,
                  backgroundColor: theme.colors.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 6,
                  shadowColor: theme.colors.primary,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.4,
                  shadowRadius: 8,
                  elevation: 8,
                }}>
                  <Image 
                    source={require('../assets/logo.png')} 
                    style={{ width: isLandscape ? 100 : 65, height: isLandscape ? 100 : 65, resizeMode: 'contain' }} 
                  />
                </View>
                <Text style={{ 
                  fontSize: isLandscape ? 18 : 15, 
                  fontWeight: 'bold', 
                  color: theme.colors.text.primary, 
                  fontFamily: FONTS.families.secondary, 
                  marginBottom: 3
                }}>
                  {roundName}
                </Text>

                {winner && (
                    <View style={{ alignItems: 'center', marginVertical: 6 }}>
                        <Text style={{ fontSize: isLandscape ? 32 : 26, marginBottom: 4 }}>👑</Text>
                        <Text style={{ 
                          fontSize: isLandscape ? 20 : 17, 
                          fontWeight: 'bold', 
                          color: theme.colors.text.primary, 
                          fontFamily: FONTS.families.secondary,
                          textAlign: 'center'
                        }}>
                          {winner.name}
                        </Text>
                        <Text style={{ 
                          fontSize: isLandscape ? 32 : 26, 
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
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14, fontFamily: FONTS.families.secondary }}>جولة جديدة</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>

            {/* Right Side (Portrait: Bottom) - Details & Stats */}
            <View style={{ flex: isLandscape ? 0.55 : 1 }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 6 }}>
                    
                    {/* Stats Grid */}
                    <View style={{ marginBottom: 10 }}>
                      <Text style={{ 
                        color: theme.colors.text.secondary, 
                        marginBottom: 5, 
                        textAlign: 'right', 
                        fontFamily: FONTS.families.secondary,
                        fontSize: 11
                      }}>
                        إحصائيات الجولة
                      </Text>
                      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                        <StatBox icon='people' label='عدد الفرق' value={sortedTeams.length} />
                        <StatBox icon='help' label='الأسئلة' value={stats.totalQuestions || 0} />
                      </View>
                    </View>

                    {/* Categories Table */}
                    {gameData?.categories && gameData.categories.length > 0 && (
                      <View style={{ marginTop: 10 }}>
                        <Text style={{ 
                          color: theme.colors.text.secondary, 
                          marginBottom: 5, 
                          textAlign: 'right', 
                          fontFamily: FONTS.families.secondary,
                          fontSize: 11
                        }}>
                          نتائج الفئات
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <View style={{ borderWidth: 1, borderColor: 'rgba(0,0,0,0.1)', borderRadius: 8, overflow: 'hidden' }}>
                            {/* Header */}
                            <View style={{ flexDirection: 'row-reverse', backgroundColor: `${theme.colors.primary}20`, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.1)' }}>
                              <View style={{ width: 90, paddingHorizontal: 8, paddingVertical: 6, borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.1)' }}>
                                <Text style={{ fontSize: 9, fontWeight: 'bold', color: theme.colors.text.primary, textAlign: 'right' }}>الفئة</Text>
                              </View>
                              {sortedTeams.map((team) => (
                                <View key={team.name} style={{ minWidth: 70, paddingHorizontal: 6, paddingVertical: 6, borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.1)', alignItems: 'center' }}>
                                  <Text style={{ fontSize: 8, fontWeight: 'bold', color: theme.colors.text.primary, textAlign: 'center' }}>{team.name}</Text>
                                </View>
                              ))}
                            </View>

                            {/* Rows */}
                            {gameData.categories.map((category, idx) => (
                              <View key={idx} style={{ flexDirection: 'row-reverse', borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)' }}>
                                <View style={{ width: 90, paddingHorizontal: 8, paddingVertical: 6, borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.1)' }}>
                                  <Text style={{ fontSize: 8, color: theme.colors.text.secondary, textAlign: 'right' }}>{category || 'بدون اسم'}</Text>
                                </View>
                                {sortedTeams.map((team) => {
                                  const teamStats = gameData.categoryStats?.[team.name]?.[category] || {};
                                  return (
                                    <View key={team.name} style={{ minWidth: 70, paddingHorizontal: 6, paddingVertical: 6, borderRightWidth: 1, borderRightColor: 'rgba(0,0,0,0.1)', alignItems: 'center' }}>
                                      <Text style={{ fontSize: 8, fontWeight: 'bold', color: theme.colors.primary, textAlign: 'center' }}>{teamStats.points || 0}</Text>
                                      <Text style={{ fontSize: 7, color: theme.colors.text.secondary, marginTop: 2 }}>✓ {teamStats.correct || 0}</Text>
                                    </View>
                                  );
                                })}
                              </View>
                            ))}
                          </View>
                        </ScrollView>
                      </View>
                    )}

                    {/* Rankings */}
                    {sortedTeams.length > 1 && (
                      <View>
                          <Text style={{ 
                            color: theme.colors.text.secondary, 
                            marginBottom: 5, 
                            textAlign: 'right', 
                            fontFamily: FONTS.families.secondary,
                            fontSize: 11
                          }}>
                            باقي الفرق
                          </Text>
                          {sortedTeams.slice(1).map((team) => (
                              <View key={team.name} style={{
                                  flexDirection: 'row-reverse',
                                  alignItems: 'center',
                                  backgroundColor: 'rgba(0,0,0,0.03)',
                                  padding: 7,
                                  borderRadius: 8,
                                  marginBottom: 3,
                                  borderRightWidth: 3,
                                  borderRightColor: theme.colors.border.secondary || '#ccc'
                              }}>
                                  <View style={{ 
                                    width: 18, 
                                    height: 18, 
                                    borderRadius: 9, 
                                    backgroundColor: 'rgba(0,0,0,0.1)', 
                                    alignItems: 'center', 
                                    justifyContent: 'center', 
                                    marginLeft: 6 
                                  }}>
                                      <Text style={{ color: theme.colors.text.primary, fontSize: 9, fontWeight: 'bold' }}>{team.position}</Text>
                                  </View>
                                  <Text style={{ 
                                    flex: 1, 
                                    textAlign: 'right', 
                                    color: theme.colors.text.primary, 
                                    fontWeight: 'bold', 
                                    fontFamily: FONTS.families.secondary,
                                    fontSize: 12
                                  }}>
                                    {team.name}
                                  </Text>
                                  <Text style={{ 
                                    fontWeight: 'bold', 
                                    color: theme.colors.primary,
                                    fontSize: 13
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
                            paddingVertical: 12,
                            borderRadius: 12,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: 6,
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
                                <Text style={{ color: '#FFF', fontWeight: 'bold', fontSize: 14, fontFamily: FONTS.families.secondary }}>جولة جديدة</Text>
                            </>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </View>
      </View>
    </BackgroundSelector>
  );
}

