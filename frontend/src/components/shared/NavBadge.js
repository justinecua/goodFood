import { View, Text } from 'react-native';
import styles from '../../styles/RestaurantAddDishScreenStyle';

// The count bubble that sits on the corner of a bottom-navbar icon.
//
//   <View style={styles.iconWrap}>
//     <Image ... />
//     <NavBadge count={unread.messages} />
//   </View>
//
// Renders nothing at zero, so an icon with no news looks exactly as it did
// before. Anything past 99 becomes "99+" to keep the bubble from stretching
// wide enough to overlap the neighbouring tab.
const NavBadge = ({ count }) => {
  const value = Number(count) || 0;

  if (value <= 0) return null;

  return (
    <View style={styles.navBadge}>
      <Text style={styles.navBadgeText}>{value > 99 ? '99+' : value}</Text>
    </View>
  );
};

export default NavBadge;
