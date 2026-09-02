import { View, Text, Image, StyleSheet } from 'react-native';
import { CircleUser } from 'lucide-react-native';
import StarRating from './StarRating';
import colors from '../../constants/colors';
import { mediaUrl } from '../../constants/config';

// "3 days ago" style stamp - reviews are only ever a rough age to the reader.
const timeAgo = iso => {
  if (!iso) return '';

  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['week', 604800],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];

  for (const [label, span] of units) {
    const amount = Math.floor(seconds / span);
    if (amount >= 1) return `${amount} ${label}${amount === 1 ? '' : 's'} ago`;
  }

  return 'just now';
};

// One review in a list. `subtitle` carries whatever the screen wants under the
// name - the dish reviewed, or the restaurant it was left on.
const ReviewCard = ({ review, rating, subtitle }) => {
  const name =
    [review.first_name, review.last_name].filter(Boolean).join(' ') ||
    review.username;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {review.account_profile_photo ? (
          <Image
            source={{ uri: mediaUrl(review.account_profile_photo) }}
            style={styles.avatar}
          />
        ) : (
          <View style={[styles.avatar, styles.avatarEmpty]}>
            <CircleUser size={20} color={colors.subtext} />
          </View>
        )}

        <View style={styles.headerBody}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <Text style={styles.time}>{timeAgo(review.created_at)}</Text>
      </View>

      <StarRating value={rating} size={13} showValue style={styles.stars} />

      {review.comment ? (
        <Text style={styles.comment}>{review.comment}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.container_bg2,
    borderRadius: 14,
    padding: 14,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.container_bg,
  },
  avatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBody: {
    flex: 1,
    gap: 1,
  },
  name: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.maintext,
  },
  subtitle: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
  },
  time: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
  },
  stars: {
    marginTop: 1,
  },
  comment: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    lineHeight: 19,
    color: colors.maintext,
  },
});

export default ReviewCard;
