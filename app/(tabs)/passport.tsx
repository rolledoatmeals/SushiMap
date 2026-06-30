import { useEffect, useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useJournalStore } from '@stores/journalStore';
import { useAuthStore } from '@stores/authStore';
import { useRestaurants } from '@hooks/useRestaurants';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import type { Restaurant } from '../../types';

// ─── Local collection definitions ───────────────────────────────────────────

const NYC_IDS = ['r007', 'r008', 'r009', 'r010', 'r011', 'r038', 'r039', 'r040', 'r041', 'r042', 'r043', 'r044', 'r045', 'r046', 'r047', 'r048', 'r049', 'r050', 'r051'] as const;
const NJ_IDS = ['r001', 'r002', 'r003', 'r004', 'r005', 'r006', 'r012', 'r013', 'r014', 'r015', 'r016', 'r017', 'r018', 'r019', 'r020', 'r021', 'r022', 'r023', 'r024', 'r025', 'r026', 'r027', 'r028', 'r029', 'r030', 'r031', 'r032', 'r033', 'r034', 'r037', 'r052', 'r053', 'r054', 'r055', 'r056', 'r057', 'r058'] as const;
const TAMPA_IDS = ['r059', 'r060', 'r061', 'r062', 'r063', 'r064', 'r065', 'r066', 'r067', 'r068'] as const;

type LocalCollection = {
  id: string;
  icon: string;
  name: string;
  description: string;
  getProgress: (v: Set<string>) => { current: number; total: number };
  isComplete: (v: Set<string>) => boolean;
};

const COLLECTIONS: LocalCollection[] = [
  {
    id: 'palisades',
    icon: '🏔️',
    name: 'Palisades Park Pack',
    description: 'Visit all 4 AYCE spots in Palisades Park, NJ',
    getProgress: (v) => ({
      current: ['r001', 'r002', 'r003', 'r004'].filter((id) => v.has(id)).length,
      total: 4,
    }),
    isComplete: (v) => ['r001', 'r002', 'r003', 'r004'].every((id) => v.has(id)),
  },
  {
    id: 'fort_lee',
    icon: '🌉',
    name: 'Fort Lee Explorer',
    description: 'Hit all 3 AYCE spots in Fort Lee',
    getProgress: (v) => ({
      current: ['r005', 'r006', 'r053'].filter((id) => v.has(id)).length,
      total: 3,
    }),
    isComplete: (v) => ['r005', 'r006', 'r053'].every((id) => v.has(id)),
  },
  {
    id: 'flushing',
    icon: '🍜',
    name: 'Flushing Obsessed',
    description: 'Visit all 3 AYCE gems in Flushing, Queens',
    getProgress: (v) => ({
      current: ['r007', 'r008', 'r009'].filter((id) => v.has(id)).length,
      total: 3,
    }),
    isComplete: (v) => ['r007', 'r008', 'r009'].every((id) => v.has(id)),
  },
  {
    id: 'long_island',
    icon: '🏝️',
    name: 'Long Island Loop',
    description: 'Stamp all 4 AYCE spots on Long Island',
    getProgress: (v) => ({
      current: ['r046', 'r047', 'r048', 'r049'].filter((id) => v.has(id)).length,
      total: 4,
    }),
    isComplete: (v) => ['r046', 'r047', 'r048', 'r049'].every((id) => v.has(id)),
  },
  {
    id: 'tampa_bay',
    icon: '🌴',
    name: 'Tampa Bay Sushi Tour',
    description: 'Visit 5 AYCE spots across the Tampa Bay area',
    getProgress: (v) => ({
      current: Math.min(TAMPA_IDS.filter((id) => v.has(id)).length, 5),
      total: 5,
    }),
    isComplete: (v) => TAMPA_IDS.filter((id) => v.has(id)).length >= 5,
  },
  {
    id: 'nyc_nj',
    icon: '🗽',
    name: 'NYC + NJ Explorer',
    description: 'Experience AYCE on both sides of the Hudson',
    getProgress: (v) => {
      const hasNYC = NYC_IDS.some((id) => v.has(id)) ? 1 : 0;
      const hasNJ = NJ_IDS.some((id) => v.has(id)) ? 1 : 0;
      return { current: hasNYC + hasNJ, total: 2 };
    },
    isComplete: (v) => NYC_IDS.some((id) => v.has(id)) && NJ_IDS.some((id) => v.has(id)),
  },
];

// ─── Seeded leaderboard community (anonymized handles) ───────────────────────

type LeaderEntry = { id: string; name: string; stamps: number; isMe?: boolean };

