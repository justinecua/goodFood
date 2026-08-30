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
import { ChevronRight, Plus, Tag, UtensilsCrossed } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import EmptyState from '../../components/shared/EmptyState';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/OwnerListScreenStyle';
import colors from '../../constants/colors';
import { getDishes } from '../../api/services/dish';
import { mediaUrl } from '../../constants/config';

const badges = dish =>
  [
    dish.is_signature && 'Signature',
    dish.is_best_seller && 'Best seller',
    !dish.is_available && 'Unavailable',
  ]
    .filter(Boolean)
    .join(' · ');

const MenuScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [dishes, setDishes] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getDishes()
        .then(data => active && setDishes(data?.dishes ?? []))
        .catch(err => {
          console.log('getDishes failed:', err.message);
          if (active) setDishes([]);
        })
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, []),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title="Menu"
          subtitle={`${dishes.length} ${
            dishes.length === 1 ? 'dish' : 'dishes'
          }`}
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.button} />
          </View>
        ) : dishes.length === 0 ? (
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes yet"
            message="Add your first dish so diners can see what you serve. Use the button below."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {dishes.map(dish => (
              <TouchableOpacity
                key={dish.dish_id}
                style={styles.row}
                onPress={() =>
                  navigation.navigate('DishDetails', {
                    dishId: dish.dish_id,
                  })
                }
              >
                {dish.dish_image_path ? (
                  <Image
                    source={{ uri: mediaUrl(dish.dish_image_path) }}
                    style={styles.thumb}
                  />
                ) : (
                  <View style={[styles.thumb, styles.thumbEmpty]}>
                    <UtensilsCrossed size={18} color={colors.subtext} />
                  </View>
                )}
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{dish.dish_name}</Text>
                  <Text style={styles.rowMeta}>
                    {dish.dish_category_name || 'Uncategorised'}
                    {badges(dish) ? ` · ${badges(dish)}` : ''}
                  </Text>
                </View>
                <Text style={styles.rowTrailing}>{dish.dish_price}</Text>
                <ChevronRight size={16} color={colors.subtextInput} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddDish')}
          >
            <Plus size={15} color="#fff" />
            <Text style={styles.actionButtonText}>Add Dish</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonOutline]}
            onPress={() => navigation.navigate('DishCategories')}
          >
            <Tag size={15} color={colors.button} />
            <Text
              style={[styles.actionButtonText, styles.actionButtonTextOutline]}
            >
              Categories
            </Text>
          </TouchableOpacity>
        </View>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default MenuScreen;
