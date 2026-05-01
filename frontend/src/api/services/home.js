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
