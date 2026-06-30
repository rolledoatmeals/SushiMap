import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { View, TextInput, FlatList, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Text } from '@components/ui/Text';
import { Button } from '@components/ui/Button';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { EmptyState } from '@components/ui/EmptyState';
import { RestaurantCard } from '@components/restaurant/RestaurantCard';
import { WasabiCharacter } from '@components/wasabi/WasabiCharacter';
import { useSearchStore } from '@stores/searchStore';
import { useRestaurants } from '@hooks/useRestaurants';
import { useDebounce } from '@hooks/useDebounce';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';
import type { Restaurant, RestaurantFilters } from '../types';

type TimeLimitFilter = 'any' | 'quick' | 'relaxed';
type MaxPriceOption = 30 | 40 | 50 | 60 | null;

type DraftFilters = {
  maxDinnerPrice: MaxPriceOption;
  isOpenNow: boolean;
  hasSashimi: boolean;
  hasNigiri: boolean;
  timeLimitFilter: TimeLimitFilter;
  parking: boolean;
  accessibility: boolean;
};

const DEFAULT_DRAFT: DraftFilters = {
  maxDinnerPrice: null,
  isOpenNow: false,
  hasSashimi: false,
  hasNigiri: false,
  timeLimitFilter: 'any',
  parking: false,
  accessibility: false,
};

// Stable option arrays — defined outside the component so they are never re-created
const PRICE_OPTIONS: { label: string; value: MaxPriceOption }[] = [
  { label: 'Any', value: null },
  { label: '≤$30', value: 30 },
  { label: '≤$40', value: 40 },
  { label: '≤$50', value: 50 },
  { label: '≤$60', value: 60 },
];

const TIME_OPTIONS: { label: string; value: TimeLimitFilter }[] = [
  { label: 'Any', value: 'any' },
  { label: 'Quick (≤90 min)', value: 'quick' },
  { label: 'Relaxed (120+ min)', value: 'relaxed' },
];

const SNAP_POINTS: (string | number)[] = ['75%', '90%'];

function draftToFilters(draft: DraftFilters): RestaurantFilters {
  const f: RestaurantFilters = {};
  if (draft.maxDinnerPrice != null) f.maxDinnerPrice = draft.maxDinnerPrice;
  if (draft.isOpenNow) f.isOpenNow = true;
  if (draft.hasSashimi) f.hasSashimi = true;
  if (draft.hasNigiri) f.hasNigiri = true;
  if (draft.timeLimitFilter === 'quick') f.timeLimitMax = 90;
  if (draft.parking) f.parking = true;
  if (draft.accessibility) f.accessibility = true;
  return f;
}

function countActiveFilters(draft: DraftFilters): number {
  return [
    draft.maxDinnerPrice != null,
    draft.isOpenNow,
    draft.hasSashimi,
    draft.hasNigiri,
    draft.timeLimitFilter !== 'any',
    draft.parking,
    draft.accessibility,
  ].filter(Boolean).length;
}

// ─── Filter toggle row ────────────────────────────────────────────────────────

function FilterToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const colors = useColors();
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(!value);
  }, [onChange, value]);

  return (
    <Pressable
      onPress={handlePress}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Spacing.sm,
      }}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
    >
      <Text variant="body">{label}</Text>
      <View
        style={{
          width: 44,
          height: 26,
          borderRadius: 13,
          backgroundColor: value ? Colors.wasabiGreen : colors.border,
          justifyContent: 'center',
          paddingHorizontal: 2,
        }}
      >
        <View
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: '#FFF',
            transform: [{ translateX: value ? 18 : 0 }],
            shadowColor: '#000',
            shadowOpacity: 0.15,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
            elevation: 2,
          }}
        />
      </View>
    </Pressable>
  );
}

// ─── Chip row ─────────────────────────────────────────────────────────────────

