import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DinerBottomNavbar from './DinerBottomNavbar';
import RestaurantBottomNavbar from './RestaurantBottomNavbar';

// Picks the right tab bar for whoever is signed in, so screens shared between
// the two account types (profile information, for one) don't have to be
// duplicated per role. Renders nothing until the account type is known, which
// avoids flashing the wrong tabs on mount.
const AccountBottomNavbar = ({ navigation }) => {
  const [accountType, setAccountType] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem('user')
      .then(res => {
        if (res) setAccountType(JSON.parse(res).account_type ?? null);
      })
      .catch(() => {});
  }, []);

  if (!accountType) return null;

  return accountType === 'Diner' ? (
    <DinerBottomNavbar navigation={navigation} />
  ) : (
    <RestaurantBottomNavbar navigation={navigation} />
  );
};

export default AccountBottomNavbar;
