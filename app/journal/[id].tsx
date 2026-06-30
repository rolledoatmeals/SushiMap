import { useState } from 'react';
import { View, ScrollView, Pressable, Alert, Share, Dimensions } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { EmptyState } from '@components/ui/EmptyState';
import { useJournalStore } from '@stores/journalStore';
import { useRestaurant } from '@hooks/useRestaurants';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const RATING_LABELS: Record<string, string> = {
  fishQuality: 'Fish Quality',
  value: 'Value for Money',
  service: 'Service',
  refillSpeed: 'Refill Speed',
  atmosphere: 'Atmosphere',
};

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function JournalEntryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const entries = useJournalStore((s) => s.entries);
  const deleteEntry = useJournalStore((s) => s.deleteEntry);
  const [photoIndex, setPhotoIndex] = useState(0);

  const entry = entries.find((e) => e.id === id);
  const { data: restaurant } = useRestaurant(entry?.restaurantId ?? '');

  if (!entry) {
    return (
      <EmptyState
        title="Entry not found"
        subtitle="This journal entry may have been deleted."
        ctaLabel="Back to Journal"
        onCta={() => router.back()}
      />
    );
  }

  const e = entry;

  async function handleShare() {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const name = restaurant?.name ?? 'an AYCE sushi spot';
    await Share.share({
      message: `I visited ${name} on ${formatDate(e.date)}! Fish Quality: ${e.ratings.fishQuality}/5${e.wouldReturn ? ' — Would return! 🍣' : ''}`,
    });
  }

  async function handleDelete() {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert('Delete Entry', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          deleteEntry(e.id);
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          router.back();
        },
      },
    ]);
  }

  const ratings = (Object.entries(e.ratings) as [string, number | undefined][])
    .filter(([, v]) => v != null && v > 0)
    .map(([key, val]) => ({
      key,
      label: RATING_LABELS[key] ?? key,
      val: val as number,
    }));

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
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
            onPress={() => router.back()}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text variant="heading3" numberOfLines={1}>
              {restaurant?.name ?? '…'}
            </Text>
            <Text variant="caption" color={colors.textSecondary}>
              {formatDate(entry.date)}
            </Text>
          </View>
          <Pressable
            onPress={handleShare}
            style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
            accessibilityRole="button"
            accessibilityLabel="Share journal entry"
          >
            <Ionicons name="share-outline" size={22} color={colors.textPrimary} />
          </Pressable>
        </View>

        {/* Photo carousel */}
        {entry.photos.length > 0 && (
          <View style={{ marginBottom: Spacing.lg }}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={(e) => {
                setPhotoIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
              }}
              scrollEventThrottle={32}
            >
              {entry.photos.map((uri) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={{ width: SCREEN_WIDTH, height: 240 }}
                  contentFit="cover"
                  accessibilityLabel="Visit photo"
                />
              ))}
            </ScrollView>
            {entry.photos.length > 1 && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                  marginTop: Spacing.sm,
                }}
              >
                {entry.photos.map((uri, i) => (
                  <View
                    key={uri}
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: i === photoIndex ? Colors.salmon : colors.border,
                    }}
                  />
                ))}
              </View>
            )}
          </View>
        )}

        <View style={{ paddingHorizontal: Spacing.lg, gap: Spacing.lg }}>
          {/* Tags row */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: Spacing.sm,
              flexWrap: 'wrap',
            }}
          >
            {entry.wouldReturn && (
              <View
                style={{
                  backgroundColor: Colors.wasabiGreen + '22',
                  borderRadius: Radius.pill,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.xs,
                }}
              >
                <Text variant="bodySmall" color={Colors.wasabiGreen} style={{ fontWeight: '600' }}>
                  Would Return ✓
                </Text>
              </View>
            )}
            {restaurant && (
              <Pressable
                onPress={() => router.push(`/restaurant/${restaurant.id}`)}
                style={{
                  backgroundColor: colors.surface2,
                  borderRadius: Radius.pill,
                  paddingHorizontal: Spacing.md,
                  paddingVertical: Spacing.xs,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
                accessibilityRole="link"
                accessibilityLabel={`View ${restaurant.name} details`}
              >
                <Text variant="bodySmall" color={colors.textSecondary}>
                  {restaurant.neighborhood}
                </Text>
                <Ionicons name="chevron-forward" size={12} color={colors.textTertiary} />
              </Pressable>
            )}
          </View>

          {/* Ratings card */}
          <Card>
            <Text variant="heading3" style={{ marginBottom: Spacing.md }}>
              Ratings
            </Text>
            {ratings.map(({ key, label, val }) => (
              <View key={key} style={{ marginBottom: Spacing.sm }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: Spacing.xs,
                  }}
                >
                  <Text variant="bodySmall" color={colors.textSecondary}>
                    {label}
                  </Text>
                  <Text variant="bodySmall" style={{ fontWeight: '700' }}>
                    {val}/5
                  </Text>
                </View>
                <View
                  style={{ height: 6, backgroundColor: colors.surface2, borderRadius: Radius.pill }}
                >
                  <View
                    style={{
                      height: 6,
                      width: `${(val / 5) * 100}%`,
                      backgroundColor: Colors.salmon,
                      borderRadius: Radius.pill,
                    }}
                  />
                </View>
              </View>
            ))}
          </Card>

          {/* Notes card */}
          {entry.notes ? (
            <Card>
              <Text variant="heading3" style={{ marginBottom: Spacing.sm }}>
                Notes
              </Text>
              <Text variant="body" color={colors.textSecondary} style={{ lineHeight: 24 }}>
                {entry.notes}
              </Text>
            </Card>
          ) : null}

          {/* Delete */}
          <Button
            label="Delete Entry"
            variant="destructive"
            size="md"
            fullWidth
            onPress={handleDelete}
          />
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
