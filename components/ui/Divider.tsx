import { View, type ViewStyle } from 'react-native';
import { useColors } from '@hooks/useColors';

interface DividerProps {
  style?: ViewStyle;
}

export function Divider({ style }: DividerProps) {
  const colors = useColors();
  return (
    <View
      style={[{ height: 1, backgroundColor: colors.border, width: '100%' }, style]}
      accessibilityRole="none"
    />
  );
}
