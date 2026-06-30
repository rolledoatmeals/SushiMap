import { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useJournalStore } from '@stores/journalStore';
import { useAuthStore } from '@stores/authStore';
import { useRestaurants } from '@hooks/useRestaurants';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import type { Restaurant, RatingValue, CreateJournalEntryInput } from '../../types';

const TOTAL_STEPS = 5;
const STEP_LABELS = ['Restaurant', 'Date', 'Photos', 'Ratings', 'Notes'];

type DraftRatings = {
  fishQuality: RatingValue;
  value?: RatingValue;
  service?: RatingValue;
  refillSpeed?: RatingValue;
  atmosphere?: RatingValue;
};

type Draft = {
  restaurant: Restaurant | null;
  date: string;
  photos: string[];
  ratings: DraftRatings;
  notes: string;
  wouldReturn: boolean;
};

function localDateISO(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function formatDisplayDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function StarRating({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: RatingValue | undefined;
  required?: boolean;
  onChange: (v: RatingValue) => void;
}) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: Spacing.md }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.xs }}>
        <Text variant="bodySmall" style={{ fontWeight: '600' }}>
          {label}
        </Text>
        {required && (
          <Text variant="caption" color={Colors.salmon} style={{ marginLeft: 4 }}>
            *
          </Text>
        )}
      </View>
      <View style={{ flexDirection: 'row', gap: Spacing.xs }}>
        {([1, 2, 3, 4, 5] as RatingValue[]).map((star) => (
          <Pressable
            key={star}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(star);
            }}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="radio"
            accessibilityLabel={`${star} star${star > 1 ? 's' : ''}`}
            accessibilityState={{ checked: value === star }}
          >
            <Ionicons
              name={value !== undefined && star <= value ? 'star' : 'star-outline'}
              size={28}
              color={value !== undefined && star <= value ? Colors.salmon : colors.border}
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

export default function JournalCreateScreen() {
  const colors = useColors();
  const { addEntry } = useJournalStore();
  const { userId } = useAuthStore();
  const { data: restaurants } = useRestaurants();
  const [step, setStep] = useState(1);
  const [search, setSearch] = useState('');
  const [draft, setDraft] = useState<Draft>({
    restaurant: null,
    date: localDateISO(),
    photos: [],
    ratings: { fishQuality: 3 as RatingValue },
    notes: '',
    wouldReturn: true,
  });

  function update<K extends keyof Draft>(key: K, value: Draft[K]) {
    setDraft((d) => ({ ...d, [key]: value }));
  }

  const filteredRestaurants =
    restaurants?.filter(
      (r) =>
        r.name.toLowerCase().includes(search.toLowerCase()) ||
        r.neighborhood.toLowerCase().includes(search.toLowerCase()),
    ) ?? [];

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access to add photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      selectionLimit: 6 - draft.photos.length,
    });
    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri);
      update('photos', [...draft.photos, ...uris].slice(0, 6));
    }
  }

  function canAdvance(): boolean {
    if (step === 1) return draft.restaurant !== null;
    if (step === 4) return draft.ratings.fishQuality != null;
    return true;
  }

  function handleBack() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step === 1) {
      router.back();
    } else {
      setStep((s) => s - 1);
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1);
    } else {
      handleSubmit();
    }
  }

  function handleSubmit() {
    if (!draft.restaurant) return;
    const input: CreateJournalEntryInput = {
      restaurantId: draft.restaurant.id,
      userId,
      date: draft.date,
      photos: draft.photos,
      notes: draft.notes.trim(),
      ratings: draft.ratings,
      wouldReturn: draft.wouldReturn,
    };
    const entry = addEntry(input);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace(`/journal/${entry.id}`);
  }

  function getWasabiMood(): 'idle' | 'think' | 'wave' | 'eat' | 'write' {
    if (step === 2) return 'think';
    if (step === 3) return 'wave';
    if (step === 4) return 'eat';
    if (step === 5) return 'write';
    return 'idle';
  }

  const todayISO = localDateISO();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayISO = localDateISO(yesterdayDate);

  return (
    <ScreenWrapper>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.base,
            paddingBottom: Spacing.md,
            gap: Spacing.sm,
          }}
        >
          <Pressable
            onPress={handleBack}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color={colors.textSecondary}>
              Step {step} of {TOTAL_STEPS}
            </Text>
            <Text variant="heading3">{STEP_LABELS[step - 1]}</Text>
          </View>
          <WasabiCharacter mood={getWasabiMood()} size={40} />
        </View>

        {/* Progress bar */}
        <View
          style={{
            marginHorizontal: Spacing.lg,
            height: 4,
            backgroundColor: colors.surface2,
            borderRadius: Radius.pill,
            marginBottom: Spacing.lg,
          }}
        >
          <View
            style={{
              height: 4,
              width: `${(step / TOTAL_STEPS) * 100}%`,
              backgroundColor: Colors.salmon,
              borderRadius: Radius.pill,
            }}
          />
        </View>

        {/* Step content */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: Spacing.xl }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Step 1 — Restaurant */}
          {step === 1 && (
            <View style={{ gap: Spacing.md }}>
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search restaurants…"
                placeholderTextColor={colors.textTertiary}
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: Radius.lg,
                  paddingHorizontal: Spacing.base,
                  height: 48,
                  color: colors.textPrimary,
                  fontSize: 16,
                }}
                autoFocus
                accessibilityLabel="Search restaurants"
                returnKeyType="search"
              />
              {filteredRestaurants.map((r) => {
                const selected = draft.restaurant?.id === r.id;
                return (
                  <Pressable
                    key={r.id}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      update('restaurant', r);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: Spacing.base,
                      backgroundColor: selected ? Colors.salmon + '15' : colors.surface,
                      borderRadius: Radius.md,
                      borderWidth: 1,
                      borderColor: selected ? Colors.salmon : colors.border,
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={r.name}
                  >
                    <View style={{ flex: 1, gap: 2 }}>
                      <Text variant="body" style={{ fontWeight: '600' }}>
                        {r.name}
                      </Text>
                      <Text variant="bodySmall" color={colors.textSecondary}>
                        {r.neighborhood} · {r.city}
                      </Text>
                    </View>
                    {selected && (
                      <Ionicons name="checkmark-circle" size={22} color={Colors.salmon} />
                    )}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Step 2 — Date */}
          {step === 2 && (
            <View style={{ gap: Spacing.md }}>
              <Text variant="body" color={colors.textSecondary}>
                When did you visit?
              </Text>
              {(
                [
                  { label: 'Today', iso: todayISO },
                  { label: 'Yesterday', iso: yesterdayISO },
                ] as { label: string; iso: string }[]
              ).map(({ label, iso }) => {
                const selected = draft.date === iso;
                return (
                  <Pressable
                    key={label}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      update('date', iso);
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: Spacing.base,
                      backgroundColor: selected ? Colors.salmon + '15' : colors.surface,
                      borderRadius: Radius.md,
                      borderWidth: 1,
                      borderColor: selected ? Colors.salmon : colors.border,
                    }}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                    accessibilityLabel={label}
                  >
                    <Text variant="body" style={{ fontWeight: '600' }}>
                      {label}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                      <Text variant="bodySmall" color={colors.textSecondary}>
                        {formatDisplayDate(iso)}
                      </Text>
                      {selected && (
                        <Ionicons name="checkmark-circle" size={20} color={Colors.salmon} />
                      )}
                    </View>
                  </Pressable>
                );
              })}
              <View>
                <Text
                  variant="bodySmall"
                  color={colors.textSecondary}
                  style={{ marginBottom: Spacing.xs }}
                >
                  Other date
                </Text>
                <TextInput
                  value={draft.date}
                  onChangeText={(v) => update('date', v)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="numbers-and-punctuation"
                  style={{
                    backgroundColor: colors.surface,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: Radius.lg,
                    paddingHorizontal: Spacing.base,
                    height: 48,
                    color: colors.textPrimary,
                    fontSize: 16,
                  }}
                  accessibilityLabel="Visit date"
                />
              </View>
            </View>
          )}

          {/* Step 3 — Photos */}
          {step === 3 && (
            <View style={{ gap: Spacing.md }}>
              <Text variant="body" color={colors.textSecondary}>
                Add photos from your visit (optional, up to 6)
              </Text>
              {draft.photos.length > 0 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ gap: Spacing.sm }}
                >
                  {draft.photos.map((uri, i) => (
                    <View key={uri} style={{ position: 'relative' }}>
                      <Image
                        source={{ uri }}
                        style={{ width: 120, height: 120, borderRadius: Radius.md }}
                        contentFit="cover"
                        accessibilityLabel="Selected photo"
                      />
                      <Pressable
                        onPress={() =>
                          update(
                            'photos',
                            draft.photos.filter((_, idx) => idx !== i),
                          )
                        }
                        style={{
                          position: 'absolute',
                          top: 4,
                          right: 4,
                          width: 24,
                          height: 24,
                          borderRadius: 12,
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Remove photo"
                      >
                        <Ionicons name="close" size={14} color="#FFF" />
                      </Pressable>
                    </View>
                  ))}
                </ScrollView>
              )}
              {draft.photos.length < 6 && (
                <Pressable
                  onPress={handlePickPhoto}
                  style={{
                    height: 120,
                    borderRadius: Radius.md,
                    borderWidth: 2,
                    borderColor: colors.border,
                    borderStyle: 'dashed',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: Spacing.sm,
                  }}
                  accessibilityRole="button"
                  accessibilityLabel="Add photos from library"
                >
                  <Ionicons name="camera-outline" size={32} color={colors.textTertiary} />
                  <Text variant="bodySmall" color={colors.textTertiary}>
                    Tap to add photos
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Step 4 — Ratings */}
          {step === 4 && (
            <View>
              <Text
                variant="body"
                color={colors.textSecondary}
                style={{ marginBottom: Spacing.lg }}
              >
                Rate your experience
              </Text>
              <StarRating
                label="Fish Quality"
                value={draft.ratings.fishQuality}
                required
                onChange={(v) => update('ratings', { ...draft.ratings, fishQuality: v })}
              />
              <StarRating
                label="Value for Money"
                value={draft.ratings.value}
                onChange={(v) => update('ratings', { ...draft.ratings, value: v })}
              />
              <StarRating
                label="Service"
                value={draft.ratings.service}
                onChange={(v) => update('ratings', { ...draft.ratings, service: v })}
              />
              <StarRating
                label="Refill Speed"
                value={draft.ratings.refillSpeed}
                onChange={(v) => update('ratings', { ...draft.ratings, refillSpeed: v })}
              />
              <StarRating
                label="Atmosphere"
                value={draft.ratings.atmosphere}
                onChange={(v) => update('ratings', { ...draft.ratings, atmosphere: v })}
              />

              {/* Would Return toggle */}
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  update('wouldReturn', !draft.wouldReturn);
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: Spacing.base,
                  backgroundColor: draft.wouldReturn ? Colors.wasabiGreen + '15' : colors.surface,
                  borderRadius: Radius.md,
                  borderWidth: 1,
                  borderColor: draft.wouldReturn ? Colors.wasabiGreen : colors.border,
                  marginTop: Spacing.sm,
                }}
                accessibilityRole="switch"
                accessibilityState={{ checked: draft.wouldReturn }}
                accessibilityLabel="Would return to this restaurant"
              >
                <Text variant="body" style={{ fontWeight: '600' }}>
                  Would Return?
                </Text>
                <Ionicons
                  name={draft.wouldReturn ? 'checkmark-circle' : 'ellipse-outline'}
                  size={24}
                  color={draft.wouldReturn ? Colors.wasabiGreen : colors.textTertiary}
                />
              </Pressable>
            </View>
          )}

          {/* Step 5 — Notes */}
          {step === 5 && (
            <View style={{ gap: Spacing.md }}>
              <Text variant="body" color={colors.textSecondary}>
                Any notes about your visit? (optional)
              </Text>
              <TextInput
                value={draft.notes}
                onChangeText={(v) => update('notes', v)}
                placeholder="The salmon melted in my mouth…"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                style={{
                  backgroundColor: colors.surface,
                  borderWidth: 1,
                  borderColor: colors.border,
                  borderRadius: Radius.lg,
                  padding: Spacing.base,
                  color: colors.textPrimary,
                  fontSize: 16,
                  minHeight: 160,
                  lineHeight: 24,
                }}
                accessibilityLabel="Visit notes"
              />

              {/* Summary card */}
              {draft.restaurant && (
                <View
                  style={{
                    backgroundColor: colors.surface,
                    borderRadius: Radius.md,
                    padding: Spacing.base,
                    gap: Spacing.xs,
                    borderWidth: 1,
                    borderColor: colors.border,
                  }}
                >
                  <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                    {draft.restaurant.name}
                  </Text>
                  <Text variant="caption" color={colors.textSecondary}>
                    {formatDisplayDate(draft.date)} · Fish Quality: {draft.ratings.fishQuality}/5
                  </Text>
                  <Text
                    variant="caption"
                    color={draft.wouldReturn ? Colors.wasabiGreen : colors.textTertiary}
                  >
                    {draft.wouldReturn ? 'Would return ✓' : 'Would not return'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>

        {/* Bottom navigation */}
        <View
          style={{
            flexDirection: 'row',
            gap: Spacing.md,
            paddingHorizontal: Spacing.lg,
            paddingBottom: Spacing.xl,
            paddingTop: Spacing.md,
          }}
        >
          {step > 1 && (
            <Button
              label="Back"
              variant="secondary"
              size="lg"
              onPress={handleBack}
              style={{ flex: 1 }}
            />
          )}
          <Button
            label={step === TOTAL_STEPS ? 'Save Entry' : 'Next'}
            variant="primary"
            size="lg"
            onPress={handleNext}
            disabled={!canAdvance()}
            fullWidth={step === 1}
            style={step > 1 ? { flex: 1 } : undefined}
          />
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
}
