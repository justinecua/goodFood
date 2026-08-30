import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/AddDishScreenStyle';
import colors from '../../constants/colors';
import { useAddDishForm } from '../../hooks/useAddDishForm';

// Opens the photo library and hands the chosen image back to `onPicked`.
const chooseImage = onPicked => {
  launchImageLibrary({ mediaType: 'photo' }, res => {
    if (res.didCancel || res.errorCode) return;
    const image = res.assets?.[0];
    if (image?.uri) onPicked(image);
  });
};

// One labelled text input.
const TextField = ({ label, value, onChangeText, multiline, keyboardType }) => (
  <View>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={label}
      placeholderTextColor={colors.subtextInput}
      keyboardType={keyboardType}
      multiline={multiline}
      style={[styles.input, multiline && styles.multilineInput]}
    />
  </View>
);

// A tappable label / on-off pill.
const ToggleRow = ({ label, value, onPress }) => (
  <TouchableOpacity style={styles.toggleRow} onPress={onPress}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <View style={[styles.pill, value && styles.pillActive]}>
      <Text style={[styles.pillText, value && styles.pillTextActive]}>
        {value ? 'Yes' : 'No'}
      </Text>
    </View>
  </TouchableOpacity>
);

const AddDishScreen = ({ navigation, route }) => {
  const {
    isEdit,
    form,
    handleChange,
    toggle,
    image,
    setImage,
    categories,
    isLoading,
    handleSubmit,
  } = useAddDishForm(navigation, route.params?.dish);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title={isEdit ? 'Edit Dish' : 'Add Dish'}
          subtitle={isEdit ? 'Update this dish' : 'Add a dish to your menu'}
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.formScroll}>
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Photo</Text>
            <TouchableOpacity
              style={styles.photoButton}
              onPress={() => chooseImage(setImage)}
              activeOpacity={0.8}
            >
              {image?.uri ? (
                <Image source={{ uri: image.uri }} style={styles.photo} />
              ) : (
                <>
                  <Camera size={22} color={colors.subtextInput} />
                  <Text style={styles.photoText}>Add a photo</Text>
                </>
              )}
            </TouchableOpacity>

            <TextField
              label="Dish Name"
              value={form.dish_name}
              onChangeText={text => handleChange('dish_name', text)}
            />
            <TextField
              label="Description"
              multiline
              value={form.dish_description}
              onChangeText={text => handleChange('dish_description', text)}
            />
            <TextField
              label="Price"
              keyboardType="decimal-pad"
              value={form.dish_price}
              onChangeText={text => handleChange('dish_price', text)}
            />

            <Text style={styles.inputLabel}>Category</Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.dropdownPlaceholder}
              selectedTextStyle={styles.dropdownText}
              data={categories}
              labelField="dish_category_name"
              valueField="dish_category_id"
              placeholder={
                categories.length
                  ? 'Select a category'
                  : 'No categories yet — add one first'
              }
              value={form.dish_category_id}
              onChange={item =>
                handleChange('dish_category_id', item.dish_category_id)
              }
            />

            <TextField
              label="Preparation Notes"
              multiline
              value={form.preparation_notes}
              onChangeText={text => handleChange('preparation_notes', text)}
            />
            <TextField
              label="How to Eat"
              multiline
              value={form.how_to_eat}
              onChangeText={text => handleChange('how_to_eat', text)}
            />

            <View style={styles.toggleGroup}>
              <ToggleRow
                label="Signature dish"
                value={form.is_signature}
                onPress={() => toggle('is_signature')}
              />
              <ToggleRow
                label="Best seller"
                value={form.is_best_seller}
                onPress={() => toggle('is_best_seller')}
              />
              <ToggleRow
                label="Available"
                value={form.is_available}
                onPress={() => toggle('is_available')}
              />
            </View>

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
                    {isEdit ? 'Save Changes' : 'Add Dish'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default AddDishScreen;
