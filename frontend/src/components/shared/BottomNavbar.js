import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/RestaurantAddDishScreenStyle';
import chatnavbar from '../../assets/images/chatnavbar.png';
import dishnavbar from '../../assets/images/dishnavbar.png';
import homenavbar from '../../assets/images/homenavbar.png';
import notifnavbar from '../../assets/images/notifnavbar.png';
import usercircle from '../../assets/images/usercircle.png';

const BottomNavbar = () => {
  return (
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
        <Text style={styles.navIconText}>Notification</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.navItem}>
        <Image style={styles.navIconImage} source={usercircle} />
        <Text style={styles.navIconText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavbar;
