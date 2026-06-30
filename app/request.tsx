import { useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import { supabase } from '@lib/supabase';

type PriceRange = '$' | '$$' | '$$$';
type Market = 'NJ' | 'NYC';

export default function RequestScreen() {
  const colors = useColors();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [market, setMarket] = useState<Market>('NJ');
  const [priceRange, setPriceRange] = useState<PriceRange>('$$');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = name.trim().length > 0 && address.trim().length > 0;

  async function handleSubmit() {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const { error } = await supabase.from('restaurant_suggestions').insert({
      user_id: session?.user.id ?? null,
      name: name.trim(),
      address: address.trim(),
      market,
      price_range: priceRange,
      notes: notes.trim() || null,
    });
    setSubmitting(false);
    if (error) {
      Alert.alert('Submission failed', 'Could not send your suggestion. Please try again.');
      return;
    }
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View
          style={{
            paddingTop: 60,
            paddingHorizontal: Spacing.lg,
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: Spacing.xl,
          }}
        >
          <Pressable
            onPress={() => router.back()}
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: colors.surface2,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: Spacing.md,
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
          </Pressable>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: Spacing.xl,
            gap: Spacing.lg,
          }}
        >
          <Text style={{ fontSize: 64 }}>🍣</Text>
          <View style={{ alignItems: 'center', gap: Spacing.sm }}>
            <Text variant="heading2" style={{ textAlign: 'center' }}>
              Thanks for the tip!
            </Text>
            <Text
              variant="body"
              color={colors.textSecondary}
              style={{ textAlign: 'center', lineHeight: 22 }}
            >
              We'll research {name.trim()} and add it to SushiMap if it qualifies as a verified AYCE
              spot.
            </Text>
          </View>
          <Button
            label="Back to Home"
            variant="primary"
            size="lg"
            fullWidth
            onPress={() => router.back()}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header */}
      <View
        style={{
          paddingTop: 60,
          paddingHorizontal: Spacing.lg,
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: Spacing.lg,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.surface2,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: Spacing.md,
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <View>
          <Text variant="caption" color={colors.textSecondary}>
            Help us grow
          </Text>
          <Text variant="heading2">Suggest a Spot</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingBottom: 120,
          gap: Spacing.lg,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="body" color={colors.textSecondary} style={{ lineHeight: 22 }}>
          Know an AYCE spot we're missing? Drop it here and we'll verify it.
        </Text>

        {/* Restaurant Name */}
        <View style={{ gap: Spacing.sm }}>
          <Text variant="bodySmall" style={{ fontWeight: '600' }}>
            Restaurant Name{' '}
            <Text variant="bodySmall" color={Colors.salmon}>
              *
            </Text>
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: Radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: Spacing.base,
              height: 48,
              justifyContent: 'center',
            }}
          >
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Sapporo Japanese Restaurant"
              placeholderTextColor={colors.textTertiary}
              style={{ color: colors.textPrimary, fontSize: 15 }}
              returnKeyType="next"
              accessibilityLabel="Restaurant name"
            />
          </View>
        </View>

        {/* Address */}
        <View style={{ gap: Spacing.sm }}>
          <Text variant="bodySmall" style={{ fontWeight: '600' }}>
            Address or Neighborhood{' '}
            <Text variant="bodySmall" color={Colors.salmon}>
              *
            </Text>
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: Radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: Spacing.base,
              height: 48,
              justifyContent: 'center',
            }}
          >
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 123 Broad Ave, Palisades Park, NJ"
              placeholderTextColor={colors.textTertiary}
              style={{ color: colors.textPrimary, fontSize: 15 }}
              returnKeyType="next"
              accessibilityLabel="Address or neighborhood"
            />
          </View>
        </View>

        {/* Market */}
        <View style={{ gap: Spacing.sm }}>
          <Text variant="bodySmall" style={{ fontWeight: '600' }}>
            Location
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {(['NJ', 'NYC'] as Market[]).map((m) => (
              <Pressable
                key={m}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMarket(m);
                }}
                style={{
                  flex: 1,
                  paddingVertical: Spacing.sm,
                  borderRadius: Radius.lg,
                  borderWidth: 1.5,
                  borderColor: market === m ? Colors.salmon : colors.border,
                  backgroundColor: market === m ? Colors.salmon + '12' : colors.surface,
                  alignItems: 'center',
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: market === m }}
                accessibilityLabel={m}
              >
                <Text
                  variant="body"
                  color={market === m ? Colors.salmon : colors.textSecondary}
                  style={{ fontWeight: market === m ? '700' : '400' }}
                >
                  {m === 'NJ' ? '🌿 New Jersey' : '🗽 New York City'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Price Range */}
        <View style={{ gap: Spacing.sm }}>
          <Text variant="bodySmall" style={{ fontWeight: '600' }}>
            Approx. Price Range (dinner)
          </Text>
          <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
            {(['$', '$$', '$$$'] as PriceRange[]).map((p) => (
              <Pressable
                key={p}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setPriceRange(p);
                }}
                style={{
                  flex: 1,
                  paddingVertical: Spacing.sm,
                  borderRadius: Radius.lg,
                  borderWidth: 1.5,
                  borderColor: priceRange === p ? Colors.salmon : colors.border,
                  backgroundColor: priceRange === p ? Colors.salmon + '12' : colors.surface,
                  alignItems: 'center',
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: priceRange === p }}
                accessibilityLabel={
                  p === '$' ? 'Under $25' : p === '$$' ? '$25 to $40' : 'Over $40'
                }
              >
                <Text
                  variant="body"
                  color={priceRange === p ? Colors.salmon : colors.textSecondary}
                  style={{ fontWeight: priceRange === p ? '700' : '400' }}
                >
                  {p}
                </Text>
                <Text
                  variant="caption"
                  color={priceRange === p ? Colors.salmon : colors.textTertiary}
                >
                  {p === '$' ? 'Under $25' : p === '$$' ? '$25–$40' : 'Over $40'}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Notes */}
        <View style={{ gap: Spacing.sm }}>
          <Text variant="bodySmall" style={{ fontWeight: '600' }}>
            Additional Notes{' '}
            <Text variant="caption" color={colors.textTertiary}>
              (optional)
            </Text>
          </Text>
          <View
            style={{
              backgroundColor: colors.surface,
              borderRadius: Radius.lg,
              borderWidth: 1,
              borderColor: colors.border,
              paddingHorizontal: Spacing.base,
              paddingVertical: Spacing.sm,
            }}
          >
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Any info that might help us verify: website, phone, time limit, menu highlights…"
              placeholderTextColor={colors.textTertiary}
              style={{
                color: colors.textPrimary,
                fontSize: 15,
                minHeight: 96,
                textAlignVertical: 'top',
              }}
              multiline
              accessibilityLabel="Additional notes"
            />
          </View>
        </View>

        {/* Info card */}
        <Card
          style={{
            backgroundColor: Colors.salmon + '10',
            borderWidth: 1,
            borderColor: Colors.salmon + '30',
          }}
        >
          <View style={{ flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' }}>
            <Ionicons
              name="information-circle"
              size={20}
              color={Colors.salmon}
              style={{ marginTop: 1 }}
            />
            <Text
              variant="bodySmall"
              color={colors.textSecondary}
              style={{ flex: 1, lineHeight: 20 }}
            >
              We verify every spot before adding it. Only confirmed all-you-can-eat sushi
              restaurants are listed.
            </Text>
          </View>
        </Card>

        <Button
          label="Submit Suggestion"
          variant="primary"
          size="lg"
          fullWidth
          onPress={handleSubmit}
          disabled={!canSubmit}
          loading={submitting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
