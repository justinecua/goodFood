import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import styles from '../styles/RestaurantInboxScreenStyle';
import colors from '../constants/colors';
import BottomNavbar from '../components/shared/BottomNavbar';
import SearchButton from '../assets/images/searchbutton.png';
import { SafeAreaView } from 'react-native-safe-area-context';

const RestaurantInboxScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Inbox</Text>
          </View>
          <View style={styles.midContainer}>
            <TouchableOpacity style={styles.searchInput}>
              <Text style={styles.placeholderText}>Search</Text>
              <Image style={styles.searchIcon} source={SearchButton} />
            </TouchableOpacity>
          </View>
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.addDishButton}>
              <Text style={styles.addDishButtonText}>Add Dish</Text>
            </TouchableOpacity>
          </View>

          {/* Bottom NavBar */}
          <BottomNavbar navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RestaurantInboxScreen;
