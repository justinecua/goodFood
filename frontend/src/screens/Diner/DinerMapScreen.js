import { View } from 'react-native';
import { useEffect, useState } from 'react';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/DinerMapScreenStyle';
import NearbyMap from '../../components/shared/NearbyMap';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { requestLocationPermission } from '../../hooks/useLocationPermission';
import { getUserLocation, saveUserLocation } from '../../api/services/location';

// Apple Maps on iOS, MapLibre on Android - both behind NearbyMap, which
// takes {latitude, longitude} and handles the coordinate order each one
// wants. Until a fix arrives the map sits on St. Michael's College.
const DinerMapScreen = ({ navigation }) => {
  const [center, setCenter] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const requestLocation = async () => {
      // Whatever was captured at login gets the map on the right spot right
      // away; the live fix below refines it.
      const stored = await getUserLocation();
      if (!cancelled && stored) setCenter(stored);

      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        console.log('Permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          if (cancelled) return;

          const { latitude, longitude } = position.coords;

          setCenter({ latitude, longitude });
          saveUserLocation({ latitude, longitude }).catch(() => {});
        },
        error => {
          console.log('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
        },
      );
    };

    requestLocation();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.mapWrap}>
          <NearbyMap style={styles.map} center={center} />
        </View>

        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerMapScreen;
