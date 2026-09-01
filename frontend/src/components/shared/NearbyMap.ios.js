import { useEffect, useRef } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import colors from '../../constants/colors';
import { DEFAULT_PLACE, DEFAULT_DELTA, USER_DELTA } from '../../constants/map';

// iOS renders the built-in Apple map. PROVIDER_DEFAULT is Apple Maps here,
// which needs no API key and no extra entitlement — the location usage
// description already in Info.plist is enough.
//
// The Android half of this component lives in NearbyMap.android.js and uses
// MapLibre; Metro picks the right one per platform. Both take the same
// props: { center, places, style, followUser }.
const NearbyMap = ({ center, places = [], style, followUser = true }) => {
  const mapRef = useRef(null);
  const origin = center || DEFAULT_PLACE;

  // Re-centre whenever the fix moves, so the map tracks the diner live.
  useEffect(() => {
    if (!center) return;

    mapRef.current?.animateToRegion(
      {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: USER_DELTA,
        longitudeDelta: USER_DELTA,
      },
      600,
    );
  }, [center]);

  return (
    <MapView
      ref={mapRef}
      style={style}
      provider={PROVIDER_DEFAULT}
      initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: DEFAULT_DELTA,
        longitudeDelta: DEFAULT_DELTA,
      }}
      showsUserLocation={followUser}
      showsMyLocationButton={followUser}
      showsPointsOfInterest={false}
    >
      {places.map(place => (
        <Marker
          key={place.id}
          coordinate={{
            latitude: place.latitude,
            longitude: place.longitude,
          }}
          title={place.name}
          description={[place.category, place.cuisine]
            .filter(Boolean)
            .join(' · ')}
          pinColor={colors.button}
        />
      ))}
    </MapView>
  );
};

export default NearbyMap;
