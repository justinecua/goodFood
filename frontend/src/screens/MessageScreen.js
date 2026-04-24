import { View, Text } from 'react-native';
import styles from '../styles/ProfileScreenStyle';
import BottomNavbar from '../components/shared/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const MessageScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Messages</Text>
        </View>
        <BottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default MessageScreen;
