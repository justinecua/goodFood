import { View, Text } from 'react-native';
import styles from '../../styles/ProfileScreenStyle';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const MessageScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.section}>
            <Text>Messages</Text>
          </View>
          <RestaurantBottomNavbar navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
