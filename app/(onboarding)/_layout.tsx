import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="index" options={{ animation: 'fade' }} />
      <Stack.Screen name="welcome" />
      <Stack.Screen name="name" />
      <Stack.Screen name="preferences" />
      <Stack.Screen name="location" />
      <Stack.Screen name="done" options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack>
  );
}
