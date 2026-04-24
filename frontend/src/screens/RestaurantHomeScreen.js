import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/RestaurantHomeScreenStyles';
import colors from '../constants/colors';
import iconSource from '../constants/icons';
import BottomNavbar from '../components/shared/BottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const RestaurantHomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <View style={styles.upperContainer}>
            <View>
              <Text>Hello, Mi Casa</Text>
              <Text>Brgy. Poblacion, Quezon Avenue, Iligan ...</Text>
            </View>
            <View>
              <Image
                style={styles.userProfile}
                source={iconSource.userProfile}
              />
            </View>
          </View>
        </View>

        <BottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantHomeScreen;
