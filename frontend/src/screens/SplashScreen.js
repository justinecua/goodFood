import { View, Text, Image } from 'react-native';
import styles from '../styles/SplashScreenStyles';

const SplashScreen = () => {
  return (
    <View style={styles.background}>
      <Image
        source={require('../assets/images/goodFoodLogo.png')}
        style={styles.logoSymbol}
      ></Image>
      <Image
        source={require('../assets/images/goodFood.png')}
        style={styles.logo}
      ></Image>
    </View>
  );
};

export default SplashScreen;
