import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { router } from 'expo-router';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';

type State = 'waiting' | 'already-granted' | 'done' | 'denied';

export default function LocationScreen() {
  const colors = useColors();
  const [state, setState] = useState<State>('waiting');

  useEffect(() => {
    async function handle() {
      const { status } = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        // Already on — show a brief confirmation then advance
        setState('already-granted');
        setTimeout(() => router.replace('/(onboarding)/done'), 1400);
        return;
      }

      if (status !== 'undetermined') {
        // Denied — can't ask again
        setState('denied');
        return;
      }

      // First time — fire the native iOS popup immediately
      const { status: result } = await Location.requestForegroundPermissionsAsync();
      setState(result === 'granted' ? 'done' : 'denied');
      router.push('/(onboarding)/done');
    }
    handle();
  }, []);

  const alreadyGranted = state === 'already-granted';
  const denied = state === 'denied';

  return (
    <ScreenWrapper>
      <View
        style={{
          flex: 1,
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing['3xl'],
          justifyContent: 'space-between',
          paddingBottom: Spacing['2xl'],
        }}
      >
        <View style={{ alignItems: 'center', gap: Spacing.xl }}>
          <WasabiCharacter mood={alreadyGranted ? 'celebrate' : 'point'} size={100} />
          <View style={{ alignItems: 'center', gap: Spacing.sm }}>
            <Text variant="heading2" style={{ textAlign: 'center' }}>
              {alreadyGranted ? 'Location is on' : 'Find AYCE spots near you'}
            </Text>
            <Text
              variant="body"
              color={colors.textSecondary}
              style={{ textAlign: 'center', lineHeight: 24 }}
            >
              {alreadyGranted
                ? 'SushiMap can already see nearby spots and sort by distance.'
                : denied
                  ? 'No worries — you can enable location later in Settings to see restaurants near you.'
                  : 'SushiMap uses your location to show restaurants nearby and sort by distance. We never store or share your location.'}
            </Text>
          </View>

          {alreadyGranted && (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: Spacing.sm,
                backgroundColor: Colors.wasabiGreen + '22',
                borderRadius: Radius.md,
                paddingHorizontal: Spacing.base,
                paddingVertical: Spacing.sm,
              }}
            >
              <Ionicons name="checkmark-circle" size={18} color={Colors.wasabiGreen} />
              <Text variant="bodySmall" style={{ color: Colors.wasabiGreen, fontWeight: '600' }}>
                Already enabled
              </Text>
            </View>
          )}
        </View>

        {denied && (
          <Button
            label="Continue without location"
            variant="ghost"
            size="lg"
            fullWidth
            onPress={() => router.push('/(onboarding)/done')}
            accessibilityLabel="Continue without location"
          />
        )}
      </View>
    </ScreenWrapper>
  );
}
