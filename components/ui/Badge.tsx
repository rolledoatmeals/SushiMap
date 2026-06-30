import { View } from 'react-native';
import { Text } from './Text';
import { Colors } from '@constants/colors';
import { Radius } from '@constants/radius';
import { Spacing } from '@constants/spacing';

type BadgeVariant = 'verifiedAYCE' | 'open' | 'closed' | 'new';

const BADGE_CONFIG: Record<BadgeVariant, { bg: string; textColor: string; label: string }> = {
  verifiedAYCE: { bg: Colors.salmon, textColor: '#FFF', label: '✓ Verified AYCE' },
  open: { bg: Colors.openGreen, textColor: '#FFF', label: 'Open' },
  closed: { bg: Colors.closedRed, textColor: '#FFF', label: 'Closed' },
  new: { bg: Colors.charcoal, textColor: '#FFF', label: 'New' },
};

interface BadgeProps {
  variant: BadgeVariant;
  label?: string; // override default label
}

export function Badge({ variant, label }: BadgeProps) {
  const config = BADGE_CONFIG[variant];
  return (
    <View
      style={{
        backgroundColor: config.bg,
        borderRadius: Radius.pill,
        paddingVertical: Spacing.xs / 2,
        paddingHorizontal: Spacing.sm,
        alignSelf: 'flex-start',
      }}
      accessibilityRole="text"
      accessibilityLabel={label ?? config.label}
    >
      <Text variant="caption" color={config.textColor} style={{ fontWeight: '600' }}>
        {label ?? config.label}
      </Text>
    </View>
  );
}
