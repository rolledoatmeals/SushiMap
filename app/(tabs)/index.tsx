import { useState, useCallback, useMemo } from 'react';
import { View, FlatList, Pressable, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { RestaurantCardSkeleton } from '@components/ui/SkeletonLoader';
import { EmptyState } from '@components/ui/EmptyState';
import { ErrorState } from '@components/ui/ErrorState';
import { RestaurantCard } from '@components/restaurant/RestaurantCard';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useRestaurants, useOpenNowRestaurants } from '@hooks/useRestaurants';
import { useUserLocation } from '@hooks/useUserLocation';
import { useAuthStore } from '@stores/authStore';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import { distanceKm } from '@utils/distance';
import { isOpenNow } from '@utils/hours';
import type { Restaurant, RestaurantFilters } from '../../types';

type FilterChip = { id: string; label: string };

const FILTER_CHIPS: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'open-now', label: 'Open Now' },
  { id: 'near-me', label: 'Near Me' },
  { id: 'byob', label: 'BYOB' },
  { id: 'under-30', label: 'Under $30' },
  { id: 'top-rated', label: 'Top Rated' },
  { id: 'lunch', label: 'Lunch Deal' },
];

const SKELETON_DATA = [1, 2, 3] as const;
const SKELETON_KEY_EXTRACTOR = (i: number) => String(i);
const SKELETON_RENDER_ITEM = () => <RestaurantCardSkeleton />;
const SKELETON_CONTENT_STYLE = { paddingHorizontal: Spacing.lg, gap: Spacing.md } as const;
const LIST_CONTENT_STYLE = {
  paddingHorizontal: Spacing.lg,
  gap: Spacing.md,
  paddingBottom: 120,
} as const;
const LIST_STYLE = { flex: 1 } as const;

