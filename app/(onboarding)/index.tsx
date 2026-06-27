import { useState } from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import {
  savePreferences,
  markOnboardingComplete,
  type FavoriteAyce,
  type Budget,
  type DiningWith,
} from '@/utils/preferences';

const STEPS = [
  {
    question: "What's your favorite part of AYCE?",
    key: 'favoriteAyce' as const,
    options: [
      { value: 'sashimi', label: 'Unlimited Sashimi', emoji: '🍣' },
      { value: 'rolls', label: 'Specialty Rolls', emoji: '🍱' },
      { value: 'nigiri', label: 'Nigiri', emoji: '🐟' },
      { value: 'value', label: 'Best Value', emoji: '💰' },
      { value: 'open', label: "I'm open to anything", emoji: '✨' },
    ],
  },
  {
    question: "What's your usual budget?",
    key: 'budget' as const,
    options: [
      { value: 'under_30', label: 'Under $30', emoji: null },
      { value: '30_40', label: '$30–40', emoji: null },
      { value: '40_50', label: '$40–50', emoji: null },
      { value: '50_plus', label: '$50+', emoji: null },
    ],
  },
  {
    question: 'Who do you usually eat with?',
    key: 'diningWith' as const,
    options: [
      { value: 'solo', label: 'Just me', emoji: null },
      { value: 'partner', label: 'My partner', emoji: null },
      { value: 'friends', label: 'Friends', emoji: null },
      { value: 'family', label: 'Family', emoji: null },
      { value: 'anyone', label: 'Anyone', emoji: null },
    ],
  },
] as const;

type Selections = {
  favoriteAyce: FavoriteAyce | null;
  budget: Budget | null;
  diningWith: DiningWith | null;
};

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Selections>({
    favoriteAyce: null,
    budget: null,
    diningWith: null,
  });

  const current = STEPS[step]!;
  const selected = selections[current.key];
  const isLast = step === STEPS.length - 1;

  function handleSelect(value: string) {
    setSelections((prev) => ({ ...prev, [current.key]: value }));
  }

  function handleContinue() {
    if (isLast) {
      savePreferences({
        favoriteAyce: selections.favoriteAyce ?? undefined,
        budget: selections.budget ?? undefined,
        diningWith: selections.diningWith ?? undefined,
      });
      markOnboardingComplete();
      router.replace('/(tabs)');
    } else {
      setStep((s) => s + 1);
    }
  }

  function handleSkip() {
    markOnboardingComplete();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView className="flex-1 bg-off-white">
      <View className="flex-1 px-6 pt-6 pb-8 justify-between">

        {/* Header */}
        <View className="gap-6">
          <View className="flex-row justify-between items-center">
            <View className="flex-row gap-2">
              {STEPS.map((_, i) => (
                <View
                  key={i}
                  style={{
                    width: i === step ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: i <= step ? '#E8735A' : '#EDE8E3',
                  }}
                />
              ))}
            </View>
            <Pressable onPress={handleSkip} hitSlop={12}>
              <Text className="text-sm text-charcoal-light">Skip</Text>
            </Pressable>
          </View>

          <View className="gap-2">
            <Text className="text-xs font-semibold text-salmon uppercase tracking-widest">
              Question {step + 1}
            </Text>
            <Text className="text-2xl font-bold text-charcoal leading-snug">
              {current.question}
            </Text>
          </View>

          {/* Options */}
          <View className="gap-3">
            {current.options.map((opt) => {
              const isSelected = selected === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => handleSelect(opt.value)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 16,
                    paddingHorizontal: 18,
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: isSelected ? '#E8735A' : '#EDE8E3',
                    backgroundColor: isSelected ? '#E8735A' : '#FFFFFF',
                    gap: 12,
                  }}
                >
                  {opt.emoji && (
                    <Text style={{ fontSize: 22 }}>{opt.emoji}</Text>
                  )}
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      fontWeight: '600',
                      color: isSelected ? '#FFFFFF' : '#2C2926',
                    }}
                  >
                    {opt.label}
                  </Text>
                  {isSelected && (
                    <View
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: 11,
                        backgroundColor: 'rgba(255,255,255,0.3)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Continue button */}
        <Pressable
          onPress={handleContinue}
          disabled={!selected}
          style={{
            height: 54,
            borderRadius: 16,
            backgroundColor: selected ? '#E8735A' : '#EDE8E3',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: '700',
              color: selected ? '#FFFFFF' : '#8A7E78',
            }}
          >
            {isLast ? "Let's Go 🍣" : 'Continue'}
          </Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}
