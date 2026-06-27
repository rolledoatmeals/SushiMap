import { Tabs, Redirect } from 'expo-router';
import { Text } from 'react-native';
import { useAuthStore } from '@/store/auth';
import { isOnboardingComplete } from '@/utils/preferences';

export default function TabsLayout() {
  const { session, isGuest, isLoading } = useAuthStore();

  if (isLoading) return null;
  if (!session && !isGuest) return <Redirect href="/(auth)/sign-in" />;
  if (!isOnboardingComplete()) return <Redirect href="/(onboarding)" />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#E8735A',
        tabBarInactiveTintColor: '#8A7E78',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#EDE8E3',
          borderTopWidth: 1,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{ title: 'Map', tabBarIcon: () => <TabIcon emoji="🗺️" /> }}
      />
      <Tabs.Screen
        name="explore"
        options={{ title: 'Explore', tabBarIcon: () => <TabIcon emoji="🔍" /> }}
      />
      <Tabs.Screen
        name="journal"
        options={{ title: 'Journal', tabBarIcon: () => <TabIcon emoji="📓" /> }}
      />
      <Tabs.Screen
        name="passport"
        options={{ title: 'Passport', tabBarIcon: () => <TabIcon emoji="🎖️" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: () => <TabIcon emoji="👤" /> }}
      />
    </Tabs>
  );
}

function TabIcon({ emoji }: { emoji: string }) {
  return <Text style={{ fontSize: 20 }}>{emoji}</Text>;
}
