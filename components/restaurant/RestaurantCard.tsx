import { memo, useCallback, useEffect } from 'react';
import { View, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import { isOpenNow } from '@utils/hours';
import { distanceKm, formatDistance } from '@utils/distance';
import { useJournalStore } from '@stores/journalStore';
import type { Restaurant } from '../../types';
import type { Coordinates } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onPress: () => void;
  index?: number;
  userLocation?: Coordinates | null;
}

const BLURHASH = 'L6PZfSi_.AyE_3t7t7R**0o#DgR4';

export const RestaurantCard = memo(function RestaurantCard({
  restaurant,
  onPress,
  index = 0,
  userLocation,
}: RestaurantCardProps) {
  const colors = useColors();
  const addEntry = useJournalStore((s) => s.addEntry);
  const entries = useJournalStore((s) => s.entries);
  const open = isOpenNow(restaurant);
  const isNew = restaurant.tags.includes('new-spot');
  const hasVisited = entries.some((e) => e.restaurantId === restaurant.id);

  const distance =
    userLocation != null
      ? formatDistance(distanceKm(userLocation, restaurant.coordinates))
      : null;

  const translateY = useSharedValue(24);
  const opacity = useSharedValue(0);
  const stampScale = useSharedValue(1);

  useEffect(() => {
    const delay = index * 60;
    translateY.value = withDelay(delay, withTiming(0, { duration: 380 }));
    opacity.value = withDelay(delay, withTiming(1, { duration: 380 }));
  }, [index, translateY, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stampScale.value }],
  }));

  const handlePress = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const handleQuickStamp = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (hasVisited) {
      Alert.alert(
        'Already stamped',
        `You have a journal entry for ${restaurant.name}. Add another visit from the restaurant page.`,
        [{ text: 'OK' }],
      );
      return;
    }

    stampScale.value = withSequence(
      withSpring(1.4, { damping: 6 }),
      withSpring(1, { damping: 8 }),
    );

    const today = new Date();
    const date = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    addEntry({
      restaurantId: restaurant.id,
      userId: null,
      date,
      photos: [],
      notes: '',
      ratings: { fishQuality: 3 },
      wouldReturn: true,
    });

    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [hasVisited, restaurant.id, restaurant.name, addEntry, stampScale]);

  return (
    <Animated.View style={animStyle}>
      <Pressable
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${restaurant.name}, ${open ? 'open' : 'closed'}, dinner $${restaurant.priceDinner} per person`}
      >
        {({ pressed }) => (
          <Card style={{ opacity: pressed ? 0.92 : 1, padding: 0, overflow: 'hidden' }}>
            {/* Photo */}
            <View style={{ height: 180, backgroundColor: colors.surface2 }}>
              {restaurant.photos.length > 0 ? (
                <Image
                  source={{ uri: restaurant.photos[0] }}
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                  placeholder={BLURHASH}
                  transition={300}
                  accessibilityLabel={`${restaurant.name} photo`}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: colors.surface2,
                    gap: Spacing.sm,
                  }}
                >
                  <Text variant="heading1" style={{ fontSize: 52 }}>
                    🍣
                  </Text>
                  <View
                    style={{
                      backgroundColor: colors.border,
                      borderRadius: Radius.pill,
                      paddingHorizontal: Spacing.sm,
                      paddingVertical: Spacing.xs / 2,
                    }}
                  >
                    <Text variant="caption" color={colors.textSecondary} style={{ fontWeight: '600' }}>
                      {restaurant.neighborhood}
                    </Text>
                  </View>
                </View>
              )}

              {/* Open/closed badge */}
              <View style={{ position: 'absolute', bottom: Spacing.sm, left: Spacing.sm }}>
                <Badge variant={open ? 'open' : 'closed'} />
              </View>

              {/* NEW badge */}
              {isNew && (
                <View
                  style={{
                    position: 'absolute',
                    top: Spacing.sm,
                    left: Spacing.sm,
                    backgroundColor: Colors.wasabiGreen,
                    borderRadius: Radius.pill,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: 2,
                  }}
                >
                  <Text variant="caption" color="#FFF" style={{ fontWeight: '700' }}>
                    NEW
                  </Text>
                </View>
              )}

              {/* Verified badge */}
              <View style={{ position: 'absolute', top: Spacing.sm, right: Spacing.sm }}>
                <Badge variant="verifiedAYCE" />
              </View>

              {/* Quick stamp button */}
              <Animated.View
                style={[
                  stampStyle,
                  {
                    position: 'absolute',
                    bottom: Spacing.sm,
                    right: Spacing.sm,
                  },
                ]}
              >
                <Pressable
                  onPress={handleQuickStamp}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    backgroundColor: hasVisited
                      ? Colors.wasabiGreen
                      : 'rgba(0,0,0,0.45)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={hasVisited ? 'Already visited' : 'Mark as visited'}
                  hitSlop={8}
                >
                  <Ionicons
                    name={hasVisited ? 'checkmark-circle' : 'checkmark-circle-outline'}
                    size={20}
                    color="#FFF"
                  />
                </Pressable>
              </Animated.View>
            </View>

            {/* Info */}
            <View style={{ padding: Spacing.base, gap: Spacing.sm }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <Text
                  variant="heading3"
                  style={{ flex: 1, marginRight: Spacing.sm }}
                  numberOfLines={1}
                >
                  {restaurant.name}
                </Text>
                <Text variant="bodySmall" style={{ fontWeight: '700', color: Colors.salmon }}>
                  ★ {restaurant.rating.toFixed(1)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
                <Text variant="bodySmall" color={colors.textSecondary} numberOfLines={1} style={{ flex: 1 }}>
                  {restaurant.neighborhood} · {restaurant.city}, {restaurant.state}
                </Text>
                {distance != null && (
                  <Text variant="caption" color={Colors.salmon} style={{ fontWeight: '600' }}>
                    {distance}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <View style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'center', flexWrap: 'wrap' }}>
                  {restaurant.priceLunch !== null ? (
                    <>
                      <Text variant="caption" color={colors.textSecondary}>
                        Lunch{' '}
                        <Text variant="caption" style={{ fontWeight: '700', color: colors.textPrimary }}>
                          ${restaurant.priceLunch}
                        </Text>
                      </Text>
                      <Text variant="caption" color={colors.textTertiary}>·</Text>
                    </>
                  ) : null}
                  <Text variant="caption" color={colors.textSecondary}>
                    Dinner{' '}
                    <Text variant="caption" style={{ fontWeight: '700', color: colors.textPrimary }}>
                      ${restaurant.priceDinner}
                    </Text>
                  </Text>
                  {restaurant.tags.includes('byob') && (
                    <>
                      <Text variant="caption" color={colors.textTertiary}>·</Text>
                      <Text variant="caption" style={{ fontWeight: '700', color: Colors.wasabiGreen }}>
                        BYOB
                      </Text>
                    </>
                  )}
                </View>
                <Text variant="caption" color={colors.textSecondary}>
                  ⏱ {restaurant.timeLimit} min
                </Text>
              </View>
            </View>
          </Card>
        )}
      </Pressable>
    </Animated.View>
  );
});
