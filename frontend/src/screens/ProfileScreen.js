import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/ProfileScreenStyle';
import BottomNavbar from '../components/shared/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProfileScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Profile Page</Text>

          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        <BottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
