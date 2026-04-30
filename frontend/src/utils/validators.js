import { Alert } from 'react-native';

export const validateRegisterForm = (form, role) => {
  if (!form.username.trim()) {
    Alert.alert('Validation Error', 'Username is required.');
    return false;
  }

  if (!form.password.trim()) {
    Alert.alert('Validation Error', 'Password is required.');
    return false;
  }

  if (form.password.length < 6) {
    Alert.alert('Validation Error', 'Password must be at least 6 characters.');
    return false;
  }

  if (!form.email_address.trim()) {
    Alert.alert('Validation Error', 'Email address is required.');
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(form.email_address)) {
    Alert.alert('Validation Error', 'Please enter a valid email address.');
    return false;
  }

  if (!form.mobile_number.trim()) {
    Alert.alert('Validation Error', 'Mobile number is required.');
    return false;
  }

  if (!role) {
    Alert.alert('Validation Error', 'Please select a role.');
    return false;
  }

  return true;
};
