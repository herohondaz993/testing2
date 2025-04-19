import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to tabs directly
  return <Redirect href="/(tabs)" />;
}