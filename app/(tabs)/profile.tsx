import { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Alert, Share } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import * as StoreReview from 'expo-store-review';
import Constants from 'expo-constants';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { supabase } from '@lib/supabase';
import { useAuthStore } from '@stores/authStore';
import { useJournalStore } from '@stores/journalStore';
import { useSavedStore } from '@stores/savedStore';
import { useSearchStore } from '@stores/searchStore';
import { useAppearanceStore, type AppearanceMode } from '@stores/appearanceStore';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import { router } from 'expo-router';

const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0';
type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

// ─── Settings row ─────────────────────────────────────────────────────────────

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  destructive,
  accessory,
}: {
  icon: IoniconName;
  label: string;
  value?: string;
  onPress?: () => void;
  destructive?: boolean;
  accessory?: React.ReactNode;
}) {
  const colors = useColors();
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        gap: Spacing.md,
        minHeight: 44,
      }}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={label}
      disabled={!onPress && !accessory}
    >
      <View
        style={{
          width: 32,
          height: 32,
          borderRadius: Radius.sm,
          backgroundColor: destructive ? Colors.closedRed + '18' : colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons
          name={icon}
          size={16}
          color={destructive ? Colors.closedRed : colors.textSecondary}
        />
      </View>
      <Text
        variant="body"
        color={destructive ? Colors.closedRed : colors.textPrimary}
        style={{ flex: 1 }}
      >
        {label}
      </Text>
      {accessory ??
        (value ? (
          <Text variant="bodySmall" color={colors.textTertiary}>
            {value}
          </Text>
        ) : onPress ? (
          <Ionicons name="chevron-forward" size={16} color={colors.textTertiary} />
        ) : null)}
    </Pressable>
  );
}

// ─── Appearance toggle ────────────────────────────────────────────────────────

