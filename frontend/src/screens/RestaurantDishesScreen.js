import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../styles/RestaurantAddDishScreenStyle';
import colors from '../constants/colors';
import BottomNavbar from '../components/shared/BottomNavbar';

const RestaurantDishesScreen = () => {
  return (
    <View style={styles.background}>
      <View style={styles.headerContainer}>
        <Text style={styles.heading}>Restaurant Dishes</Text>
      </View>
      <View style={styles.midContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>Ari Pics</Text>
        </View>
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

export default RestaurantDishesScreen; 

