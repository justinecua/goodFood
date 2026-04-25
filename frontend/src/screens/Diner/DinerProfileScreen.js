import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/ProfileScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutAccount } from '../../api/services/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DinerProfileScreen = ({ navigation }) => {
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
          <Text>Diner Profile Page</Text>

          <TouchableOpacity onPress={handleLogout}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerProfileScreen;
