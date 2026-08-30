import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { SquarePen, Trash2, UtensilsCrossed } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/RestaurantDishDetailsScreenStyle';
import colors from '../../constants/colors';
import { getDish, deleteDish } from '../../api/services/dish';
import { mediaUrl } from '../../constants/config';

const Section = ({ title, children }) =>
  children ? (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionBody}>{children}</Text>
    </View>
  ) : null;

const RestaurantDishDetailsScreen = ({ navigation, route }) => {
  const dishId = route.params?.dishId;

  const [loading, setLoading] = useState(true);
  const [dish, setDish] = useState(null);
  const [image, setImage] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      if (!dishId) {
        setLoading(false);
        return undefined;
      }

      getDish(dishId)
        .then(data => {
          if (!active) return;
          setDish(data?.dish ?? null);
          setImage(data?.images?.[0]?.dish_image_path ?? null);
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

  const goToEdit = () =>
    navigation.navigate('AddDish', { dish: { ...dish, imagePath: image } });

  const confirmDelete = () => {
    Alert.alert('Delete Dish', `Remove "${dish.dish_name}" from your menu?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            const res = await deleteDish(dishId);
            if (res.error) {
              Alert.alert('Not Deleted', res.error);
              return;
            }
            navigation.goBack();
          } catch (err) {
            Alert.alert('Failed', err.message);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  const tags = dish
    ? [
        dish.is_signature && 'Signature',
        dish.is_best_seller && 'Best seller',
        dish.is_available ? 'Available' : 'Unavailable',
      ].filter(Boolean)
    : [];

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title={dish?.dish_name || 'Dish'}
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
              <Image source={{ uri: mediaUrl(image) }} style={styles.image} />
            ) : (
              <View style={[styles.image, styles.imageEmpty]}>
                <UtensilsCrossed size={30} color={colors.subtext} />
                <Text style={styles.imageEmptyText}>No photo</Text>
              </View>
            )}

            <View style={styles.titleRow}>
              <Text style={styles.name}>{dish.dish_name}</Text>
              <Text style={styles.price}>₱{dish.dish_price}</Text>
            </View>

            <Text style={styles.category}>
              {dish.dish_category_name || 'Uncategorised'}
            </Text>

            {tags.length > 0 && (
              <View style={styles.tagRow}>
                {tags.map(tag => (
                  <View
                    key={tag}
                    style={[
                      styles.tag,
                      tag === 'Unavailable' && styles.tagMuted,
                    ]}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        tag === 'Unavailable' && styles.tagTextMuted,
                      ]}
                    >
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            <Section title="Description">{dish.dish_description}</Section>
            <Section title="Preparation notes">
              {dish.preparation_notes}
            </Section>
            <Section title="How to eat">{dish.how_to_eat}</Section>
          </ScrollView>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteBtn]}
              onPress={confirmDelete}
              disabled={deleting}
            >
              {deleting ? (
                <ActivityIndicator color={colors.button} />
              ) : (
                <>
                  <Trash2 size={16} color="#c0392b" />
                  <Text style={[styles.actionBtnText, styles.deleteBtnText]}>
                    Delete
                  </Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, styles.editBtn]}
              onPress={goToEdit}
            >
              <SquarePen size={16} color="#fff" />
              <Text style={styles.actionBtnText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default RestaurantDishDetailsScreen;
