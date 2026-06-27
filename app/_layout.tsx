import '../global.css';
import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RepositoryProvider } from '@/services/repositories/RepositoryContext';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

const queryClient = new QueryClient();

function AuthInitializer() {
  const { setSession } = useAuthStore();

  useEffect(() => {
    let unsub: (() => void) | undefined;

    (async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
      } catch {
        setSession(null);
      }

      try {
        const { data } = supabase.auth.onAuthStateChange((_, session) => {
          setSession(session);
        });
        unsub = () => data.subscription.unsubscribe();
      } catch {
        // env vars not available — stay in guest/loading state
      }
    })();

    return () => unsub?.();
  }, [setSession]);

  return null;
}

export default function RootLayout() {
  const session = useAuthStore((s) => s.session);

  return (
    <QueryClientProvider client={queryClient}>
      <RepositoryProvider isAuthenticated={!!session}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <AuthInitializer />
          <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
      </RepositoryProvider>
    </QueryClientProvider>
  );
}
