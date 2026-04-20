import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../styles/RestaurantDishDetailsScreenStyle';
import TestImage from '../assets/images/goodFood_green.png';

const RestaurantDishDetailsScreen = () => {
  return (
    <View style={styles.background}>
      <Text style={styles.back}>{'<'}</Text>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={TestImage} style={styles.image} />
        </View>
        <View style={styles.row}>
          <Text style={styles.title}>Fish Tacos</Text>
          <Text style={styles.price}>₱159.00</Text>
        </View>
        <View style={styles.row}>
        <Text style={styles.rating}>Rating 5.0</Text>
        <Text style={styles.status}>Available</Text>
        </View>
        <Text style={styles.description}>
          Practice sir practice
        </Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={styles.commentBtn}>
            <Text style={styles.commentText}>Comments</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ratingBtn}>
            <Text style={styles.ratingText}>Ratings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default RestaurantDishDetailsScreen;