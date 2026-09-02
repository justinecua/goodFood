import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Store,
  Phone,
  MapPin,
  SquarePen,
  Clock,
  Tag,
  GitBranch,
  ChevronRight,
  UtensilsCrossed,
  Star,
} from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import styles from '../../styles/MyRestaurantScreenStyle';
import colors from '../../constants/colors';
import { getRestaurantInfo } from '../../api/services/home';
import { mediaUrl } from '../../constants/config';

// One "label / value" line. Falls back to a placeholder when the value is empty.
const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={[styles.detailValue, !value && styles.detailValueEmpty]}>
      {value ? String(value) : 'Not provided'}
    </Text>
  </View>
);

// A tappable row that opens another screen.
const NavRow = ({ icon: Icon, label, count, onPress }) => (
  <TouchableOpacity style={styles.navRow} onPress={onPress}>
    <View style={styles.navRowIcon}>
      <Icon size={16} color={colors.button} />
    </View>
    <Text style={styles.navRowLabel}>{label}</Text>
    {count != null ? <Text style={styles.navRowCount}>{count}</Text> : null}
    <ChevronRight size={18} color={colors.subtextInput} />
  </TouchableOpacity>
);

const formatDate = value => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
};

// "13:30:00" -> "1:30 PM".
const formatTime12 = value => {
  if (!value) return '';
  const [h, m = '00'] = String(value).split(':');
  let hour = parseInt(h, 10);
  if (Number.isNaN(hour)) return '';
  const period = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m.slice(0, 2)} ${period}`;
};

const MyRestaurantScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [location, setLocation] = useState(null);
  const [operatingHours, setOperatingHours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);

  // Reload every time the screen comes into focus (e.g. after editing).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getRestaurantInfo()
        .then(info => {
          if (!active) return;
          setRestaurant(info?.restaurant ?? null);
          setLocation(info?.location ?? null);
          setOperatingHours(info?.operating_hours ?? []);
          setCategories(info?.categories ?? []);
          setBranches(info?.branches ?? []);
        })
        .catch(err => {
          console.log('getRestaurantInfo failed:', err.message);
          if (active) {
            setRestaurant(null);
            setLocation(null);
          }
        })
        .finally(() => {
          if (active) setLoading(false);
        });

      return () => {
        active = false;
      };
    }, []),
  );

  const goToEdit = () => navigation.navigate('RestaurantInformationScreen');
  const addedOn = formatDate(restaurant?.created_at);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.heading}>My Restaurant</Text>
        </View>

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.button} />
          </View>
        ) : !restaurant ? (
          <View style={styles.centered}>
            <View style={styles.emptyIconWrap}>
              <Store size={32} color={colors.subtext} />
            </View>
            <Text style={styles.emptyTitle}>No information yet</Text>
            <Text style={styles.emptyText}>
              You haven&apos;t added your restaurant details yet.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={goToEdit}>
              <Text style={styles.primaryButtonText}>
                Add Restaurant Information
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.coverWrap}>
              {restaurant.restaurant_cover_img ? (
                <Image
                  source={{ uri: mediaUrl(restaurant.restaurant_cover_img) }}
                  style={styles.cover}
                />
              ) : (
                <View style={[styles.cover, styles.coverEmpty]}>
                  <Text style={styles.coverEmptyText}>No cover photo</Text>
                </View>
              )}

              <View style={styles.logoWrap}>
                {restaurant.restaurant_logo_img ? (
                  <Image
                    source={{ uri: mediaUrl(restaurant.restaurant_logo_img) }}
                    style={styles.logo}
                  />
                ) : (
                  <View style={[styles.logo, styles.logoEmpty]}>
                    <Store size={22} color={colors.subtext} />
                  </View>
                )}
              </View>
            </View>

            <Text style={styles.name}>{restaurant.restaurant_name}</Text>
            <Text style={styles.description}>
              {restaurant.restaurant_description || 'No description provided.'}
            </Text>

            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Phone size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Contact</Text>
              </View>
              <DetailRow label="Address" value={restaurant.address} />
              <DetailRow
                label="Contact Number"
                value={restaurant.contact_number}
              />
              <DetailRow label="Email" value={restaurant.email} />
            </View>

            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <MapPin size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Location</Text>
              </View>
              <DetailRow label="City" value={location?.city} />
              <DetailRow label="Province" value={location?.province} />
              <DetailRow label="Region" value={location?.region} />
              <DetailRow label="Country" value={location?.country} />
              <DetailRow label="Latitude" value={location?.latitude} />
              <DetailRow label="Longitude" value={location?.longitude} />
            </View>

            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Clock size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Operating Hours</Text>
              </View>
              {operatingHours.length === 0 ? (
                <Text style={styles.cardEmptyText}>No hours set.</Text>
              ) : (
                operatingHours.map(row => (
                  <View key={row.operating_hours_id} style={styles.detailRow}>
                    <Text style={styles.detailLabel}>{row.day_of_week}</Text>
                    <Text style={styles.detailValue}>
                      {row.is_closed
                        ? 'Closed'
                        : `${formatTime12(row.opening_time)} – ${formatTime12(
                            row.closing_time,
                          )}`}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Tag size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Cuisine Categories</Text>
              </View>
              {categories.length === 0 ? (
                <Text style={styles.cardEmptyText}>No categories added.</Text>
              ) : (
                <View style={styles.chipWrap}>
                  {categories.map(category => (
                    <View key={category.category_id} style={styles.chip}>
                      <Text style={styles.chipText}>
                        {category.category_name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <UtensilsCrossed size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Manage</Text>
              </View>
              <NavRow
                icon={UtensilsCrossed}
                label="Menu"
                onPress={() => navigation.navigate('Menu')}
              />
              <NavRow
                icon={Tag}
                label="Dish Categories"
                onPress={() => navigation.navigate('DishCategories')}
              />
              <NavRow
                icon={GitBranch}
                label="Branches"
                count={branches.length || null}
                onPress={() => navigation.navigate('Branches')}
              />
              <NavRow
                icon={Star}
                label="Reviews"
                onPress={() => navigation.navigate('OwnerReviews')}
              />
            </View>

            <TouchableOpacity style={styles.editButton} onPress={goToEdit}>
              <SquarePen size={16} color={colors.button} />
              <Text style={styles.editButtonText}>Edit Information</Text>
            </TouchableOpacity>

            {addedOn ? (
              <Text style={styles.footnote}>Added on {addedOn}</Text>
            ) : null}
          </ScrollView>
        )}

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default MyRestaurantScreen;
