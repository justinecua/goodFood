import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import styles from '../../styles/AddDishCategoryScreenStyle';
import colors from '../../constants/colors';
import { addDishCategory, getDishCategories } from '../../api/services/dish';

const AddDishCategoryScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadCategories = () => {
    getDishCategories()
      .then(data => setCategories(data?.categories ?? []))
      .catch(err => console.log('getDishCategories failed:', err.message));
  };

  useEffect(loadCategories, []);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Category name is required.');
      return;
    }

    const body = new FormData();
    body.append('dish_category_name', name.trim());
    body.append('dish_category_description', description.trim());

    try {
      setIsLoading(true);
      const res = await addDishCategory(body);
      if (res.error) {
        Alert.alert('Category Not Saved', res.error);
        return;
      }
      setName('');
      setDescription('');
      loadCategories();
      Alert.alert('Success', 'Dish category added.');
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Add Dish Category</Text>
          <Text style={styles.subheading}>
            Categories help organise your menu
          </Text>
        </View>

        <ScrollView contentContainerStyle={styles.formScroll}>
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Category Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="e.g. Appetizers, Main Course, Desserts"
              placeholderTextColor={colors.subtextInput}
              style={styles.input}
            />

            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Optional short description"
              placeholderTextColor={colors.subtextInput}
              multiline
              style={[styles.input, styles.multilineInput]}
            />

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Add Category</Text>
              )}
            </TouchableOpacity>

            {categories.length > 0 && (
              <View style={styles.existingWrap}>
                <Text style={styles.existingTitle}>Existing categories</Text>
                {categories.map(category => (
                  <View
                    key={category.dish_category_id}
                    style={styles.existingRow}
                  >
                    <Tag size={14} color={colors.button} />
                    <View style={styles.existingTextWrap}>
                      <Text style={styles.existingName}>
                        {category.dish_category_name}
                      </Text>
                      {category.dish_category_description ? (
                        <Text style={styles.existingDesc}>
                          {category.dish_category_description}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </ScrollView>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default AddDishCategoryScreen;
