import React from 'react';
import { View, StyleSheet } from 'react-native';
import AdminQuestionTableEditor from '../../screens/AdminQuestionTableEditor';

export default function QuestionTableEditorPage() {
  return (
    <View style={styles.container}>
      <AdminQuestionTableEditor />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
