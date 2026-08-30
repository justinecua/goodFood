import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

async function currentAccountId() {
  const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
  return user.account_id ?? null;
}

// Same multipart helper as api/services/home.js — kept local so the dish
// endpoints stay self-contained.
async function postMultipart(path, formData) {
  const url = `${BACKEND_API_URL}${path}`;
  try {
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 20000,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        error.response.data?.error || `Server error ${error.response.status}`,
      );
    }
    throw new Error(
      `Could not reach the server at ${BACKEND_API_URL}. ` +
        'Check that the backend is running and the device is on the same network.',
    );
  }
}

export async function getDishCategories() {
  const response = await axios.post(
    `${BACKEND_API_URL}/get-dish-categories/`,
    {},
  );
  return response.data;
}

export async function addDishCategory(formData) {
  return postMultipart('/add-dish-category/', formData);
}

export async function getDishes() {
  const account_id = await currentAccountId();

  const response = await axios.post(`${BACKEND_API_URL}/get-dishes/`, {
    account_id,
  });

  return response.data;
}

export async function addDish(formData) {
  return postMultipart('/add-dish/', formData);
}