function AppearanceToggle() {
  const colors = useColors();
  const { mode, setMode } = useAppearanceStore();

  const OPTIONS: { value: AppearanceMode; label: string }[] = [
    { value: 'light', label: 'Light' },
    { value: 'system', label: 'Auto' },
    { value: 'dark', label: 'Dark' },
  ];

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface2,
        borderRadius: Radius.md,
        padding: 3,
      }}
    >
      {OPTIONS.map((opt) => {
        const active = mode === opt.value;
        return (
          <Pressable
            key={opt.value}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              await setMode(opt.value);
            }}
            style={{
              flex: 1,
              paddingVertical: Spacing.xs + 2,
              borderRadius: Radius.sm,
              alignItems: 'center',
              backgroundColor: active ? colors.surface : 'transparent',
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={`${opt.label} appearance`}
          >
            <Text
              variant="caption"
              color={active ? colors.textPrimary : colors.textTertiary}
              style={{ fontWeight: active ? '700' : '400' }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Stat chip ────────────────────────────────────────────────────────────────

function StatChip({ label, value }: { label: string; value: number }) {
  const colors = useColors();
  return (
    <View style={{ flex: 1, alignItems: 'center', paddingVertical: Spacing.md }}>
      <Text variant="heading2" color={Colors.salmon}>
        {value}
      </Text>
      <Text variant="caption" color={colors.textSecondary} style={{ textAlign: 'center' }}>
        {label}
      </Text>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const colors = useColors();
  const [appleAvailable, setAppleAvailable] = useState(false);
  const { isGuest, userName, userEmail, setAppleUser, setGuest, signOut } = useAuthStore();

  useEffect(() => {
    AppleAuthentication.isAvailableAsync()
      .then(setAppleAvailable)
      .catch(() => setAppleAvailable(false));
  }, []);
  const entries = useJournalStore((s) => s.entries);
  const migrateToUser = useJournalStore((s) => s.migrateToUser);
  const pushAllJournal = useJournalStore((s) => s.pushAllToSupabase);
  const syncJournal = useJournalStore((s) => s.syncFromSupabase);
  const savedIds = useSavedStore((s) => s.savedIds);
  const pushAllSaved = useSavedStore((s) => s.pushAllToSupabase);
  const syncSaved = useSavedStore((s) => s.syncFromSupabase);
  const clearSearchHistory = useSearchStore((s) => s.clearAll);

  const visitedCount = new Set(entries.map((e) => e.restaurantId)).size;
  const savedCount = savedIds.size;

  const initials = userName
    ? userName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  async function handleAppleSignIn() {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const name =
        [credential.fullName?.givenName, credential.fullName?.familyName]
          .filter(Boolean)
          .join(' ') || 'Apple User';
      const email = credential.email ?? '';

      // Local auth state
      await setAppleUser(credential.user, name, email);
      migrateToUser(credential.user);

      // Supabase auth + sync
      if (credential.identityToken) {
        const { error } = await supabase.auth.signInWithIdToken({
          provider: 'apple',
          token: credential.identityToken,
        });
        if (!error) {
          // Push local data first, then pull remote to merge
          await pushAllJournal();
          await syncJournal();
          await pushAllSaved();
          await syncSaved();
        }
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      const err = e as { code?: string };
      if (err.code !== 'ERR_CANCELED') {
        Alert.alert('Sign in failed', 'Could not complete Apple Sign In. Please try again.');
      }
    }
  }

  async function handleSignOut() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Sign Out', 'Your journal and saved spots will remain on this device.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await supabase.auth.signOut();
          await signOut();
          await setGuest();
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        },
      },
    ]);
  }

  async function handleRate() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (await StoreReview.hasAction()) {
      await StoreReview.requestReview();
    }
  }

  async function handleExportData() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const data = {
      exportedAt: new Date().toISOString(),
      user: { userName, userEmail },
      journalEntries: entries,
      savedRestaurantIds: [...savedIds],
    };
    await Share.share({
      message: JSON.stringify(data, null, 2),
      title: 'SushiMap Data Export',
    });
  }

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View
          style={{
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.base,
            paddingBottom: Spacing.md,
          }}
        >
          <Text variant="caption" color={colors.textSecondary}>
            Your account
          </Text>
          <Text variant="heading2">Profile</Text>
        </View>

        {/* Identity card */}
        {isGuest ? (
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
            <Card style={{ alignItems: 'center', gap: Spacing.md, paddingVertical: Spacing.xl }}>
              <WasabiCharacter mood="wave" size={72} />
              <View style={{ alignItems: 'center', gap: Spacing.xs }}>
                <Text variant="heading3" style={{ textAlign: 'center' }}>
                  Sign in to save your progress
                </Text>
                <Text variant="body" color={colors.textSecondary} style={{ textAlign: 'center' }}>
                  Your journal and stamps sync across devices when you sign in.
                </Text>
              </View>
              {appleAvailable ? (
                <AppleAuthentication.AppleAuthenticationButton
                  buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                  buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                  cornerRadius={Radius.md}
                  style={{ width: '100%', height: 50 }}
                  onPress={handleAppleSignIn}
                />
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: 50,
                    backgroundColor: colors.surface2,
                    borderRadius: Radius.md,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text variant="bodySmall" color={colors.textTertiary}>
                    Sign In with Apple not available
                  </Text>
                </View>
              )}
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
            <Card style={{ gap: Spacing.md }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: Colors.salmon,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text variant="heading3" color="#FFF">
                    {initials}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text variant="heading3" numberOfLines={1}>
                    {userName || 'SushiMap User'}
                  </Text>
                  {userEmail ? (
                    <Text variant="bodySmall" color={colors.textSecondary} numberOfLines={1}>
                      {userEmail}
                    </Text>
                  ) : null}
                </View>
              </View>
            </Card>
          </View>
        )}

        {/* Stats */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <Card style={{ paddingVertical: 0, paddingHorizontal: 0, overflow: 'hidden' }}>
            <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
              <StatChip label="Visits" value={entries.length} />
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <StatChip label="Spots" value={visitedCount} />
              <View style={{ width: 1, backgroundColor: colors.border }} />
              <StatChip label="Saved" value={savedCount} />
            </View>
          </Card>
        </View>

        {/* Appearance */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text
            variant="caption"
            color={colors.textSecondary}
            style={{ fontWeight: '600', marginBottom: Spacing.sm, letterSpacing: 0.5 }}
          >
            APPEARANCE
          </Text>
          <Card>
            <AppearanceToggle />
          </Card>
        </View>

        {/* Data settings */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text
            variant="caption"
            color={colors.textSecondary}
            style={{ fontWeight: '600', marginBottom: Spacing.sm, letterSpacing: 0.5 }}
          >
            DATA
          </Text>
          <Card style={{ gap: 0 }}>
            <SettingsRow
              icon="add-circle-outline"
              label="Suggest a Restaurant"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/request');
              }}
            />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 48 }} />
            <SettingsRow
              icon="download-outline"
              label="Export My Data"
              onPress={handleExportData}
            />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 48 }} />
            <SettingsRow
              icon="time-outline"
              label="Clear Search History"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                clearSearchHistory();
              }}
            />
          </Card>
        </View>

        {/* Account */}
        {!isGuest && (
          <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
            <Text
              variant="caption"
              color={colors.textSecondary}
              style={{ fontWeight: '600', marginBottom: Spacing.sm, letterSpacing: 0.5 }}
            >
              ACCOUNT
            </Text>
            <Card>
              <SettingsRow
                icon="log-out-outline"
                label="Sign Out"
                onPress={handleSignOut}
                destructive
              />
            </Card>
          </View>
        )}

        {/* About */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text
            variant="caption"
            color={colors.textSecondary}
            style={{ fontWeight: '600', marginBottom: Spacing.sm, letterSpacing: 0.5 }}
          >
            ABOUT
          </Text>
          <Card style={{ gap: 0 }}>
            <SettingsRow icon="information-circle-outline" label="Version" value={APP_VERSION} />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 48 }} />
            <SettingsRow icon="star-outline" label="Rate SushiMap" onPress={handleRate} />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 48 }} />
            <SettingsRow
              icon="document-text-outline"
              label="Terms of Service"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/legal/terms');
              }}
            />
            <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 48 }} />
            <SettingsRow
              icon="shield-outline"
              label="Privacy Policy"
              onPress={async () => {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/legal/privacy');
              }}
            />
          </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