export default function HomeScreen() {
  const colors = useColors();
  const { userName } = useAuthStore();
  const [activeChip, setActiveChip] = useState('all');
  const userLocation = useUserLocation();

  const filters = useMemo<RestaurantFilters | undefined>(() => {
    if (activeChip === 'under-30') return { maxDinnerPrice: 30 };
    if (activeChip === 'top-rated') return { minRating: 4.2 };
    if (activeChip === 'lunch') return { maxLunchPrice: 25 };
    if (activeChip === 'byob') return { tags: ['byob'] };
    return undefined;
  }, [activeChip]);

  const isOpenNowChip = activeChip === 'open-now';
  const isNearMe = activeChip === 'near-me';

  const {
    data: allRestaurants,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useRestaurants(!isOpenNowChip && !isNearMe ? filters : undefined, 'rating');
  const { data: openNow, refetch: refetchOpenNow } = useOpenNowRestaurants();

  const handleRefresh = useCallback(async () => {
    await Promise.all([refetch(), refetchOpenNow()]);
  }, [refetch, refetchOpenNow]);

  // Build displayed list — "Near Me" sorts by distance if location available
  const restaurants = useMemo<Restaurant[]>(() => {
    if (isOpenNowChip) return openNow ?? [];
    const base = allRestaurants ?? [];
    if (isNearMe && userLocation) {
      return [...base].sort(
        (a, b) =>
          distanceKm(userLocation, a.coordinates) - distanceKm(userLocation, b.coordinates),
      );
    }
    return base;
  }, [isOpenNowChip, isNearMe, openNow, allRestaurants, userLocation]);

  const handleChip = useCallback((id: string) => {
    if (id === 'near-me' && !userLocation) {
      Alert.alert(
        'Location needed',
        'Enable location in Settings → Privacy & Security → Location Services → SushiMap to sort by distance.',
      );
      return;
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveChip(id);
  }, [userLocation]);

  const handleShowAll = useCallback(() => setActiveChip('all'), []);

  const handleSurpriseMe = useCallback(async () => {
    const pool = (allRestaurants ?? []).filter((r) => isOpenNow(r));
    if (pool.length === 0) {
      Alert.alert('Nothing open right now', 'Check back later or browse all spots.');
      return;
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const pick = pool[Math.floor(Math.random() * pool.length)];
    router.push(`/restaurant/${pick.id}`);
  }, [allRestaurants]);

  const initials = useMemo(
    () =>
      userName
        ? userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
        : '?',
    [userName],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: Restaurant; index: number }) => (
      <RestaurantCard
        restaurant={item}
        index={index}
        userLocation={userLocation}
        onPress={() => router.push(`/restaurant/${item.id}`)}
      />
    ),
    [userLocation],
  );

  const keyExtractor = useCallback((r: Restaurant) => r.id, []);

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
          paddingBottom: Spacing.sm,
        }}
      >
        <View style={{ gap: 2 }}>
          <Text variant="caption" color={colors.textSecondary}>
            NYC & North Jersey
          </Text>
          <Text variant="heading2">SushiMap</Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
          {/* Surprise Me */}
          <Pressable
            onPress={handleSurpriseMe}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: colors.surface,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Surprise me — pick a random open restaurant"
          >
            <Ionicons name="shuffle-outline" size={20} color={colors.textPrimary} />
          </Pressable>

          {/* Profile */}
          <Pressable
            onPress={() => router.push('/(tabs)/profile')}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: Colors.salmon,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Text variant="label" color="#FFF">
              {initials}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Search bar */}
      <Pressable
        onPress={() => router.push('/search')}
        style={{
          marginHorizontal: Spacing.lg,
          marginBottom: Spacing.sm,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: Radius.lg,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: Spacing.base,
          height: 44,
          gap: Spacing.sm,
        }}
        accessibilityRole="search"
        accessibilityLabel="Search AYCE sushi spots"
      >
        <Ionicons name="search-outline" size={18} color={colors.textTertiary} />
        <Text variant="body" color={colors.textTertiary}>
          Search AYCE sushi spots…
        </Text>
      </Pressable>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: Spacing.lg }}
        style={{ marginVertical: Spacing.sm, flexGrow: 0, flexShrink: 0 }}
      >
        {FILTER_CHIPS.map((chip, i) => {
          const active = chip.id === activeChip;
          const disabled = chip.id === 'near-me' && !userLocation;
          return (
            <Pressable
              key={chip.id}
              onPress={() => handleChip(chip.id)}
              style={{
                minHeight: 44,
                paddingHorizontal: Spacing.base,
                borderRadius: Radius.pill,
                backgroundColor: active ? Colors.salmon : colors.surface,
                borderWidth: 1,
                borderColor: active ? Colors.salmon : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: i < FILTER_CHIPS.length - 1 ? Spacing.sm : 0,
                opacity: disabled ? 0.45 : 1,
                flexDirection: 'row',
                gap: Spacing.xs,
              }}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              accessibilityLabel={chip.label}
            >
              {chip.id === 'near-me' && (
                <Ionicons
                  name="location-outline"
                  size={12}
                  color={active ? '#FFF' : colors.textPrimary}
                />
              )}
              <Text
                variant="bodySmall"
                color={active ? '#FFF' : colors.textPrimary}
                style={{ fontWeight: active ? '600' : '400' }}
              >
                {chip.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Content */}
      {isLoading ? (
        <FlatList
          style={LIST_STYLE}
          data={SKELETON_DATA}
          keyExtractor={SKELETON_KEY_EXTRACTOR}
          contentContainerStyle={SKELETON_CONTENT_STYLE}
          renderItem={SKELETON_RENDER_ITEM}
        />
      ) : isError ? (
        <ErrorState message="Couldn't load restaurants. Check your connection." onRetry={refetch} />
      ) : restaurants.length === 0 ? (
        <EmptyState
          title="No spots found"
          subtitle="Try a different filter or check back soon."
          ctaLabel="Show All"
          onCta={handleShowAll}
        >
          <WasabiCharacter mood="think" size={72} />
        </EmptyState>
      ) : (
        <FlatList
          style={LIST_STYLE}
          data={restaurants}
          keyExtractor={keyExtractor}
          contentContainerStyle={LIST_CONTENT_STYLE}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching && !isLoading}
          onRefresh={handleRefresh}
          renderItem={renderItem}
          ListFooterComponent={<ListFooter />}
        />
      )}
    </ScreenWrapper>
  );
}

function ListFooter() {
  return (
    <Pressable
      onPress={() => router.push('/request')}
      style={{
        marginTop: Spacing.sm,
        paddingVertical: Spacing.lg,
        alignItems: 'center',
        gap: Spacing.xs,
      }}
      accessibilityRole="button"
      accessibilityLabel="Suggest a restaurant"
    >
      <Text variant="bodySmall" color="rgba(0,0,0,0.4)">
        Missing a spot?
      </Text>
      <Text variant="bodySmall" style={{ color: Colors.salmon, fontWeight: '600' }}>
        Suggest a restaurant
      </Text>
    </Pressable>
  );
}
