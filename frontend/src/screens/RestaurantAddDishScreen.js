import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/RestaurantAddDishScreenStyle';
import colors from '../constants/colors';
import PreviewLogo from '../assets/images/previewLogo.png';
import chatnavbar from '../assets/images/chatnavbar.png';
import dishnavbar from '../assets/images/dishnavbar.png';
import homenavbar from '../assets/images/homenavbar.png';
import notifnavbar from '../assets/images/notifnavbar.png';
import usercircle from '../assets/images/usercircle.png';

const AddDish = () => {
  const [category, setCategory] = useState(null);
  const [availability, setAvailability] = useState(null);

  const categoryData = [
    { label: 'Main Course', value: 'main' },
    { label: 'Appetizer', value: 'appetizer' },
    { label: 'Dessert', value: 'dessert' },
    { label: 'Beverage', value: 'beverage' },
  ];

  const availabilityData = [
    { label: 'In Stock', value: 'available' },
    { label: 'Out of Stock', value: 'unavailable' },
  ];

  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Add Dish</Text>
      </View>

      <View style={styles.midContainer}>
        <TouchableOpacity style={styles.addDishInput}>
          <Text style={styles.placeholderText}>Image (Click to upload image)</Text>
        </TouchableOpacity>

        <View style={styles.imagePreviewContainer}>
          <Image style={styles.UpperLogo} source={PreviewLogo} />
          <Text style={styles.imagePreviewText}>Image Preview</Text>
        </View>
        <TextInput
          placeholder="Name"
          placeholderTextColor={colors.subtextInput}
          style={styles.addDishInput}
        />
        <TextInput
          placeholder="Description"
          placeholderTextColor={colors.subtextInput}
          style={[styles.addDishInput, styles.descriptionInput]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
        <Dropdown
          style={styles.dropdownContainer}
          placeholderStyle={styles.dropdownText}
          selectedTextStyle={styles.dropdownText}
          data={categoryData}
          labelField="label"
          valueField="value"
          placeholder="Category"
          value={category}
          onChange={(item) => setCategory(item.value)}
          renderRightIcon={() => <Text style={styles.dropdownArrow}>▼</Text>}
        />
        <Dropdown
          style={styles.dropdownContainer}
          placeholderStyle={styles.dropdownText}
          selectedTextStyle={styles.dropdownText}
          data={availabilityData}
          labelField="label"
          valueField="value"
          placeholder="Availability"
          value={availability}
          onChange={(item) => setAvailability(item.value)}
          renderRightIcon={() => <Text style={styles.dropdownArrow}>▼</Text>}
        />
        <TextInput
          placeholder="Price"
          placeholderTextColor={colors.subtextInput}
          style={styles.addDishInput}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.cancelDishButton}>
          <Text style={styles.cancelDishButtonText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.addDishButton}>
          <Text style={styles.addDishButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomNavigationBar}>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={homenavbar} />
          <Text style={styles.navIconText}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={chatnavbar} />
          <Text style={styles.navIconText}>Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={dishnavbar} />
          <Text style={styles.navIconText}>Dish</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={notifnavbar} />
          <Text style={styles.navIconText}>Notification</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Image style={styles.navIconImage} source={usercircle} />
          <Text style={styles.navIconText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddDish;