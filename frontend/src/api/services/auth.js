import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

// How long a stored session stays valid without logging in again.
export const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 1 day

const SESSION_KEYS = ['accessToken', 'refreshToken', 'user', 'loginAt'];

export async function clearSession() {
  await AsyncStorage.multiRemove(SESSION_KEYS);
}

/**
 * Returns the stored session if one exists and is younger than SESSION_TTL_MS,
 * otherwise clears it and returns null. Used on app start so a refresh/restart
 * keeps the user logged in for up to a day.
 */
export async function getActiveSession() {
  const entries = await AsyncStorage.multiGet(SESSION_KEYS);
  const store = Object.fromEntries(entries);

  if (!store.user || !store.accessToken || !store.loginAt) {
    return null;
  }

  const age = Date.now() - Number(store.loginAt);
  if (!Number.isFinite(age) || age < 0 || age >= SESSION_TTL_MS) {
    await clearSession();
    return null;
  }

  try {
    return {
      user: JSON.parse(store.user),
      access: store.accessToken,
      refresh: store.refreshToken,
    };
  } catch (e) {
    await clearSession();
    return null;
  }
}

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

  await AsyncStorage.multiSet([
    ['accessToken', access],
    ['refreshToken', refresh],
    ['user', JSON.stringify(user)],
    ['loginAt', String(Date.now())],
  ]);

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
