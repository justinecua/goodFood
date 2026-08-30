import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDish, getDishCategories } from '../api/services/dish';

const emptyForm = () => ({
  dish_name: '',
  dish_description: '',
  dish_price: '',
  dish_category_id: null,
  is_signature: false,
  is_best_seller: false,
  is_available: true,
  preparation_notes: '',
  how_to_eat: '',
});

export const useAddDishForm = navigation => {
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const toggle = key => {
    setForm(prev => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    getDishCategories()
      .then(data => setCategories(data?.categories ?? []))
      .catch(err => console.log('getDishCategories failed:', err.message));
  }, []);

  const isValid = () => {
    if (!form.dish_name.trim()) {
      Alert.alert('Validation Error', 'Dish name is required.');
      return false;
    }
    const price = Number(form.dish_price);
    if (!form.dish_price.trim() || Number.isNaN(price) || price < 0) {
      Alert.alert('Validation Error', 'Enter a valid price.');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) return;

    const stored = await AsyncStorage.getItem('user');
    const accountId = stored ? JSON.parse(stored).account_id : null;
    if (!accountId) {
      Alert.alert('Failed', 'You are not signed in. Please log in again.');
      return;
    }

    const body = new FormData();
    body.append('account_id', String(accountId));
    body.append('dish_name', form.dish_name.trim());
    body.append('dish_description', form.dish_description.trim());
    body.append('dish_price', form.dish_price.trim());
    body.append('preparation_notes', form.preparation_notes.trim());
    body.append('how_to_eat', form.how_to_eat.trim());
    body.append('is_signature', form.is_signature ? 'true' : 'false');
    body.append('is_best_seller', form.is_best_seller ? 'true' : 'false');
    body.append('is_available', form.is_available ? 'true' : 'false');
    if (form.dish_category_id) {
      body.append('dish_category_id', String(form.dish_category_id));
    }
    if (image?.uri) {
      body.append('dish_image', {
        uri: image.uri,
        name: image.fileName || 'dish.jpg',
        type: image.type || 'image/jpeg',
      });
    }

    try {
      setIsLoading(true);
      const res = await addDish(body);
      if (res.error) {
        Alert.alert('Dish Not Saved', res.error);
        return;
      }
      Alert.alert('Success', 'Dish added.', [
        { text: 'OK', onPress: () => navigation.navigate('MyRestaurant') },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    handleChange,
    toggle,
    image,
    setImage,
    categories,
    isLoading,
    handleSubmit,
  };
};
