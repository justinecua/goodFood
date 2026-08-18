import { useState } from 'react';
import { Alert } from 'react-native';
import { addAdditionalInfo } from '../api/services/home';
import { validateAdditionalInfoForm } from '../utils/validatorAdditionalInfo';

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

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleAddInformation = async () => {
    if (!form.firstname && !form.lastname && !form.gender && !form.birthdate) {
      console.log('Form is empty');
      return;
    }

    console.log('Current Form Data:', form);

    if (!validateAdditionalInfoForm(form)) return;

    const formData = new FormData();
    formData.append('firstname', form.firstname.trim());
    formData.append('lastname', form.lastname.trim());
    formData.append('gender', form.gender);
    formData.append('birthdate', form.birthdate);

    if (profileImage) {
      formData.append('profile_image', {
        uri: profileImage,
        name: 'profile.jpg',
        type: 'image/jpeg',
      });
    }

    try {
      setIsLoading(true);
      const res = await addAdditionalInfo(formData);

      if (res.error) {
        Alert.alert('Additional Information Not Added', res.error);
        return;
      }

      Alert.alert('Success', 'Account information added successfully.', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('RestaurantHomeScreen'),
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
