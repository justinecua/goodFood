import { useCallback, useEffect, useMemo, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { searchNearbyFood } from '../api/services/places';
import { getUserLocation, saveUserLocation } from '../api/services/location';
import { requestLocationPermission } from './useLocationPermission';
import { distanceMeters } from '../utils/geo';

const GEO_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 15000,
  maximumAge: 60000,
};

const DEFAULT_RADIUS = 3000;
const WIDER_RADIUS = 10000;

const getCurrentPosition = () =>
  new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(resolve, reject, GEO_OPTIONS);
  });

/**
 * Resolves the diner's position, then the food places around it.
 *
 * The stored login-time location is used immediately so the list can render
 * while a fresh fix is still coming in; if the fix moves the user, the
 * search re-runs. Consent was already asked for at login, so a denial here
 * is not fatal - it just leaves the screen without a location to work from.
 */
export const useNearbyPlaces = () => {
  const [origin, setOrigin] = useState(null);
  const [places, setPlaces] = useState([]);
  const [radius, setRadius] = useState(DEFAULT_RADIUS);
  const [isLocating, setIsLocating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [locationDenied, setLocationDenied] = useState(false);

  const locate = useCallback(async () => {
    setIsLocating(true);
    setLocationDenied(false);

    const stored = await getUserLocation();
    if (stored) setOrigin(stored);

    try {
      const granted = await requestLocationPermission();

      if (!granted) {
        setLocationDenied(!stored);
        return;
      }

      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;

      setOrigin({ latitude, longitude });
      saveUserLocation({ latitude, longitude }).catch(() => {});
    } catch (e) {
      // A stored location is still a usable starting point.
      setLocationDenied(!stored);
    } finally {
      setIsLocating(false);
    }
  }, []);

  // Resolve a position once on mount.
  useEffect(() => {
    locate();
  }, [locate]);

  const load = useCallback(async () => {
    if (!origin) return;

    try {
      setIsLoading(true);
      setError(null);
      setPlaces(await searchNearbyFood({ ...origin, radius }));
    } catch (e) {
      setError(e.message);
      setPlaces([]);
    } finally {
      setIsLoading(false);
    }
  }, [origin, radius]);

  // Re-run whenever the position or the radius changes.
  useEffect(() => {
    load();
  }, [load]);

  // Nearest first - distance is the whole recommendation for now.
  const ranked = useMemo(() => {
    if (!origin) return [];

    return places
      .map(place => ({ ...place, distance: distanceMeters(origin, place) }))
      .sort((a, b) => a.distance - b.distance);
  }, [places, origin]);

  const widen = () => setRadius(WIDER_RADIUS);

  return {
    origin,
    places: ranked,
    radius,
    isWide: radius >= WIDER_RADIUS,
    isLocating,
    isLoading,
    error,
    locationDenied,
    reload: load,
    retryLocation: locate,
    widen,
  };
};
