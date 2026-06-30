import { View, type ViewProps, type ViewStyle } from 'react-native';
import { useColors } from '@hooks/useColors';
import { Radius } from '@constants/radius';
import { Spacing } from '@constants/spacing';

interface CardProps extends ViewProps {
  padding?: number;
  style?: ViewStyle;
}

export function Card({ padding = Spacing.base, style, children, ...props }: CardProps) {
  const colors = useColors();
  return (
    <View
      style={[
        {
          backgroundColor: colors.surface,
          borderRadius: Radius.xl,
          padding,
          shadowColor: '#000',
          shadowOpacity: 0.07,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
}
