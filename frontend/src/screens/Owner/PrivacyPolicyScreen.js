import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/InfoScreenStyle';

const SECTIONS = [
  {
    title: 'What we collect',
    body: 'Your account details (name, email, mobile number), the restaurant and menu information you add, and photos you upload. We also keep basic usage logs to keep the service running.',
  },
  {
    title: 'How we use it',
    body: 'To show your restaurant and dishes to diners, to sign you in, and to let diners contact you. Ratings and reviews from diners are shown publicly alongside your restaurant.',
  },
  {
    title: 'What we share',
    body: 'Your restaurant name, address, menu, hours and photos are visible to other goodFood users. We do not sell your personal information. We only share data with third parties when needed to operate the app (for example, hosting) or when required by law.',
  },
  {
    title: 'Your choices',
    body: 'You can edit or remove your restaurant information and photos at any time from the app. To delete your account, contact us and we will remove your data within 30 days, except records we must keep for legal reasons.',
  },
  {
    title: 'Contact',
    body: 'Questions about privacy? Email privacy@goodfood.app.',
  },
];

const PrivacyPolicyScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <ScreenHeader title="Privacy Policy" onBack={() => navigation.goBack()} />

    <ScrollView contentContainerStyle={styles.scroll}>
      <Text style={styles.intro}>
        This policy explains what goodFood collects, why, and what you can do
        about it. It applies to restaurant owners and diners using the app.
      </Text>

      {SECTIONS.map(section => (
        <View key={section.title}>
          <Text style={styles.blockTitle}>{section.title}</Text>
          <Text style={styles.blockBody}>{section.body}</Text>
        </View>
      ))}

      <Text style={styles.meta}>Last updated: August 2026</Text>
    </ScrollView>
  </SafeAreaView>
);

export default PrivacyPolicyScreen;
