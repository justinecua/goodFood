import { useState } from 'react';
import { Dropdown } from 'react-native-element-dropdown';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import styles from '../../styles/RestaurantNotificationScreenStyle';
import colors from '../../constants/colors';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const NotificationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={styles.background}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Notifications</Text>
          </View>
          <View style={styles.midContainer}>
            <View style={styles.card}>
              <Text style={styles.cardText}>New Reservation Request</Text>
            </View>
          </View>
        </View>
        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default NotificationScreen;
