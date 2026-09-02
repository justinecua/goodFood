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
  ChevronRight,
  MapPin,
  MessageSquare,
  Star,
  Store,
  UtensilsCrossed,
} from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import StarRating from '../../components/shared/StarRating';
import RatingSummary from '../../components/shared/RatingSummary';
import ReviewCard from '../../components/shared/ReviewCard';
import EmptyState from '../../components/shared/EmptyState';
import styles from '../../styles/DinerDetailScreenStyle';
import colors from '../../constants/colors';
import { mediaUrl } from '../../constants/config';
import { getRestaurantDetails } from '../../api/services/home';
import { getRestaurantReviews } from '../../api/services/review';

// Only the first few reviews are shown inline - the rest are one tap away on
// the reviews screen.
const PREVIEW_COUNT = 3;

const to12h = time => {
  if (!time) return '';

  const [hourText, minute] = String(time).split(':');
  const hour = Number(hourText);
  const suffix = hour >= 12 ? 'PM' : 'AM';

  return `${((hour + 11) % 12) + 1}:${minute} ${suffix}`;
};

const DinerRestaurantScreen = ({ navigation, route }) => {
  const restaurantId = route.params?.restaurantId;

  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [myReview, setMyReview] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      if (!restaurantId) {
        setLoading(false);
        return undefined;
      }

      Promise.all([
        getRestaurantDetails(restaurantId),
        getRestaurantReviews(restaurantId),
      ])
        .then(([detailData, reviewData]) => {
          if (!active) return;

          setDetails(detailData?.error ? null : detailData);
          setReviews(reviewData?.reviews ?? []);
          setSummary(reviewData?.summary ?? null);
          setMyReview(reviewData?.my_review ?? null);
        })
        .catch(err => {
          console.log('getRestaurantDetails failed:', err.message);
          if (active) setDetails(null);
        })
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [restaurantId]),
  );

  const restaurant = details?.restaurant;

  const goToReview = () =>
    navigation.navigate('WriteReview', {
      mode: 'restaurant',
      restaurantId,
      restaurantName: restaurant?.restaurant_name,
      image: restaurant?.restaurant_logo_img,
    });

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title={restaurant?.restaurant_name || 'Restaurant'}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
        </View>
      ) : !restaurant ? (
        <View style={styles.centered}>
          <Store size={30} color={colors.subtext} />
          <Text style={styles.notFound}>
            This restaurant could not be found.
          </Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            {restaurant.restaurant_cover_img ? (
              <Image
                source={{ uri: mediaUrl(restaurant.restaurant_cover_img) }}
                style={styles.cover}
              />
            ) : (
              <View style={[styles.cover, styles.coverEmpty]}>
                <Store size={34} color={colors.subtext} />
              </View>
            )}

            <View style={styles.header}>
              <Text style={styles.title}>{restaurant.restaurant_name}</Text>

              <StarRating
                value={summary?.overall_rating}
                size={14}
                showValue
                count={summary?.review_count}
              />

              {restaurant.restaurant_description ? (
                <Text style={styles.subtitle}>
                  {restaurant.restaurant_description}
                </Text>
              ) : null}

              <View style={styles.metaRow}>
                <MapPin size={13} color={colors.subtext} />
                <Text style={styles.subtitle}>
                  {[restaurant.address, restaurant.city]
                    .filter(Boolean)
                    .join(', ')}
                </Text>
              </View>

              {details.categories.length > 0 && (
                <View style={styles.chipRow}>
                  {details.categories.map(category => (
                    <View key={category.category_id} style={styles.chip}>
                      <Text style={styles.chipText}>
                        {category.category_name}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ratings</Text>
              <RatingSummary
                summary={summary}
                average={summary?.overall_rating}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Menu</Text>
              {details.dishes.length === 0 ? (
                <EmptyState
                  compact
                  icon={UtensilsCrossed}
                  title="No dishes yet"
                  message="This restaurant hasn't added its menu."
                />
              ) : (
                details.dishes.map(dish => (
                  <TouchableOpacity
                    key={dish.dish_id}
                    style={styles.menuRow}
                    onPress={() =>
                      navigation.navigate('DinerDish', {
                        dishId: dish.dish_id,
                        restaurantName: restaurant.restaurant_name,
                      })
                    }
                  >
                    {dish.dish_image_path ? (
                      <Image
                        source={{ uri: mediaUrl(dish.dish_image_path) }}
                        style={styles.menuThumb}
                      />
                    ) : (
                      <View style={[styles.menuThumb, styles.menuThumbEmpty]}>
                        <UtensilsCrossed size={18} color={colors.subtext} />
                      </View>
                    )}

                    <View style={styles.menuBody}>
                      <Text style={styles.menuName}>{dish.dish_name}</Text>
                      <Text style={styles.menuMeta}>
                        {dish.dish_category_name || 'Uncategorised'}
                        {Number(dish.review_count) > 0
                          ? ` · ★ ${Number(dish.average_rating).toFixed(1)} (${
                              dish.review_count
                            })`
                          : ' · Not yet rated'}
                      </Text>
                    </View>

                    <Text style={styles.menuPrice}>₱{dish.dish_price}</Text>
                    <ChevronRight size={16} color={colors.subtextInput} />
                  </TouchableOpacity>
                ))
              )}
            </View>

            {details.operating_hours.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Opening hours</Text>
                {details.operating_hours.map(hours => (
                  <View
                    key={hours.operating_hours_id}
                    style={styles.hoursRow}
                  >
                    <Text style={styles.hoursDay}>{hours.day_of_week}</Text>
                    <Text
                      style={[
                        styles.hoursTime,
                        hours.is_closed && styles.hoursClosed,
                      ]}
                    >
                      {hours.is_closed
                        ? 'Closed'
                        : `${to12h(hours.opening_time)} – ${to12h(
                            hours.closing_time,
                          )}`}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Reviews</Text>
                {reviews.length > PREVIEW_COUNT && (
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('RestaurantReviews', {
                        restaurantId,
                        restaurantName: restaurant.restaurant_name,
                      })
                    }
                  >
                    <Text style={styles.sectionLink}>
                      See all {reviews.length}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              {reviews.length === 0 ? (
                <EmptyState
                  compact
                  icon={Star}
                  title="No reviews yet"
                  message="Be the first to rate this restaurant."
                />
              ) : (
                <View style={styles.reviewList}>
                  {reviews.slice(0, PREVIEW_COUNT).map(review => (
                    <ReviewCard
                      key={review.res_review_id}
                      review={review}
                      rating={review.overall_rating}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={[styles.rateBar, styles.rateBarRow]}>
            <TouchableOpacity style={styles.rateButton} onPress={goToReview}>
              <Star size={16} color="#fff" />
              <Text style={styles.rateButtonText}>
                {myReview ? 'Edit your review' : 'Rate this restaurant'}
              </Text>
            </TouchableOpacity>

            {/* No conversation id yet - the thread is created (or reused)
                when the first message is sent. */}
            <TouchableOpacity
              style={styles.messageButton}
              onPress={() =>
                navigation.navigate('MessageThread', {
                  restaurantId,
                  title: restaurant.restaurant_name,
                })
              }
            >
              <MessageSquare size={16} color={colors.button} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default DinerRestaurantScreen;
