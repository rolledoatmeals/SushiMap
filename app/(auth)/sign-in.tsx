import { View, Text, Pressable, Platform, Alert } from 'react-native';
import { Redirect } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthStore } from '@/store/auth';
import { supabase } from '@/lib/supabase';
import { isOnboardingComplete } from '@/utils/preferences';

export default function SignInScreen() {
  const { session, isGuest, continueAsGuest } = useAuthStore();
  const insets = useSafeAreaInsets();

  if (session || isGuest) {
    return <Redirect href={isOnboardingComplete() ? '/(tabs)' : '/(onboarding)'} />;
  }

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
    <View style={{ flex: 1, backgroundColor: '#F8F4EF' }}>

      {/* Decorative bg emoji */}
      <Text style={{
        position: 'absolute',
        top: 40,
        right: -24,
        fontSize: 180,
        opacity: 0.05,
      }}>
        🍣
      </Text>

      <View style={{
        flex: 1,
        paddingHorizontal: 28,
        paddingTop: insets.top + 32,
        paddingBottom: insets.bottom + 24,
        justifyContent: 'space-between',
      }}>

        {/* Hero */}
        <View style={{ alignItems: 'center', gap: 16 }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 28,
            backgroundColor: '#E8735A',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#E8735A',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.35,
            shadowRadius: 16,
          }}>
            <Text style={{ fontSize: 44 }}>🍣</Text>
          </View>

          <View style={{ alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 32, fontWeight: '800', color: '#2C2926', letterSpacing: -0.5 }}>
              Sushi Map
            </Text>
            <Text style={{ fontSize: 15, color: '#8A7E78', textAlign: 'center', lineHeight: 22 }}>
              Every AYCE sushi spot in the{'\n'}tristate area, in one place.
            </Text>
          </View>
        </View>

        {/* Feature highlights */}
        <View style={{ gap: 12 }}>
          <FeatureRow
            emoji="🗺️"
            title="Map every spot"
            desc="Browse NYC & NJ AYCE restaurants with live open/closed status"
          />
          <FeatureRow
            emoji="📓"
            title="Track your visits"
            desc="Log prices, notes, and photos each time you go"
          />
          <FeatureRow
            emoji="🎖️"
            title="Collect stamps"
            desc="Earn passport stamps and unlock achievements as you explore"
          />
        </View>

        {/* CTA buttons */}
        <View style={{ gap: 12 }}>
          {Platform.OS === 'ios' && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={14}
              style={{ height: 54, width: '100%' }}
              onPress={handleAppleSignIn}
            />
          )}

          <Pressable
            onPress={continueAsGuest}
            style={({ pressed }) => ({
              height: 54,
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: '#EDE8E3',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: pressed ? '#EDE8E3' : '#FFFFFF',
            })}
          >
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#4A4440' }}>
              Continue as Guest
            </Text>
          </Pressable>

          <Text style={{ fontSize: 12, color: '#8A7E78', textAlign: 'center', lineHeight: 18 }}>
            Sign in to save restaurants, log visits, and earn passport stamps.
          </Text>
        </View>

      </View>
    </View>
  );
}

function FeatureRow({ emoji, title, desc }: { emoji: string; title: string; desc: string }) {
  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: '#EDE8E3',
    }}>
      <View style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#F8F4EF',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C2926', marginBottom: 2 }}>
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: '#8A7E78', lineHeight: 17 }}>
          {desc}
        </Text>
      </View>
    </View>
  );
}
