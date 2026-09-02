import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import RatingSummary from '../../components/shared/RatingSummary';
import ReviewCard from '../../components/shared/ReviewCard';
import EmptyState from '../../components/shared/EmptyState';
import styles from '../../styles/DinerDetailScreenStyle';
import colors from '../../constants/colors';
import { getRestaurantReviews } from '../../api/services/review';

// Every review on one restaurant, reached from the "See all" link on its page.
const RestaurantReviewsScreen = ({ navigation, route }) => {
  const { restaurantId, restaurantName } = route.params ?? {};

  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [myReview, setMyReview] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getRestaurantReviews(restaurantId)
        .then(data => {
          if (!active) return;
          setReviews(data?.reviews ?? []);
          setSummary(data?.summary ?? null);
          setMyReview(data?.my_review ?? null);
        })
        .catch(err => console.log('getRestaurantReviews failed:', err.message))
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [restaurantId]),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title="Reviews"
        subtitle={restaurantName}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.section}>
              <RatingSummary
                summary={summary}
                average={summary?.overall_rating}
              />
            </View>

            <View style={styles.section}>
              {reviews.length === 0 ? (
                <EmptyState
                  compact
                  icon={Star}
                  title="No reviews yet"
                  message="Be the first to rate this restaurant."
                />
              ) : (
                <View style={styles.reviewList}>
                  {reviews.map(review => (
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

          <View style={styles.rateBar}>
            <TouchableOpacity
              style={styles.rateButton}
              onPress={() =>
                navigation.navigate('WriteReview', {
                  mode: 'restaurant',
                  restaurantId,
                  restaurantName,
                })
              }
            >
              <Star size={16} color="#fff" />
              <Text style={styles.rateButtonText}>
                {myReview ? 'Edit your review' : 'Write a review'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default RestaurantReviewsScreen;
