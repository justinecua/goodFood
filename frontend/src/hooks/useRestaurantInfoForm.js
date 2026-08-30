import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addRestaurantInfo, getRestaurantInfo } from '../api/services/home';
import { mediaUrl } from '../constants/config';

// Every text field on the screen, in one place.
const FIELDS = [
  'restaurant_name',
  'restaurant_description',
  'address',
  'contact_number',
  'email',
  'city',
  'province',
  'region',
  'country',
  'latitude',
  'longitude',
];

const REQUIRED = ['restaurant_name', 'address', 'contact_number', 'email'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyForm = () => Object.fromEntries(FIELDS.map(key => [key, '']));

// A picked-from-gallery image has a local uri; a prefilled one is an http URL.
const isNewUpload = image => !!image?.uri && !/^https?:/i.test(image.uri);

export const useRestaurantInfoForm = navigation => {
  const [form, setForm] = useState(emptyForm);
  const [logoImage, setLogoImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  // If the account already has a restaurant, load it so this screen edits it.
  useEffect(() => {
    getRestaurantInfo()
      .then(data => {
        if (!data?.restaurant) return;

        // restaurant + location fields both feed the one flat form.
        const saved = { ...data.location, ...data.restaurant };
        setForm(Object.fromEntries(FIELDS.map(key => [key, saved[key] ?? ''])));

        const { restaurant_logo_img, restaurant_cover_img } = data.restaurant;
        if (restaurant_logo_img) {
          setLogoImage({ uri: mediaUrl(restaurant_logo_img) });
        }
        if (restaurant_cover_img) {
          setCoverImage({ uri: mediaUrl(restaurant_cover_img) });
        }
      })
      .catch(err => console.log('getRestaurantInfo failed:', err.message));
  }, []);

  const isValid = () => {
    const missing = REQUIRED.find(key => !form[key].trim());
    if (missing) {
      Alert.alert('Validation Error', `${labelFor(missing)} is required.`);
      return false;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    const accountId = await readAccountId();
    if (!accountId) {
      Alert.alert(
        'Update Failed',
        'You are not signed in. Please log in again.',
      );
      return;
    }

    const body = new FormData();
    body.append('account_id', String(accountId));
    FIELDS.forEach(key => body.append(key, form[key].trim()));
    appendImage(body, 'restaurant_logo_img', logoImage, 'logo.jpg');
    appendImage(body, 'restaurant_cover_img', coverImage, 'cover.jpg');

    try {
      setIsLoading(true);
      const res = await addRestaurantInfo(body);
      if (res.error) {
        Alert.alert('Restaurant Information Not Saved', res.error);
        return;
      }
      Alert.alert('Success', 'Restaurant information saved.', [
        { text: 'OK', onPress: () => navigation.navigate('RestaurantHome') },
      ]);
    } catch (err) {
      Alert.alert('Update Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    logoImage,
    setLogoImage,
    coverImage,
    setCoverImage,
    isLoading,
    handleSubmit,
  };
};

// --- helpers -------------------------------------------------------------- //

function labelFor(key) {
  return key
    .split('_')
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

async function readAccountId() {
  const stored = await AsyncStorage.getItem('user');
  return stored ? JSON.parse(stored).account_id : null;
}

function appendImage(body, field, image, fallbackName) {
  if (!isNewUpload(image)) return;
  body.append(field, {
    uri: image.uri,
    name: image.fileName || fallbackName,
    type: image.type || 'image/jpeg',
  });
}
