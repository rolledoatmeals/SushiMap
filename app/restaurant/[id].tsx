import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useAuthStore } from '@/store/auth';
import { isRestaurantOpenNow } from '@/utils/geo';
import type { RestaurantHours } from '@/types/restaurant';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const ATTRIBUTE_LABELS: Record<string, string> = {
  reservations: 'Reservations',
  walk_in_only: 'Walk-in Only',
  byo_wine: 'BYO Wine',
  byo_beer: 'BYO Beer',
  byo_sake: 'BYO Sake',
  parking_free: 'Free Parking',
  parking_paid: 'Paid Parking',
  delivery: 'Delivery',
  takeout: 'Takeout',
  halal: 'Halal',
  wheelchair_accessible: 'Accessible',
  outdoor_seating: 'Outdoor Seating',
  private_dining: 'Private Dining',
};

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number);
  const period = (h ?? 0) >= 12 ? 'pm' : 'am';
  const hour = (h ?? 0) % 12 || 12;
  return m ? `${hour}:${String(m).padStart(2, '0')}${period}` : `${hour}${period}`;
}

export default function RestaurantDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const { session } = useAuthStore();
  const { data: restaurant, isLoading } = useRestaurant(id ?? null);

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8F4EF', alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#E8735A" />
      </View>
    );
  }

  if (!restaurant) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F8F4EF', alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#8A7E78' }}>Restaurant not found</Text>
      </View>
    );
  }

  const isOpen = isRestaurantOpenNow(restaurant.hours);
  const lunchPrice = restaurant.pricing.find(
    (p) => p.isCurrent && (p.mealPeriod === 'lunch' || p.mealPeriod === 'all_day'),
  );
  const dinnerPrice = restaurant.pricing.find(
    (p) => p.isCurrent && p.mealPeriod === 'dinner',
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F8F4EF' }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 20,
          backgroundColor: '#FFFFFF',
          borderBottomWidth: 1,
          borderBottomColor: '#EDE8E3',
        }}>
          <Pressable
            onPress={() => router.back()}
            hitSlop={12}
            style={{ marginBottom: 16 }}
          >
            <Text style={{ fontSize: 15, color: '#E8735A', fontWeight: '600' }}>← Back</Text>
          </Pressable>

          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{ fontSize: 26, fontWeight: '800', color: '#2C2926', letterSpacing: -0.5 }}>
                {restaurant.name}
              </Text>
              {restaurant.neighborhood && (
                <Text style={{ fontSize: 14, color: '#8A7E78', marginTop: 4 }}>
                  {restaurant.neighborhood} · {restaurant.city}, {restaurant.state}
                </Text>
              )}
            </View>
            <View style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: isOpen ? '#7AB64815' : '#EDE8E3',
            }}>
              <Text style={{
                fontSize: 13,
                fontWeight: '700',
                color: isOpen ? '#7AB648' : '#8A7E78',
              }}>
                {isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>

          {restaurant.address && (
            <Text style={{ fontSize: 13, color: '#8A7E78', marginTop: 8 }}>
              📍 {restaurant.address}
            </Text>
          )}
        </View>

        {/* Pricing */}
        {(lunchPrice || dinnerPrice) && (
          <Section title="Pricing">
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {lunchPrice && (
                <View style={pricingCardStyle}>
                  <Text style={{ fontSize: 12, color: '#8A7E78', marginBottom: 2 }}>Lunch</Text>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#2C2926' }}>
                    ${lunchPrice.pricePerPerson.toFixed(0)}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#8A7E78' }}>per person</Text>
                </View>
              )}
              {dinnerPrice && (
                <View style={pricingCardStyle}>
                  <Text style={{ fontSize: 12, color: '#8A7E78', marginBottom: 2 }}>Dinner</Text>
                  <Text style={{ fontSize: 22, fontWeight: '800', color: '#2C2926' }}>
                    ${dinnerPrice.pricePerPerson.toFixed(0)}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#8A7E78' }}>per person</Text>
                </View>
              )}
            </View>
          </Section>
        )}

        {/* Hours */}
        {restaurant.hours.length > 0 && (
          <Section title="Hours">
            <View style={{ gap: 6 }}>
              {DAYS.map((day, i) => {
                const h = restaurant.hours.find((x) => x.dayOfWeek === i) as RestaurantHours | undefined;
                const today = new Date().getDay() === i;
                return (
                  <View
                    key={day}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      backgroundColor: today ? '#E8735A15' : 'transparent',
                    }}
                  >
                    <Text style={{
                      fontSize: 14,
                      fontWeight: today ? '700' : '400',
                      color: today ? '#E8735A' : '#4A4440',
                      width: 40,
                    }}>
                      {day}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      color: h?.isClosed ? '#8A7E78' : '#2C2926',
                      fontWeight: today ? '600' : '400',
                    }}>
                      {!h || h.isClosed
                        ? 'Closed'
                        : `${formatTime(h.openTime!)} – ${formatTime(h.closeTime!)}`}
                    </Text>
                  </View>
                );
              })}
            </View>
          </Section>
        )}

        {/* Attributes */}
        {restaurant.attributes.length > 0 && (
          <Section title="Details">
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {restaurant.attributes.map((attr) => (
                <View
                  key={attr}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 20,
                    backgroundColor: '#EDE8E3',
                  }}
                >
                  <Text style={{ fontSize: 13, color: '#4A4440', fontWeight: '500' }}>
                    {ATTRIBUTE_LABELS[attr] ?? attr}
                  </Text>
                </View>
              ))}
            </View>
          </Section>
        )}
      </ScrollView>

      {/* Log Visit FAB */}
      {session && (
        <View style={{
          position: 'absolute',
          bottom: insets.bottom + 16,
          left: 20,
          right: 20,
        }}>
          <Pressable
            onPress={() => router.push({ pathname: '/log-visit', params: { restaurantId: restaurant.id } })}
            style={({ pressed }) => ({
              height: 54,
              borderRadius: 16,
              backgroundColor: pressed ? '#D4634A' : '#E8735A',
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#E8735A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
              + Log Visit
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginTop: 12, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#EDE8E3', padding: 20 }}>
      <Text style={{ fontSize: 12, fontWeight: '700', color: '#8A7E78', letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 14 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

const pricingCardStyle = {
  flex: 1,
  backgroundColor: '#F8F4EF',
  borderRadius: 14,
  padding: 16,
  alignItems: 'center' as const,
  borderWidth: 1,
  borderColor: '#EDE8E3',
};
