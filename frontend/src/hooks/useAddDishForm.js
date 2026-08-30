import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDish, updateDish, getDishCategories } from '../api/services/dish';
import { mediaUrl } from '../constants/config';

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

// `editing` is an existing dish object (with an optional `imagePath`) when the
// screen was opened to edit rather than add.
export const useAddDishForm = (navigation, editing) => {
  const isEdit = !!editing?.dish_id;

  const [form, setForm] = useState(() =>
    isEdit
      ? {
          dish_name: editing.dish_name ?? '',
          dish_description: editing.dish_description ?? '',
          dish_price:
            editing.dish_price != null ? String(editing.dish_price) : '',
          dish_category_id: editing.dish_category_id ?? null,
          is_signature: !!editing.is_signature,
          is_best_seller: !!editing.is_best_seller,
          is_available: editing.is_available !== false,
          preparation_notes: editing.preparation_notes ?? '',
          how_to_eat: editing.how_to_eat ?? '',
        }
      : emptyForm(),
  );
  const [image, setImage] = useState(
    isEdit && editing.imagePath ? { uri: mediaUrl(editing.imagePath) } : null,
  );
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

  // A freshly picked image has a local uri; a prefilled one is an http URL.
  const isNewUpload = () => !!image?.uri && !/^https?:/i.test(image.uri);

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
    if (isEdit) body.append('dish_id', String(editing.dish_id));
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
    if (isNewUpload()) {
      body.append('dish_image', {
        uri: image.uri,
        name: image.fileName || 'dish.jpg',
        type: image.type || 'image/jpeg',
      });
    }

    try {
      setIsLoading(true);
      const res = await (isEdit ? updateDish(body) : addDish(body));
      if (res.error) {
        Alert.alert('Dish Not Saved', res.error);
        return;
      }
      Alert.alert('Success', isEdit ? 'Dish updated.' : 'Dish added.', [
        {
          text: 'OK',
          onPress: () =>
            isEdit ? navigation.goBack() : navigation.navigate('Menu'),
        },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isEdit,
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
