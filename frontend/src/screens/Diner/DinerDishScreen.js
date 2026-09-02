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
import { Star, UtensilsCrossed } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import StarRating from '../../components/shared/StarRating';
import RatingSummary from '../../components/shared/RatingSummary';
import ReviewCard from '../../components/shared/ReviewCard';
import EmptyState from '../../components/shared/EmptyState';
import styles from '../../styles/DinerDetailScreenStyle';
import colors from '../../constants/colors';
import { mediaUrl } from '../../constants/config';
import { getDish } from '../../api/services/dish';
import { getDishReviews } from '../../api/services/review';

const Section = ({ title, children }) =>
  children ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{children}</Text>
    </View>
  ) : null;

// The diner's view of a single dish: what it is, how it's rated, and the way
// in to rating it themselves.
const DinerDishScreen = ({ navigation, route }) => {
  const dishId = route.params?.dishId;

  const [loading, setLoading] = useState(true);
  const [dish, setDish] = useState(null);
  const [image, setImage] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState(null);
  const [myReview, setMyReview] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      if (!dishId) {
        setLoading(false);
        return undefined;
      }

      Promise.all([getDish(dishId), getDishReviews(dishId)])
        .then(([dishData, reviewData]) => {
          if (!active) return;

          setDish(dishData?.dish ?? null);
          setImage(dishData?.images?.[0]?.dish_image_path ?? null);
          setReviews(reviewData?.reviews ?? []);
          setSummary(reviewData?.summary ?? null);
          setMyReview(reviewData?.my_review ?? null);
        })
        .catch(err => {
          console.log('getDish failed:', err.message);
          if (active) setDish(null);
        })
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [dishId]),
  );

  // The restaurant name comes from the dish itself, but a caller that already
  // knows it (the restaurant page) passes it through so the header is right
  // while the request is still in flight.
  const restaurantName =
    dish?.restaurant_name || route.params?.restaurantName || '';

  const tags = dish
    ? [
        dish.is_signature && 'Signature',
        dish.is_best_seller && 'Best seller',
        !dish.is_available && 'Unavailable',
      ].filter(Boolean)
    : [];

  const goToReview = () =>
    navigation.navigate('WriteReview', {
      mode: 'dish',
      dishId,
      dishName: dish?.dish_name,
      restaurantName,
      image,
    });

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title={dish?.dish_name || 'Dish'}
        subtitle={restaurantName}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
        </View>
      ) : !dish ? (
        <View style={styles.centered}>
          <UtensilsCrossed size={30} color={colors.subtext} />
          <Text style={styles.notFound}>This dish could not be found.</Text>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scroll}>
            {image ? (
              <Image source={{ uri: mediaUrl(image) }} style={styles.cover} />
            ) : (
              <View style={[styles.cover, styles.coverEmpty]}>
                <UtensilsCrossed size={34} color={colors.subtext} />
              </View>
            )}

            <View style={styles.header}>
              <View style={styles.titleRow}>
                <Text style={styles.title}>{dish.dish_name}</Text>
                <Text style={styles.price}>₱{dish.dish_price}</Text>
              </View>

              <StarRating
                value={summary?.rating}
                size={14}
                showValue
                count={summary?.review_count}
              />

              <Text style={styles.subtitle}>
                {dish.dish_category_name || 'Uncategorised'}
                {restaurantName ? ` · ${restaurantName}` : ''}
              </Text>

              {tags.length > 0 && (
                <View style={styles.chipRow}>
                  {tags.map(tag => (
                    <View
                      key={tag}
                      style={[
                        styles.chip,
                        tag === 'Unavailable' && styles.chipMuted,
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          tag === 'Unavailable' && styles.chipTextMuted,
                        ]}
                      >
                        {tag}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <Section title="Description">{dish.dish_description}</Section>
            <Section title="How to eat it">{dish.how_to_eat}</Section>
            <Section title="Good to know">{dish.preparation_notes}</Section>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Ratings</Text>
              <RatingSummary summary={summary} average={summary?.rating} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                Reviews {reviews.length ? `(${reviews.length})` : ''}
              </Text>

              {reviews.length === 0 ? (
                <EmptyState
                  compact
                  icon={Star}
                  title="No reviews yet"
                  message="Be the first to rate this dish."
                />
              ) : (
                <View style={styles.reviewList}>
                  {reviews.map(review => (
                    <ReviewCard
                      key={review.dish_review_id}
                      review={review}
                      rating={review.rating}
                    />
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={styles.rateBar}>
            <TouchableOpacity style={styles.rateButton} onPress={goToReview}>
              <Star size={16} color="#fff" />
              <Text style={styles.rateButtonText}>
                {myReview ? 'Edit your rating' : 'Rate this dish'}
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default DinerDishScreen;
