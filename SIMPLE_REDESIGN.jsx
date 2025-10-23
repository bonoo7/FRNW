// تصميم بسيط لصفحة البداية - SimpleHomeScreen.jsx
// هذا هو التصميم البسيط والواضح الذي سيحل مشكلة عدم ظهور الخانات

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
  Platform,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { SPACING, FONTS } from '../styles/theme';
import { useTheme } from '../contexts/ThemeContext';
import BackgroundPattern from '../components/BackgroundPattern';
import { Stack, useFocusEffect } from 'expo-router';

const SimpleHomeScreen = () => {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [isLoading, setIsLoading] = useState(false);
  const [gameSettings, setGameSettings] = useState({
    roundName: '',
    teamCount: 2,
    teams: ['', ''],
  });

  useFocusEffect(
    React.useCallback(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
      return () => fadeAnim.setValue(0);
    }, [])
  );

  const updateTeamCount = (count) => {
    const newTeams = Array(count).fill('');
    gameSettings.teams.forEach((team, index) => {
      if (index < count) newTeams[index] = team;
    });
    setGameSettings(prev => ({
      ...prev,
      teamCount: count,
      teams: newTeams
    }));
  };

  const updateTeam = (index, value) => {
    const newTeams = [...gameSettings.teams];
    newTeams[index] = value;
    setGameSettings(prev => ({ ...prev, teams: newTeams }));
  };

  const getDefaultTeamName = (index) => {
    const names = ['الفريق الأحمر', 'الفريق الأزرق', 'الفريق الأخضر', 'الفريق الأصفر', 'الفريق البرتقالي'];
    return names[index] || `الفريق ${index + 1}`;
  };

  const handleStartGame = async () => {
    if (!gameSettings.roundName.trim()) {
      alert('من فضلك أدخل اسم الجولة');
      return;
    }
    if (gameSettings.teams.some(t => !t.trim())) {
      alert('من فضلك أدخل أسماء جميع الفرق');
      return;
    }
    setIsLoading(true);
    // محاكاة تأخير
    setTimeout(() => {
      setIsLoading(false);
      // الانتقال للعبة
    }, 500);
  };

  return (
    <BackgroundPattern style={{ flex: 1 }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {/* الرأس الأزرق */}
          <LinearGradient
            colors={['#1E40AF', '#3B82F6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: SPACING.lg,
              paddingTop: SPACING.xl,
              paddingBottom: SPACING.xl,
              borderBottomLeftRadius: 30,
              borderBottomRightRadius: 30,
              marginBottom: SPACING.lg,
            }}
          >
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#FFFFFF',
              textAlign: 'center',
              marginBottom: SPACING.sm,
              fontFamily: FONTS.families.secondary,
            }}>
              🎮 فكّر
            </Text>
            <Text style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              fontFamily: FONTS.families.secondary,
            }}>
              إعداد لعبة جديدة
            </Text>
          </LinearGradient>

          {/* المحتوى الرئيسي */}
          <View style={{ paddingHorizontal: SPACING.lg, paddingBottom: SPACING.xl }}>
            {/* قسم عدد الفرق */}
            <View style={{ marginBottom: SPACING.xl }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <MaterialIcons name="group" size={28} color="#1E40AF" />
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333',
                  marginLeft: SPACING.md,
                  fontFamily: FONTS.families.secondary,
                }}>
                  عدد الفرق
                </Text>
              </View>

              <View style={{
                flexDirection: 'row-reverse',
                justifyContent: 'space-around',
                backgroundColor: '#F5F5F5',
                borderRadius: 15,
                padding: SPACING.md,
              }}>
                {[2, 3, 4, 5].map(count => (
                  <TouchableOpacity
                    key={count}
                    onPress={() => updateTeamCount(count)}
                    style={{
                      paddingHorizontal: SPACING.md,
                      paddingVertical: SPACING.sm,
                      borderRadius: 10,
                      borderWidth: 2,
                      borderColor: gameSettings.teamCount === count ? '#1E40AF' : '#DDD',
                      backgroundColor: gameSettings.teamCount === count ? '#1E40AF' : '#FFF',
                    }}
                  >
                    <Text style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: gameSettings.teamCount === count ? '#FFF' : '#333',
                      fontFamily: FONTS.families.secondary,
                    }}>
                      {count}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* قسم اسم الجولة */}
            <View style={{ marginBottom: SPACING.xl }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <MaterialIcons name="edit" size={28} color="#1E40AF" />
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333',
                  marginLeft: SPACING.md,
                  fontFamily: FONTS.families.secondary,
                }}>
                  اسم الجولة
                </Text>
              </View>

              <TextInput
                style={{
                  borderWidth: 2,
                  borderColor: '#1E40AF',
                  borderRadius: 12,
                  paddingHorizontal: SPACING.md,
                  paddingVertical: SPACING.md,
                  fontSize: 16,
                  fontFamily: FONTS.families.secondary,
                  color: '#333',
                  textAlign: 'right',
                  backgroundColor: '#FFF',
                  minHeight: 50,
                }}
                placeholder="الجولة الأولى"
                placeholderTextColor="#CCC"
                value={gameSettings.roundName}
                onChangeText={(value) => setGameSettings(prev => ({ ...prev, roundName: value }))}
              />
            </View>

            {/* قسم أسماء الفرق */}
            <View style={{ marginBottom: SPACING.xl }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.md }}>
                <MaterialIcons name="people" size={28} color="#1E40AF" />
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#333',
                  marginLeft: SPACING.md,
                  fontFamily: FONTS.families.secondary,
                }}>
                  أسماء الفرق
                </Text>
              </View>

              <View style={{
                flexDirection: 'row-reverse',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}>
                {Array.from({ length: gameSettings.teamCount }).map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: gameSettings.teamCount <= 2 ? '48%' : gameSettings.teamCount === 3 ? '31%' : '23%',
                      marginBottom: SPACING.lg,
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: '#666',
                      marginBottom: SPACING.sm,
                      fontFamily: FONTS.families.secondary,
                      textAlign: 'right',
                    }}>
                      الفريق {index + 1}
                    </Text>
                    <TextInput
                      style={{
                        borderWidth: 2,
                        borderColor: '#1E40AF',
                        borderRadius: 10,
                        paddingHorizontal: SPACING.md,
                        paddingVertical: SPACING.sm,
                        fontSize: 14,
                        fontFamily: FONTS.families.secondary,
                        color: '#333',
                        textAlign: 'right',
                        backgroundColor: '#FFF',
                        minHeight: 45,
                      }}
                      placeholder={getDefaultTeamName(index)}
                      placeholderTextColor="#CCC"
                      value={gameSettings.teams[index]}
                      onChangeText={(value) => updateTeam(index, value)}
                    />
                  </View>
                ))}
              </View>
            </View>

            {/* زر البدء */}
            <TouchableOpacity
              onPress={handleStartGame}
              disabled={isLoading}
              style={{
                backgroundColor: '#1E40AF',
                borderRadius: 14,
                paddingVertical: SPACING.lg,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                opacity: isLoading ? 0.7 : 1,
                elevation: 5,
                shadowColor: '#1E40AF',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="large" />
              ) : (
                <>
                  <MaterialIcons name="play-arrow" size={28} color="#FFFFFF" />
                  <Text style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: '#FFFFFF',
                    marginLeft: SPACING.sm,
                    fontFamily: FONTS.families.secondary,
                  }}>
                    بدء اللعبة
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </BackgroundPattern>
  );
};

export default SimpleHomeScreen;
