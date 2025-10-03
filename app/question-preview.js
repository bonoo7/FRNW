import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import QuestionScreen from '../screens/QuestionScreen';
import StorageService from '../services/storageService';
import BackgroundPattern from '../components/BackgroundPattern';
import { useTheme } from '../contexts/ThemeContext';

export default function QuestionPreviewPage() {
  const { theme } = useTheme();
  const [questionData, setQuestionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPreviewData = async () => {
      try {
        const previewDataString = await StorageService.getItem('previewQuestionData');
        if (previewDataString) {
          const previewData = JSON.parse(previewDataString);
          setQuestionData(previewData);
        }
      } catch (error) {
        console.error('خطأ في تحميل بيانات المعاينة:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPreviewData();
  }, []);

  if (loading) {
    return (
      <BackgroundPattern>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: theme.colors.text.primary }]}>
            جاري تحميل السؤال...
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  if (!questionData) {
    return (
      <BackgroundPattern>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, { color: theme.colors.text.primary }]}>
            لم يتم العثور على بيانات السؤال للمعاينة
          </Text>
        </View>
      </BackgroundPattern>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'معاينة السؤال',
          headerShown: false,
        }}
      />
      <QuestionScreen questionData={questionData} />
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
