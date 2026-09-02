import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Send, Store, UtensilsCrossed } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import StarRating from '../../components/shared/StarRating';
import styles from '../../styles/WriteReviewScreenStyle';
import colors from '../../constants/colors';
import { mediaUrl } from '../../constants/config';
import {
  getRestaurantReviews,
  addRestaurantReview,
  deleteRestaurantReview,
  getDishReviews,
  addDishReview,
  deleteDishReview,
} from '../../api/services/review';

// The one review page, for both things a diner can rate.
//
//   navigation.navigate('WriteReview', {
//     mode: 'restaurant', restaurantId, restaurantName, logo,
//   })
//   navigation.navigate('WriteReview', {
//     mode: 'dish', dishId, dishName, restaurantName, image,
//   })
//
// A restaurant is scored on three criteria and the overall rating is their
// average; a dish gets a single score. If the diner has rated this before,
// their existing review is loaded and the form saves over it.
const WORDS = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'];

const RatingBlock = ({ label, hint, value, onChange }) => (
  <View style={styles.ratingBlock}>
    <Text style={styles.ratingLabel}>{label}</Text>
    {hint ? <Text style={styles.ratingHint}>{hint}</Text> : null}
    <StarRating value={value} onChange={onChange} style={styles.ratingStars} />
    <Text style={styles.ratingWord}>{WORDS[value] || ' '}</Text>
  </View>
);

const WriteReviewScreen = ({ navigation, route }) => {
  const {
    mode = 'restaurant',
    restaurantId,
    restaurantName,
    dishId,
    dishName,
    image,
  } = route.params ?? {};

  const isDish = mode === 'dish';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [existingId, setExistingId] = useState(null);

  const [food, setFood] = useState(0);
  const [service, setService] = useState(0);
  const [ambiance, setAmbiance] = useState(0);
  const [dishRating, setDishRating] = useState(0);
  const [comment, setComment] = useState('');

  // Load whatever the diner said last time, so a second visit edits rather
  // than starts over.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      const load = isDish
        ? getDishReviews(dishId)
        : getRestaurantReviews(restaurantId);

      load
        .then(data => {
          if (!active) return;

          const mine = data?.my_review;
          if (!mine) return;

          setComment(mine.comment ?? '');

          if (isDish) {
            setExistingId(mine.dish_review_id);
            setDishRating(Math.round(Number(mine.rating)));
          } else {
            setExistingId(mine.res_review_id);
            setFood(Math.round(Number(mine.food_rating)));
            setService(Math.round(Number(mine.service_rating)));
            setAmbiance(Math.round(Number(mine.ambiance_rating)));
          }
        })
        .catch(err => console.log('load review failed:', err.message))
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [isDish, dishId, restaurantId]),
  );

  const overall = (food + service + ambiance) / 3;
  const complete = isDish
    ? dishRating > 0
    : food > 0 && service > 0 && ambiance > 0;

  const submit = async () => {
    if (!complete || saving) return;

    setSaving(true);
    setError(null);

    try {
      const response = isDish
        ? await addDishReview({
            dishId,
            rating: dishRating,
            comment: comment.trim() || null,
          })
        : await addRestaurantReview({
            restaurantId,
            foodRating: food,
            serviceRating: service,
            ambianceRating: ambiance,
            comment: comment.trim() || null,
          });

      if (response?.error) {
        setError(response.error);
        return;
      }

      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Review',
      `Remove your review of ${isDish ? dishName : restaurantName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setSaving(true);
              const response = isDish
                ? await deleteDishReview(existingId)
                : await deleteRestaurantReview(existingId);

              if (response?.error) {
                Alert.alert('Not Deleted', response.error);
                return;
              }

              navigation.goBack();
            } catch (err) {
              Alert.alert('Failed', err.message);
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title={existingId ? 'Edit Review' : 'Write a Review'}
        subtitle={isDish ? dishName : restaurantName}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
        </View>
      ) : (
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.subject}>
              {image ? (
                <Image
                  source={{ uri: mediaUrl(image) }}
                  style={styles.subjectThumb}
                />
              ) : (
                <View style={[styles.subjectThumb, styles.subjectThumbEmpty]}>
                  {isDish ? (
                    <UtensilsCrossed size={22} color={colors.subtext} />
                  ) : (
                    <Store size={22} color={colors.subtext} />
                  )}
                </View>
              )}
              <View style={styles.subjectBody}>
                <Text style={styles.subjectName} numberOfLines={2}>
                  {isDish ? dishName : restaurantName}
                </Text>
                <Text style={styles.subjectMeta}>
                  {isDish
                    ? `Dish at ${restaurantName}`
                    : 'How was your visit?'}
                </Text>
              </View>
            </View>

            {isDish ? (
              <RatingBlock
                label="Rate this dish"
                hint="How was it - taste, portion, value?"
                value={dishRating}
                onChange={setDishRating}
              />
            ) : (
              <>
                <RatingBlock
                  label="Food"
                  hint="Taste, freshness and portion size"
                  value={food}
                  onChange={setFood}
                />
                <RatingBlock
                  label="Service"
                  hint="Speed, attentiveness and accuracy"
                  value={service}
                  onChange={setService}
                />
                <RatingBlock
                  label="Ambiance"
                  hint="Comfort, noise and cleanliness"
                  value={ambiance}
                  onChange={setAmbiance}
                />

                <View style={styles.overall}>
                  <Text style={styles.overallLabel}>Overall rating</Text>
                  <View>
                    <Text style={styles.overallValue}>
                      {complete ? overall.toFixed(1) : '—'}
                    </Text>
                  </View>
                </View>
              </>
            )}

            <View style={styles.commentBlock}>
              <Text style={styles.commentLabel}>
                Tell other diners more (optional)
              </Text>
              <TextInput
                style={styles.commentInput}
                placeholder={
                  isDish
                    ? 'What did you like about it? Would you order it again?'
                    : 'What stood out? Anything they could do better?'
                }
                placeholderTextColor={colors.subtextInput}
                value={comment}
                onChangeText={setComment}
                multiline
                maxLength={1000}
              />
              <Text style={styles.commentCount}>{comment.length}/1000</Text>
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
          </ScrollView>

          <View style={styles.submitBar}>
            <TouchableOpacity
              style={[
                styles.submitButton,
                (!complete || saving) && styles.submitButtonDisabled,
              ]}
              onPress={submit}
              disabled={!complete || saving}
            >
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Send size={16} color="#fff" />
                  <Text style={styles.submitButtonText}>
                    {existingId ? 'Update Review' : 'Post Review'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {existingId ? (
              <TouchableOpacity
                style={styles.deleteLink}
                onPress={confirmDelete}
                disabled={saving}
              >
                <Text style={styles.deleteLinkText}>Delete my review</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default WriteReviewScreen;
