import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/RegisterScreenStyles';
import colors from '../constants/colors';
import goodFoodGreen from '../assets/images/goodFood_green.png';

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.background}>
      <View style={styles.UpperLogoContainer}>
        <Image style={styles.UpperLogo} source={goodFoodGreen} />
      </View>
      <View>
        <View style={styles.topContainer}>
          <Text style={styles.headings}>Create an account</Text>
        </View>
        <View style={styles.topContainer}>
          <Text style={styles.subHeadings}>Join us and</Text>
          <Text style={styles.subHeadings2}>find local foods to eat!</Text>
        </View>
        <View style={styles.midContainer}>
          <TextInput
            placeholder="Username"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>
          <TextInput
            placeholder="Email Address"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>
          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>
          <TextInput
            placeholder="Role Selection"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
          ></TextInput>
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.bottomsubHeading}>
              Already have an account?
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.bottomsubHeadingLogin}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
