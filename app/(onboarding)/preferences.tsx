import { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useAuthStore, type UserPreference } from '@stores/authStore';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';

const PREFERENCE_OPTIONS: {
  id: UserPreference;
  label: string;
  emoji: string;
  description: string;
}[] = [
  { id: 'best-value', label: 'Best Value', emoji: '💰', description: 'Most food for the price' },
  { id: 'top-rated', label: 'Top Rated', emoji: '⭐', description: 'Highest community scores' },
  { id: 'open-late', label: 'Open Late', emoji: '🌙', description: 'Open past 10 PM' },
  { id: 'lunch-deals', label: 'Lunch Deals', emoji: '☀️', description: 'Best lunch prices' },
];

const AUTO_ADVANCE_DELAY = 800;

export default function PreferencesScreen() {
  const colors = useColors();
  const { setPreferences } = useAuthStore();
  const [selected, setSelected] = useState<Set<UserPreference>>(new Set());
  const [didSelect, setDidSelect] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  async function handleContinue(prefs: Set<UserPreference>) {
    if (timerRef.current) clearTimeout(timerRef.current);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await setPreferences([...prefs]);
    router.push('/(onboarding)/location');
  }

  function togglePref(id: UserPreference) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => handleContinue(next), AUTO_ADVANCE_DELAY);

      return next;
    });

    if (!didSelect) setDidSelect(true);
  }

  return (
    <ScreenWrapper>
      <View style={{ flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing['2xl'] }}>
        <View style={{ alignItems: 'center', marginBottom: Spacing.xl }}>
          <WasabiCharacter mood={didSelect ? 'celebrate' : 'idle'} size={72} />
        </View>

        <Text variant="heading2" style={{ marginBottom: Spacing.sm }}>
          What matters most to you?
        </Text>
        <Text variant="body" color={colors.textSecondary} style={{ marginBottom: Spacing.xl }}>
          We'll highlight spots that match. You can always change this later.
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md }}>
          {PREFERENCE_OPTIONS.map((opt) => {
            const isActive = selected.has(opt.id);
            return (
              <Pressable
                key={opt.id}
                onPress={() => togglePref(opt.id)}
                style={{
                  width: '47%',
                  backgroundColor: isActive ? Colors.salmon : colors.surface,
                  borderRadius: Radius.xl,
                  padding: Spacing.base,
                  borderWidth: 1.5,
                  borderColor: isActive ? Colors.salmon : colors.border,
                  gap: Spacing.xs,
                }}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isActive }}
                accessibilityLabel={opt.label}
              >
                <Text variant="heading3">{opt.emoji}</Text>
                <Text
                  variant="bodySmall"
                  color={isActive ? '#FFF' : colors.textPrimary}
                  style={{ fontWeight: '600' }}
                >
                  {opt.label}
                </Text>
                <Text
                  variant="caption"
                  color={isActive ? 'rgba(255,255,255,0.8)' : colors.textSecondary}
                >
                  {opt.description}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {didSelect && (
          <Text
            variant="caption"
            color={colors.textTertiary}
            style={{ textAlign: 'center', marginTop: Spacing.xl }}
          >
            Moving on…
          </Text>
        )}
      </View>

      <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing['2xl'] }}>
        <Button
          label="Skip"
          variant="ghost"
          size="lg"
          fullWidth
          onPress={() => handleContinue(selected)}
        />
      </View>
    </ScreenWrapper>
  );
}
