import { useRef, useState, useCallback, useMemo } from 'react';
import { View, Pressable, ScrollView, StyleSheet } from 'react-native';
import MapView, { Marker, type Region } from 'react-native-maps';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Text } from '@components/ui/Text';
import { RestaurantCard } from '@components/restaurant/RestaurantCard';
import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { useRestaurants, useOpenNowRestaurants } from '@hooks/useRestaurants';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import { isOpenNow } from '@utils/hours';
import type { Restaurant } from '../../types';
import { router } from 'expo-router';

// No Google APIs — uses Apple Maps on iOS, default on Android (free)
const NYC_REGION: Region = {
  latitude: 40.7831,
  longitude: -73.9712,
  latitudeDelta: 0.35,
  longitudeDelta: 0.35,
};

// Stable shadow offset — avoids new object on every marker render
const MARKER_SHADOW_OFFSET = { width: 0, height: 2 } as const;

// Stable snap-points array — BottomSheet uses referential equality internally
const SNAP_POINTS: (string | number)[] = ['40%', '70%'];

type FilterChip = { id: string; label: string };
const CHIPS: FilterChip[] = [
  { id: 'all', label: 'All' },
  { id: 'open-now', label: 'Open Now' },
  { id: 'under-30', label: 'Under $30' },
  { id: 'top-rated', label: 'Top Rated' },
];

export default function MapScreen() {
  const colors = useColors();
  const mapRef = useRef<MapView>(null);
  const sheetRef = useRef<BottomSheet>(null);
  const [selected, setSelected] = useState<Restaurant | null>(null);
  const [activeChip, setActiveChip] = useState('all');

  const { data: allRestaurants, isLoading, isError, refetch } = useRestaurants();
  const { data: openNow } = useOpenNowRestaurants();

  const restaurants = useMemo(() => {
    if (activeChip === 'open-now') return openNow ?? [];
    if (activeChip === 'under-30') return (allRestaurants ?? []).filter((r) => r.priceDinner <= 30);
    if (activeChip === 'top-rated') return (allRestaurants ?? []).filter((r) => r.rating >= 4.2);
    return allRestaurants ?? [];
  }, [activeChip, allRestaurants, openNow]);

  // Stable style objects for BottomSheet
  const sheetBgStyle = useMemo(() => ({ backgroundColor: colors.surface }), [colors.surface]);
  const sheetHandleStyle = useMemo(() => ({ backgroundColor: colors.border }), [colors.border]);

  const handleMarkerPress = useCallback(
    (r: Restaurant) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setSelected(r);
      mapRef.current?.animateToRegion(
        { ...r.coordinates, latitudeDelta: 0.05, longitudeDelta: 0.05 },
        400,
      );
      sheetRef.current?.expand();
    },
    [],
  );

  const handleRecenter = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    mapRef.current?.animateToRegion(NYC_REGION, 600);
  }, []);

  const handleChip = useCallback((id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setActiveChip(id);
    setSelected(null);
    sheetRef.current?.close();
  }, []);

  const handleSheetClose = useCallback(() => setSelected(null), []);

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError) return <ErrorState message="Couldn't load map data." onRetry={refetch} />;

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={NYC_REGION}
        showsUserLocation
        showsCompass={false}
        // No Google API key — Apple Maps on iOS, OSM on Android via default
      >
        {restaurants.map((r) => {
          const isSelected = selected?.id === r.id;
          const size = isSelected ? 44 : 36;
          const fontSize = isSelected ? 22 : 18;
          const pinBg = isSelected
            ? Colors.charcoal
            : isOpenNow(r)
              ? Colors.wasabiGreen
              : '#ABABAB';
          return (
            <Marker
              key={r.id}
              coordinate={r.coordinates}
              onPress={() => handleMarkerPress(r)}
              accessibilityLabel={r.name}
            >
              <View
                style={{
                  width: size,
                  height: size,
                  borderRadius: Radius.pill,
                  backgroundColor: pinBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  shadowColor: '#000',
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  shadowOffset: MARKER_SHADOW_OFFSET,
                  elevation: 4,
                }}
              >
                <Text style={{ fontSize }}>🍣</Text>
              </View>
            </Marker>
          );
        })}
      </MapView>

      {/* Floating filter chips */}
      <View style={styles.chipsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: Spacing.lg, gap: Spacing.sm }}
        >
          {CHIPS.map((chip) => {
            const active = chip.id === activeChip;
            const blurTint = colors.surface === '#FFFFFF' ? 'light' : 'dark';
            return (
              <Pressable
                key={chip.id}
                onPress={() => handleChip(chip.id)}
                accessibilityRole="button"
                accessibilityState={{ selected: active }}
                accessibilityLabel={chip.label}
              >
                <BlurView
                  intensity={80}
                  tint={blurTint}
                  style={{
                    borderRadius: Radius.pill,
                    overflow: 'hidden',
                    paddingHorizontal: Spacing.base,
                    paddingVertical: Spacing.xs + 2,
                    backgroundColor: active ? Colors.salmon : undefined,
                  }}
                >
                  <Text
                    variant="bodySmall"
                    color={active ? '#FFF' : colors.textPrimary}
                    style={{ fontWeight: active ? '600' : '400' }}
                  >
                    {chip.label}
                  </Text>
                </BlurView>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Re-center button */}
      <Pressable
        onPress={handleRecenter}
        style={[styles.recenterBtn, { backgroundColor: colors.surface }]}
        accessibilityRole="button"
        accessibilityLabel="Re-center map"
      >
        <Ionicons name="locate" size={20} color={Colors.salmon} />
      </Pressable>

      {/* Bottom sheet restaurant card */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        onClose={handleSheetClose}
        backgroundStyle={sheetBgStyle}
        handleIndicatorStyle={sheetHandleStyle}
      >
        <BottomSheetView style={styles.sheetContent}>
          {selected && (
            <RestaurantCard
              restaurant={selected}
              onPress={() => router.push(`/restaurant/${selected.id}`)}
            />
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  chipsContainer: { position: 'absolute', top: 60, left: 0, right: 0 },
  recenterBtn: {
    position: 'absolute',
    bottom: 180,
    right: Spacing.lg,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  sheetContent: { padding: Spacing.base },
});
