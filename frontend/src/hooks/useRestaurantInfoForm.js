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

export const DAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const emptyForm = () => Object.fromEntries(FIELDS.map(key => [key, '']));

// One editable row per day, all closed by default until the owner fills it in.
const emptyHours = () =>
  DAYS.map(day => ({
    day_of_week: day,
    opening_time: '',
    closing_time: '',
    is_closed: false,
  }));

const emptyBranch = () => ({
  branch_name: '',
  address: '',
  contact_number: '',
  latitude: '',
  longitude: '',
});

// "09:00:00" -> "09:00"; null -> "".
const toShortTime = value => (value ? String(value).slice(0, 5) : '');

// A picked-from-gallery image has a local uri; a prefilled one is an http URL.
const isNewUpload = image => !!image?.uri && !/^https?:/i.test(image.uri);

export const useRestaurantInfoForm = navigation => {
  const [form, setForm] = useState(emptyForm);
  const [logoImage, setLogoImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [operatingHours, setOperatingHours] = useState(emptyHours);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const setHour = (day, key, value) => {
    setOperatingHours(prev =>
      prev.map(row =>
        row.day_of_week === day ? { ...row, [key]: value } : row,
      ),
    );
  };

  const addCategory = name => {
    const clean = name.trim();
    if (!clean) return;
    setCategories(prev =>
      prev.some(c => c.toLowerCase() === clean.toLowerCase())
        ? prev
        : [...prev, clean],
    );
  };

  const removeCategory = name => {
    setCategories(prev => prev.filter(c => c !== name));
  };

  const addBranch = () => setBranches(prev => [...prev, emptyBranch()]);

  const removeBranch = index => {
    setBranches(prev => prev.filter((_, i) => i !== index));
  };

  const setBranch = (index, key, value) => {
    setBranches(prev =>
      prev.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
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

        // Merge saved hours onto the 7-day template so every day still shows.
        if (Array.isArray(data.operating_hours)) {
          setOperatingHours(
            emptyHours().map(row => {
              const match = data.operating_hours.find(
                h => h.day_of_week === row.day_of_week,
              );
              return match
                ? {
                    day_of_week: row.day_of_week,
                    opening_time: toShortTime(match.opening_time),
                    closing_time: toShortTime(match.closing_time),
                    is_closed: !!match.is_closed,
                  }
                : row;
            }),
          );
        }

        if (Array.isArray(data.categories)) {
          setCategories(data.categories.map(c => c.category_name));
        }

        if (Array.isArray(data.branches)) {
          setBranches(
            data.branches.map(b => ({
              branch_name: b.branch_name ?? '',
              address: b.address ?? '',
              contact_number: b.contact_number ?? '',
              latitude: b.latitude ?? '',
              longitude: b.longitude ?? '',
            })),
          );
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
    const badHour = operatingHours.find(
      row =>
        !row.is_closed &&
        ((row.opening_time && !row.closing_time) ||
          (!row.opening_time && row.closing_time)),
    );
    if (badHour) {
      Alert.alert(
        'Validation Error',
        `${badHour.day_of_week}: set both an opening and a closing time, or mark it closed.`,
      );
      return false;
    }
    const badBranch = branches.find(
      b =>
        (b.branch_name.trim() || b.address.trim() || b.contact_number.trim()) &&
        !(b.branch_name.trim() && b.address.trim() && b.contact_number.trim()),
    );
    if (badBranch) {
      Alert.alert(
        'Validation Error',
        'Each branch needs a name, address and contact number.',
      );
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
    body.append('operating_hours', JSON.stringify(operatingHours));
    body.append('categories', JSON.stringify(categories));
    body.append(
      'branches',
      JSON.stringify(
        branches.filter(b => b.branch_name.trim() && b.address.trim()),
      ),
    );
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
    operatingHours,
    setHour,
    categories,
    addCategory,
    removeCategory,
    branches,
    addBranch,
    removeBranch,
    setBranch,
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
