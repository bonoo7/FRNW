import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminQuestionEditor from '../screens/AdminQuestionEditor';

export default function QuestionEditorPage() {
  return (
    <View style={styles.container}>
      <AdminQuestionEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
