import { View, Text } from 'react-native';
import StarRating from './StarRating';
import styles from '../../styles/DinerDetailScreenStyle';

// Average score, the 5..1 star histogram, and (for restaurants) the per-
// criterion averages. `summary` is the object the review endpoints return.
const Bar = ({ label, value, total }) => (
  <View style={styles.ratingBarRow}>
    <Text style={styles.ratingBarLabel}>{label}</Text>
    <View style={styles.ratingBarTrack}>
      <View
        style={[
          styles.ratingBarFill,
          { width: `${total ? (value / total) * 100 : 0}%` },
        ]}
      />
    </View>
  </View>
);

const Criterion = ({ label, value }) => (
  <View style={styles.ratingCriterion}>
    <Text style={styles.ratingCriterionValue}>
      {value ? Number(value).toFixed(1) : '—'}
    </Text>
    <Text style={styles.ratingCriterionLabel}>{label}</Text>
  </View>
);

const RatingSummary = ({ summary, average }) => {
  const count = Number(summary?.review_count) || 0;
  const score = Number(average) || 0;

  return (
    <>
      <View style={styles.ratingPanel}>
        <View style={styles.ratingAverage}>
          <Text style={styles.ratingAverageValue}>
            {count ? score.toFixed(1) : '—'}
          </Text>
          <StarRating value={score} size={12} />
          <Text style={styles.ratingAverageCount}>
            {count} {count === 1 ? 'review' : 'reviews'}
          </Text>
        </View>

        <View style={styles.ratingBars}>
          {[5, 4, 3, 2, 1].map(star => (
            <Bar
              key={star}
              label={star}
              value={Number(summary?.[`stars_${star}`]) || 0}
              total={count}
            />
          ))}
        </View>
      </View>

      {/* Restaurants are scored on three criteria; dishes just have the one. */}
      {summary?.food_rating !== undefined ? (
        <View style={styles.ratingBreakdown}>
          <Criterion label="Food" value={summary.food_rating} />
          <Criterion label="Service" value={summary.service_rating} />
          <Criterion label="Ambiance" value={summary.ambiance_rating} />
        </View>
      ) : null}
    </>
  );
};

export default RatingSummary;
