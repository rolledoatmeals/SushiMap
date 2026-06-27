import { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRestaurants } from '@/hooks/useRestaurants';
import type { Restaurant } from '@/types/restaurant';
import { isRestaurantOpenNow } from '@/utils/geo';

type FilterKey = 'open_now' | 'manhattan' | 'brooklyn' | 'queens' | 'nj';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'open_now', label: 'Open Now' },
  { key: 'manhattan', label: 'Manhattan' },
  { key: 'brooklyn', label: 'Brooklyn' },
  { key: 'queens', label: 'Queens' },
  { key: 'nj', label: 'NJ' },
];

function matchesFilter(r: Restaurant, active: Set<FilterKey>): boolean {
  if (active.has('open_now') && !isRestaurantOpenNow(r.hours)) return false;
  if (active.has('manhattan') && r.regionId !== 'region-nyc-manhattan') return false;
  if (active.has('brooklyn') && r.regionId !== 'region-nyc-brooklyn') return false;
  if (active.has('queens') && r.regionId !== 'region-nyc-queens') return false;
  if (active.has('nj') && r.regionId !== 'region-nj') return false;
  return true;
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const { data: allRestaurants = [], isLoading } = useRestaurants();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allRestaurants.filter((r) => {
      const matchesSearch =
        q.length === 0 ||
        r.name.toLowerCase().includes(q) ||
        (r.neighborhood?.toLowerCase().includes(q) ?? false) ||
        r.city.toLowerCase().includes(q) ||
        r.address.toLowerCase().includes(q);
      return matchesSearch && matchesFilter(r, activeFilters);
    });
  }, [allRestaurants, query, activeFilters]);

  function toggleFilter(key: FilterKey) {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      const regionKeys: FilterKey[] = ['manhattan', 'brooklyn', 'queens', 'nj'];
      if (regionKeys.includes(key)) {
        regionKeys.forEach((k) => next.delete(k));
      }
      if (prev.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  return (
    <View className="flex-1 bg-off-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 pt-4 pb-2">
        <Text className="text-2xl font-bold text-charcoal mb-3">Explore</Text>
        <View className="flex-row items-center bg-surface border border-border rounded-xl px-4 h-11 gap-2">
          <Text className="text-base">🔍</Text>
          <TextInput
            className="flex-1 text-base text-charcoal"
            placeholder="Search restaurants, neighborhoods..."
            placeholderTextColor="#8A7E78"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => setQuery('')} hitSlop={8}>
              <Text className="text-charcoal-light text-lg">✕</Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
      >
        {FILTERS.map((f) => {
          const active = activeFilters.has(f.key);
          return (
            <Pressable
              key={f.key}
              onPress={() => toggleFilter(f.key)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 20,
                borderWidth: 1.5,
                borderColor: active ? '#E8735A' : '#EDE8E3',
                backgroundColor: active ? '#E8735A' : '#FFFFFF',
              }}
            >
              <Text style={{
                fontSize: 13,
                fontWeight: '600',
                color: active ? '#FFFFFF' : '#4A4440',
              }}>
                {f.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8735A" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
          ItemSeparatorComponent={() => <View className="h-px bg-border" />}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-3xl mb-3">🍣</Text>
              <Text className="text-charcoal-light text-base text-center">
                {query || activeFilters.size > 0 ? 'No restaurants match' : 'No restaurants yet'}
              </Text>
            </View>
          }
          renderItem={({ item }) => <RestaurantRow restaurant={item} />}
        />
      )}
    </View>
  );
}

function RestaurantRow({ restaurant: r }: { restaurant: Restaurant }) {
  const lunchPrice = r.pricing.find(
    (p) => p.isCurrent && (p.mealPeriod === 'lunch' || p.mealPeriod === 'all_day'),
  );
  const dinnerPrice = r.pricing.find((p) => p.isCurrent && p.mealPeriod === 'dinner');
  const isOpen = isRestaurantOpenNow(r.hours);

  return (
    <Pressable
      onPress={() => router.push(`/restaurant/${r.id}`)}
      className="py-3.5 bg-off-white active:opacity-70"
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-charcoal" numberOfLines={1}>
            {r.name}
          </Text>
          <Text className="text-sm text-charcoal-light mt-0.5">
            {[r.neighborhood, r.city].filter(Boolean).join(' · ')}
          </Text>
        </View>
        <View className="items-end gap-1">
          <View style={{
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 20,
            backgroundColor: isOpen ? '#7AB64818' : '#EDE8E3',
          }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: isOpen ? '#7AB648' : '#8A7E78' }}>
              {isOpen ? 'Open' : 'Closed'}
            </Text>
          </View>
          <Text className="text-xs text-charcoal-light">
            {lunchPrice ? `L $${lunchPrice.pricePerPerson.toFixed(0)}` : ''}
            {lunchPrice && dinnerPrice ? ' · ' : ''}
            {dinnerPrice ? `D $${dinnerPrice.pricePerPerson.toFixed(0)}` : ''}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
