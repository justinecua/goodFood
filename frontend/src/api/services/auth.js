import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

export async function registerAccount(data) {
  const response = await axios.post(`${BACKEND_API_URL}/register/`, data);
  return response.data;
}

export async function login(username, password) {
  const response = await axios.post(`${BACKEND_API_URL}/login/`, {
    username,
    password,
  });

  if (response.data.error) {
    throw new Error(response.data.error);
  }

  const { access, refresh, user } = response.data;

  await AsyncStorage.setItem('accessToken', access);
  await AsyncStorage.setItem('refreshToken', refresh);
  await AsyncStorage.setItem('user', JSON.stringify(user));

  return { access, refresh, user };
}

export async function logoutAccount(refresh) {
  const response = await axios.post(`${BACKEND_API_URL}/logout/`, {
    refresh,
  });
  return response.data;
}

export async function getAccountTypes() {
  const response = await axios.get(`${BACKEND_API_URL}/account-types/`);
  return response.data;
}
