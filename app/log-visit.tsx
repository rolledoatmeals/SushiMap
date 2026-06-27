import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRestaurant } from '@/hooks/useRestaurants';
import { useRepositories } from '@/services/repositories/RepositoryContext';

export default function LogVisitModal() {
  const { restaurantId } = useLocalSearchParams<{ restaurantId: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { journal } = useRepositories();
  const { data: restaurant } = useRestaurant(restaurantId ?? null);

  const [pricePaid, setPricePaid] = useState('');
  const [notes, setNotes] = useState('');

  const { mutate: saveVisit, isPending } = useMutation({
    mutationFn: () =>
      journal.create({
        restaurantId: restaurantId!,
        visitedAt: new Date().toISOString(),
        pricePaid: pricePaid ? parseFloat(pricePaid) : undefined,
        notes: notes.trim() || undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['journal'] });
      router.back();
    },
    onError: () => {
      Alert.alert('Error', 'Could not save your visit. Please try again.');
    },
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#F8F4EF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Handle bar */}
      <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 4 }}>
        <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: '#EDE8E3' }} />
      </View>

      <View style={{ paddingHorizontal: 20, paddingTop: 12, flex: 1 }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <Text style={{ fontSize: 20, fontWeight: '800', color: '#2C2926' }}>Log Visit</Text>
          <Pressable onPress={() => router.back()} hitSlop={12}>
            <Text style={{ fontSize: 22, color: '#8A7E78' }}>✕</Text>
          </Pressable>
        </View>

        {restaurant && (
          <Text style={{ fontSize: 14, color: '#8A7E78', marginBottom: 28 }}>
            {restaurant.name} · {restaurant.neighborhood ?? restaurant.city}
          </Text>
        )}

        {/* Date — always today */}
        <Label>Date</Label>
        <View style={inputContainerStyle}>
          <Text style={{ fontSize: 15, color: '#2C2926' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </Text>
        </View>

        {/* Price paid */}
        <Label>Price paid (optional)</Label>
        <View style={inputContainerStyle}>
          <Text style={{ fontSize: 15, color: '#8A7E78', marginRight: 4 }}>$</Text>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: '#2C2926' }}
            placeholder="e.g. 35"
            placeholderTextColor="#C5BCB7"
            keyboardType="decimal-pad"
            value={pricePaid}
            onChangeText={setPricePaid}
          />
        </View>

        {/* Notes */}
        <Label>Notes (optional)</Label>
        <View style={[inputContainerStyle, { height: 110, alignItems: 'flex-start', paddingTop: 12 }]}>
          <TextInput
            style={{ flex: 1, fontSize: 15, color: '#2C2926', textAlignVertical: 'top' }}
            placeholder="How was it? Favorite dishes, wait time…"
            placeholderTextColor="#C5BCB7"
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>
      </View>

      {/* Save button */}
      <View style={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 16 }}>
        <Pressable
          onPress={() => saveVisit()}
          disabled={isPending}
          style={({ pressed }) => ({
            height: 54,
            borderRadius: 16,
            backgroundColor: pressed || isPending ? '#D4634A' : '#E8735A',
            alignItems: 'center',
            justifyContent: 'center',
          })}
        >
          {isPending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>Save Visit</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

function Label({ children }: { children: string }) {
  return (
    <Text style={{ fontSize: 12, fontWeight: '700', color: '#8A7E78', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
      {children}
    </Text>
  );
}

const inputContainerStyle = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  backgroundColor: '#FFFFFF',
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#EDE8E3',
  paddingHorizontal: 16,
  height: 50,
  marginBottom: 20,
};
