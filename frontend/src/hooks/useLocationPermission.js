import { useState } from 'react';
import { Alert, Platform, PermissionsAndroid } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { saveUserLocation } from '../api/services/location';

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 10000,
};

// Asks the OS for foreground location access. Returns true only when the user
// granted it, so the caller can fall back to continuing without a fix.
export async function requestLocationPermission() {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  }

  const status = await Geolocation.requestAuthorization('whenInUse');
  return status === 'granted';
}

function getCurrentPosition() {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, GEO_OPTIONS);
  });
}

/**
 * Drives the "share your location" prompt: requests permission, reads a single
 * fix and stores it, then hands control back through `onDone`. Declining (or a
 * failed fix) still calls `onDone` — the location is a nicety, not a gate.
 */
export const useLocationPermission = onDone => {
  const [isRequesting, setIsRequesting] = useState(false);

  const allow = async () => {
    if (isRequesting) return;

    try {
      setIsRequesting(true);

      const hasPermission = await requestLocationPermission();
      if (!hasPermission) {
        Alert.alert(
          'Location off',
          'goodFood can still be used, but restaurants near you will not be suggested. You can turn location on later in your device settings.',
        );
        onDone(null);
        return;
      }

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      const location = await saveUserLocation({ latitude, longitude });

      onDone(location);
    } catch (error) {
      Alert.alert(
        'Could not get your location',
        'We could not read your location right now. You can continue and try again later.',
      );
      onDone(null);
    } finally {
      setIsRequesting(false);
    }
  };

  const cancel = () => {
    if (isRequesting) return;
    onDone(null);
  };

  return { isRequesting, allow, cancel };
};
