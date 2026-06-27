import { View, Text, Pressable, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { session, isGuest, signOut } = useAuthStore();
  const router = useRouter();

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore — we clear local state regardless
    }
    signOut();
  }

  function handleSignIn() {
    router.push('/(auth)/sign-in');
  }

  if (isGuest || !session) {
    return (
      <View
        className="flex-1 bg-off-white items-center justify-center px-8"
        style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
      >
        <Text className="text-4xl mb-4">👤</Text>
        <Text className="text-xl font-bold text-charcoal mb-2">You're browsing as a guest</Text>
        <Text className="text-sm text-charcoal-light text-center mb-6">
          Sign in to save restaurants, log visits, earn passport stamps, and sync across devices.
        </Text>
        <Pressable
          onPress={handleSignIn}
          className="bg-charcoal px-8 py-3.5 rounded-xl w-full items-center"
        >
          <Text className="text-white font-semibold text-base">Sign In</Text>
        </Pressable>
      </View>
    );
  }

  const email = session.user.email;
  const initials = email ? email[0]?.toUpperCase() ?? '?' : '?';

  return (
    <View
      className="flex-1 bg-off-white"
      style={{ paddingTop: insets.top }}
    >
      <View className="px-4 pt-4 pb-6 border-b border-border">
        <Text className="text-2xl font-bold text-charcoal mb-4">Profile</Text>
        <View className="flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-full bg-salmon items-center justify-center">
            <Text className="text-2xl font-bold text-white">{initials}</Text>
          </View>
          <View>
            <Text className="text-base font-semibold text-charcoal">{email}</Text>
            <Text className="text-sm text-charcoal-light mt-0.5">Member</Text>
          </View>
        </View>
      </View>

      <View className="px-4 pt-4 gap-2">
        <SettingsRow label="Notifications" onPress={() => {}} />
        <SettingsRow label="Privacy" onPress={() => {}} />
        <SettingsRow label="About" onPress={() => {}} />
      </View>

      <View className="px-4 mt-auto pb-8">
        <Pressable
          onPress={() =>
            Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Sign Out', style: 'destructive', onPress: handleSignOut },
            ])
          }
          className="border border-error rounded-xl py-3.5 items-center"
        >
          <Text className="text-error font-semibold text-base">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SettingsRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center justify-between py-3.5 border-b border-border active:opacity-60"
    >
      <Text className="text-base text-charcoal">{label}</Text>
      <Text className="text-charcoal-light text-lg">›</Text>
    </Pressable>
  );
}
