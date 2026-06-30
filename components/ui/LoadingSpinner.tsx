import { ActivityIndicator, View } from 'react-native';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
}

export function LoadingSpinner({
  size = 'large',
  color = Colors.salmon,
  fullScreen = false,
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        accessibilityRole="progressbar"
        accessibilityLabel="Loading"
      >
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
  return (
    <ActivityIndicator
      size={size}
      color={color}
      style={{ margin: Spacing.base }}
      accessibilityRole="progressbar"
      accessibilityLabel="Loading"
    />
  );
}
