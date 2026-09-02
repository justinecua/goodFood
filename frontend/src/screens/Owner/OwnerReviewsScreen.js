import { useCallback, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Star } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import RatingSummary from '../../components/shared/RatingSummary';
import ReviewCard from '../../components/shared/ReviewCard';
import EmptyState from '../../components/shared/EmptyState';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import styles from '../../styles/DinerDetailScreenStyle';
import colors from '../../constants/colors';
import { getOwnerReviews } from '../../api/services/review';

// What diners have said about the owner's restaurant. Restaurant reviews and
// dish reviews arrive in one list, tagged by kind, so they read as a single
// feed with the dish name shown where there is one.
const OwnerReviewsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getOwnerReviews()
        .then(data => {
          if (!active) return;
          setReviews(data?.reviews ?? []);
          setSummary(data?.summary ?? null);
        })
        .catch(err => console.log('getOwnerReviews failed:', err.message))
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <ScreenHeader
          title="Reviews"
          subtitle={
            reviews.length
              ? `${reviews.length} ${
                  reviews.length === 1 ? 'review' : 'reviews'
                }`
              : undefined
          }
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.button} />
          </View>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No reviews yet"
            message="Once diners rate your restaurant or its dishes, their reviews appear here."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your rating</Text>
              <RatingSummary
                summary={summary}
                average={summary?.overall_rating}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>What diners said</Text>
              <View style={styles.reviewList}>
                {reviews.map(review => (
                  <ReviewCard
                    key={`${review.review_kind}-${review.review_id}`}
                    review={review}
                    rating={review.rating}
                    subtitle={
                      review.review_kind === 'dish'
                        ? `on ${review.dish_name}`
                        : 'on your restaurant'
                    }
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        )}

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default OwnerReviewsScreen;
