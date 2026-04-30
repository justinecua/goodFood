import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import styles from '../styles/RegisterScreenStyles';
import colors from '../constants/colors';
import goodFoodGreen from '../assets/images/goodFood_green.png';
import RoleDropdown from '../components/register/RoleDropdown';
import { useRegisterForm } from '../hooks/useRegisterForm';

const RegisterScreen = ({ navigation }) => {
  const {
    form,
    handleChange,
    handleRegister,
    open,
    setOpen,
    role,
    setRole,
    items,
    setItems,
    isLoading,
  } = useRegisterForm(navigation);

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
            value={form.username}
            onChangeText={text => handleChange('username', text)}
          />

          <TextInput
            placeholder="Password"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
            value={form.password}
            onChangeText={text => handleChange('password', text)}
            secureTextEntry
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
            value={form.email_address}
            onChangeText={text => handleChange('email_address', text)}
          />

          <TextInput
            placeholder="Mobile Number"
            placeholderTextColor={colors.subtextInput}
            style={styles.registerInput}
            value={form.mobile_number}
            onChangeText={text => handleChange('mobile_number', text)}
          />
          <View style={{ zIndex: 2 }}>
            <RoleDropdown
              open={open}
              value={role}
              items={items}
              setOpen={setOpen}
              setValue={setRole}
              setItems={setItems}
              styles={styles}
            />
          </View>
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

        <TouchableOpacity
          style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Register</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterScreen;
