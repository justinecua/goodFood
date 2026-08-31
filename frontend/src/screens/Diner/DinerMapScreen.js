import { View, Text } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import {
  Map,
  Camera,
  Marker,
  NativeUserLocation,
} from '@maplibre/maplibre-react-native';
import Geolocation from 'react-native-geolocation-service';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/DinerMapScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { requestLocationPermission } from '../../hooks/useLocationPermission';
import { getUserLocation, saveUserLocation } from '../../api/services/location';
import {
  MAP_STYLE_URL,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  USER_ZOOM,
} from '../../constants/map';

const DinerMapScreen = ({ navigation }) => {
  // MapLibre works in [longitude, latitude] order, unlike the {latitude,
  // longitude} objects the rest of the app passes around.
  const [center, setCenter] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    const showCoords = ({ latitude, longitude }, animate) => {
      if (cancelled) return;

      const lngLat = [longitude, latitude];
      setCenter(lngLat);

      if (animate) {
        cameraRef.current?.flyTo({
          center: lngLat,
          zoom: USER_ZOOM,
          duration: 1000,
        });
      }
    };

    const requestLocation = async () => {
      // Whatever was captured at login gets the map on the right spot right
      // away; the live fix below refines it.
      const stored = await getUserLocation();
      if (stored) showCoords(stored, false);

      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        console.log('Permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          showCoords({ latitude, longitude }, true);
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
          <Map style={styles.map} mapStyle={MAP_STYLE_URL}>
            <Camera
              ref={cameraRef}
              initialViewState={{
                center: center ?? DEFAULT_CENTER,
                zoom: center ? USER_ZOOM : DEFAULT_ZOOM,
              }}
            />

            <NativeUserLocation />

            {center && (
              <Marker id="you-are-here" lngLat={center}>
                <View style={styles.marker}>
                  <View style={styles.markerDot} />
                  <Text style={styles.markerLabel}>You are here</Text>
                </View>
              </Marker>
            )}
          </Map>
        </View>

        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerMapScreen;
