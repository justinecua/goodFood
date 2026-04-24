import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/RestaurantAddDishScreenStyle';
import { useRoute } from '@react-navigation/native';
import colors from '../../constants/colors';

import chatnavbar from '../../assets/navBarIcons/chat_0.png';
import dishnavbar from '../../assets/navBarIcons/fries_0.png';
import homenavbar from '../../assets/navBarIcons/home_0.png';
import notifnavbar from '../../assets/navBarIcons/notif_0.png';
import usercircle from '../../assets/navBarIcons/profile_0.png';

import chatnavbar1 from '../../assets/navBarIcons/chat_1.png';
import dishnavbar1 from '../../assets/navBarIcons/fries_1.png';
import homenavbar1 from '../../assets/navBarIcons/home_1.png';
import notifnavbar1 from '../../assets/navBarIcons/notif_1.png';
import usercircle1 from '../../assets/navBarIcons/profile_1.png';

const BottomNavbar = ({ navigation }) => {
  const route = useRoute();
  const current = route.name;

  return (
    <View style={styles.bottomNavigationBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('RestaurantHome')}
      >
        <Image
          style={styles.homeIcon}
          source={current === 'RestaurantHome' ? homenavbar1 : homenavbar}
        />

        <Text
          style={[
            styles.navIconText,
            current === 'RestaurantHome' && { color: colors.button },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('MessageScreen')}
      >
        <Image
          style={styles.chatIcon}
          source={current === 'MessageScreen' ? chatnavbar1 : chatnavbar}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'MessageScreen' && { color: colors.button },
          ]}
        >
          Messages
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('AddDish')}
      >
        <Image
          style={styles.dishIcon}
          source={current === 'AddDish' ? dishnavbar1 : dishnavbar}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'AddDish' && { color: colors.button },
          ]}
        >
          Dish
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('Notifications')}
      >
        <Image
          style={styles.notifIcon}
          source={current === 'Notifications' ? notifnavbar1 : notifnavbar}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'Notifications' && { color: colors.button },
          ]}
        >
          Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('ProfileScreen')}
      >
        <Image
          style={styles.profileIcon}
          source={current === 'ProfileScreen' ? usercircle1 : usercircle}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'ProfileScreen' && { color: colors.button },
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomNavbar;
