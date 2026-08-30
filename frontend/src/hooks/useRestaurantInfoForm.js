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

// One editable row per day. Times are held in 12-hour form (e.g. "9:00")
// with a separate AM/PM flag; they're converted to 24-hour "HH:MM" on submit.
const emptyHours = () =>
  DAYS.map(day => ({
    day_of_week: day,
    opening_time: '',
    opening_period: 'AM',
    closing_time: '',
    closing_period: 'PM',
    is_closed: false,
  }));

// "13:30:00" (from the API) -> { time: "1:30", period: "PM" }.
const from24h = value => {
  const raw = String(value || '').trim();
  if (!raw) return { time: '', period: 'AM' };
  const [hStr, mStr = '00'] = raw.split(':');
  let hour = parseInt(hStr, 10);
  if (Number.isNaN(hour)) return { time: '', period: 'AM' };
  const period = hour >= 12 ? 'PM' : 'AM';
  hour %= 12;
  if (hour === 0) hour = 12;
  return { time: `${hour}:${mStr.slice(0, 2).padStart(2, '0')}`, period };
};

// { "9:00", "AM" } -> "09:00" for the backend TimeField. "" if unparseable.
const to24h = (time, period) => {
  const raw = String(time || '').trim();
  if (!raw) return '';
  const [hStr, mStr = '0'] = raw.split(':');
  let hour = parseInt(hStr, 10);
  let min = parseInt(mStr, 10);
  if (Number.isNaN(hour)) return '';
  if (Number.isNaN(min)) min = 0;
  hour %= 12;
  if (period === 'PM') hour += 12;
  return `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
};

// A picked-from-gallery image has a local uri; a prefilled one is an http URL.
const isNewUpload = image => !!image?.uri && !/^https?:/i.test(image.uri);

export const useRestaurantInfoForm = navigation => {
  const [form, setForm] = useState(emptyForm);
  const [logoImage, setLogoImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [operatingHours, setOperatingHours] = useState(emptyHours);
  const [categories, setCategories] = useState([]);
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
              if (!match) return row;

              const open = from24h(match.opening_time);
              const close = from24h(match.closing_time);
              return {
                day_of_week: row.day_of_week,
                opening_time: open.time,
                opening_period: open.time ? open.period : 'AM',
                closing_time: close.time,
                closing_period: close.time ? close.period : 'PM',
                is_closed: !!match.is_closed,
              };
            }),
          );
        }

        if (Array.isArray(data.categories)) {
          setCategories(data.categories.map(c => c.category_name));
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

    // Send the hours in 24-hour form, which is what the backend TimeField wants.
    const hoursPayload = operatingHours.map(row => ({
      day_of_week: row.day_of_week,
      is_closed: row.is_closed,
      opening_time: row.is_closed
        ? ''
        : to24h(row.opening_time, row.opening_period),
      closing_time: row.is_closed
        ? ''
        : to24h(row.closing_time, row.closing_period),
    }));

    const body = new FormData();
    body.append('account_id', String(accountId));
    FIELDS.forEach(key => body.append(key, form[key].trim()));
    body.append('operating_hours', JSON.stringify(hoursPayload));
    body.append('categories', JSON.stringify(categories));
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
