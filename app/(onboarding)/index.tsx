import { useEffect } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Text } from '@components/ui/Text';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useColors } from '@hooks/useColors';
import { Spacing } from '@constants/spacing';

export default function SplashScreen() {
  const colors = useColors();
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 400 });
    const timer = setTimeout(() => {
      router.replace('/(onboarding)/welcome');
    }, 2200);
    return () => clearTimeout(timer);
  }, [opacity]);

  const fadeStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        fadeStyle,
        {
          flex: 1,
          backgroundColor: colors.background,
          alignItems: 'center',
          justifyContent: 'center',
          gap: Spacing.xl,
        },
      ]}
    >
      <WasabiCharacter mood="idle" size={100} />
      <View style={{ alignItems: 'center', gap: Spacing.xs }}>
        <Text variant="heading1">SushiMap</Text>
        <Text variant="body" color={colors.textSecondary}>
          All-you-can-eat, verified.
        </Text>
      </View>
    </Animated.View>
  );
}
