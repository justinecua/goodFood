import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/RestaurantProfileInformationScreenStyle';
import colors from '../../constants/colors';

const RestaurantProfileInformationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Add Information</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.midContainer}>
            <TextInput
              placeholder="First Name"
              placeholderTextColor={colors.subtextInput}
              style={styles.addDishInput}
            />

            <TextInput
              placeholder="Last Name"
              placeholderTextColor={colors.subtextInput}
              style={styles.addDishInput}
            />

            <TextInput
              placeholder="Gender"
              placeholderTextColor={colors.subtextInput}
              style={styles.addDishInput}
            />

            <TextInput
              placeholder="Birthdate"
              placeholderTextColor={colors.subtextInput}
              style={styles.addDishInput}
              keyboardType="numeric"
            />
          </View>
        </View>
        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantProfileInformationScreen;
