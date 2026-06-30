import { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';

export type WasabiMood =
  | 'idle'
  | 'wave'
  | 'peek'
  | 'celebrate'
  | 'think'
  | 'sad'
  | 'eat'
  | 'write'
  | 'point';

type Props = {
  mood?: WasabiMood;
  size?: number;
};

const EMOJI: Record<WasabiMood, string> = {
  idle:      '🍣',
  wave:      '👋',
  peek:      '👀',
  celebrate: '🎉',
  think:     '🤔',
  sad:       '😔',
  eat:       '😋',
  write:     '✍️',
  point:     '👆',
};

export function WasabiCharacter({ mood = 'idle', size = 80 }: Props) {
  const translateY = useSharedValue(0);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  useEffect(() => {
    translateY.value = 0;
    rotate.value = 0;
    scale.value = 1;

    switch (mood) {
      case 'idle':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-4, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
            withTiming(0, { duration: 1800, easing: Easing.inOut(Easing.sin) }),
          ),
          -1,
          false,
        );
        break;
      case 'wave':
        rotate.value = withRepeat(
          withSequence(
            withTiming(0.3, { duration: 200 }),
            withTiming(-0.3, { duration: 200 }),
            withTiming(0, { duration: 200 }),
          ),
          3,
          false,
        );
        break;
      case 'celebrate':
        scale.value = withSequence(
          withTiming(1.3, { duration: 150 }),
          withTiming(0.9, { duration: 100 }),
          withTiming(1.15, { duration: 100 }),
          withTiming(1, { duration: 200 }),
        );
        translateY.value = withSequence(
          withTiming(-16, { duration: 200 }),
          withTiming(0, { duration: 300, easing: Easing.bounce }),
        );
        break;
      case 'think':
        translateY.value = withRepeat(
          withSequence(withTiming(-2, { duration: 1200 }), withTiming(0, { duration: 1200 })),
          -1,
          false,
        );
        break;
      case 'sad':
        translateY.value = withTiming(4, { duration: 400 });
        break;
      case 'peek':
        translateY.value = withRepeat(
          withSequence(withTiming(-6, { duration: 600 }), withTiming(0, { duration: 600 })),
          -1,
          false,
        );
        break;
      case 'write':
        rotate.value = withRepeat(
          withSequence(
            withTiming(0.12, { duration: 400 }),
            withTiming(-0.08, { duration: 400 }),
            withTiming(0, { duration: 200 }),
          ),
          -1,
          false,
        );
        break;
      case 'point':
        translateY.value = withRepeat(
          withSequence(
            withTiming(-8, { duration: 500, easing: Easing.out(Easing.ease) }),
            withTiming(0, { duration: 500, easing: Easing.in(Easing.ease) }),
          ),
          -1,
          false,
        );
        break;
    }
  }, [mood, translateY, rotate, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}rad` },
      { scale: scale.value },
    ],
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
      ]}
    >
      <View
        className="items-center justify-center rounded-full bg-brand-red/10"
        style={{ width: size, height: size }}
      >
        <Text style={{ fontSize: size * 0.55 }}>{EMOJI[mood]}</Text>
      </View>
    </Animated.View>
  );
}
