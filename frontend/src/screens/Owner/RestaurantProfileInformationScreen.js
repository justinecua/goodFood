import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import ScreenHeader from '../../components/shared/ScreenHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/RestaurantProfileInformationScreenStyle';
import colors from '../../constants/colors';
import GenderDropdown from '../../components/register/GenderDropdown';
import { Camera } from 'lucide-react-native';
import { useAddInformationForm } from '../../hooks/useAddInformationForm';

const RestaurantProfileInformationScreen = ({ navigation }) => {
  const {
    form,
    handleChange,
    handleAddInformation,
    open,
    setOpen,
    isLoading,
    profileImage,
    setProfileImage,
    showDatePicker,
    setShowDatePicker,
    selectedDate,
    setSelectedDate,
    tempDate,
    setTempDate,
    gender,
    setGender,
    genderItems,
    setGenderItems,
  } = useAddInformationForm(navigation);

  const pickProfileImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res.didCancel) return;
      if (res.errorCode) {
        console.log('image picker error', res.errorCode, res.errorMessage);
        return;
      }
      const asset = res.assets?.[0];
      if (asset?.uri) setProfileImage(asset);
    });
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
      if (event.type === 'set' && date) {
        setSelectedDate(date);
        handleChange('birthdate', date.toLocaleDateString());
      }
    } else {
      if (date) setTempDate(date);
    }
  };

  const handleIOSConfirm = () => {
    setSelectedDate(tempDate);
    handleChange('birthdate', tempDate.toLocaleDateString());
    setShowDatePicker(false);
  };

  const handleIOSCancel = () => {
    setTempDate(selectedDate);
    setShowDatePicker(false);
  };

  const showDatepicker = () => {
    setTempDate(selectedDate);
    setShowDatePicker(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* iOS date picker */}
      {Platform.OS === 'ios' && (
        <Modal transparent visible={showDatePicker} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalSubContainer}>
              <View style={styles.modalContentContainer}>
                <TouchableOpacity onPress={handleIOSCancel}>
                  <Text style={styles.modalCancel}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleIOSConfirm}>
                  <Text style={styles.modalDone}>Done</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.modalDateTimePicker}>
                <DateTimePicker
                  testID="dateTimePicker"
                  value={tempDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  style={{ width: 320 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      <View style={styles.container}>
        <ScreenHeader
          title="Profile Information"
          subtitle="Your personal details"
          onBack={() => navigation.goBack()}
        />

        <View style={styles.section}>
          <View style={styles.midContainer}>
            <View style={styles.profileImageWrapper}>
              <TouchableOpacity
                style={styles.profileImageButton}
                onPress={pickProfileImage}
                activeOpacity={0.8}
              >
                {profileImage?.uri ? (
                  <Image
                    source={{ uri: profileImage.uri }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Text style={styles.profileImageText}>Add Photo</Text>
                )}
              </TouchableOpacity>
              <View style={styles.cameraBadge}>
                <Camera size={16} color="#fff" />
              </View>
            </View>
            <View style={styles.midSubContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <TextInput
                value={form.firstname}
                onChangeText={text => handleChange('firstname', text)}
                placeholder="Enter your first name"
                placeholderTextColor={colors.subtextInput}
                style={styles.addDishInput}
              />

              <Text style={styles.inputLabel}>Last Name</Text>
              <TextInput
                value={form.lastname}
                onChangeText={text => handleChange('lastname', text)}
                placeholder="Enter your last name"
                placeholderTextColor={colors.subtextInput}
                style={styles.addDishInput}
              />

              {/* Gender Dropdown */}
              <Text style={styles.inputLabel}>Gender</Text>
              <GenderDropdown
                open={open}
                value={gender}
                items={genderItems}
                setOpen={setOpen}
                setValue={setGender}
                setItems={setGenderItems}
                styles={styles}
              />

              <Text style={styles.inputLabel}>Birthdate</Text>
              <TouchableOpacity onPress={showDatepicker}>
                <TextInput
                  value={form.birthdate}
                  placeholder="Select your birthdate"
                  placeholderTextColor={colors.subtextInput}
                  style={styles.addDishInput}
                  editable={false}
                  pointerEvents="none"
                />
              </TouchableOpacity>

              {/* Android date picker */}
              {Platform.OS === 'android' && showDatePicker && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedDate}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={form.email}
                onChangeText={text => handleChange('email', text)}
                placeholder="you@example.com"
                placeholderTextColor={colors.subtextInput}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.addDishInput}
              />

              <Text style={styles.inputLabel}>Mobile Number</Text>
              <TextInput
                value={form.mobile}
                onChangeText={text => handleChange('mobile', text)}
                placeholder="09xxxxxxxxx"
                placeholderTextColor={colors.subtextInput}
                keyboardType="phone-pad"
                style={styles.addDishInput}
              />

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
                  onPress={handleAddInformation}
                  disabled={isLoading}
                >
                  <Text style={styles.addDishButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantProfileInformationScreen;
