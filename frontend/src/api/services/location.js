import AsyncStorage from '@react-native-async-storage/async-storage';

// Last coordinates the user agreed to share, kept on the device so screens
// (map, nearby suggestions) can read them without asking for a fresh fix.
const LOCATION_KEY = 'userLocation';

export async function saveUserLocation({ latitude, longitude }) {
  const location = { latitude, longitude, capturedAt: Date.now() };
  await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  return location;
}

export async function getUserLocation() {
  try {
    const stored = await AsyncStorage.getItem(LOCATION_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    return null;
  }
}

export async function clearUserLocation() {
  try {
    await AsyncStorage.removeItem(LOCATION_KEY);
  } catch (e) {}
}
