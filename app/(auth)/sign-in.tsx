import { View, Text, Pressable, ActivityIndicator, Platform, Alert } from 'react-native';
import { Redirect } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';

export default function SignInScreen() {
  const { session, isGuest, continueAsGuest } = useAuthStore();

  if (session || isGuest) return <Redirect href="/(tabs)" />;

  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      if (!credential.identityToken) throw new Error('No identity token');

      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) throw error;
    } catch (err: unknown) {
      if (
        err instanceof Error &&
        'code' in err &&
        (err as { code: string }).code === 'ERR_REQUEST_CANCELED'
      ) {
        return;
      }
      Alert.alert('Sign in failed', err instanceof Error ? err.message : 'Please try again.');
    }
  }

  return (
    <View className="flex-1 bg-off-white items-center justify-between px-8 pb-16 pt-24">
      <View className="items-center gap-4">
        <Text className="text-5xl">🍣</Text>
        <Text className="text-3xl font-bold text-charcoal tracking-tight">Sushi Map</Text>
        <Text className="text-base text-charcoal-light text-center mt-1">
          Find every AYCE sushi spot{'\n'}in the tristate area
        </Text>
      </View>

      <View className="w-full gap-3">
        {Platform.OS === 'ios' && (
          <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={12}
            style={{ height: 52, width: '100%' }}
            onPress={handleAppleSignIn}
          />
        )}

        <Pressable
          onPress={continueAsGuest}
          className="w-full h-13 rounded-xl border border-border items-center justify-center"
        >
          <Text className="text-base text-charcoal-mid font-medium">Continue as Guest</Text>
        </Pressable>

        <Text className="text-xs text-charcoal-light text-center mt-2">
          Sign in to save restaurants, log visits, and earn passport stamps.
        </Text>
      </View>
    </View>
  );
}
