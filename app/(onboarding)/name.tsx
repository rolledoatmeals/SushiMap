import { useState, useRef } from 'react';
import { View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useAuthStore } from '@stores/authStore';
import { useColors } from '@hooks/useColors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';

export default function NameScreen() {
  const colors = useColors();
  const { setName, userName, userEmail } = useAuthStore();
  const [name, setNameLocal] = useState(userName);
  const [email, setEmailLocal] = useState(userEmail);
  const [hasTyped, setHasTyped] = useState(false);
  const emailRef = useRef<TextInput>(null);

  const wasabiX = useSharedValue(-80);
  const wasabiOpacity = useSharedValue(0);

  // Lean in from left
  useState(() => {
    wasabiX.value = withDelay(200, withTiming(0, { duration: 500 }));
    wasabiOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
  });

  const wasabiStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: wasabiX.value }],
    opacity: wasabiOpacity.value,
  }));

  function handleNameChange(text: string) {
    setNameLocal(text);
    if (text.length === 1 && !hasTyped) {
      setHasTyped(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }

  async function handleContinue() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setName(name.trim(), email.trim());
    router.push('/(onboarding)/preferences');
  }

  const canContinue = name.trim().length > 0;

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ flex: 1, paddingHorizontal: Spacing.lg, paddingTop: Spacing['2xl'] }}>
          <Animated.View
            style={[wasabiStyle, { alignSelf: 'flex-start', marginBottom: Spacing.xl }]}
          >
            <WasabiCharacter mood={hasTyped ? 'celebrate' : 'idle'} size={72} />
          </Animated.View>

          <Text variant="heading2" style={{ marginBottom: Spacing.sm }}>
            What should we call you?
          </Text>
          <Text
            variant="body"
            color={colors.textSecondary}
            style={{ marginBottom: Spacing['2xl'] }}
          >
            This appears on your journal entries and passport.
          </Text>

          <View style={{ gap: Spacing.md }}>
            <TextInput
              value={name}
              onChangeText={handleNameChange}
              placeholder="Your name"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              autoFocus
              style={{
                backgroundColor: colors.surface,
                borderRadius: Radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: Spacing.base,
                paddingVertical: Spacing.md,
                fontSize: 16,
                color: colors.textPrimary,
                height: 52,
              }}
              accessibilityLabel="Your name"
            />
            <TextInput
              ref={emailRef}
              value={email}
              onChangeText={setEmailLocal}
              placeholder="Email (optional)"
              placeholderTextColor={colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={canContinue ? handleContinue : undefined}
              style={{
                backgroundColor: colors.surface,
                borderRadius: Radius.lg,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: Spacing.base,
                paddingVertical: Spacing.md,
                fontSize: 16,
                color: colors.textPrimary,
                height: 52,
              }}
              accessibilityLabel="Email address (optional)"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing['2xl'] }}>
          <Button
            label="Continue"
            variant="primary"
            size="lg"
            fullWidth
            disabled={!canContinue}
            onPress={handleContinue}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
