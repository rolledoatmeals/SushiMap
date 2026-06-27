import { useRef, useMemo, useCallback } from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRestaurants } from '@/hooks/useRestaurants';
import type { Restaurant } from '@/types/restaurant';
import { useState } from 'react';

const NYC: Region = {
  latitude: 40.82,
  longitude: -73.98,
  latitudeDelta: 0.55,
  longitudeDelta: 0.55,
};

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const { data: restaurants = [], isLoading } = useRestaurants();
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => [240], []);

  const handleMarkerPress = useCallback((restaurant: Restaurant) => {
    setSelected(restaurant);
    sheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <View className="flex-1">
      <MapView
        style={{ flex: 1 }}
        initialRegion={NYC}
        showsUserLocation
        showsMyLocationButton={false}
        onPress={() => sheetRef.current?.close()}
      >
        {restaurants.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat, longitude: r.lng }}
            onPress={() => handleMarkerPress(r)}
          >
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: selected?.id === r.id ? '#E8735A' : '#2C2926',
                borderWidth: 2,
                borderColor: '#FFFFFF',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 12 }}>🍣</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {isLoading && (
        <View
          className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center"
          pointerEvents="none"
        >
          <ActivityIndicator size="large" color="#E8735A" />
        </View>
      )}

      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={handleSheetClose}
        backgroundStyle={{ backgroundColor: '#FFFFFF' }}
        handleIndicatorStyle={{ backgroundColor: '#EDE8E3' }}
        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.08, shadowRadius: 12 }}
      >
        <BottomSheetView style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 8 }}>
          {selected && <RestaurantDetail restaurant={selected} />}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

function RestaurantDetail({ restaurant: r }: { restaurant: Restaurant }) {
  const lunchPrice = r.pricing.find(
    (p) => p.isCurrent && (p.mealPeriod === 'lunch' || p.mealPeriod === 'all_day'),
  );
  const dinnerPrice = r.pricing.find(
    (p) => p.isCurrent && p.mealPeriod === 'dinner',
  );
  const isOpenNow = (() => {
    const { isRestaurantOpenNow } = require('@/utils/geo');
    return isRestaurantOpenNow(r.hours) as boolean;
  })();

  return (
    <View className="gap-3">
      <View className="flex-row items-start justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-xl font-bold text-charcoal" numberOfLines={2}>
            {r.name}
          </Text>
          {r.neighborhood && (
            <Text className="text-sm text-charcoal-light mt-0.5">{r.neighborhood} · {r.city}</Text>
          )}
        </View>
        <View
          className={`px-2.5 py-1 rounded-full ${isOpenNow ? 'bg-wasabi/10' : 'bg-border'}`}
        >
          <Text className={`text-xs font-semibold ${isOpenNow ? 'text-wasabi' : 'text-charcoal-light'}`}>
            {isOpenNow ? 'Open' : 'Closed'}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-charcoal-light">{r.address}</Text>

      <View className="flex-row gap-3">
        {lunchPrice && (
          <PriceChip label="Lunch" price={lunchPrice.pricePerPerson} />
        )}
        {dinnerPrice && (
          <PriceChip label="Dinner" price={dinnerPrice.pricePerPerson} />
        )}
      </View>

      <View className="flex-row gap-2 mt-1">
        {r.attributes.includes('reservations') && <Chip label="Reservations" />}
        {r.attributes.includes('byo_wine') && <Chip label="BYO Wine" />}
        {r.attributes.includes('byo_sake') && <Chip label="BYO Sake" />}
        {r.attributes.includes('parking_free') && <Chip label="Free Parking" />}
        {r.attributes.includes('halal') && <Chip label="Halal" />}
      </View>
    </View>
  );
}

function PriceChip({ label, price }: { label: string; price: number }) {
  return (
    <View className="bg-surface-warm border border-border rounded-lg px-3 py-2">
      <Text className="text-xs text-charcoal-light">{label}</Text>
      <Text className="text-base font-bold text-charcoal">${price.toFixed(0)}<Text className="text-xs font-normal text-charcoal-light">/pp</Text></Text>
    </View>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <View className="bg-border rounded-full px-2.5 py-1">
      <Text className="text-xs text-charcoal-mid">{label}</Text>
    </View>
  );
}
