import { useState } from 'react';
import { Alert } from 'react-native';
import { login } from '../api/services/auth';

export const useLoginForm = navigation => {
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
      const { user } = result;

      if (user.account_type === 'Restaurant Owner') {
        navigation.navigate('RestaurantHome');
      } else if (user.account_type === 'Diner') {
        navigation.navigate('DinerHome');
      } else {
        Alert.alert('Error', 'Unknown account type');
      }
    } catch (error) {
      Alert.alert('Login Failed', error.response?.data?.error || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleLogin,
    isLoading,
  };
};
