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
import { ChevronRight, Plus, Tag } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import EmptyState from '../../components/shared/EmptyState';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/OwnerListScreenStyle';
import colors from '../../constants/colors';
import { getDishCategories } from '../../api/services/dish';

const DishCategoriesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getDishCategories()
        .then(data => active && setCategories(data?.categories ?? []))
        .catch(err => {
          console.log('getDishCategories failed:', err.message);
          if (active) setCategories([]);
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
          title="Dish Categories"
          subtitle="Shared across all restaurants"
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.button} />
          </View>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Tag}
            title="No categories yet"
            message="Categories group your dishes on the menu, like Appetizers or Mains. Add one with the button below."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {categories.map(category => (
              <TouchableOpacity
                key={category.dish_category_id}
                style={styles.row}
                onPress={() =>
                  navigation.navigate('AddDishCategory', { category })
                }
              >
                <View style={styles.rowIconWrap}>
                  <Tag size={16} color={colors.button} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>
                    {category.dish_category_name}
                  </Text>
                  {category.dish_category_description ? (
                    <Text style={styles.rowMeta}>
                      {category.dish_category_description}
                    </Text>
                  ) : null}
                </View>
                <ChevronRight size={16} color={colors.subtextInput} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <View style={styles.actionBar}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('AddDishCategory')}
          >
            <Plus size={15} color="#fff" />
            <Text style={styles.actionButtonText}>Add Category</Text>
          </TouchableOpacity>
        </View>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DishCategoriesScreen;
