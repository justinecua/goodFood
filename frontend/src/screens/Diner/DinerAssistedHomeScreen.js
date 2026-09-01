import { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Search,
  MapPin,
  Compass,
  UtensilsCrossed,
  LayoutGrid,
  RefreshCw,
} from 'lucide-react-native';
import styles from '../../styles/DinerAssistedHomeScreenStyle';
import colors from '../../constants/colors';
import EmptyState from '../../components/shared/EmptyState';
import NearbyMap from '../../components/shared/NearbyMap';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { useNearbyPlaces } from '../../hooks/useNearbyPlaces';
import { formatDistance } from '../../utils/geo';

// The chips narrow the list down by what the place actually is. "All" keeps
// everything the search returned.
const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'restaurant', label: 'Restaurants', kinds: ['restaurant'] },
  { key: 'cafe', label: 'Cafés', kinds: ['cafe'] },
  { key: 'fast', label: 'Fast food', kinds: ['fast_food', 'food_court'] },
  { key: 'sweet', label: 'Sweets', kinds: ['ice_cream', 'bakery', 'pastry'] },
  { key: 'store', label: 'Food stores', shopsOnly: true },
];

// Pin count is capped so a dense area doesn't put a hundred annotations on
// the map; the full set is still in the list below it.
const MAX_PINS = 40;

const matchesFilter = (place, filter) => {
  if (filter.key === 'all') return true;
  if (filter.shopsOnly) return place.isShop;
  return filter.kinds.includes(place.kind);
};

const matchesQuery = (place, query) => {
  if (!query) return true;

  const haystack = [place.name, place.cuisine, place.category, place.address]
    .join(' ')
    .toLowerCase();

  // Every word has to appear somewhere, so "korean bbq" narrows rather than
  // widens the way a plain OR would.
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every(word => haystack.includes(word));
};

const DinerAssistedHomeScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [filterKey, setFilterKey] = useState('all');

  const {
    origin,
    places,
    isLocating,
    isLoading,
    error,
    locationDenied,
    isWide,
    reload,
    retryLocation,
    widen,
  } = useNearbyPlaces();

  const filter = FILTERS.find(f => f.key === filterKey) || FILTERS[0];

  const results = useMemo(
    () =>
      places.filter(
        place => matchesFilter(place, filter) && matchesQuery(place, query),
      ),
    [places, filter, query],
  );

  const busy = isLocating || isLoading;

  const renderPlace = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardIcon}>
        <UtensilsCrossed size={18} color={colors.button} />
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.cardMeta} numberOfLines={1}>
          {[item.category, item.cuisine].filter(Boolean).join(' · ')}
        </Text>
        {item.address ? (
          <Text style={styles.cardAddress} numberOfLines={1}>
            {item.address}
          </Text>
        ) : null}
      </View>

      <View style={styles.cardDistance}>
        <MapPin size={13} color={colors.subtext} />
        <Text style={styles.cardDistanceText}>
          {formatDistance(item.distance)}
        </Text>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (busy) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
          <Text style={styles.centeredText}>
            {isLocating ? 'Finding your location…' : 'Looking for places…'}
          </Text>
        </View>
      );
    }

    if (locationDenied) {
      return (
        <EmptyState
          icon={Compass}
          title="Location is off"
          message="Turn location on for goodFood in your device settings, then try again — suggestions are based on where you are."
          actionLabel="Try again"
          onAction={retryLocation}
        />
      );
    }

    if (error) {
      return (
        <EmptyState
          icon={RefreshCw}
          title="Could not load places"
          message={error}
          actionLabel="Retry"
          onAction={reload}
        />
      );
    }

    if (query || filterKey !== 'all') {
      return (
        <EmptyState
          icon={Search}
          title="Nothing matches that"
          message="Try a different craving, or clear the filter to see everything nearby."
        />
      );
    }

    return (
      <EmptyState
        icon={UtensilsCrossed}
        title="Nothing found nearby"
        message={
          isWide
            ? 'There are no mapped food places around you yet.'
            : 'No food places within 3 km. Try widening the search.'
        }
        actionLabel={isWide ? 'Retry' : 'Search wider'}
        onAction={isWide ? reload : widen}
      />
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.heading}>Where do you want to eat?</Text>
            <Text style={styles.subheading}>
              {busy
                ? 'Checking what is around you…'
                : `${results.length} food ${
                    results.length === 1 ? 'place' : 'places'
                  } near you`}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() =>
              navigation.replace('DinerHomeMode', { change: true })
            }
            hitSlop={styles.hitSlop}
          >
            <LayoutGrid size={18} color={colors.button} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchBar}>
          <Search size={18} color={colors.subtext} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Sisig, ramen, coffee, a place name…"
            placeholderTextColor={colors.subtextInput}
            style={styles.searchInput}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query ? (
            <TouchableOpacity onPress={() => setQuery('')}>
              <Text style={styles.clear}>Clear</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <FlatList
          horizontal
          data={FILTERS}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
          style={styles.chipRow}
          contentContainerStyle={styles.chipRowContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chip, item.key === filterKey && styles.chipActive]}
              onPress={() => setFilterKey(item.key)}
            >
              <Text
                style={[
                  styles.chipText,
                  item.key === filterKey && styles.chipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        <View style={styles.mapWrap}>
          <NearbyMap
            style={styles.map}
            center={origin}
            places={results.slice(0, MAX_PINS)}
          />
        </View>

        <FlatList
          data={results}
          keyExtractor={item => item.id}
          renderItem={renderPlace}
          style={styles.results}
          contentContainerStyle={
            results.length === 0 ? styles.listEmpty : styles.list
          }
          ListEmptyComponent={renderEmpty}
          keyboardShouldPersistTaps="handled"
        />

        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerAssistedHomeScreen;
