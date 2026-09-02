import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { MessageSquare, Star, Store, UtensilsCrossed } from 'lucide-react-native';
import EmptyState from './EmptyState';
import ReviewCard from './ReviewCard';
import styles from '../../styles/RestaurantHomeScreenStyles';
import colors from '../../constants/colors';
import { mediaUrl } from '../../constants/config';

// The three sections shared by the diner and owner home screens: top dishes,
// top restaurants, and the latest reviews.
//
// These rank across all of goodFood, not just the user's surroundings - the
// point of the home screen is to show the best the app has to offer. When the
// user has shared their location each card also says how far away it is, but
// that's information, not a filter.

const chunk = (items, size) => {
  const rows = [];
  for (let i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
};

// "1.2 km" close by, "18 km" further out - a decimal is only useful nearby.
const distanceLabel = km => {
  if (km === null || km === undefined) return null;

  const value = Number(km);
  if (Number.isNaN(value)) return null;

  return value < 10 ? `${value.toFixed(1)} km` : `${Math.round(value)} km`;
};

const Rating = ({ value, count }) => (
  <View style={styles.ratingRow}>
    <Star size={11} color={colors.button} fill={colors.button} />
    <Text style={styles.ratingText}>{Number(value).toFixed(1)}</Text>
    {count ? <Text style={styles.ratingCount}>({count})</Text> : null}
  </View>
);

// Heading + caption + body. The heading is rendered even while the data is
// still loading, so the screen never looks like the section is missing.
const Section = ({ title, caption, onSeeAll, loading, children }) => (
  <>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
      {onSeeAll ? (
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={styles.sectionHeaderText1}>See all</Text>
        </TouchableOpacity>
      ) : null}
    </View>
    <Text style={styles.textStyle1}>{caption}</Text>

    {loading ? (
      <View style={styles.sectionLoading}>
        <ActivityIndicator size="small" color={colors.button} />
      </View>
    ) : (
      children
    )}
  </>
);

const TopPicks = ({
  loading,
  dishes = [],
  restaurants = [],
  reviews = [],
  onSelectDish,
  onSelectRestaurant,
  onSelectReview,
  onSeeAllDishes,
  onSeeAllRestaurants,
  onSeeAllReviews,
}) => (
  <>
    <Section
      title="Top Dishes"
      caption="Highest rated on goodFood"
      loading={loading}
      onSeeAll={dishes.length > 0 ? onSeeAllDishes : null}
    >
      {dishes.length === 0 ? (
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
          {chunk(dishes, 2).map((row, rowIndex) => (
            <View key={`dish-row-${rowIndex}`} style={styles.dishSubContainer}>
              {row.map((dish, columnIndex) => (
                <TouchableOpacity
                  key={dish.dish_id}
                  style={styles.dishCard}
                  onPress={() => onSelectDish && onSelectDish(dish)}
                >
                  {dish.dish_image_path ? (
                    <Image
                      style={styles.dishImage}
                      source={{ uri: mediaUrl(dish.dish_image_path) }}
                    />
                  ) : (
                    <View style={styles.dishImageEmpty}>
                      <UtensilsCrossed size={26} color={colors.subtext} />
                    </View>
                  )}

                  <View style={styles.rankBadge}>
                    <Text style={styles.rankBadgeText}>
                      #{rowIndex * 2 + columnIndex + 1}
                    </Text>
                  </View>

                  <View style={styles.dishUnderline} />

                  <View style={styles.dishCardBody}>
                    <Text style={styles.dishText} numberOfLines={1}>
                      {dish.dish_name}
                    </Text>
                    <Rating
                      value={dish.average_rating}
                      count={dish.review_count}
                    />
                    <Text style={styles.dishMeta} numberOfLines={1}>
                      {[dish.restaurant_name, distanceLabel(dish.distance_km)]
                        .filter(Boolean)
                        .join(' · ')}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Keeps a trailing odd card left-aligned instead of centred. */}
              {row.length === 1 && <View style={styles.dishCardSpacer} />}
            </View>
          ))}
        </View>
      )}
    </Section>

    <Section
      title="Top Restaurants"
      caption="Highest rated on goodFood"
      loading={loading}
      onSeeAll={restaurants.length > 0 ? onSeeAllRestaurants : null}
    >
      {restaurants.length === 0 ? (
        <View style={styles.emptySection}>
          <EmptyState
            compact
            icon={Store}
            title="No top restaurants yet"
            message="Restaurant rankings appear here as reviews come in."
          />
        </View>
      ) : (
        <View style={styles.restaurantContainer}>
          {chunk(restaurants, 3).map((row, rowIndex) => (
            <View
              key={`restaurant-row-${rowIndex}`}
              style={styles.restaurantSubContainer}
            >
              {row.map(restaurant => (
                <TouchableOpacity
                  key={restaurant.restaurant_id}
                  style={styles.restaurantCard}
                  onPress={() =>
                    onSelectRestaurant && onSelectRestaurant(restaurant)
                  }
                >
                  {restaurant.restaurant_logo_img ? (
                    <Image
                      style={styles.restaurantCardImage}
                      source={{ uri: mediaUrl(restaurant.restaurant_logo_img) }}
                    />
                  ) : (
                    <View style={styles.restaurantCardImageEmpty}>
                      <Store size={22} color={colors.subtext} />
                    </View>
                  )}

                  <Text style={styles.restaurantText} numberOfLines={1}>
                    {restaurant.restaurant_name}
                  </Text>
                  <Rating
                    value={restaurant.average_rating}
                    count={restaurant.review_count}
                  />
                  <Text style={styles.restaurantMeta} numberOfLines={1}>
                    {distanceLabel(restaurant.distance_km) ||
                      restaurant.city ||
                      ''}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Pad the last row so three-up columns stay put. */}
              {row.length < 3 &&
                Array.from({ length: 3 - row.length }).map((_, index) => (
                  <View
                    key={`restaurant-spacer-${index}`}
                    style={styles.restaurantCardSpacer}
                  />
                ))}
            </View>
          ))}
        </View>
      )}
    </Section>

    <Section
      title="Latest Reviews"
      caption="What diners on goodFood are saying"
      loading={loading}
      onSeeAll={reviews.length > 0 ? onSeeAllReviews : null}
    >
      {reviews.length === 0 ? (
        <View style={[styles.emptySection, styles.emptySectionLast]}>
          <EmptyState
            compact
            icon={MessageSquare}
            title="No reviews yet"
            message="Reviews diners write show up here as they come in."
          />
        </View>
      ) : (
        <View style={styles.reviewFeed}>
          {reviews.map(review => (
            <TouchableOpacity
              key={`${review.review_kind}-${review.review_id}`}
              activeOpacity={onSelectReview ? 0.7 : 1}
              onPress={() => onSelectReview && onSelectReview(review)}
            >
              <ReviewCard
                review={review}
                rating={review.rating}
                subtitle={
                  review.review_kind === 'dish'
                    ? `${review.dish_name} · ${review.restaurant_name}`
                    : review.restaurant_name
                }
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </Section>
  </>
);

export default TopPicks;