const COMMUNITY_SEEDS: Omit<LeaderEntry, 'isMe'>[] = [
  { id: 'u1',  name: 'sashimi_steve',    stamps: 31 },
  { id: 'u2',  name: 'roll_queen_nj',    stamps: 28 },
  { id: 'u3',  name: 'wasabi.warrior',   stamps: 26 },
  { id: 'u4',  name: 'ayces_up',         stamps: 23 },
  { id: 'u5',  name: 'edamame_earl',     stamps: 20 },
  { id: 'u6',  name: 'flushing_fan',     stamps: 18 },
  { id: 'u7',  name: 'byo_baron',        stamps: 16 },
  { id: 'u8',  name: 'nori_nate',        stamps: 14 },
  { id: 'u9',  name: 'hudson_rolls',     stamps: 12 },
  { id: 'u10', name: 'toro.enjoyer',     stamps: 11 },
  { id: 'u11', name: 'bergen_bites',     stamps: 10 },
  { id: 'u12', name: 'tampa.sushi.fan',  stamps: 9  },
  { id: 'u13', name: 'brooklyn.rolls',   stamps: 8  },
  { id: 'u14', name: 'spicy_tuna_gal',   stamps: 7  },
  { id: 'u15', name: 'queens_eats',      stamps: 7  },
  { id: 'u16', name: 'jc_foodie',        stamps: 6  },
  { id: 'u17', name: 'maki_mike',        stamps: 5  },
  { id: 'u18', name: 'omakase_or_bust',  stamps: 4  },
  { id: 'u19', name: 'lowkey_rice',      stamps: 3  },
  { id: 'u20', name: 'nigiri.net',       stamps: 3  },
  { id: 'u21', name: 'ayce.addict',      stamps: 2  },
  { id: 'u22', name: 'refill.speedrun',  stamps: 2  },
  { id: 'u23', name: 'flounder_found',   stamps: 1  },
  { id: 'u24', name: 'eel.season',       stamps: 1  },
  { id: 'u25', name: 'soy.curious',      stamps: 1  },
];

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

// ─── Stamp item (animated) ───────────────────────────────────────────────────

function StampItem({
  restaurant,
  visited,
  delay,
}: {
  restaurant: Restaurant;
  visited: boolean;
  delay: number;
}) {
  const scale = useSharedValue(0);
  const colors = useColors();

  useEffect(() => {
    scale.value = withDelay(delay, withSpring(1, { damping: 14, stiffness: 200 }));
  }, [scale, delay]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const initials = restaurant.name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={{ width: '33.33%', padding: Spacing.xs }}>
      <Animated.View style={animStyle}>
        <View
          style={{
            aspectRatio: 1,
            borderRadius: Radius.xl,
            backgroundColor: visited ? Colors.salmon : colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: visited ? 0 : 1,
            borderColor: colors.border,
          }}
          accessibilityLabel={`${restaurant.name}${visited ? ', visited' : ', not yet visited'}`}
          accessibilityRole="image"
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: visited ? '#FFF' : colors.textTertiary,
            }}
          >
            {initials}
          </Text>
          {visited && (
            <Text style={{ fontSize: 9, color: 'rgba(255,255,255,0.85)', marginTop: 2 }}>✓</Text>
          )}
        </View>
        <Text
          numberOfLines={2}
          style={{
            fontSize: 9,
            textAlign: 'center',
            color: visited ? colors.textPrimary : colors.textTertiary,
            marginTop: Spacing.xs,
            lineHeight: 12,
          }}
        >
          {restaurant.name}
        </Text>
      </Animated.View>
    </View>
  );
}

// ─── Achievement badge ────────────────────────────────────────────────────────

function AchievementBadge({
  icon,
  name,
  description,
  unlocked,
}: {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
}) {
  const colors = useColors();
  return (
    <View
      style={{ width: '33.33%', padding: Spacing.xs }}
      accessibilityLabel={`${name}: ${description}. ${unlocked ? 'Unlocked' : 'Locked'}`}
      accessibilityRole="image"
    >
      <View
        style={{
          borderRadius: Radius.xl,
          backgroundColor: unlocked ? Colors.wasabiGreen + '18' : colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
          padding: Spacing.md,
          aspectRatio: 1,
          borderWidth: 1,
          borderColor: unlocked ? Colors.wasabiGreen + '40' : colors.border,
        }}
      >
        <Text style={{ fontSize: 26, opacity: unlocked ? 1 : 0.3 }}>{icon}</Text>
      </View>
      <Text
        numberOfLines={2}
        style={{
          fontSize: 9,
          textAlign: 'center',
          color: unlocked ? colors.textPrimary : colors.textTertiary,
          marginTop: Spacing.xs,
          lineHeight: 12,
        }}
      >
        {name}
      </Text>
    </View>
  );
}

