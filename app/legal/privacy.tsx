import { ScrollView, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useColors } from '@hooks/useColors';
import { Spacing } from '@constants/spacing';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: Spacing.xl }}>
      <Text variant="heading3" style={{ marginBottom: Spacing.sm }}>
        {title}
      </Text>
      <Text variant="body" color={colors.textSecondary} style={{ lineHeight: 24 }}>
        {children}
      </Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const colors = useColors();

  return (
    <ScreenWrapper>
      {/* Header */}
      <View
        style={{
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.sm,
          paddingBottom: Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
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
          }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text variant="heading3">Privacy Policy</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: Spacing.lg,
          paddingTop: Spacing.lg,
          paddingBottom: 60,
        }}
      >
        <Text variant="caption" color={colors.textTertiary} style={{ marginBottom: Spacing.xl }}>
          Last updated: June 2026
        </Text>

        <Section title="Overview">
          SushiMap is built with your privacy as a default. We collect the minimum data necessary to
          deliver the service. We do not sell your data, serve you ads, or share your personal
          information with third parties for marketing purposes.
        </Section>

        <Section title="Information We Collect">
          {
            'When you sign in with Apple:\n• Name (if you share it with us during first sign-in)\n• Email address (if you share it — Apple allows you to hide this)\n• An anonymous Apple user ID used to link your account\n\nWhen you use the App:\n• Journal entries you create: visit date, restaurant, ratings, notes, and photos you upload\n• Restaurants you save to your list\n• Your recent search history (stored only on your device)\n• Restaurant suggestions you submit voluntarily'
          }
        </Section>

        <Section title="Location Data">
          SushiMap requests access to your device location to sort restaurants by distance and show
          nearby spots on the map. Your precise location is processed on-device and is never
          transmitted to our servers, stored in our database, or shared with any third party.
        </Section>

        <Section title="How We Store Your Data">
          {
            'On-device: Journal entries, saved restaurants, search history, and your preferences are stored locally using iOS Secure Enclave-backed storage (Expo SecureStore).\n\nIn the cloud (signed-in users only): Journal entries and saved restaurants are synced to Supabase, a secure cloud database, so your data is available if you reinstall the App or get a new device. Your data is stored in the United States.'
          }
        </Section>

        <Section title="Photos">
          Photos you attach to journal entries are stored on your device. If cloud sync is enabled,
          photos may be uploaded to our storage in the future — we will update this policy before
          doing so.
        </Section>

        <Section title="Data Sharing">
          We do not sell, rent, or share your personal data with advertisers or data brokers.
          {'\n\n'}
          We use Supabase (supabase.com) as our backend infrastructure provider. Your data is
          processed by Supabase under their own privacy terms. Apple Sign In authentication is
          handled by Apple under their privacy policy.
        </Section>

        <Section title="Data Retention and Deletion">
          You can export your data at any time from Profile → Export My Data. To delete your
          account and all associated data, contact us at zacharyshepelsky20@gmail.com. We will
          remove your data from our servers within 30 days of a verified deletion request.
        </Section>

        <Section title="Children">
          SushiMap is not directed at children under 13. We do not knowingly collect personal
          information from anyone under 13. If you believe a child has provided us with personal
          information, contact us so we can delete it.
        </Section>

        <Section title="Changes to This Policy">
          We may update this Privacy Policy as the App evolves. We will note the "last updated"
          date at the top. For material changes, we will make a reasonable effort to notify you
          within the App.
        </Section>

        <Section title="Contact">
          Questions or data requests: zacharyshepelsky20@gmail.com
        </Section>
      </ScrollView>
    </ScreenWrapper>
  );
}
