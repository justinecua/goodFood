import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/RestaurantNotificationScreenStyle';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import NotificationList, {
  notificationKind,
} from '../../components/shared/NotificationList';

// An owner talks to many diners, so a message notification opens the inbox
// rather than guessing a thread. Everything else is about a review.
const NotificationScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.screen}>
      <NotificationList
        emptyMessage="Reviews, ratings and messages from diners will show up here."
        onOpen={notification =>
          navigation.navigate(
            notificationKind(notification.title) === 'message'
              ? 'MessageScreen'
              : 'OwnerReviews',
          )
        }
      />
      <RestaurantBottomNavbar navigation={navigation} />
    </View>
  </SafeAreaView>
);

export default NotificationScreen;
