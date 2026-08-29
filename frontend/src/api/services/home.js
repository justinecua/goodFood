import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

export async function checkInfoComplete() {
  const user = JSON.parse(await AsyncStorage.getItem('user'));

  const response = await axios.post(`${BACKEND_API_URL}/check-info-complete/`, {
    account_id: user.account_id,
  });

  return response.data;
}

export async function addAdditionalInfo(formData) {
  const url = `${BACKEND_API_URL}/add-additional-info/`;
  try {
    const response = await axios.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 20000,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Server answered with a non-2xx status.
      throw new Error(
        error.response.data?.error ||
          `Server error ${error.response.status}`,
      );
    }
    // No response at all — DNS/connection/timeout/malformed body.
    console.log('addAdditionalInfo transport failure', {
      url,
      code: error.code,
      message: error.message,
    });
    throw new Error(
      `Could not reach the server at ${BACKEND_API_URL}. ` +
        'Check that the backend is running and the device is on the same network.',
    );
  }
}