// ─── Leaderboard row ─────────────────────────────────────────────────────────

function LeaderRow({ rank, entry, total }: { rank: number; entry: LeaderEntry; total: number }) {
  const colors = useColors();
  const isMe = !!entry.isMe;
  const medal = rank <= 3 ? RANK_MEDALS[rank - 1] : null;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: Radius.md,
        backgroundColor: isMe ? Colors.salmon + '14' : 'transparent',
        borderWidth: isMe ? 1 : 0,
        borderColor: isMe ? Colors.salmon + '40' : 'transparent',
        marginBottom: Spacing.xs,
        gap: Spacing.md,
      }}
      accessibilityLabel={`Rank ${rank}: ${entry.name}, ${entry.stamps} stamps`}
    >
      {/* Rank */}
      <View style={{ width: 28, alignItems: 'center' }}>
        {medal ? (
          <Text style={{ fontSize: 18 }}>{medal}</Text>
        ) : (
          <Text variant="bodySmall" color={colors.textTertiary} style={{ fontWeight: '600' }}>
            {rank}
          </Text>
        )}
      </View>

      {/* Avatar */}
      <View
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: isMe ? Colors.salmon : colors.surface2,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          style={{ fontSize: 13, fontWeight: '700', color: isMe ? '#FFF' : colors.textSecondary }}
        >
          {entry.name.slice(0, 2).toUpperCase()}
        </Text>
      </View>

      {/* Name + bar */}
      <View style={{ flex: 1 }}>
        <View
          style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.xs, marginBottom: 4 }}
        >
          <Text
            variant="bodySmall"
            style={{
              fontWeight: isMe ? '700' : '500',
              color: isMe ? Colors.salmon : colors.textPrimary,
            }}
          >
            {isMe ? 'You' : entry.name}
          </Text>
          {isMe && <Ionicons name="person" size={10} color={Colors.salmon} />}
        </View>
        <View style={{ height: 4, backgroundColor: colors.surface2, borderRadius: Radius.pill }}>
          <View
            style={{
              height: 4,
              width: `${Math.max(4, (entry.stamps / total) * 100)}%`,
              backgroundColor: isMe ? Colors.salmon : colors.border,
              borderRadius: Radius.pill,
            }}
          />
        </View>
      </View>

      {/* Stamp count */}
      <Text
        variant="bodySmall"
        style={{
          fontWeight: '700',
          color: isMe ? Colors.salmon : colors.textSecondary,
          minWidth: 32,
          textAlign: 'right',
        }}
      >
        {entry.stamps}
      </Text>
    </View>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function PassportScreen() {
  const colors = useColors();
  const entries = useJournalStore((s) => s.entries);
  const { data: restaurants } = useRestaurants();
  const { userName } = useAuthStore();

  // Memoised — rebuilt only when journal entries change
  const visitedIds = useMemo(() => new Set(entries.map((e) => e.restaurantId)), [entries]);
  const stampCount = visitedIds.size;
  const totalRestaurants = restaurants?.length ?? 0;

  // Memoised — complex derivation with nested .filter()/.some() calls
  const achievements = useMemo(
    () => [
      {
        id: 'first_bite',
        icon: '🍣',
        name: 'First Bite',
        description: 'Log your first AYCE visit',
        unlocked: entries.length >= 1,
      },
      {
        id: 'double_dip',
        icon: '🔄',
        name: 'Double Dip',
        description: 'Return to the same spot twice',
        unlocked: (restaurants ?? []).some(
          (r) => entries.filter((e) => e.restaurantId === r.id).length >= 2,
        ),
      },
      {
        id: 'five_star',
        icon: '⭐',
        name: 'Five Star Fish',
        description: 'Rate fish quality 5/5',
        unlocked: entries.some((e) => e.ratings.fishQuality === 5),
      },
      {
        id: 'roll_call',
        icon: '🏅',
        name: 'Roll Call',
        description: 'Visit 5 different AYCE spots',
        unlocked: visitedIds.size >= 5,
      },
      {
        id: 'regular',
        icon: '💚',
        name: 'Regular',
        description: 'Would return to 3 or more spots',
        unlocked:
          new Set(entries.filter((e) => e.wouldReturn).map((e) => e.restaurantId)).size >= 3,
      },
      {
        id: 'completionist',
        icon: '🏆',
        name: 'Completionist',
        description: 'Stamp 20+ different spots',
        unlocked: visitedIds.size >= 20,
      },
    ],
    [entries, restaurants, visitedIds],
  );

  // Memoised — sort + find on every render is wasteful
  const { allEntries, leaderMax, myRank } = useMemo(() => {
    const myHandle = userName ? userName.split(' ')[0].toLowerCase() : 'you';
    const myEntry: LeaderEntry = { id: 'me', name: myHandle, stamps: stampCount, isMe: true };
    const sorted: LeaderEntry[] = [...COMMUNITY_SEEDS, myEntry].sort(
      (a, b) => b.stamps - a.stamps,
    );
    return {
      allEntries: sorted,
      leaderMax: sorted[0]?.stamps ?? 1,
      myRank: sorted.findIndex((e) => e.isMe) + 1,
    };
  }, [userName, stampCount]);

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
            justifyContent: 'space-between',
            paddingHorizontal: Spacing.lg,
            paddingTop: Spacing.base,
            paddingBottom: Spacing.md,
          }}
        >
          <View>
            <Text variant="caption" color={colors.textSecondary}>
              Your collection
            </Text>
            <Text variant="heading2">Passport</Text>
          </View>
          <View style={{ alignItems: 'center', gap: 2 }}>
            <WasabiCharacter mood={stampCount > 0 ? 'celebrate' : 'idle'} size={48} />
            <View
              style={{
                backgroundColor: Colors.salmon,
                borderRadius: Radius.pill,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 2,
                minWidth: 28,
                alignItems: 'center',
              }}
            >
              <Text variant="caption" color="#FFF" style={{ fontWeight: '700' }}>
                {stampCount}/{totalRestaurants}
              </Text>
            </View>
          </View>
        </View>

        {/* Stamps grid */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text variant="heading3" style={{ marginBottom: Spacing.md }}>
            Stamps
          </Text>
          <Card style={{ padding: Spacing.sm }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {(restaurants ?? []).map((r, i) => (
                <StampItem
                  key={r.id}
                  restaurant={r}
                  visited={visitedIds.has(r.id)}
                  delay={i * 55}
                />
              ))}
            </View>
          </Card>
        </View>

        {/* Leaderboard */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: Spacing.md,
            }}
          >
            <Text variant="heading3">Leaderboard</Text>
            <View
              style={{
                backgroundColor: Colors.salmon + '18',
                borderRadius: Radius.pill,
                paddingHorizontal: Spacing.sm,
                paddingVertical: 3,
              }}
            >
              <Text variant="caption" style={{ color: Colors.salmon, fontWeight: '700' }}>
                Rank #{myRank}
              </Text>
            </View>
          </View>
          <Card style={{ paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xs }}>
            {allEntries.slice(0, 10).map((entry, i) => (
              <LeaderRow key={entry.id} rank={i + 1} entry={entry} total={leaderMax} />
            ))}
          </Card>
        </View>

        {/* Collections */}
        <View style={{ paddingHorizontal: Spacing.lg, marginBottom: Spacing.lg }}>
          <Text variant="heading3" style={{ marginBottom: Spacing.md }}>
            Collections
          </Text>
          <View style={{ gap: Spacing.md }}>
            {COLLECTIONS.map((c) => {
              const { current, total } = c.getProgress(visitedIds);
              const complete = c.isComplete(visitedIds);
              return (
                <Card key={c.id} style={{ gap: Spacing.sm }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.md }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: Radius.md,
                        backgroundColor: complete ? Colors.wasabiGreen + '18' : colors.surface2,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ fontSize: 22 }}>{c.icon}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                        <Text variant="body" style={{ fontWeight: '600' }}>
                          {c.name}
                        </Text>
                        {complete && (
                          <View
                            style={{
                              backgroundColor: Colors.wasabiGreen,
                              borderRadius: Radius.pill,
                              paddingHorizontal: Spacing.xs + 2,
                              paddingVertical: 2,
                            }}
                          >
                            <Text style={{ fontSize: 9, color: '#FFF', fontWeight: '700' }}>
                              DONE
                            </Text>
                          </View>
                        )}
                      </View>
                      <Text variant="caption" color={colors.textSecondary}>
                        {c.description}
                      </Text>
                    </View>
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
                        width: `${(current / total) * 100}%`,
                        backgroundColor: complete ? Colors.wasabiGreen : Colors.salmon,
                        borderRadius: Radius.pill,
                      }}
                    />
                  </View>
                  <Text variant="caption" color={colors.textTertiary}>
                    {current} / {total}
                  </Text>
                </Card>
              );
            })}
          </View>
        </View>

        {/* Achievements */}
        <View style={{ paddingHorizontal: Spacing.lg }}>
          <Text variant="heading3" style={{ marginBottom: Spacing.md }}>
            Achievements
          </Text>
          <Card style={{ padding: Spacing.sm }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {achievements.map((a) => (
                <AchievementBadge
                  key={a.id}
                  icon={a.icon}
                  name={a.name}
                  description={a.description}
                  unlocked={a.unlocked}
                />
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}
