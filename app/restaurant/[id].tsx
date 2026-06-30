import { useCallback, useMemo } from 'react';
import { View, Pressable, Linking, Share } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Image } from 'expo-image';
import { Text } from '@components/ui/Text';
import { Badge } from '@components/ui/Badge';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { ErrorState } from '@components/ui/ErrorState';
import { LoadingSpinner } from '@components/ui/LoadingSpinner';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useRestaurant } from '@hooks/useRestaurants';
import { useSavedStore } from '@stores/savedStore';
import { useJournalStore } from '@stores/journalStore';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import { isOpenNow, formatTodayHours, formatWeeklyHours } from '@utils/hours';
import { SEED_REVIEWS } from '../../data/seedReviews';

const HERO_HEIGHT = 280;

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { data: restaurant, isLoading, isError } = useRestaurant(id);
  const { toggle, isSaved } = useSavedStore();
  const entries = useJournalStore((s) => s.entries);
  const scrollY = useSharedValue(0);

  const wasabiMood = restaurant?.rating && restaurant.rating >= 4.5 ? 'celebrate' : 'idle';

  const scrollHandler = useAnimatedScrollHandler((e) => {
    scrollY.value = e.contentOffset.y;
  });

  const heroStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          scrollY.value,
          [0, HERO_HEIGHT],
          [0, -HERO_HEIGHT / 2],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const headerOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      scrollY.value,
      [HERO_HEIGHT - 80, HERO_HEIGHT - 40],
      [0, 1],
      Extrapolation.CLAMP,
    ),
  }));

  const handleSave = useCallback(async () => {
    if (!restaurant) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await toggle(restaurant.id);
  }, [toggle, restaurant]);

  const handleDirections = useCallback(async () => {
    if (!restaurant) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const query = encodeURIComponent(restaurant.address);
    await Linking.openURL(`maps:?q=${query}`);
  }, [restaurant]);

  const handleCall = useCallback(async () => {
    if (!restaurant?.phone) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL(`tel:${restaurant.phone.replace(/\D/g, '')}`);
  }, [restaurant]);

  const handleReserve = useCallback(async () => {
    if (!restaurant?.reservationUrl) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL(restaurant.reservationUrl);
  }, [restaurant]);

  const handleWebsite = useCallback(async () => {
    if (!restaurant?.website) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await Linking.openURL(restaurant.website);
  }, [restaurant]);

  const handleLogVisit = useCallback(() => router.push('/journal/create'), []);
  const handleBack = useCallback(() => router.back(), []);

  const handleShare = useCallback(async () => {
    if (!restaurant) return;
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const price = restaurant.priceLunch
      ? `Lunch $${restaurant.priceLunch} · Dinner $${restaurant.priceDinner}`
      : `Dinner $${restaurant.priceDinner}`;
    await Share.share({
      message: `${restaurant.name} — AYCE sushi in ${restaurant.neighborhood}, ${restaurant.city}\n${price}/pp · ${restaurant.timeLimit} min limit\n${restaurant.address}`,
      title: restaurant.name,
    });
  }, [restaurant]);

  // Derived state — must be computed before early returns to avoid hooks-order violation.
  const saved = restaurant ? isSaved(restaurant.id) : false;

  const { avgRatings, weeklyHours } = useMemo(() => {
    if (!restaurant) return { avgRatings: null, weeklyHours: {} as Record<string, string> };
    const filtered = entries.filter((e) => e.restaurantId === restaurant.id);
    const weekly = formatWeeklyHours(restaurant.hours);

    function avgOptional(key: 'value' | 'service' | 'refillSpeed' | 'atmosphere'): number {
      const rated = filtered.filter((e) => e.ratings[key] != null);
      if (rated.length === 0) return 0;
      return rated.reduce((a, e) => a + (e.ratings[key] ?? 0), 0) / rated.length;
    }

    const avgs =
      filtered.length > 0
        ? {
            fishQuality:
              filtered.reduce((a, e) => a + e.ratings.fishQuality, 0) / filtered.length,
            value: avgOptional('value'),
            service: avgOptional('service'),
            refillSpeed: avgOptional('refillSpeed'),
            atmosphere: avgOptional('atmosphere'),
          }
        : null;

    return { avgRatings: avgs, weeklyHours: weekly };
  }, [entries, restaurant]);

  const quickActions = useMemo(
    () =>
      restaurant
        ? [
            {
              icon: 'navigate-outline' as const,
              label: 'Directions',
              onPress: handleDirections,
              always: true,
              checked: undefined as boolean | undefined,
            },
            {
              icon: 'call-outline' as const,
              label: 'Call',
              onPress: handleCall,
              always: !!restaurant.phone,
              checked: undefined as boolean | undefined,
            },
            {
              icon: 'globe-outline' as const,
              label: 'Website',
              onPress: handleWebsite,
              always: !!restaurant.website,
              checked: undefined as boolean | undefined,
            },
            {
              icon: 'calendar-outline' as const,
              label: 'Reserve',
              onPress: handleReserve,
              always: !!restaurant.reservationUrl,
              checked: undefined as boolean | undefined,
            },
            {
              icon: (saved ? 'heart' : 'heart-outline') as 'heart' | 'heart-outline',
              label: saved ? 'Saved' : 'Save',
              onPress: handleSave,
              always: true,
              checked: saved,
            },
            {
              icon: 'share-outline' as const,
              label: 'Share',
              onPress: handleShare,
              always: true,
              checked: undefined as boolean | undefined,
            },
          ].filter((a) => a.always)
        : [],
    [
      saved,
      restaurant,
      handleDirections,
      handleCall,
      handleWebsite,
      handleReserve,
      handleSave,
      handleShare,
    ],
  );

  if (isLoading) return <LoadingSpinner fullScreen />;
  if (isError || !restaurant)
    return <ErrorState message="Restaurant not found." onRetry={handleBack} />;

  const r = restaurant;
  const open = isOpenNow(r);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Sticky header (appears on scroll) */}
      <Animated.View
        style={[headerOpacity, { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }]}
        pointerEvents="none"
      >
        <BlurView
          intensity={80}
          style={{
            paddingTop: insets.top + Spacing.sm,
            paddingBottom: Spacing.sm,
            paddingHorizontal: Spacing.lg,
          }}
        >
          <Text variant="heading3" numberOfLines={1}>
            {restaurant.name}
          </Text>
        </BlurView>
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero photo */}
        <Animated.View style={[{ height: HERO_HEIGHT, overflow: 'hidden' }, heroStyle]}>
          {restaurant.photos.length > 0 ? (
            <Image
              source={{ uri: restaurant.photos[0] }}
              style={{ width: '100%', height: HERO_HEIGHT + 40 }}
              contentFit="cover"
              accessibilityLabel={`${restaurant.name} photo`}
            />
          ) : (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.surface2,
              }}
            >
              <Text variant="heading1" style={{ fontSize: 72 }}>
                🍣
              </Text>
            </View>
          )}
          {/* Back button */}
          <Pressable
            onPress={handleBack}
            style={{
              position: 'absolute',
              top: 54,
              left: Spacing.base,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(0,0,0,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={22} color="#FFF" />
          </Pressable>
          {/* Save button */}
          <Pressable
            onPress={handleSave}
            style={{
              position: 'absolute',
              top: 54,
              right: Spacing.base,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: 'rgba(0,0,0,0.35)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            accessibilityRole="button"
            accessibilityLabel={saved ? 'Remove from saved' : 'Save restaurant'}
            accessibilityState={{ checked: saved }}
          >
            <Ionicons
              name={saved ? 'heart' : 'heart-outline'}
              size={22}
              color={saved ? Colors.salmon : '#FFF'}
            />
          </Pressable>
          {/* Verified badge */}
          <View style={{ position: 'absolute', bottom: Spacing.sm, left: Spacing.base }}>
            <Badge variant="verifiedAYCE" />
          </View>
        </Animated.View>

        <View style={{ padding: Spacing.lg, gap: Spacing.lg }}>
          {/* Core info */}
          <View style={{ gap: Spacing.sm }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.sm }}>
              <WasabiCharacter mood={wasabiMood} size={48} />
              <View style={{ flex: 1 }}>
                <Text variant="heading2">{restaurant.name}</Text>
                <Text variant="body" color={colors.textSecondary}>
                  {restaurant.neighborhood} · {restaurant.city}, {restaurant.state}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
              <Badge
                variant={open ? 'open' : 'closed'}
                label={open ? `Open · ${formatTodayHours(restaurant)}` : 'Closed'}
              />
              <Text variant="bodySmall" color={colors.textSecondary}>
                ★ {restaurant.rating.toFixed(1)}{restaurant.reviewCount > 0 ? ` (${restaurant.reviewCount})` : ''}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: Spacing.base }}>
              <View>
                {restaurant.priceLunch && (
                  <Text variant="bodySmall" color={colors.textSecondary}>
                    Lunch{' '}
                    <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                      ${restaurant.priceLunch}/pp
                    </Text>
                  </Text>
                )}
                <Text variant="bodySmall" color={colors.textSecondary}>
                  Dinner{' '}
                  <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                    ${restaurant.priceDinner}/pp
                  </Text>
                </Text>
              </View>
              <Text variant="bodySmall" color={colors.textSecondary}>
                ⏱{' '}
                <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                  {restaurant.timeLimit} min
                </Text>{' '}
                limit
              </Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {quickActions.map((action) => (
              <Pressable
                key={action.label}
                onPress={action.onPress}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  gap: Spacing.xs,
                  paddingVertical: Spacing.sm,
                  backgroundColor: colors.surface,
                  borderRadius: Radius.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  minHeight: 44,
                }}
                accessibilityRole="button"
                accessibilityLabel={action.label}
                accessibilityState={
                  action.checked !== undefined ? { checked: action.checked } : undefined
                }
              >
                <Ionicons
                  name={action.icon as 'navigate-outline'}
                  size={20}
                  color={Colors.salmon}
                />
                <Text variant="caption" color={colors.textSecondary}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* About */}
          <Card>
            <Text variant="heading3" style={{ marginBottom: Spacing.sm }}>
              About
            </Text>
            <Text variant="body" color={colors.textSecondary}>
              {restaurant.description}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: Spacing.sm,
                marginTop: Spacing.md,
              }}
            >
              {restaurant.menuCategories.map((cat) => (
                <View
                  key={cat}
                  style={{
                    backgroundColor: colors.surface2,
                    borderRadius: Radius.pill,
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                  }}
                >
                  <Text variant="caption" color={colors.textSecondary}>
                    {cat}
                  </Text>
                </View>
              ))}
            </View>
            <View style={{ marginTop: Spacing.md, gap: Spacing.xs }}>
              {[
                { label: 'Sashimi', val: restaurant.hasSashimi },
                { label: 'Nigiri', val: restaurant.hasNigiri },
                { label: 'Specialty Rolls', val: restaurant.hasSpecialtyRolls },
                { label: 'Drinks Included', val: restaurant.drinks },
                { label: 'BYOB', val: restaurant.tags.includes('byob') },
                { label: 'Parking', val: restaurant.parking },
                { label: 'Wheelchair Accessible', val: restaurant.accessibility },
              ].map(({ label, val }) => (
                <View
                  key={label}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 2,
                  }}
                  accessible
                  accessibilityLabel={`${label}: ${val ? 'available' : 'not available'}`}
                >
                  <Text variant="bodySmall" color={colors.textSecondary}>
                    {label}
                  </Text>
                  <Ionicons
                    name={val ? 'checkmark-circle' : 'close-circle-outline'}
                    size={18}
                    color={val ? Colors.wasabiGreen : colors.textTertiary}
                  />
                </View>
              ))}
            </View>
          </Card>

          {/* Hours */}
          <Card>
            <Text variant="heading3" style={{ marginBottom: Spacing.sm }}>
              Hours
            </Text>
            {Object.entries(weeklyHours).map(([day, hours]) => (
              <View
                key={day}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: Spacing.xs,
                }}
              >
                <Text
                  variant="bodySmall"
                  color={colors.textSecondary}
                  style={{ fontWeight: '600' }}
                >
                  {day}
                </Text>
                <Text variant="bodySmall" color={colors.textSecondary}>
                  {hours}
                </Text>
              </View>
            ))}
          </Card>

          {/* My ratings */}
          <Card>
            <Text variant="heading3" style={{ marginBottom: Spacing.sm }}>
              My Ratings
            </Text>
            {avgRatings ? (
              [
                { label: 'Fish Quality', val: avgRatings.fishQuality },
                { label: 'Value', val: avgRatings.value },
                { label: 'Service', val: avgRatings.service },
                { label: 'Refill Speed', val: avgRatings.refillSpeed },
                { label: 'Atmosphere', val: avgRatings.atmosphere },
              ]
                .filter(({ val }) => val > 0)
                .map(({ label, val }) => (
                  <View key={label} style={{ marginBottom: Spacing.sm }}>
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
                      <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                        {val.toFixed(1)}/5
                      </Text>
                    </View>
                    <View
                      style={{
                        height: 6,
                        backgroundColor: colors.surface2,
                        borderRadius: Radius.pill,
                      }}
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
                ))
            ) : (
              <Text variant="body" color={colors.textTertiary}>
                Be the first to review this spot.
              </Text>
            )}
          </Card>

          {/* Community reviews */}
          <CommunityReviews restaurantId={r.id} reviewCount={r.reviewCount} rating={r.rating} />

          <Button
            label="Log a Visit"
            variant="primary"
            size="lg"
            fullWidth
            onPress={handleLogVisit}
          />

          {/* Data footer */}
          <View style={{ gap: Spacing.xs }}>
            <Text variant="caption" color={colors.textTertiary}>
              Last verified: {restaurant.lastVerifiedDate} · {restaurant.verificationSource}
            </Text>
            <Text variant="caption" color={colors.textTertiary}>
              Community confidence: {restaurant.communityConfidenceScore}%
            </Text>
          </View>
        </View>
      </Animated.ScrollView>
    </View>
  );
}

