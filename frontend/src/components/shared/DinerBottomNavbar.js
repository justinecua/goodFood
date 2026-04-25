import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/RestaurantAddDishScreenStyle';
import { useRoute } from '@react-navigation/native';
import colors from '../../constants/colors';

import chatnavbar from '../../assets/navBarIcons/chat_0.png';
import eat from '../../assets/navBarIcons/eat_0.png';
import homenavbar from '../../assets/navBarIcons/home_0.png';
import notifnavbar from '../../assets/navBarIcons/notif_0.png';
import usercircle from '../../assets/navBarIcons/profile_0.png';

import chatnavbar1 from '../../assets/navBarIcons/chat_1.png';
import eat1 from '../../assets/navBarIcons/eat_1.png';
import homenavbar1 from '../../assets/navBarIcons/home_1.png';
import notifnavbar1 from '../../assets/navBarIcons/notif_1.png';
import usercircle1 from '../../assets/navBarIcons/profile_1.png';

const DinerBottomNavbar = ({ navigation }) => {
  const route = useRoute();
  const current = route.name;

  return (
    <View style={styles.bottomNavigationBar}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('DinerHome')}
      >
        <Image
          style={styles.homeIcon}
          source={current === 'DinerHome' ? homenavbar1 : homenavbar}
        />

        <Text
          style={[
            styles.navIconText,
            current === 'DinerHome' && { color: colors.button },
          ]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('DinerInboxScreen')}
      >
        <Image
          style={styles.chatIcon}
          source={current === 'DinerInboxScreen' ? chatnavbar1 : chatnavbar}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'DinerInboxScreen' && { color: colors.button },
          ]}
        >
          Messages
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('DinerMapScreen')}
      >
        <Image
          style={styles.dishIcon}
          source={current === 'DinerMapScreen' ? eat1 : eat}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'DinerMapScreen' && { color: colors.button },
          ]}
        >
          Map
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('DinerNotificationScreen')}
      >
        <Image
          style={styles.notifIcon}
          source={
            current === 'DinerNotificationScreen' ? notifnavbar1 : notifnavbar
          }
        />
        <Text
          style={[
            styles.navIconText,
            current === 'DinerNotificationScreen' && { color: colors.button },
          ]}
        >
          Notification
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => navigation.navigate('DinerProfileScreen')}
      >
        <Image
          style={styles.profileIcon}
          source={current === 'DinerProfileScreen' ? usercircle1 : usercircle}
        />
        <Text
          style={[
            styles.navIconText,
            current === 'DinerProfileScreen' && { color: colors.button },
          ]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DinerBottomNavbar;
