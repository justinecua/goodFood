// St. Michael's College, Iligan — the map's home base and the fallback
// centre before a live fix arrives.
//
// Nominatim lists two campuses under this name; this is the main one on
// Quezon Avenue in Poblacion (the other is on Miguel Sheker Avenue in
// Tambo, at 8.2394, 124.2498).
export const DEFAULT_PLACE = {
  label: "St. Michael's College, Iligan",
  latitude: 8.228441,
  longitude: 124.2395125,
};

// MapLibre takes coordinates as [longitude, latitude]; react-native-maps
// takes {latitude, longitude}. Both orders are exported so neither map
// implementation has to flip them inline.
export const DEFAULT_CENTER = [DEFAULT_PLACE.longitude, DEFAULT_PLACE.latitude];

export const DEFAULT_ZOOM = 14;
export const USER_ZOOM = 16;

// react-native-maps expresses zoom as a span in degrees.
export const DEFAULT_DELTA = 0.02;
export const USER_DELTA = 0.008;

// MapLibre needs no API key — it just renders whatever vector style you
// point it at. OpenFreeMap serves the OpenStreetMap-based "Liberty" style
// for free with no signup or usage cap; swap this URL for a MapTiler /
// Protomaps key if you ever need an SLA. Only used on Android — iOS renders
// the built-in Apple map, which needs no style and no key either.
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';
