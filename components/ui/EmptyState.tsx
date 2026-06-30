import { View } from 'react-native';
import { Text } from './Text';
import { Button } from './Button';
import { Spacing } from '@constants/spacing';

interface EmptyStateProps {
  icon?: string; // emoji
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  onCta?: () => void;
  children?: React.ReactNode; // e.g. WasabiCharacter above the text
}

export function EmptyState({ icon, title, subtitle, ctaLabel, onCta, children }: EmptyStateProps) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Spacing['2xl'],
        gap: Spacing.sm,
      }}
      accessibilityRole="text"
    >
      {children}
      {icon && (
        <Text variant="heading1" style={{ marginBottom: Spacing.sm }}>
          {icon}
        </Text>
      )}
      <Text variant="heading3" style={{ textAlign: 'center' }}>
        {title}
      </Text>
      {subtitle && (
        <Text variant="body" style={{ textAlign: 'center' }}>
          {subtitle}
        </Text>
      )}
      {ctaLabel && onCta && (
        <Button
          label={ctaLabel}
          onPress={onCta}
          variant="primary"
          size="md"
          style={{ marginTop: Spacing.base }}
        />
      )}
    </View>
  );
}
