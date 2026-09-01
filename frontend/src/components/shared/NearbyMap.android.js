import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  Map,
  Camera,
  Marker,
  NativeUserLocation,
} from '@maplibre/maplibre-react-native';
import colors from '../../constants/colors';
import {
  MAP_STYLE_URL,
  DEFAULT_CENTER,
  DEFAULT_ZOOM,
  USER_ZOOM,
} from '../../constants/map';

// Android renders MapLibre against a keyless OpenStreetMap style — Apple
// Maps has no Android equivalent and Google Maps would need a billed key.
// Same props as NearbyMap.ios.js; Metro picks the right file per platform.
//
// Note the coordinate order: MapLibre wants [longitude, latitude].
const NearbyMap = ({ center, places = [], style, followUser = true }) => {
  const cameraRef = useRef(null);
  const centerLngLat = center
    ? [center.longitude, center.latitude]
    : DEFAULT_CENTER;

  // Re-centre whenever the fix moves, so the map tracks the diner live.
  useEffect(() => {
    if (!center) return;

    cameraRef.current?.flyTo({
      center: [center.longitude, center.latitude],
      zoom: USER_ZOOM,
      duration: 600,
    });
  }, [center]);

  return (
    <Map style={style} mapStyle={MAP_STYLE_URL}>
      <Camera
        ref={cameraRef}
        initialViewState={{
          center: centerLngLat,
          zoom: center ? USER_ZOOM : DEFAULT_ZOOM,
        }}
      />

      {followUser ? <NativeUserLocation /> : null}

      {places.map(place => (
        <Marker
          key={place.id}
          id={place.id}
          lngLat={[place.longitude, place.latitude]}
        >
          <View style={styles.pin}>
            <View style={styles.pinDot} />
            <Text style={styles.pinLabel} numberOfLines={1}>
              {place.name}
            </Text>
          </View>
        </Marker>
      ))}
    </Map>
  );
};

const styles = StyleSheet.create({
  pin: {
    alignItems: 'center',
    maxWidth: 120,
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: colors.container_bg2,
    backgroundColor: colors.button,
  },
  pinLabel: {
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: colors.container_bg2,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 9,
    color: colors.maintext,
  },
});

export default NearbyMap;
