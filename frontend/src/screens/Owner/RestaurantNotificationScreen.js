import { View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';
import styles from '../../styles/RestaurantNotificationScreenStyle';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import EmptyState from '../../components/shared/EmptyState';
import { SafeAreaView } from 'react-native-safe-area-context';

// Notifications aren't wired to the backend yet, so this always shows the
// empty state for now. The list will slot in above it once the API exists.
const NotificationScreen = ({ navigation }) => {
  const notifications = [];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Notifications</Text>
          </View>

          <View style={styles.midContainer}>
            {notifications.length === 0 ? (
              <EmptyState
                icon={Bell}
                title="No notifications"
                message="Reservations, reviews and messages will show up here."
              />
            ) : (
              notifications.map(item => (
                <View key={item.id} style={styles.card}>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
              ))
            )}
          </View>
        </View>
        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
