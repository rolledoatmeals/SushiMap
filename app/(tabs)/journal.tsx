import { View, FlatList, Pressable } from 'react-native';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { EmptyState } from '@components/ui/EmptyState';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useJournalStore } from '@stores/journalStore';
import { useRestaurants } from '@hooks/useRestaurants';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import type { JournalEntry } from '../../types';

function formatDate(isoDate: string): string {
  const d = new Date(isoDate + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function JournalEntryCard({
  entry,
  restaurantName,
  onPress,
}: {
  entry: JournalEntry;
  restaurantName: string;
  onPress: () => void;
}) {
  const colors = useColors();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Journal entry for ${restaurantName}`}
    >
      <Card style={{ gap: Spacing.sm }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: Spacing.sm,
          }}
        >
          <View style={{ flex: 1 }}>
            <Text variant="heading3" numberOfLines={1}>
              {restaurantName}
            </Text>
            <Text variant="bodySmall" color={colors.textSecondary}>
              {formatDate(entry.date)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingTop: 2 }}>
            <Ionicons name="star" size={13} color={Colors.salmon} />
            <Text variant="bodySmall" style={{ fontWeight: '700' }}>
              {entry.ratings.fishQuality}/5
            </Text>
          </View>
        </View>

        {entry.notes ? (
          <Text
            variant="body"
            color={colors.textSecondary}
            numberOfLines={2}
            style={{ lineHeight: 20 }}
          >
            {entry.notes}
          </Text>
        ) : null}

        <View style={{ flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' }}>
          {entry.wouldReturn && (
            <View
              style={{
                backgroundColor: Colors.wasabiGreen + '22',
                borderRadius: Radius.pill,
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
              }}
            >
              <Text variant="caption" color={Colors.wasabiGreen} style={{ fontWeight: '600' }}>
                Would Return ✓
              </Text>
            </View>
          )}
          {entry.photos.length > 0 && (
            <View
              style={{
                backgroundColor: colors.surface2,
                borderRadius: Radius.pill,
                paddingHorizontal: Spacing.sm,
                paddingVertical: Spacing.xs,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <Ionicons name="image-outline" size={11} color={colors.textTertiary} />
              <Text variant="caption" color={colors.textSecondary}>
                {entry.photos.length} photo{entry.photos.length > 1 ? 's' : ''}
              </Text>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
}

export default function JournalScreen() {
  const colors = useColors();
  const entries = useJournalStore((s) => s.entries);
  const { data: restaurants } = useRestaurants();

  function getRestaurantName(id: string): string {
    return restaurants?.find((r) => r.id === id)?.name ?? 'Unknown Restaurant';
  }

  return (
    <ScreenWrapper>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.base,
          paddingBottom: Spacing.md,
        }}
      >
        <View>
          <Text variant="caption" color={colors.textSecondary}>
            Your visits
          </Text>
          <Text variant="heading2">Sushi Journal</Text>
        </View>
        {entries.length > 0 && (
          <View
            style={{
              backgroundColor: Colors.salmon,
              borderRadius: Radius.pill,
              paddingHorizontal: Spacing.md,
              paddingVertical: Spacing.xs,
              minWidth: 28,
              alignItems: 'center',
            }}
          >
            <Text variant="caption" color="#FFF" style={{ fontWeight: '700' }}>
              {entries.length}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      {entries.length === 0 ? (
        <EmptyState
          title="No visits yet"
          subtitle="Tap the + button to log your first visit."
          ctaLabel="Log First Visit"
          onCta={() => router.push('/journal/create')}
        >
          <WasabiCharacter mood="think" size={80} />
        </EmptyState>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            gap: Spacing.md,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <JournalEntryCard
              entry={item}
              restaurantName={getRestaurantName(item.restaurantId)}
              onPress={() => router.push(`/journal/${item.id}`)}
            />
          )}
        />
      )}

      {/* FAB */}
      <Pressable
        onPress={async () => {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push('/journal/create');
        }}
        style={{
          position: 'absolute',
          bottom: 100,
          right: Spacing.lg,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: Colors.salmon,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
        accessibilityRole="button"
        accessibilityLabel="Log a new visit"
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </Pressable>
    </ScreenWrapper>
  );
}
