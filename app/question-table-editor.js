import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import AdminQuestionTableEditor from '../screens/AdminQuestionTableEditor';

export default function QuestionTableEditorPage() {
  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          headerShown: false,
          contentStyle: { padding: 0, margin: 0 }
        }} 
      />
      <AdminQuestionTableEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    margin: 0,
  },
});
