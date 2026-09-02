import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

async function currentAccountId() {
  const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
  return user.account_id ?? null;
}

async function post(path, payload) {
  const response = await axios.post(`${BACKEND_API_URL}${path}`, payload, {
    timeout: 20000,
  });
  return response.data;
}

// The same endpoints serve owners and diners - which notifications come back
// is decided by the account the request is made for.
export async function getNotifications() {
  return post('/get-notifications/', { account_id: await currentAccountId() });
}

export async function getUnreadCount() {
  return post('/get-unread-count/', { account_id: await currentAccountId() });
}

export async function markNotificationRead(notificationId) {
  return post('/mark-notification-read/', {
    notification_id: notificationId,
    account_id: await currentAccountId(),
  });
}

export async function markAllNotificationsRead() {
  return post('/mark-all-notifications-read/', {
    account_id: await currentAccountId(),
  });
}

export async function deleteNotification(notificationId) {
  return post('/delete-notification/', {
    notification_id: notificationId,
    account_id: await currentAccountId(),
  });
}
