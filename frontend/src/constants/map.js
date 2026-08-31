// MapLibre needs no API key — it just renders whatever vector style you point
// it at. OpenFreeMap serves the OpenStreetMap-based "Liberty" style for free
// with no signup or usage cap; swap this URL for a MapTiler / Protomaps key if
// you ever need an SLA.
export const MAP_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

// Iligan City — where the map opens before the first fix arrives.
// MapLibre coordinates are [longitude, latitude].
export const DEFAULT_CENTER = [124.2452, 8.228];
export const DEFAULT_ZOOM = 12;

// Closer in once we actually know where the user is.
export const USER_ZOOM = 15;
