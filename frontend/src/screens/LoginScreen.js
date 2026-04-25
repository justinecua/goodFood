import { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import styles from '../styles/RegisterScreenStyles';
import colors from '../constants/colors';
import goodFoodGreen from '../assets/images/goodFood_green.png';
import { login } from '../api/services/auth';

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    username: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const handleChange = (key, value) => {
    setForm(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleLogin = async () => {
    if (!form.username.trim()) {
      Alert.alert('Validation Error', 'Username is required.');
      return;
    }

    if (!form.password.trim()) {
      Alert.alert('Validation Error', 'Password is required.');
      return;
    }

    try {
      setIsLoading(true);
      const result = await login(form.username.trim(), form.password);

      console.log('Login success:', result);

      navigation.navigate('RestaurantHome');
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };
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
        </View>
      </View>

      <View style={styles.bottomContainer}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomSubContainer}>
            <Text style={styles.bottomsubHeading}>Don`t have an account?</Text>
          </View>

          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.bottomsubHeadingLogin}>Register</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, isLoading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.registerButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
