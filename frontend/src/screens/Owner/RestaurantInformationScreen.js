import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera, X, Plus } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import styles from '../../styles/RestaurantProfileInformationScreenStyle';
import colors from '../../constants/colors';
import { useRestaurantInfoForm } from '../../hooks/useRestaurantInfoForm';

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
      autoCapitalize={keyboardType === 'email-address' ? 'none' : 'sentences'}
      multiline={multiline}
      style={[styles.addDishInput, multiline && styles.multilineInput]}
    />
  </View>
);

// Circular logo picker with a camera badge.
const LogoField = ({ image, onPress }) => (
  <View>
    <Text style={styles.inputLabel}>Logo</Text>
    <View style={styles.profileImageWrapper}>
      <TouchableOpacity
        style={styles.profileImageButton}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {image?.uri ? (
          <Image source={{ uri: image.uri }} style={styles.profileImage} />
        ) : (
          <Text style={styles.profileImageText}>Add Logo</Text>
        )}
      </TouchableOpacity>
      <View style={styles.cameraBadge}>
        <Camera size={16} color="#fff" />
      </View>
    </View>
  </View>
);

// Wide cover-photo picker.
const CoverField = ({ image, onPress }) => (
  <View>
    <Text style={styles.inputLabel}>Cover Photo</Text>
    <TouchableOpacity
      style={styles.coverImageButton}
      onPress={onPress}
      activeOpacity={0.8}
    >
      {image?.uri ? (
        <Image source={{ uri: image.uri }} style={styles.coverImage} />
      ) : (
        <Text style={styles.profileImageText}>Add Cover Photo</Text>
      )}
    </TouchableOpacity>
  </View>
);

// One day's opening / closing time, or a "Closed" toggle.
const HoursRow = ({ row, onChange }) => (
  <View style={styles.hoursRow}>
    <Text style={styles.hoursDay}>{row.day_of_week}</Text>

    {row.is_closed ? (
      <Text style={styles.hoursClosedText}>Closed</Text>
    ) : (
      <View style={styles.hoursTimes}>
        <TextInput
          value={row.opening_time}
          onChangeText={text => onChange('opening_time', text)}
          placeholder="09:00"
          placeholderTextColor={colors.subtextInput}
          style={styles.hoursInput}
        />
        <Text style={styles.hoursDash}>–</Text>
        <TextInput
          value={row.closing_time}
          onChangeText={text => onChange('closing_time', text)}
          placeholder="22:00"
          placeholderTextColor={colors.subtextInput}
          style={styles.hoursInput}
        />
      </View>
    )}

    <TouchableOpacity
      style={[styles.closedPill, row.is_closed && styles.closedPillActive]}
      onPress={() => onChange('is_closed', !row.is_closed)}
    >
      <Text
        style={[
          styles.closedPillText,
          row.is_closed && styles.closedPillTextActive,
        ]}
      >
        Closed
      </Text>
    </TouchableOpacity>
  </View>
);

