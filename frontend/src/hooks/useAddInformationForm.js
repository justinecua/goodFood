import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addAdditionalInfo } from '../api/services/home';
import { mediaUrl } from '../constants/config';
import { validateAdditionalInfoForm } from '../utils/validatorAdditionalInfo';

const toISODate = date => {
  const pad = n => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
};

const isLocalFileUri = uri => !!uri && !/^https?:/i.test(uri);

export const useAddInformationForm = navigation => {
  const [form, setForm] = useState({
    firstname: '',
    lastname: '',
    gender: '',
    birthdate: '',
  });

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(null);

  const [birthdate, setBirthdate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tempDate, setTempDate] = useState(new Date());

  const [gender, setGender] = useState('');
  const [genderItems, setGenderItems] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  // Prefill from the cached user so this screen also works as "edit".
  useEffect(() => {
    AsyncStorage.getItem('user').then(res => {
      if (!res) return;
      const u = JSON.parse(res);

      setForm(prev => ({
        ...prev,
        firstname: u.first_name || '',
        lastname: u.last_name || '',
        gender: u.gender || '',
        birthdate: u.birthdate
          ? new Date(u.birthdate).toLocaleDateString()
          : '',
      }));
      if (u.gender) setGender(u.gender);
      if (u.birthdate) setSelectedDate(new Date(u.birthdate));

      const photo = mediaUrl(u.account_profile_photo);
      if (photo) setProfileImage({ uri: photo });
    });
  }, []);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddInformation = async () => {
    // `gender` lives in its own state because react-native-dropdown-picker
    // drives `setValue` with an updater fn, not a plain value.
    const payload = { ...form, gender };

    if (
      !payload.firstname &&
      !payload.lastname &&
      !payload.gender &&
      !payload.birthdate
    ) {
      console.log('Form is empty');
      return;
    }

    if (!validateAdditionalInfoForm(payload)) return;

    const stored = await AsyncStorage.getItem('user');
    const accountId = stored ? JSON.parse(stored).account_id : null;

    if (!accountId) {
      Alert.alert('Update Failed', 'You are not signed in. Please log in again.');
      return;
    }

    const formData = new FormData();
    formData.append('account_id', String(accountId));
    formData.append('firstname', payload.firstname.trim());
    formData.append('lastname', payload.lastname.trim());
    formData.append('gender', payload.gender);
    formData.append('birthdate', toISODate(selectedDate));

    // Only upload a freshly picked local file — not the existing remote photo.
    if (isLocalFileUri(profileImage?.uri)) {
      formData.append('profile_image', {
        uri: profileImage.uri,
        name: profileImage.fileName || 'profile.jpg',
        type: profileImage.type || 'image/jpeg',
      });
    }

    try {
      setIsLoading(true);
      const res = await addAdditionalInfo(formData);

      if (res.error) {
        Alert.alert('Additional Information Not Added', res.error);
        return;
      }

      // Keep the cached user in sync so the new photo / details show up
      // right away without needing to log in again.
      if (res.user) {
        const prev = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({ ...prev, ...res.user }),
        );
      }

      Alert.alert('Success', 'Account information added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('RestaurantHome'),
        },
      ]);
    } catch (error) {
      Alert.alert('Update Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    handleAddInformation,

    open,
    setOpen,
    items,
    setItems,
    isLoading,

    profileImage,
    setProfileImage,

    birthdate,
    setBirthdate,
    showDatePicker,
    setShowDatePicker,
    selectedDate,
    setSelectedDate,
    tempDate,
    setTempDate,

    gender,
    setGender,
    genderItems,
    setGenderItems,
  };
};
