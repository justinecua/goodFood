import axios from 'axios';

// Nearby places come from OpenStreetMap via the Overpass API: no key, no
// signup, and it works the same on Android and iOS. It replaces nothing on
// our own backend - goodFood's restaurants have no "near me" endpoint yet,
// so this is what fills the assisted home screen today.
//
// Public Overpass instances go down and rate-limit independently of each
// other - during development the main one timed out while two mirrors
// returned a bare 500 for every query - so several are tried in turn.
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
  'https://maps.mail.ru/osm/tools/overpass/api/interpreter',
];

// Whichever instance answered last time is tried on its own first, so a
// warm screen makes exactly one request.
let lastGoodEndpoint = null;

// Generous, because on a device iOS tries QUIC before falling back to
// TCP+TLS and the slower mirrors have been seen needing well past 20s.
const ATTEMPT_TIMEOUT_MS = 30000;

// Places people eat at, and the food shops worth suggesting alongside them.
const AMENITIES = [
  'restaurant',
  'cafe',
  'fast_food',
  'food_court',
  'ice_cream',
  'bar',
  'pub',
];

const SHOPS = [
  'bakery',
  'pastry',
  'deli',
  'convenience',
  'supermarket',
  'greengrocer',
  'butcher',
  'seafood',
];

// Human labels for the raw OSM tag values.
const LABELS = {
  restaurant: 'Restaurant',
  cafe: 'Café',
  fast_food: 'Fast food',
  food_court: 'Food court',
  ice_cream: 'Ice cream',
  bar: 'Bar',
  pub: 'Pub',
  bakery: 'Bakery',
  pastry: 'Pastry shop',
  deli: 'Deli',
  convenience: 'Convenience store',
  supermarket: 'Supermarket',
  greengrocer: 'Grocery',
  butcher: 'Butcher',
  seafood: 'Seafood shop',
};

const buildQuery = ({ latitude, longitude, radius }) => {
  const around = `(around:${Math.round(radius)},${latitude},${longitude})`;
  const amenity = `["amenity"~"^(${AMENITIES.join('|')})$"]`;
  const shop = `["shop"~"^(${SHOPS.join('|')})$"]`;

  // `nwr` matches nodes, ways and relations in one statement - half the
  // statements of spelling out node/way separately, and measurably quicker
  // to come back. `out center` gives the ways a single coordinate, so
  // venues mapped as buildings arrive with a usable lat/lon like nodes do.
  return `[out:json][timeout:20];
(
  nwr${amenity}${around};
  nwr${shop}${around};
);
out center 80;`;
};

const addressOf = tags => {
  const parts = [
    [tags['addr:housenumber'], tags['addr:street']].filter(Boolean).join(' '),
    tags['addr:barangay'],
    tags['addr:city'] || tags['addr:town'] || tags['addr:village'],
  ];
  return parts.filter(Boolean).join(', ');
};

const normalise = element => {
  const tags = element.tags || {};
  const latitude = element.lat ?? element.center?.lat;
  const longitude = element.lon ?? element.center?.lon;
  const kind = tags.amenity || tags.shop;

  // Unnamed pins are noise on a recommendation list.
  if (!tags.name || latitude == null || longitude == null) return null;

  return {
    id: `${element.type}/${element.id}`,
    name: tags.name,
    kind,
    category: LABELS[kind] || 'Food',
    isShop: !!tags.shop,
    cuisine: (tags.cuisine || '').replace(/[_;]+/g, ' ').trim(),
    address: addressOf(tags),
    openingHours: tags.opening_hours || '',
    latitude,
    longitude,
  };
};

/**
 * Food places around a point. Returns [] rather than throwing when the area
 * genuinely has nothing; only a transport/parse failure raises.
 */
const parseElements = elements => {
  // Overpass returns the node and the way for the same venue often enough
  // that de-duplicating by name + rounded position is worth it.
  const seen = new Set();
  const places = [];

  for (const element of elements) {
    const place = normalise(element);
    if (!place) continue;

    const key = `${place.name.toLowerCase()}@${place.latitude.toFixed(
      4,
    )},${place.longitude.toFixed(4)}`;
    if (seen.has(key)) continue;

    seen.add(key);
    places.push(place);
  }

  return places;
};

const requestFrom = async (endpoint, body, signal) => {
  const response = await axios.post(endpoint, body, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    timeout: ATTEMPT_TIMEOUT_MS,
    signal,
  });

  const elements = response.data?.elements;
  if (!Array.isArray(elements)) throw new Error('Unexpected response');

  return { endpoint, elements };
};

/**
 * Resolves with the first endpoint to answer successfully, and rejects only
 * once every one of them has failed. Written out rather than using
 * Promise.any so the losing requests get aborted the moment a winner is in.
 */
const firstToAnswer = (endpoints, body) =>
  new Promise((resolve, reject) => {
    const controller = new AbortController();
    let pending = endpoints.length;
    let settled = false;

    endpoints.forEach(endpoint => {
      requestFrom(endpoint, body, controller.signal).then(
        result => {
          if (settled) return;

          settled = true;
          controller.abort();
          resolve(result);
        },
        error => {
          if (settled) return;

          // Worth seeing which mirror gave up and how, since they fail in
          // different ways (timeout, 429, a bare 500, a bad certificate).
          console.log(
            'overpass failed',
            endpoint,
            error.response?.status || error.code,
          );

          pending -= 1;
          if (pending === 0) reject(new Error('all endpoints failed'));
        },
      );
    });
  });

/**
 * Food places around a point. Returns [] rather than throwing when the area
 * genuinely has nothing; only a transport/parse failure raises.
 */
export async function searchNearbyFood({ latitude, longitude, radius = 3000 }) {
  const body = `data=${encodeURIComponent(
    buildQuery({ latitude, longitude, radius }),
  )}`;

  // A known-good mirror gets a solo attempt, so the common case is one
  // request rather than four.
  if (lastGoodEndpoint) {
    try {
      const { elements } = await requestFrom(lastGoodEndpoint, body);
      return parseElements(elements);
    } catch (error) {
      console.log('overpass failed', lastGoodEndpoint, error.code);
    }
  }

  // Otherwise every remaining mirror is tried at once and the first one
  // home wins. They fail independently and slowly, so asking them in turn
  // means waiting out the sum of the dead ones before reaching a live one.
  const rest = OVERPASS_ENDPOINTS.filter(url => url !== lastGoodEndpoint);

  try {
    const { endpoint, elements } = await firstToAnswer(rest, body);
    lastGoodEndpoint = endpoint;
    return parseElements(elements);
  } catch (error) {
    lastGoodEndpoint = null;
    throw new Error(
      'The nearby-places service is busy right now. Please try again in a moment.',
    );
  }
}
