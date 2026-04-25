import { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/SplashScreenStyles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
