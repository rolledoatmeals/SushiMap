import {
  Pressable,
  ActivityIndicator,
  type PressableProps,
  type ViewStyle,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text } from './Text';
import { Colors } from '@constants/colors';
import { Radius } from '@constants/radius';
import { Spacing } from '@constants/spacing';
import { useColors } from '@hooks/useColors';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const SIZE_STYLES: Record<
  ButtonSize,
  { paddingVertical: number; paddingHorizontal: number; minHeight: number }
> = {
  sm: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.md, minHeight: 36 },
  md: { paddingVertical: Spacing.sm + 6, paddingHorizontal: Spacing.lg, minHeight: 48 },
  lg: { paddingVertical: Spacing.md + 4, paddingHorizontal: Spacing.xl, minHeight: 56 },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  onPress,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const colors = useColors();
  const isDisabled = disabled || loading;

  const bg: Record<ButtonVariant, string> = {
    primary: isDisabled ? colors.surface2 : Colors.salmon,
    secondary: colors.surface,
    ghost: 'transparent',
    destructive: isDisabled ? colors.surface2 : Colors.closedRed,
  };

  const textColor: Record<ButtonVariant, string> = {
    primary: isDisabled ? colors.textTertiary : '#FFFFFF',
    secondary: isDisabled ? colors.textTertiary : colors.textPrimary,
    ghost: isDisabled ? colors.textTertiary : Colors.salmon,
    destructive: isDisabled ? colors.textTertiary : '#FFFFFF',
  };

  const borderColor: Record<ButtonVariant, string | undefined> = {
    primary: undefined,
    secondary: isDisabled ? colors.border : colors.textSecondary,
    ghost: undefined,
    destructive: undefined,
  };

  const shadowStyle =
    variant === 'primary' && !isDisabled
      ? Platform.select({
          ios: {
            shadowColor: Colors.salmon,
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.3,
            shadowRadius: 6,
          },
          android: { elevation: 4 },
        })
      : {};

  async function handlePress(e: Parameters<NonNullable<PressableProps['onPress']>>[0]) {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  }

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          backgroundColor: bg[variant],
          borderRadius: size === 'lg' ? Radius.xl : Radius.lg,
          borderWidth: borderColor[variant] ? 1 : 0,
          borderColor: borderColor[variant],
          alignItems: 'center' as const,
          justifyContent: 'center' as const,
          flexDirection: 'row' as const,
          gap: Spacing.sm,
          width: fullWidth ? '100%' : undefined,
          opacity: pressed && !isDisabled ? 0.88 : 1,
          transform: [{ scale: pressed && !isDisabled ? 0.98 : 1 }],
          ...SIZE_STYLES[size],
          ...shadowStyle,
        },
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled }}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={textColor[variant]} />
      ) : (
        <Text
          variant={size === 'sm' ? 'bodySmall' : 'body'}
          color={textColor[variant]}
          style={{ fontWeight: '700', letterSpacing: 0.2 }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
