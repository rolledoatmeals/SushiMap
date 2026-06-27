import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { useRepositories } from '@/services/repositories/RepositoryContext';
import type { CollectionProgress } from '@/types/passport';

export default function PassportScreen() {
  const insets = useSafeAreaInsets();
  const { session, isGuest } = useAuthStore();

  if (isGuest || !session) {
    return (
      <View className="flex-1 bg-off-white items-center justify-center px-8" style={{ paddingBottom: insets.bottom }}>
        <Text className="text-4xl mb-4">🎖️</Text>
        <Text className="text-xl font-bold text-charcoal mb-2">Sushi Passport</Text>
        <Text className="text-sm text-charcoal-light text-center mb-6">
          Sign in to earn stamps for every AYCE restaurant you visit and unlock regional collections.
        </Text>
        <AuthGateButton />
      </View>
    );
  }

  return <PassportContent paddingTop={insets.top} paddingBottom={insets.bottom} />;
}

function PassportContent({ paddingTop, paddingBottom }: { paddingTop: number; paddingBottom: number }) {
  const { passport } = useRepositories();
  const { data: stamps = [], isLoading: stampsLoading } = useQuery({
    queryKey: ['passport', 'stamps'],
    queryFn: () => passport.getStamps(),
    staleTime: 60 * 1000,
  });
  const { data: progress = [], isLoading: progressLoading } = useQuery({
    queryKey: ['passport', 'progress'],
    queryFn: () => passport.getProgress(),
    staleTime: 60 * 1000,
  });

  const isLoading = stampsLoading || progressLoading;

  return (
    <View className="flex-1 bg-off-white" style={{ paddingTop }}>
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-charcoal">Passport</Text>
        <Text className="text-sm text-charcoal-light mt-1">{stamps.length} stamp{stamps.length !== 1 ? 's' : ''} earned</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8735A" />
        </View>
      ) : (
        <FlatList
          data={progress}
          keyExtractor={(p) => p.collection.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: paddingBottom + 16, gap: 12 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-4xl mb-3">🎖️</Text>
              <Text className="text-lg font-semibold text-charcoal mb-1">No collections yet</Text>
              <Text className="text-sm text-charcoal-light text-center px-8">
                Visit restaurants to start earning stamps and unlock collections.
              </Text>
            </View>
          }
          renderItem={({ item }) => <CollectionCard progress={item} />}
        />
      )}
    </View>
  );
}

function CollectionCard({ progress: p }: { progress: CollectionProgress }) {
  const pct = Math.min(p.earnedCount / p.collection.requiredCount, 1);
  const rarityColor: Record<string, string> = {
    common: '#7AB648',
    uncommon: '#2196F3',
    rare: '#9C27B0',
    legendary: '#E8735A',
  };
  const color = rarityColor[p.collection.rarity] ?? '#8A7E78';

  return (
    <View className="bg-surface rounded-xl p-4 border border-border">
      <View className="flex-row items-start justify-between mb-3">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-charcoal">{p.collection.name}</Text>
          {p.collection.description && (
            <Text className="text-xs text-charcoal-light mt-0.5" numberOfLines={2}>
              {p.collection.description}
            </Text>
          )}
        </View>
        <View className="px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '20' }}>
          <Text className="text-xs font-semibold capitalize" style={{ color }}>
            {p.collection.rarity}
          </Text>
        </View>
      </View>

      <View className="h-1.5 bg-border rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct * 100}%`, backgroundColor: p.isComplete ? color : '#E8735A' }}
        />
      </View>
      <Text className="text-xs text-charcoal-light mt-1.5">
        {p.earnedCount} / {p.collection.requiredCount} stamps
        {p.isComplete ? ' · Complete!' : ''}
      </Text>
    </View>
  );
}

function AuthGateButton() {
  const router = useRouter();
  return (
    <Pressable
      onPress={() => router.push('/(auth)/sign-in')}
      className="bg-charcoal px-8 py-3.5 rounded-xl"
    >
      <Text className="text-white font-semibold text-base">Sign In</Text>
    </Pressable>
  );
}
