import { Alert } from 'react-native';

export const validateAdditionalInfoForm = (form, role) => {
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

  return true;
};