const RestaurantInformationScreen = ({ navigation }) => {
  const {
    form,
    handleChange,
    logoImage,
    setLogoImage,
    coverImage,
    setCoverImage,
    operatingHours,
    setHour,
    categories,
    addCategory,
    removeCategory,
    branches,
    addBranch,
    removeBranch,
    setBranch,
    isLoading,
    handleSubmit,
  } = useRestaurantInfoForm(navigation);

  const [categoryText, setCategoryText] = useState('');

  const submitCategory = () => {
    addCategory(categoryText);
    setCategoryText('');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Add Restaurant Information</Text>
          <Text style={styles.subheading}>Tell us about your restaurant</Text>
        </View>

        <ScrollView contentContainerStyle={styles.formScroll}>
          <View style={styles.midContainer}>
            <View style={styles.midSubContainer}>
              <LogoField
                image={logoImage}
                onPress={() => chooseImage(setLogoImage)}
              />
              <CoverField
                image={coverImage}
                onPress={() => chooseImage(setCoverImage)}
              />

              <TextField
                label="Restaurant Name"
                value={form.restaurant_name}
                onChangeText={text => handleChange('restaurant_name', text)}
              />
              <TextField
                label="Restaurant Description"
                multiline
                value={form.restaurant_description}
                onChangeText={text =>
                  handleChange('restaurant_description', text)
                }
              />
              <TextField
                label="Address"
                value={form.address}
                onChangeText={text => handleChange('address', text)}
              />
              <TextField
                label="Contact Number"
                keyboardType="phone-pad"
                value={form.contact_number}
                onChangeText={text => handleChange('contact_number', text)}
              />
              <TextField
                label="Email"
                keyboardType="email-address"
                value={form.email}
                onChangeText={text => handleChange('email', text)}
              />
              <TextField
                label="City"
                value={form.city}
                onChangeText={text => handleChange('city', text)}
              />
              <TextField
                label="Province"
                value={form.province}
                onChangeText={text => handleChange('province', text)}
              />
              <TextField
                label="Region"
                value={form.region}
                onChangeText={text => handleChange('region', text)}
              />
              <TextField
                label="Country"
                value={form.country}
                onChangeText={text => handleChange('country', text)}
              />
              <TextField
                label="Latitude"
                value={form.latitude}
                onChangeText={text => handleChange('latitude', text)}
              />
              <TextField
                label="Longitude"
                value={form.longitude}
                onChangeText={text => handleChange('longitude', text)}
              />

              {/* -------- Operating hours -------- */}
              <Text style={styles.sectionTitle}>Operating Hours</Text>
              <Text style={styles.sectionHint}>
                Use 24-hour time (e.g. 09:00). Leave a day blank or mark it
                closed.
              </Text>
              {operatingHours.map(row => (
                <HoursRow
                  key={row.day_of_week}
                  row={row}
                  onChange={(key, value) =>
                    setHour(row.day_of_week, key, value)
                  }
                />
              ))}

              {/* -------- Cuisine categories -------- */}
              <Text style={styles.sectionTitle}>Cuisine Categories</Text>
              <View style={styles.categoryInputRow}>
                <TextInput
                  value={categoryText}
                  onChangeText={setCategoryText}
                  onSubmitEditing={submitCategory}
                  placeholder="e.g. Filipino, Cafe, Seafood"
                  placeholderTextColor={colors.subtextInput}
                  style={[styles.addDishInput, styles.categoryInput]}
                />
                <TouchableOpacity
                  style={styles.categoryAddButton}
                  onPress={submitCategory}
                >
                  <Plus size={18} color="#fff" />
                </TouchableOpacity>
              </View>
              {categories.length > 0 && (
                <View style={styles.chipWrap}>
                  {categories.map(name => (
                    <TouchableOpacity
                      key={name}
                      style={styles.chip}
                      onPress={() => removeCategory(name)}
                    >
                      <Text style={styles.chipText}>{name}</Text>
                      <X size={13} color={colors.button} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* -------- Branches -------- */}
              <Text style={styles.sectionTitle}>Branches</Text>
              {branches.map((branch, index) => (
                <View key={index} style={styles.branchCard}>
                  <View style={styles.branchCardHeader}>
                    <Text style={styles.branchCardTitle}>
                      Branch {index + 1}
                    </Text>
                    <TouchableOpacity onPress={() => removeBranch(index)}>
                      <X size={16} color={colors.subtext} />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    value={branch.branch_name}
                    onChangeText={text => setBranch(index, 'branch_name', text)}
                    placeholder="Branch name"
                    placeholderTextColor={colors.subtextInput}
                    style={styles.addDishInput}
                  />
                  <TextInput
                    value={branch.address}
                    onChangeText={text => setBranch(index, 'address', text)}
                    placeholder="Address"
                    placeholderTextColor={colors.subtextInput}
                    style={styles.addDishInput}
                  />
                  <TextInput
                    value={branch.contact_number}
                    onChangeText={text =>
                      setBranch(index, 'contact_number', text)
                    }
                    placeholder="Contact number"
                    placeholderTextColor={colors.subtextInput}
                    keyboardType="phone-pad"
                    style={styles.addDishInput}
                  />
                  <View style={styles.branchCoordRow}>
                    <TextInput
                      value={branch.latitude}
                      onChangeText={text => setBranch(index, 'latitude', text)}
                      placeholder="Latitude"
                      placeholderTextColor={colors.subtextInput}
                      style={[styles.addDishInput, styles.branchCoordInput]}
                    />
                    <TextInput
                      value={branch.longitude}
                      onChangeText={text => setBranch(index, 'longitude', text)}
                      placeholder="Longitude"
                      placeholderTextColor={colors.subtextInput}
                      style={[styles.addDishInput, styles.branchCoordInput]}
                    />
                  </View>
                </View>
              ))}
              <TouchableOpacity
                style={styles.addBranchButton}
                onPress={addBranch}
              >
                <Plus size={16} color={colors.button} />
                <Text style={styles.addBranchButtonText}>Add branch</Text>
              </TouchableOpacity>

              <View style={styles.bottomContainer}>
                <TouchableOpacity
                  style={styles.cancelDishButton}
                  onPress={() => navigation.goBack()}
                >
                  <Text style={styles.cancelDishButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.addDishButton,
                    isLoading && styles.buttonDisabled,
                  ]}
                  onPress={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.addDishButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantInformationScreen;