function ChipRow<T extends string | number | null>({
  options,
  value,
  onChange,
  label,
}: {
  options: { label: string; value: T }[];
  value: T;
  onChange: (v: T) => void;
  label: (v: T) => string;
}) {
  const colors = useColors();
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: Spacing.sm }}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={String(opt.value)}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onChange(opt.value);
            }}
            style={{
              paddingHorizontal: Spacing.base,
              paddingVertical: Spacing.xs + 2,
              borderRadius: Radius.pill,
              backgroundColor: active ? Colors.salmon : colors.surface,
              borderWidth: 1,
              borderColor: active ? Colors.salmon : colors.border,
            }}
            accessibilityRole="radio"
            accessibilityState={{ checked: active }}
            accessibilityLabel={label(opt.value)}
          >
            <Text
              variant="bodySmall"
              color={active ? '#FFF' : colors.textPrimary}
              style={{ fontWeight: active ? '600' : '400' }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

// ─── Label helpers (stable references, defined outside render) ────────────────

function priceLabel(v: MaxPriceOption): string {
  return v == null ? 'Any price' : `Up to $${v}`;
}

function timeLimitLabel(v: TimeLimitFilter): string {
  if (v === 'any') return 'Any time limit';
  if (v === 'quick') return '90 minutes or less';
  return '120 minutes or more';
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export default function SearchScreen() {
  const colors = useColors();
  const sheetRef = useRef<BottomSheet>(null);
  const textInputRef = useRef<TextInput>(null);

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  const [appliedDraft, setAppliedDraft] = useState<DraftFilters>(DEFAULT_DRAFT);
  const [draftFilters, setDraftFilters] = useState<DraftFilters>(DEFAULT_DRAFT);

  const { addSearch, removeSearch, clearAll, recentSearches } = useSearchStore();

  // Memoised so draftToFilters() isn't called on every render
  const activeFilters = useMemo(() => draftToFilters(appliedDraft), [appliedDraft]);
  const filterCount = useMemo(() => countActiveFilters(appliedDraft), [appliedDraft]);

  const { data: filteredRestaurants } = useRestaurants(
    Object.keys(activeFilters).length > 0 ? activeFilters : undefined,
  );

  // Memoised — two .filter() passes on every keystroke is wasteful
  const displayResults = useMemo<Restaurant[] | null>(() => {
    if (debouncedQuery.trim().length === 0) return null;
    const q = debouncedQuery.toLowerCase();
    return (filteredRestaurants ?? [])
      .filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.neighborhood.toLowerCase().includes(q) ||
          r.city.toLowerCase().includes(q),
      )
      .filter((r) => {
        if (appliedDraft.timeLimitFilter === 'relaxed') return r.timeLimit >= 120;
        return true;
      });
  }, [debouncedQuery, filteredRestaurants, appliedDraft.timeLimitFilter]);

  useEffect(() => {
    const timer = setTimeout(() => textInputRef.current?.focus(), 100);
    // Clean up the timer if the component unmounts before it fires
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = useCallback(() => {
    if (query.trim()) addSearch(query.trim());
  }, [query, addSearch]);

  const handleRecentTap = useCallback(
    (term: string) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setQuery(term);
      addSearch(term);
    },
    [addSearch],
  );

  const openFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraftFilters(appliedDraft);
    sheetRef.current?.expand();
  }, [appliedDraft]);

  const applyFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setAppliedDraft(draftFilters);
    sheetRef.current?.close();
  }, [draftFilters]);

  const resetFilters = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDraftFilters(DEFAULT_DRAFT);
  }, []);

  const updateDraft = useCallback(<K extends keyof DraftFilters>(key: K, value: DraftFilters[K]) => {
    setDraftFilters((d) => ({ ...d, [key]: value }));
  }, []);

  // Stable onChange callbacks for draft fields so FilterToggle/ChipRow don't re-render
  const onChangeOpenNow = useCallback((v: boolean) => updateDraft('isOpenNow', v), [updateDraft]);
  const onChangeSashimi = useCallback((v: boolean) => updateDraft('hasSashimi', v), [updateDraft]);
  const onChangeNigiri = useCallback((v: boolean) => updateDraft('hasNigiri', v), [updateDraft]);
  const onChangeParking = useCallback((v: boolean) => updateDraft('parking', v), [updateDraft]);
  const onChangeAccessibility = useCallback(
    (v: boolean) => updateDraft('accessibility', v),
    [updateDraft],
  );
  const onChangePrice = useCallback(
    (v: MaxPriceOption) => updateDraft('maxDinnerPrice', v),
    [updateDraft],
  );
  const onChangeTimeLimit = useCallback(
    (v: TimeLimitFilter) => updateDraft('timeLimitFilter', v),
    [updateDraft],
  );

  const handleClearAll = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    clearAll();
  }, [clearAll]);

  const renderItem = useCallback(
    ({ item }: { item: Restaurant }) => (
      <RestaurantCard
        restaurant={item}
        onPress={() => router.push(`/restaurant/${item.id}`)}
      />
    ),
    [],
  );

  const keyExtractor = useCallback((r: Restaurant) => r.id, []);

  const handleSheetClose = useCallback(() => {}, []);

  const showResults = displayResults !== null;
  const hasResults = (displayResults?.length ?? 0) > 0;

  return (
    <ScreenWrapper>
      {/* Search header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.base,
          paddingBottom: Spacing.sm,
          gap: Spacing.sm,
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{ width: 44, height: 44, alignItems: 'center', justifyContent: 'center' }}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </Pressable>

        <TextInput
          ref={textInputRef}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSubmit}
          placeholder="Search AYCE sushi spots…"
          placeholderTextColor={colors.textTertiary}
          returnKeyType="search"
          style={{
            flex: 1,
            backgroundColor: colors.surface,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: Radius.lg,
            paddingHorizontal: Spacing.base,
            height: 44,
            color: colors.textPrimary,
            fontSize: 16,
          }}
          accessibilityLabel="Search restaurants"
          clearButtonMode="while-editing"
        />

        {/* Filter button */}
        <Pressable
          onPress={openFilters}
          style={{
            width: 44,
            height: 44,
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}
          accessibilityRole="button"
          accessibilityLabel={`Filters${filterCount > 0 ? `, ${filterCount} active` : ''}`}
        >
          <Ionicons
            name="options-outline"
            size={22}
            color={filterCount > 0 ? Colors.salmon : colors.textPrimary}
          />
          {filterCount > 0 && (
            <View
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                width: 16,
                height: 16,
                borderRadius: 8,
                backgroundColor: Colors.salmon,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 9, color: '#FFF', fontWeight: '700' }}>{filterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>

      {/* Content */}
      {!showResults ? (
        /* Idle state — recent searches or Wasabi */
        recentSearches.length > 0 ? (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingHorizontal: Spacing.lg, paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: Spacing.sm,
              }}
            >
              <Text variant="bodySmall" color={colors.textSecondary} style={{ fontWeight: '600' }}>
                RECENT
              </Text>
              <Pressable
                onPress={handleClearAll}
                accessibilityRole="button"
                accessibilityLabel="Clear all recent searches"
              >
                <Text variant="caption" color={Colors.salmon}>
                  Clear all
                </Text>
              </Pressable>
            </View>
            {recentSearches.map((term) => (
              <Pressable
                key={term}
                onPress={() => handleRecentTap(term)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: Spacing.sm + 2,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
                accessibilityRole="button"
                accessibilityLabel={`Search for ${term}`}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                  <Ionicons name="time-outline" size={16} color={colors.textTertiary} />
                  <Text variant="body">{term}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    removeSearch(term);
                  }}
                  style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${term} from recent searches`}
                >
                  <Ionicons name="close" size={16} color={colors.textTertiary} />
                </Pressable>
              </Pressable>
            ))}
          </ScrollView>
        ) : (
          <EmptyState
            title="What are you craving?"
            subtitle="Search by restaurant name, neighbourhood, or city."
          >
            <WasabiCharacter mood="think" size={80} />
          </EmptyState>
        )
      ) : hasResults ? (
        /* Results */
        <FlatList
          data={displayResults}
          keyExtractor={keyExtractor}
          contentContainerStyle={{
            paddingHorizontal: Spacing.lg,
            gap: Spacing.md,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={renderItem}
        />
      ) : (
        /* No results */
        <EmptyState
          title="No spots found"
          subtitle={`No AYCE restaurants matched "${debouncedQuery}".`}
        >
          <WasabiCharacter mood="sad" size={80} />
        </EmptyState>
      )}

      {/* Filter bottom sheet */}
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={SNAP_POINTS}
        enablePanDownToClose
        onClose={handleSheetClose}
        backgroundStyle={{ backgroundColor: colors.surface }}
        handleIndicatorStyle={{ backgroundColor: colors.border }}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 60, gap: Spacing.lg }}
        >
          {/* Sheet header */}
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text variant="heading3">Filters</Text>
            <Pressable
              onPress={resetFilters}
              accessibilityRole="button"
              accessibilityLabel="Reset all filters"
            >
              <Text variant="bodySmall" color={Colors.salmon} style={{ fontWeight: '600' }}>
                Reset All
              </Text>
            </Pressable>
          </View>

          {/* Max dinner price */}
          <View style={{ gap: Spacing.sm }}>
            <Text variant="bodySmall" color={colors.textSecondary} style={{ fontWeight: '600' }}>
              MAX DINNER PRICE
            </Text>
            <ChipRow
              value={draftFilters.maxDinnerPrice}
              onChange={onChangePrice}
              options={PRICE_OPTIONS}
              label={priceLabel}
            />
          </View>

          {/* Open now */}
          <View
            style={{ borderTopWidth: 1, borderTopColor: colors.border, paddingTop: Spacing.md }}
          >
            <FilterToggle
              label="Open Now"
              value={draftFilters.isOpenNow}
              onChange={onChangeOpenNow}
            />
          </View>

          {/* Menu features */}
          <View
            style={{
              gap: Spacing.xs,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: Spacing.md,
            }}
          >
            <Text
              variant="bodySmall"
              color={colors.textSecondary}
              style={{ fontWeight: '600', marginBottom: Spacing.xs }}
            >
              MENU FEATURES
            </Text>
            <FilterToggle
              label="Includes Sashimi"
              value={draftFilters.hasSashimi}
              onChange={onChangeSashimi}
            />
            <FilterToggle
              label="Includes Nigiri"
              value={draftFilters.hasNigiri}
              onChange={onChangeNigiri}
            />
          </View>

          {/* Time limit */}
          <View
            style={{
              gap: Spacing.sm,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: Spacing.md,
            }}
          >
            <Text variant="bodySmall" color={colors.textSecondary} style={{ fontWeight: '600' }}>
              TIME LIMIT
            </Text>
            <ChipRow
              value={draftFilters.timeLimitFilter}
              onChange={onChangeTimeLimit}
              options={TIME_OPTIONS}
              label={timeLimitLabel}
            />
          </View>

          {/* Amenities */}
          <View
            style={{
              gap: Spacing.xs,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingTop: Spacing.md,
            }}
          >
            <Text
              variant="bodySmall"
              color={colors.textSecondary}
              style={{ fontWeight: '600', marginBottom: Spacing.xs }}
            >
              AMENITIES
            </Text>
            <FilterToggle
              label="Parking Available"
              value={draftFilters.parking}
              onChange={onChangeParking}
            />
            <FilterToggle
              label="Wheelchair Accessible"
              value={draftFilters.accessibility}
              onChange={onChangeAccessibility}
            />
          </View>

          {/* Apply */}
          <Button
            label="Apply Filters"
            variant="primary"
            size="lg"
            fullWidth
            onPress={applyFilters}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </ScreenWrapper>
  );
}
