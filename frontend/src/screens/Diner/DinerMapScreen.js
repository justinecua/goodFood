import { View, Platform, PermissionsAndroid } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import styles from '../../styles/ProfileScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const DinerMapScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const mapRef = useRef(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles permission via Geolocation
  };

  useEffect(() => {
    const requestLocation = async () => {
      const hasPermission = await requestLocationPermission();

      if (!hasPermission) {
        console.log('Permission denied');
        return;
      }

      Geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;

          const currentLocation = {
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          };

          setLocation(currentLocation);
          mapRef.current?.animateToRegion(currentLocation, 1000);
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
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={{ flex: 1 }}>
          <MapView
            ref={mapRef}
            style={{ flex: 1 }}
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            initialRegion={{
              latitude: 8.228,
              longitude: 124.2452,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {location && <Marker coordinate={location} title="You are here" />}
          </MapView>
        </View>

        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerMapScreen;
