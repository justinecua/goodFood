import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Star } from 'lucide-react-native';
import colors from '../../constants/colors';

// Star rating, read-only by default.
//
//   <StarRating value={4.5} size={14} showValue />          // display
//   <StarRating value={rating} onChange={setRating} />      // tappable input
//
// Half stars are drawn for display only - tapping always sets a whole number,
// which is what the diner expects from a five-star control.
const StarRating = ({
  value = 0,
  onChange,
  size = 16,
  showValue = false,
  count,
  style,
}) => {
  const rating = Number(value) || 0;
  const editable = typeof onChange === 'function';

  return (
    <View style={[styles.row, style]}>
      {[1, 2, 3, 4, 5].map(position => {
        // Filled once the rating reaches this star; half-filled stars are
        // approximated by the muted colour so we don't need a second icon.
        const filled = rating >= position - 0.25;
        const partial = !filled && rating >= position - 0.75;

        const star = (
          <Star
            size={editable ? size + 12 : size}
            color={filled || partial ? colors.button : colors.subtextInput}
            fill={filled ? colors.button : 'transparent'}
            fillOpacity={partial ? 0.4 : 1}
          />
        );

        return editable ? (
          <TouchableOpacity
            key={position}
            onPress={() => onChange(position)}
            hitSlop={styles.hitSlop}
            accessibilityRole="button"
            accessibilityLabel={`${position} star${position === 1 ? '' : 's'}`}
          >
            {star}
          </TouchableOpacity>
        ) : (
          <View key={position}>{star}</View>
        );
      })}

      {showValue && rating > 0 ? (
        <Text style={styles.value}>{rating.toFixed(1)}</Text>
      ) : null}

      {count !== undefined && count !== null ? (
        <Text style={styles.count}>
          ({count} {Number(count) === 1 ? 'review' : 'reviews'})
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  hitSlop: { top: 6, bottom: 6, left: 4, right: 4 },
  value: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.maintext,
    marginLeft: 4,
  },
  count: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
    marginLeft: 2,
  },
});

export default StarRating;
