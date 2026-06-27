import { View, Text, Pressable, FlatList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/store/auth';
import { useRepositories } from '@/services/repositories/RepositoryContext';
import type { JournalEntry } from '@/types/journal';
import { formatVisitDate } from '@/utils/date';

export default function JournalScreen() {
  const insets = useSafeAreaInsets();
  const { session, isGuest } = useAuthStore();

  if (isGuest || !session) return <AuthGate />;

  return <JournalList paddingBottom={insets.bottom} paddingTop={insets.top} />;
}

function JournalList({ paddingBottom, paddingTop }: { paddingBottom: number; paddingTop: number }) {
  const { journal } = useRepositories();
  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['journal'],
    queryFn: () => journal.getAll(),
    staleTime: 60 * 1000,
  });

  return (
    <View className="flex-1 bg-off-white" style={{ paddingTop }}>
      <View className="px-4 pt-4 pb-3">
        <Text className="text-2xl font-bold text-charcoal">Journal</Text>
        <Text className="text-sm text-charcoal-light mt-1">{entries.length} visit{entries.length !== 1 ? 's' : ''} logged</Text>
      </View>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator color="#E8735A" />
        </View>
      ) : (
        <FlatList
          data={entries}
          keyExtractor={(e) => e.id}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: paddingBottom + 16 }}
          ListEmptyComponent={
            <View className="items-center py-20">
              <Text className="text-4xl mb-3">📓</Text>
              <Text className="text-lg font-semibold text-charcoal mb-1">No visits yet</Text>
              <Text className="text-sm text-charcoal-light text-center px-8">
                Find a restaurant on the map and log your first visit.
              </Text>
            </View>
          }
          ItemSeparatorComponent={() => <View className="h-px bg-border" />}
          renderItem={({ item }) => <JournalRow entry={item} />}
        />
      )}
    </View>
  );
}

function JournalRow({ entry: e }: { entry: JournalEntry }) {
  return (
    <Pressable className="py-3.5 active:opacity-70">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-3">
          <Text className="text-base font-semibold text-charcoal" numberOfLines={1}>
            {e.restaurantId}
          </Text>
          {e.notes && (
            <Text className="text-sm text-charcoal-light mt-0.5" numberOfLines={2}>
              {e.notes}
            </Text>
          )}
        </View>
        <View className="items-end gap-1">
          <Text className="text-xs text-charcoal-light">{formatVisitDate(e.visitedAt)}</Text>
          {e.pricePaid && (
            <Text className="text-sm font-semibold text-charcoal">${e.pricePaid.toFixed(0)}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

function AuthGate() {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1 bg-off-white items-center justify-center px-8" style={{ paddingBottom: insets.bottom }}>
      <Text className="text-4xl mb-4">📓</Text>
      <Text className="text-xl font-bold text-charcoal mb-2">Your visit journal</Text>
      <Text className="text-sm text-charcoal-light text-center mb-6">
        Sign in to log your sushi visits, track prices you paid, and keep notes.
      </Text>
      <SignInPrompt />
    </View>
  );
}

function SignInPrompt() {
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
