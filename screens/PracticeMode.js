import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import DifficultySelector from '../components/DifficultySelector';
import TimeLimitSlider from '../components/TimeLimitSlider';
import StartPracticeButton from '../components/StartPracticeButton';
import BackgroundSelector from '../components/BackgroundSelector';
import { useTheme } from '@react-navigation/native';
import { SPACING } from '../constants/spacing';

const PracticeMode = () => {
  const [difficulty, setDifficulty] = useState('easy');
  const [timeLimit, setTimeLimit] = useState(60);
  const theme = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
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
      <SafeAreaView style={[styles.container]}>
        <View style={styles.mainContainer}>
          <View style={[styles.content, { backgroundColor: theme.colors.background.card }]}>
            <DifficultySelector value={difficulty} onChange={setDifficulty} />
            <TimeLimitSlider value={timeLimit} onChange={setTimeLimit} />
            <StartPracticeButton onPress={() => {}} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: SPACING.md,
  },
  content: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    padding: SPACING.md,
  },
});

export default PracticeMode; 