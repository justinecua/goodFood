import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/RegisterScreenStyles';
import colors from '../constants/colors';
import goodFoodGreen from '../assets/images/goodFood_green.png';

const LoginScreen = () => {
  return (
    <View style={styles.background}>
      <View style={styles.UpperLogoContainer}>
        <Image style={styles.UpperLogo} source={goodFoodGreen} />
      </View>
      <View>
        <View style={styles.topContainer}>
          <Text style={styles.headings}>Let`s sign you in</Text>
        </View>
        <View style={styles.topContainer}>
          <Text style={styles.subHeadings}>Welcome back</Text>
          <Text style={styles.subHeadings2}>You have been missed</Text>
        </View>
        <View style={styles.midContainer}>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>
          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.bottomsubHeading}>Don`t have an account?</Text>
          </View>
          <View>
            <Text style={styles.bottomsubHeadingLogin}>Register</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