// ─── Community Reviews ────────────────────────────────────────────────────────

function CommunityReviews({
  restaurantId,
  reviewCount,
  rating,
}: {
  restaurantId: string;
  reviewCount: number;
  rating: number;
}) {
  const colors = useColors();
  const reviews = SEED_REVIEWS[restaurantId]?.slice(0, 3) ?? [];

  if (reviews.length === 0) return null;

  return (
    <Card style={{ gap: Spacing.md }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text variant="heading3">Community</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs }}>
          <Text variant="bodySmall" style={{ fontWeight: '700', color: Colors.salmon }}>
            ★ {rating.toFixed(1)}
          </Text>
          <Text variant="caption" color={colors.textTertiary}>
            ({reviewCount})
          </Text>
        </View>
      </View>

      {/* Review rows */}
      {reviews.map((review, i) => (
        <View
          key={review.id}
          style={{
            paddingTop: i > 0 ? Spacing.md : 0,
            borderTopWidth: i > 0 ? 1 : 0,
            borderTopColor: colors.border,
            gap: Spacing.xs,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
              {/* Avatar */}
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: Colors.salmon + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: Colors.salmon }}>
                  {review.handle.slice(0, 2).toUpperCase()}
                </Text>
              </View>
              <Text variant="bodySmall" style={{ fontWeight: '600' }}>
                {review.handle}
              </Text>
            </View>
            <Text variant="caption" color={Colors.salmon} style={{ fontWeight: '600' }}>
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </Text>
          </View>
          <Text variant="bodySmall" color={colors.textSecondary}>
            {review.text}
          </Text>
          <Text variant="caption" color={colors.textTertiary}>
            {review.date}
          </Text>
        </View>
      ))}
    </Card>
  );
}
