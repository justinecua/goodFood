import { useState } from 'react';
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
import { Trash2 } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/AddDishCategoryScreenStyle';
import colors from '../../constants/colors';
import {
  addDishCategory,
  updateDishCategory,
  deleteDishCategory,
} from '../../api/services/dish';

const AddDishCategoryScreen = ({ navigation, route }) => {
  const editing = route.params?.category;
  const isEdit = !!editing?.dish_category_id;

  const [name, setName] = useState(editing?.dish_category_name ?? '');
  const [description, setDescription] = useState(
    editing?.dish_category_description ?? '',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Category name is required.');
      return;
    }

    const body = new FormData();
    if (isEdit) {
      body.append('dish_category_id', String(editing.dish_category_id));
    }
    body.append('dish_category_name', name.trim());
    body.append('dish_category_description', description.trim());

    try {
      setIsLoading(true);
      const res = await (isEdit
        ? updateDishCategory(body)
        : addDishCategory(body));
      if (res.error) {
        Alert.alert('Category Not Saved', res.error);
        return;
      }
      Alert.alert('Success', isEdit ? 'Category updated.' : 'Category added.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Category',
      `Delete "${editing.dish_category_name}"? Dishes in it become uncategorised.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setDeleting(true);
              const res = await deleteDishCategory(editing.dish_category_id);
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
      ],
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title={isEdit ? 'Edit Category' : 'Add Dish Category'}
          subtitle="Categories help organise your menu"
          onBack={() => navigation.goBack()}
        />

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

            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEdit ? 'Save Changes' : 'Add Category'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {isEdit && (
              <TouchableOpacity
                style={styles.deleteLink}
                onPress={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#c0392b" />
                ) : (
                  <>
                    <Trash2 size={15} color="#c0392b" />
                    <Text style={styles.deleteLinkText}>Delete category</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default AddDishCategoryScreen;
