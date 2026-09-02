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

// One set of endpoints serves both sides. The backend works out whether the
// signed-in account is the diner or the restaurant owner on each thread, so
// the app never has to say which role it is.

export async function getConversations(search) {
  return post('/get-conversations/', {
    account_id: await currentAccountId(),
    ...(search ? { search } : {}),
  });
}

// Fetching a thread is also what marks the other side's messages as read.
export async function getMessages(conversationId) {
  return post('/get-messages/', {
    conversation_id: conversationId,
    account_id: await currentAccountId(),
  });
}

// Opens the diner's thread with a restaurant, reusing it if one exists.
export async function startConversation(restaurantId) {
  return post('/start-conversation/', {
    account_id: await currentAccountId(),
    restaurant_id: restaurantId,
  });
}

// Either reply on a known thread (conversationId) or write to a restaurant for
// the first time (restaurantId) - the thread is created on demand.
export async function sendMessage({ conversationId, restaurantId, message }) {
  return post('/send-message/', {
    account_id: await currentAccountId(),
    ...(conversationId ? { conversation_id: conversationId } : {}),
    ...(restaurantId ? { restaurant_id: restaurantId } : {}),
    message,
  });
}

// Editing and deleting are limited to your own messages - the backend checks
// the sender, so a tampered request just comes back with an error.
export async function editMessage({ messageId, message }) {
  return post('/edit-message/', {
    account_id: await currentAccountId(),
    message_id: messageId,
    message,
  });
}

export async function deleteMessage(messageId) {
  return post('/delete-message/', {
    account_id: await currentAccountId(),
    message_id: messageId,
  });
}

export async function getUnreadMessageCount() {
  return post('/get-unread-message-count/', {
    account_id: await currentAccountId(),
  });
}
