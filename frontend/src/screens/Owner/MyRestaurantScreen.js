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
  Plus,
  UtensilsCrossed,
} from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import styles from '../../styles/MyRestaurantScreenStyle';
import colors from '../../constants/colors';
import { getRestaurantInfo } from '../../api/services/home';
import { getDishes } from '../../api/services/dish';
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

// "09:00:00" -> "09:00".
const shortTime = value => (value ? String(value).slice(0, 5) : '');

const MyRestaurantScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState(null);
  const [location, setLocation] = useState(null);
  const [operatingHours, setOperatingHours] = useState([]);
  const [categories, setCategories] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dishes, setDishes] = useState([]);

  // Reload every time the screen comes into focus (e.g. after editing / adding).
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      Promise.all([
        getRestaurantInfo().catch(err => {
          console.log('getRestaurantInfo failed:', err.message);
          return null;
        }),
        getDishes().catch(err => {
          console.log('getDishes failed:', err.message);
          return null;
        }),
      ])
        .then(([info, dishData]) => {
          if (!active) return;
          setRestaurant(info?.restaurant ?? null);
          setLocation(info?.location ?? null);
          setOperatingHours(info?.operating_hours ?? []);
          setCategories(info?.categories ?? []);
          setBranches(info?.branches ?? []);
          setDishes(dishData?.dishes ?? []);
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
                        : `${shortTime(row.opening_time)} – ${shortTime(
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
                <GitBranch size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Branches</Text>
              </View>
              {branches.length === 0 ? (
                <Text style={styles.cardEmptyText}>No branches added.</Text>
              ) : (
                branches.map(branch => (
                  <View key={branch.branch_id} style={styles.branchBlock}>
                    <Text style={styles.branchName}>{branch.branch_name}</Text>
                    <Text style={styles.branchLine}>{branch.address}</Text>
                    <Text style={styles.branchLine}>
                      {branch.contact_number}
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <UtensilsCrossed size={16} color={colors.button} />
                <Text style={styles.cardTitle}>Menu</Text>
              </View>

              <View style={styles.menuButtonRow}>
                <TouchableOpacity
                  style={styles.menuButton}
                  onPress={() => navigation.navigate('AddDish')}
                >
                  <Plus size={15} color="#fff" />
                  <Text style={styles.menuButtonText}>Add Dish</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.menuButton, styles.menuButtonOutline]}
                  onPress={() => navigation.navigate('AddDishCategory')}
                >
                  <Plus size={15} color={colors.button} />
                  <Text
                    style={[
                      styles.menuButtonText,
                      styles.menuButtonTextOutline,
                    ]}
                  >
                    Dish Category
                  </Text>
                </TouchableOpacity>
              </View>

              {dishes.length === 0 ? (
                <Text style={styles.cardEmptyText}>No dishes yet.</Text>
              ) : (
                dishes.map(dish => (
                  <View key={dish.dish_id} style={styles.dishRow}>
                    {dish.dish_image_path ? (
                      <Image
                        source={{ uri: mediaUrl(dish.dish_image_path) }}
                        style={styles.dishThumb}
                      />
                    ) : (
                      <View style={[styles.dishThumb, styles.dishThumbEmpty]}>
                        <UtensilsCrossed size={16} color={colors.subtext} />
                      </View>
                    )}
                    <View style={styles.dishTextWrap}>
                      <Text style={styles.dishName}>{dish.dish_name}</Text>
                      <Text style={styles.dishMeta}>
                        {dish.dish_category_name || 'Uncategorised'}
                        {dish.is_available ? '' : ' · Unavailable'}
                      </Text>
                    </View>
                    <Text style={styles.dishPrice}>{dish.dish_price}</Text>
                  </View>
                ))
              )}
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
