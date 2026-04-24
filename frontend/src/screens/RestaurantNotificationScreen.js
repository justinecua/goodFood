import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/RestaurantNotificationScreenStyle';
import BottomNavbar from '../components/shared/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Notifications</Text>
          </View>
          <View style={styles.midContainer}>
            <View style={styles.card}>
              <Text style={styles.cardText}>New Reservation Request</Text>
            </View>
          </View>
        </View>
        <BottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
