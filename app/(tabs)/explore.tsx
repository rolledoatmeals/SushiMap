import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRestaurantSearch } from '@/hooks/useRestaurants';
import type { Restaurant } from '@/types/restaurant';
import { isRestaurantOpenNow } from '@/utils/geo';

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { data: results = [], isLoading } = useRestaurantSearch(query);

  return (
    <View className="flex-1 bg-off-white" style={{ paddingTop: insets.top }}>
      <View className="px-4 pt-4 pb-3">
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

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8735A" />
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 16 }}
          ItemSeparatorComponent={() => <View className="h-px bg-border mx-0" />}
          ListEmptyComponent={
            <View className="items-center py-16">
              <Text className="text-3xl mb-3">🍣</Text>
              <Text className="text-charcoal-light text-base text-center">
                {query ? 'No restaurants found' : 'Start typing to search'}
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
    <Pressable className="py-3.5 bg-off-white active:opacity-70">
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
          <View className={`px-2 py-0.5 rounded-full ${isOpen ? 'bg-wasabi/10' : 'bg-border'}`}>
            <Text className={`text-xs font-medium ${isOpen ? 'text-wasabi' : 'text-charcoal-light'}`}>
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
