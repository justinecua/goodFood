import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MapPin, Sparkles } from 'lucide-react-native';
import styles from '../../styles/RestaurantHomeScreenStyles';
import colors from '../../constants/colors';
import ImageSource from '../../constants/imageSource';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import TopPicks from '../../components/shared/TopPicks';
import { useTopPicks } from '../../hooks/useTopPicks';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DinerHomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const { loading, dishes, restaurants, reviews, located } = useTopPicks();

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

                {/* Rankings are app-wide either way - location only adds
                    the "how far away" line to each card. */}
                {located ? null : (
                  <TouchableOpacity
                    style={styles.locationRow}
                    onPress={() =>
                      navigation.navigate('LocationPermission', {
                        next: 'DinerHome',
                      })
                    }
                  >
                    <MapPin size={12} color={colors.button} />
                    <Text style={styles.locationLink}>
                      Share your location to see distances
                    </Text>
                  </TouchableOpacity>
                )}
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

            <TopPicks
              loading={loading}
              dishes={dishes}
              restaurants={restaurants}
              reviews={reviews}
              onSelectDish={dish =>
                navigation.navigate('DinerDish', {
                  dishId: dish.dish_id,
                  restaurantName: dish.restaurant_name,
                })
              }
              onSelectRestaurant={restaurant =>
                navigation.navigate('DinerRestaurant', {
                  restaurantId: restaurant.restaurant_id,
                })
              }
              onSelectReview={review =>
                review.review_kind === 'dish'
                  ? navigation.navigate('DinerDish', {
                      dishId: review.dish_id,
                      restaurantName: review.restaurant_name,
                    })
                  : navigation.navigate('RestaurantReviews', {
                      restaurantId: review.restaurant_id,
                      restaurantName: review.restaurant_name,
                    })
              }
              onSeeAllRestaurants={() => navigation.navigate('DinerMapScreen')}
            />
          </View>
        </ScrollView>

        {/* Bottom NavBar */}
        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerHomeScreen;
