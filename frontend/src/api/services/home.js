import axios from 'axios';
import Config from 'react-native-config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BACKEND_API_URL = Config.BACKEND_API_URL;

async function currentAccountId() {
  const user = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
  return user.account_id ?? null;
}

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
      // Server answered with a non-2xx status.
      throw new Error(
        error.response.data?.error || `Server error ${error.response.status}`,
      );
    }
    // No response at all — DNS/connection/timeout/malformed body.
    console.log('multipart transport failure', {
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

export async function checkInfoComplete() {
  const account_id = await currentAccountId();

  const response = await axios.post(`${BACKEND_API_URL}/check-info-complete/`, {
    account_id,
  });

  return response.data;
}

export async function addAdditionalInfo(formData) {
  return postMultipart('/add-additional-info/', formData);
}

export async function updateProfilePhoto(formData) {
  return postMultipart('/update-profile-photo/', formData);
}

export async function getRestaurantInfo() {
  const account_id = await currentAccountId();

  const response = await axios.post(`${BACKEND_API_URL}/get-restaurant-info/`, {
    account_id,
  });

  return response.data;
}

// One restaurant's public page: profile, menu, hours, branches and its
// rating summary. Looked up by id, unlike getRestaurantInfo which resolves the
// restaurant from the signed-in owner.
export async function getRestaurantDetails(restaurantId) {
  const response = await axios.post(
    `${BACKEND_API_URL}/get-restaurant-details/`,
    { restaurant_id: restaurantId },
  );

  return response.data;
}

export async function addRestaurantInfo(formData) {
  return postMultipart('/add-restaurant-info/', formData);
}

export async function addBranch(formData) {
  return postMultipart('/add-branch/', formData);
}

export async function updateBranch(formData) {
  return postMultipart('/update-branch/', formData);
}

export async function deleteBranch(branchId) {
  const response = await axios.post(`${BACKEND_API_URL}/delete-branch/`, {
    branch_id: branchId,
  });
  return response.data;
}
