import '../global.css';

import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AppState, useColorScheme } from 'react-native';
import { supabase } from '@lib/supabase';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@stores/authStore';
import { useJournalStore } from '@stores/journalStore';
import { useSavedStore } from '@stores/savedStore';
import { useSearchStore } from '@stores/searchStore';
import { useAppearanceStore } from '@stores/appearanceStore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 2 },
  },
});

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <AppNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppNavigator() {
  const { hydrated, onboardingCompleted, hydrate } = useAuthStore();
  const hydrateJournal = useJournalStore((s) => s.hydrate);
  const hydrateSaved = useSavedStore((s) => s.hydrate);
  const hydrateSearch = useSearchStore((s) => s.hydrate);
  const hydrateAppearance = useAppearanceStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
    hydrateJournal();
    hydrateSaved();
    hydrateSearch();
    hydrateAppearance();
  }, [hydrate, hydrateJournal, hydrateSaved, hydrateSearch, hydrateAppearance]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') supabase.auth.startAutoRefresh();
      else supabase.auth.stopAutoRefresh();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!onboardingCompleted) {
      router.replace('/(onboarding)');
    }
  }, [hydrated, onboardingCompleted]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(onboarding)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="restaurant/[id]"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="search"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="journal/create"
        options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
      />
      <Stack.Screen
        name="journal/[id]"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="legal/terms"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
      <Stack.Screen
        name="legal/privacy"
        options={{ presentation: 'card', animation: 'slide_from_right' }}
      />
    </Stack>
  );
}
