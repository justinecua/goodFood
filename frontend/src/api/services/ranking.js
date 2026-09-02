import axios from 'axios';
import Config from 'react-native-config';

import { getUserLocation } from './location';

const BACKEND_API_URL = Config.BACKEND_API_URL;

async function post(path, payload) {
  const response = await axios.post(`${BACKEND_API_URL}${path}`, payload, {
    timeout: 20000,
  });
  return response.data;
}

// The coordinates the diner agreed to share on LocationPermission. When they
// haven't, the backend falls back to a nationwide ranking, so the home screen
// still has something to show.
async function coords() {
  const location = await getUserLocation();

  if (!location) return {};

  return { latitude: location.latitude, longitude: location.longitude };
}

export async function getTopDishes({ limit = 6, radiusKm } = {}) {
  return post('/get-top-dishes/', {
    ...(await coords()),
    limit,
    ...(radiusKm ? { radius_km: radiusKm } : {}),
  });
}

export async function getTopRestaurants({ limit = 6, radiusKm } = {}) {
  return post('/get-top-restaurants/', {
    ...(await coords()),
    limit,
    ...(radiusKm ? { radius_km: radiusKm } : {}),
  });
}

export async function getNearbyRestaurants({ limit = 50, radiusKm } = {}) {
  return post('/get-nearby-restaurants/', {
    ...(await coords()),
    limit,
    ...(radiusKm ? { radius_km: radiusKm } : {}),
  });
}

// The newest reviews left around the diner - restaurant and dish reviews in
// one list, tagged by `review_kind`.
export async function getRecentReviews({ limit = 5, radiusKm } = {}) {
  return post('/get-recent-reviews/', {
    ...(await coords()),
    limit,
    ...(radiusKm ? { radius_km: radiusKm } : {}),
  });
}
