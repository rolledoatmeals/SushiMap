import { ScrollView, View, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '@components/ui/Text';
import { ScreenWrapper } from '@components/ui/ScreenWrapper';
import { useColors } from '@hooks/useColors';
import { Colors } from '@constants/colors';
import { Spacing } from '@constants/spacing';
import { Radius } from '@constants/radius';

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

export default function TermsScreen() {
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
        <Text variant="heading3">Terms of Service</Text>
      </View>

      {/* Draft banner */}
      <View
        style={{
          backgroundColor: Colors.salmon + '18',
          borderRadius: Radius.md,
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.sm,
          marginHorizontal: Spacing.lg,
          marginTop: Spacing.md,
          flexDirection: 'row',
          alignItems: 'center',
          gap: Spacing.sm,
        }}
      >
        <Ionicons name="alert-circle-outline" size={16} color={Colors.salmon} />
        <Text variant="caption" style={{ color: Colors.salmon, flex: 1 }}>
          DRAFT — have a lawyer review before App Store submission
        </Text>
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

        <Section title="1. Acceptance">
          By downloading or using SushiMap ("the App"), you agree to these Terms of Service. If you
          do not agree, do not use the App.
        </Section>

        <Section title="2. What SushiMap Is">
          SushiMap is a personal discovery tool for finding all-you-can-eat (AYCE) sushi restaurants
          in the New York City metro area and Northern New Jersey. Restaurant information — including
          prices, hours, and availability — is provided for convenience and may not always be
          current. Always confirm details directly with the restaurant before visiting.
        </Section>

        <Section title="3. Your Account">
          You may use the App as a guest or sign in with Apple Sign In. You are responsible for
          maintaining the security of your Apple ID. SushiMap does not store your Apple ID
          credentials — authentication is handled entirely by Apple.
        </Section>

        <Section title="4. User-Generated Content">
          Journal entries, ratings, and notes you create are yours. By storing them in SushiMap, you
          grant us the right to sync and back up that content to provide the service. We do not
          share your journal content with other users or third parties.
        </Section>

        <Section title="5. Acceptable Use">
          You agree not to: (a) use the App for any unlawful purpose; (b) attempt to reverse
          engineer, scrape, or extract data from the App; (c) interfere with the operation of the
          App or its backend services; or (d) submit false or misleading restaurant suggestions.
        </Section>

        <Section title="6. Disclaimer of Warranties">
          The App is provided "as is" without warranties of any kind. We make no guarantee that
          restaurant information is accurate, complete, or up to date. Use the App at your own
          discretion.
        </Section>

        <Section title="7. Limitation of Liability">
          To the fullest extent permitted by law, SushiMap and its developers are not liable for any
          indirect, incidental, or consequential damages arising from your use of the App, including
          but not limited to a restaurant being closed, prices differing from what is listed, or
          data loss.
        </Section>

        <Section title="8. Changes to These Terms">
          We may update these Terms from time to time. Continued use of the App after changes
          constitutes acceptance of the revised Terms.
        </Section>

        <Section title="9. Governing Law">
          These Terms are governed by the laws of the State of New Jersey, without regard to
          conflict of law principles.
        </Section>

        <Section title="10. Contact">
          Questions about these Terms? Email us at zacharyshepelsky20@gmail.com.
        </Section>
      </ScrollView>
    </ScreenWrapper>
  );
}
