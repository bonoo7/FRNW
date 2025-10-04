import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import QuestionScreen from '../../screens/QuestionScreen';
import { Stack } from 'expo-router';
import RequiredAuthWrapper from '../../components/RequiredAuthWrapper';

export default function QuestionRoute() {
  const params = useLocalSearchParams();
  let questionData;
  
  try {
    questionData = JSON.parse(params.questionData);
    console.log('Parsed question data:', questionData);
  } catch (error) {
    console.error('Error parsing question data:', error);
    return null;
  }

  return (
    <RequiredAuthWrapper 
      title="السؤال يتطلب تسجيل الدخول"
      message="لعرض الأسئلة والمشاركة في اللعبة، يجب تسجيل الدخول أولاً"
    >
      <QuestionScreen questionData={questionData} />
    </RequiredAuthWrapper>
  );
}