import { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/SplashScreenStyles';
import { getActiveSession } from '../api/services/auth';

const HOME_BY_ACCOUNT_TYPE = {
  'Restaurant Owner': 'RestaurantHome',
  Diner: 'DinerHome',
};

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      // Restore an existing session (valid for up to a day) so a refresh or
      // app restart doesn't force the user back to the login screen.
      const [session] = await Promise.all([
        getActiveSession().catch(() => null),
        new Promise(resolve => setTimeout(resolve, 1500)),
      ]);

      if (cancelled) return;

      const target = session && HOME_BY_ACCOUNT_TYPE[session.user?.account_type];
      navigation.replace(target || 'Login');
    };

    boot();

    return () => {
      cancelled = true;
    };
  }, [navigation]);

  return (
    <View style={styles.background}>
      <Image
        source={require('../assets/images/goodFoodLogo.png')}
        style={styles.logoSymbol}
      />

      <Image
        source={require('../assets/images/goodFood.png')}
        style={styles.logo}
      />
    </View>
  );
};

export default SplashScreen;
