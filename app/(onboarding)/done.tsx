import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useAuthStore } from '@stores/authStore';
import { useColors } from '@hooks/useColors';
import { Spacing } from '@constants/spacing';

export default function DoneScreen() {
  const colors = useColors();
  const { completeOnboarding } = useAuthStore();
  const scale = useSharedValue(0.6);
  const opacity = useSharedValue(0);

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    scale.value = withTiming(1, { duration: 500 });
    opacity.value = withTiming(1, { duration: 400 });

    const timer = setTimeout(async () => {
      await completeOnboarding();
      router.replace('/(tabs)');
    }, 1800);

    return () => clearTimeout(timer);
  }, [scale, opacity, completeOnboarding]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <ScreenWrapper>
      <Animated.View
        style={[
          animStyle,
          {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            gap: Spacing.xl,
            paddingHorizontal: Spacing.lg,
          },
        ]}
      >
        <WasabiCharacter mood="celebrate" size={120} />
        <View style={{ alignItems: 'center', gap: Spacing.sm }}>
          <Text variant="heading1" style={{ textAlign: 'center' }}>
            You're all set!
          </Text>
          <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
            Time to find your next favorite AYCE spot.
          </Text>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
}
