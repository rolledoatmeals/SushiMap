import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { Typography, type TypographyVariant } from '@constants/typography';
import { useColors } from '@hooks/useColors';

interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: string;
}

export function Text({ variant = 'body', color, style, ...props }: TextProps) {
  const colors = useColors();
  return (
    <RNText
      style={[Typography[variant], { color: color ?? colors.textPrimary }, style]}
      {...props}
    />
  );
}
