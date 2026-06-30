import { useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useColors } from '@hooks/useColors';
import { Radius } from '@constants/radius';
import { Spacing } from '@constants/spacing';

interface SkeletonBoxProps {
  width?: number | `${number}%`;
  height: number;
  radius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({
  width = '100%',
  height,
  radius = Radius.md,
  style,
}: SkeletonBoxProps) {
  const colors = useColors();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        { width, height, borderRadius: radius, backgroundColor: colors.border },
        style,
      ]}
      accessibilityRole="none"
    />
  );
}

// Preset: matches the shape of a RestaurantCard
export function RestaurantCardSkeleton() {
  const colors = useColors();
  return (
    <View
      style={{
        backgroundColor: colors.surface,
        borderRadius: Radius.xl,
        padding: Spacing.base,
        gap: Spacing.sm,
        shadowColor: '#000',
        shadowOpacity: 0.07,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
      }}
    >
      <SkeletonBox height={180} radius={Radius.lg} />
      <SkeletonBox height={20} width="60%" />
      <SkeletonBox height={16} width="40%" />
      <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
        <SkeletonBox height={24} width={60} radius={Radius.pill} />
        <SkeletonBox height={24} width={50} radius={Radius.pill} />
      </View>
    </View>
  );
}
