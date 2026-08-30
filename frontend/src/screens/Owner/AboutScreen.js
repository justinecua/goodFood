import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UtensilsCrossed } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/InfoScreenStyle';
import colors from '../../constants/colors';

const SECTIONS = [
  {
    title: 'What goodFood is',
    body: 'goodFood helps diners discover restaurants and dishes, and rate them by food, service and ambiance. Restaurant owners manage their profile, menu, branches and hours, and see how their dishes are ranked.',
  },
  {
    title: 'For restaurant owners',
    body: 'Add your restaurant information, build your menu with categories, list your branches, and set your operating hours. Diner ratings feed into the rankings shown across the app.',
  },
  {
    title: 'Credits',
    body: 'Built with React Native and Django. Icons by Lucide.',
  },
];

const AboutScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <ScreenHeader title="About" onBack={() => navigation.goBack()} />

    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.logoWrap}>
        <View style={styles.logoBadge}>
          <UtensilsCrossed size={28} color={colors.button} />
        </View>
        <Text style={styles.appName}>goodFood</Text>
        <Text style={styles.version}>Version 1.0.0</Text>
      </View>

      {SECTIONS.map(section => (
        <View key={section.title}>
          <Text style={styles.blockTitle}>{section.title}</Text>
          <Text style={styles.blockBody}>{section.body}</Text>
        </View>
      ))}

      <Text style={styles.meta}>© 2026 goodFood</Text>
    </ScrollView>
  </SafeAreaView>
);

export default AboutScreen;
