import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useAuthStore } from '@stores/authStore';
import { useColors } from '@hooks/useColors';

import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';

export default function WelcomeScreen() {
  const colors = useColors();
  const { setGuest, setAppleUser } = useAuthStore();
  const [appleAvailable, setAppleAvailable] = useState(false);

  const wasabiY = useSharedValue(120);
  const wasabiOpacity = useSharedValue(0);
  const contentOpacity = useSharedValue(0);

  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));

    wasabiY.value = withDelay(
      300,
      withTiming(0, { duration: 600, easing: Easing.out(Easing.back(1.4)) }),
    );
    wasabiOpacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    contentOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
  }, [wasabiY, wasabiOpacity, contentOpacity]);

  const wasabiStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: wasabiY.value }],
    opacity: wasabiOpacity.value,
  }));
  const contentStyle = useAnimatedStyle(() => ({ opacity: contentOpacity.value }));

  async function handleGuest() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setGuest();
    router.push('/(onboarding)/name');
  }

  async function handleAppleSignIn() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const name = [credential.fullName?.givenName, credential.fullName?.familyName]
        .filter(Boolean)
        .join(' ');
      await setAppleUser(credential.user, name, credential.email ?? '');
      router.push('/(onboarding)/name');
    } catch {
      // User cancelled or error — stay on screen
    }
  }

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing['3xl'],
          paddingBottom: Spacing['2xl'],
        }}
      >
        <Animated.View style={[wasabiStyle, { alignItems: 'center' }]}>
          <WasabiCharacter mood="wave" size={110} />
          <View style={{ alignItems: 'center', gap: Spacing.xs, marginTop: Spacing.xl }}>
            <Text variant="heading1">Welcome to SushiMap</Text>
            <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
              The only app for verified{'\n'}all-you-can-eat sushi
            </Text>
          </View>
        </Animated.View>

        <Animated.View style={[contentStyle, { gap: Spacing.md }]}>
          {appleAvailable && (
            <AppleAuthentication.AppleAuthenticationButton
              buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
              buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
              cornerRadius={Radius.xl}
              style={{ height: 56, width: '100%' }}
              onPress={handleAppleSignIn}
            />
          )}
          <Button
            label="Continue as Guest"
            variant="secondary"
            size="lg"
            fullWidth
            onPress={handleGuest}
          />
          <Text
            variant="caption"
            color={colors.textTertiary}
            style={{ textAlign: 'center', marginTop: Spacing.xs }}
          >
            By continuing you agree to our Terms of Service and Privacy Policy. Guest data migrates
            to your account on sign-in.
          </Text>
        </Animated.View>
      </View>
    </ScreenWrapper>
  );
}
