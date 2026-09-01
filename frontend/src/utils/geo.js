const EARTH_RADIUS_M = 6371000;

const toRad = deg => (deg * Math.PI) / 180;

/**
 * Great-circle distance in metres between two {latitude, longitude} points.
 * Good enough for "how far is this restaurant" - the error over a few
 * kilometres is centimetres.
 */
export function distanceMeters(from, to) {
  if (!from || !to) return null;

  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);
  const lat1 = toRad(from.latitude);
  const lat2 = toRad(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.sin(dLon / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);

  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(a));
}

export function formatDistance(meters) {
  if (meters == null) return '';

  // Round to 10 m first, so 999 m doesn't render as "1000 m" right above a
  // neighbour shown as "1.0 km".
  const rounded = Math.round(meters / 10) * 10;
  if (rounded < 1000) return `${rounded} m`;

  return `${(rounded / 1000).toFixed(rounded < 10000 ? 1 : 0)} km`;
}
