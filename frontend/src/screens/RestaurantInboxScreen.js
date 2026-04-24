import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/RestaurantInboxScreenStyle';
import colors from '../constants/colors';
import BottomNavbar from '../components/shared/BottomNavbar';
import SearchButton from '../assets/images/searchbutton.png';

const RestaurantInboxScreen = () => {
  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Inbox</Text>
      </View>
        <View style={styles.midContainer}>
        <TouchableOpacity style={styles.searchInput}>
        <Text style={styles.placeholderText}>Search</Text>
        <Image style={styles.searchIcon} source={SearchButton} />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity style={styles.addDishButton}>
          <Text style={styles.addDishButtonText}>Add Dish</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom NavBar */}
      <BottomNavbar />

    </View>
  );
};

export default RestaurantInboxScreen;