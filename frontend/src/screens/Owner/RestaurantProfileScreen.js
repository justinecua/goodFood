import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/ProfileScreenStyle';
import BottomNavbar from '../../components/shared/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutAccount } from '../../api/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      const refresh = await AsyncStorage.getItem('refreshToken');

      if (refresh) {
        await logoutAccount(refresh);
      }
    } catch (e) {
      console.log('Logout error:', e);
    }

    await AsyncStorage.removeItem('accessToken');
    await AsyncStorage.removeItem('refreshToken');
    await AsyncStorage.removeItem('user');

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Profile Page</Text>

          <TouchableOpacity onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        <BottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default ProfileScreen;
