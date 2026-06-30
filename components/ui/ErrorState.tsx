import { View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { Spacing } from '@constants/spacing';
import { useColors } from '@hooks/useColors';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  message = 'Something went wrong. Please try again.',
  onRetry,
}: ErrorStateProps) {
  const colors = useColors();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing['2xl'],
        gap: Spacing.sm,
      }}
      accessibilityRole="alert"
    >
      <Text variant="heading3" style={{ textAlign: 'center' }}>
        Oops
      </Text>
      <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
        {message}
      </Text>
      {onRetry && (
        <Button
          label="Try again"
          onPress={onRetry}
          variant="secondary"
          size="md"
          style={{ marginTop: Spacing.base }}
        />
      )}
    </View>
  );
}
