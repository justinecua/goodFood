import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/RestaurantNotificationScreenStyle';
import colors from '../constants/colors';
import goodFoodGreen from '../assets/images/goodFood_green.png';
import homenavbar from '../assets/images/homenavbar.png';
import chatnavbar from '../assets/images/chatnavbar.png';
import dishnavbar from '../assets/images/dishnavbar.png';
import notifnavbar from '../assets/images/notifnavbar.png';
import usercircle from '../assets/images/usercircle.png';

const NotificationScreen = () => {
  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Notifications</Text>
      </View>
      <View style={styles.midContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>New Reservation Request</Text>
        </View>
      </View>
      <View style={styles.bottomNavigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={homenavbar} />
          <Text style={styles.navIconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={chatnavbar} />
          <Text style={styles.navIconText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={dishnavbar} />
          <Text style={styles.navIconText}>Dish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={notifnavbar} />
          <Text style={[styles.navIconText]}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={usercircle} />
          <Text style={styles.navIconText}>Profile</Text>
        </TouchableOpacity>
      </View>

    </View>
  );
};

export default NotificationScreen;