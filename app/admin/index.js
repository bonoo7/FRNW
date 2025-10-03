import { Redirect } from 'expo-router';

export default function AdminIndex() {
  // Redirigir a la página del editor de preguntas
  return <Redirect href="/admin/question-editor" />;
}
