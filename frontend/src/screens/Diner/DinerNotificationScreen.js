import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/RestaurantNotificationScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import NotificationList, {
  notificationKind,
} from '../../components/shared/NotificationList';

// A message notification opens that restaurant's thread - a diner only ever
// has one per restaurant, so the restaurant_id is enough to find it. Anything
// else opens the restaurant it came from.
const DinerNotificationScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.screen}>
      <NotificationList
        emptyMessage="Replies to your reviews, messages from restaurants and updates will show up here."
        onOpen={notification => {
          if (!notification.restaurant_id) return;

          if (notificationKind(notification.title) === 'message') {
            navigation.navigate('MessageThread', {
              restaurantId: notification.restaurant_id,
              title: notification.restaurant_name,
            });
            return;
          }

          navigation.navigate('DinerRestaurant', {
            restaurantId: notification.restaurant_id,
          });
        }}
      />
      <DinerBottomNavbar navigation={navigation} />
    </View>
  </SafeAreaView>
);

export default DinerNotificationScreen;
