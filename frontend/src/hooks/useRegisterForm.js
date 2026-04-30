import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { getAccountTypes, registerAccount } from '../api/services/auth';
import { validateRegisterForm } from '../utils/validators';

export const useRegisterForm = navigation => {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState(null);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    username: '',
    email_address: '',
    password: '',
    mobile_number: '',
  });

  useEffect(() => {
    fetchAccountTypes();
  }, []);

  const fetchAccountTypes = async () => {
    try {
      const data = await getAccountTypes();

      const formatted = data.map(item => ({
        label: item.account_type,
        value: item.acc_type_id,
      }));

      setItems(formatted);
    } catch (error) {
      console.log('Fetch account types error:', error);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    if (!validateRegisterForm(form, role)) return;

    try {
      setIsLoading(true);
      const res = await registerAccount({
        username: form.username.trim(),
        email_address: form.email_address.trim(),
        password: form.password,
        mobile_number: form.mobile_number.trim(),
        account_type: role,
      });

      if (res.error) {
        Alert.alert('Registration Failed', res.error);
        return;
      }
      Alert.alert('Success', 'Account registered successfully.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (error) {
      Alert.alert(
        'Registration Failed',
        error.response?.data?.error || error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
};
