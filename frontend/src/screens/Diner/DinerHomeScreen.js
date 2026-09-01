import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { UtensilsCrossed, Store, Sparkles } from 'lucide-react-native';
import EmptyState from '../../components/shared/EmptyState';
import styles from '../../styles/RestaurantHomeScreenStyles';
import colors from '../../constants/colors';
import ImageSource from '../../constants/imageSource';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Rankings aren't wired to the backend yet, so both sections start empty and
// show their empty state. The cards below render as soon as the API fills
// these in.
const chunk = (items, size) => {
  const rows = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
};

const DinerHomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [topDishes] = useState([]);
  const [topRestaurants] = useState([]);

  useEffect(() => {
    AsyncStorage.getItem('user').then(res => {
      if (res) {
        setUser(JSON.parse(res));
      }
    });
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <ScrollView>
          <View style={styles.background}>
            <View style={styles.upperContainer}>
              <View>
                <Text style={styles.textStyle}>Hello, {user?.username}</Text>
                <Text style={styles.textStyle1}>
                  Brgy. Poblacion, Quezon Avenue, Iligan ...
                </Text>
              </View>
              <View style={styles.upperActions}>
                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() =>
                    navigation.replace('DinerHomeMode', { change: true })
                  }
                  hitSlop={styles.hitSlop}
                >
                  <Sparkles size={18} color={colors.button} />
                </TouchableOpacity>

                <Image
                  style={styles.userProfile}
                  source={ImageSource.userProfile}
                />
              </View>
            </View>

            <LinearGradient
              colors={['#abdfc7', '#2e8b57']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 0.5 }}
              style={styles.cardBanner}
            >
              <Image
                style={styles.cardBannerImage}
                source={ImageSource.cardBannerImage}
              />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerText}>be part of</Text>
                <Image
                  style={styles.goodFoodText}
                  source={ImageSource.goodFoodText}
                />
                {/* <Text style={styles.bannerText1}>goodfood</Text> */}
                <TouchableOpacity
                  style={styles.bannerButton}
                  onPress={() => navigation.navigate('Subscription')}
                >
                  <Text style={styles.bannerButtonText}>Subscribe Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder="Search foods, dishes or restaurants"
                placeholderTextColor={colors.subtext}
                style={styles.searchBarText}
              />
              <TouchableOpacity>
                <Image
                  style={styles.searchLens}
                  source={ImageSource.searchLens}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Top Dishes</Text>
              <TouchableOpacity>
                <Text style={styles.sectionHeaderText1}>See all</Text>
              </TouchableOpacity>
            </View>

            {topDishes.length === 0 ? (
              <View style={styles.emptySection}>
                <EmptyState
                  compact
                  icon={UtensilsCrossed}
                  title="No top dishes yet"
                  message="Once diners start rating dishes, the highest-rated ones show up here."
                />
              </View>
            ) : (
              <View style={styles.dishContainer}>
                {chunk(topDishes, 2).map((row, rowIndex) => (
                  <View
                    key={`dish-row-${rowIndex}`}
                    style={styles.dishSubContainer}
                  >
                    {row.map(dish => (
                      <View key={dish.id} style={styles.dishCard}>
                        <Image
                          style={styles.dishImage}
                          source={{ uri: dish.image }}
                        />
                        <View style={styles.dishUnderline} />
                        <Text style={styles.dishText}>{dish.name}</Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Top Restaurants</Text>
              <TouchableOpacity>
                <Text style={styles.sectionHeaderText1}>See all</Text>
              </TouchableOpacity>
            </View>

            {topRestaurants.length === 0 ? (
              <View style={[styles.emptySection, styles.emptySectionLast]}>
                <EmptyState
                  compact
                  icon={Store}
                  title="No top restaurants yet"
                  message="Restaurant rankings appear here as reviews come in."
                />
              </View>
            ) : (
              <View style={styles.restaurantContainer}>
                {chunk(topRestaurants, 3).map((row, rowIndex) => (
                  <View
                    key={`restaurant-row-${rowIndex}`}
                    style={styles.restaurantSubContainer}
                  >
                    {row.map(restaurant => (
                      <View key={restaurant.id} style={styles.restaurantCard}>
                        <Image
                          style={styles.restaurantCardImage}
                          source={{ uri: restaurant.photo }}
                        />
                        <Text style={styles.restaurantText}>
                          {restaurant.name}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom NavBar */}
        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerHomeScreen;
