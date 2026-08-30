import { Alert } from 'react-native';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateAdditionalInfoForm = form => {
  if (!form.firstname.trim()) {
    Alert.alert('Validation Error', 'First Name is required.');
    return false;
  }

  if (!form.lastname.trim()) {
    Alert.alert('Validation Error', 'Last Name is required.');
    return false;
  }

  if (!form.gender) {
    Alert.alert('Validation Error', 'Gender is required.');
    return false;
  }

  if (!form.birthdate.trim()) {
    Alert.alert('Validation Error', 'Birth Date is required.');
    return false;
  }

  // email / mobile are only present on the profile-edit screen.
  if ('email' in form) {
    if (!form.email.trim()) {
      Alert.alert('Validation Error', 'Email is required.');
      return false;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
  }

  if ('mobile' in form && !form.mobile.trim()) {
    Alert.alert('Validation Error', 'Mobile Number is required.');
    return false;
  }

  return true;
};
