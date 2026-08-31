import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { CircleDollarSign, Receipt } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/shared/ScreenHeader';
import EmptyState from '../../components/shared/EmptyState';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import colors from '../../constants/colors';
import styles from '../../styles/DinerListScreenStyle';

// Subscriptions aren't wired to the backend yet, so the plan is shown as
// inactive and the payment history is empty. Both read from the API once the
// `subscription` app exposes endpoints.
const DinerPlanBillingScreen = ({ navigation }) => {
  const payments = [];
  const plan = null;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title="Plan and Billing"
          subtitle="Your subscription"
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.planCard}>
            <View style={styles.planIcon}>
              <CircleDollarSign size={22} color={colors.button} />
            </View>

            <View style={styles.planBody}>
              <Text style={styles.planName}>
                {plan ? plan.name : 'No active plan'}
              </Text>
              <Text style={styles.planMeta}>
                {plan
                  ? `Renews on ${plan.renewsOn}`
                  : 'Subscribe to support fair rankings and honest reviews.'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.planButton}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={styles.planButtonText}>
              {plan ? 'Change plan' : 'View plans'}
            </Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Payment history</Text>

          {payments.length === 0 ? (
            <EmptyState
              compact
              icon={Receipt}
              title="No payments yet"
              message="Receipts for your subscription will be listed here."
            />
          ) : null}
        </ScrollView>

        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerPlanBillingScreen;
