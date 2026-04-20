import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/RestaurantHomeScreenStyles';
import colors from '../constants/colors';
import iconSource from '../constants/icons'

const RestaurantHomeScreen = () => {
  return (
    <View style={{flex: 1}}>

      <View style={styles.background}>
        <View style={styles.upperContainer}>
          <View>
            <Text>Hello, Mi Casa</Text>
            <Text>Brgy. Poblacion, Quezon Avenue, Iligan ...</Text>
          </View>
          <View>
            <Image style={styles.userProfile} source={iconSource.userProfile}/>
          </View>
        </View>
      </View>

      <View style={styles.bottomNavBar}>
        <View style={styles.iconContainer}>
          <View style={styles.navBotton}>
            <Image style={styles.icon} source={iconSource.home.inactive}/>
            <Text>Home</Text>
          </View>
          <View style={styles.navBotton}>
            <Image style={styles.icon} source={iconSource.chat.inactive}/>
            <Text>Messages</Text>
          </View>
          <View style={styles.navBotton}>
            <Image style={styles.icon2} source={iconSource.fries.inactive}/>
            <Text>Dish</Text>
          </View>
          <View style={styles.navBotton}>
            <Image style={styles.icon1} source={iconSource.notif.inactive}/>
            <Text>Notifications</Text>
          </View>
          <View style={styles.navBotton}>
            <Image style={styles.icon3} source={iconSource.profile.inactive}/>
            <Text>Profile</Text>
          </View>      
        </View>
      </View>
    
    </View>
  );
};

export default RestaurantHomeScreen;