import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/SubscriptionScreenStyle';
import bgCover from '../assets/images/bg_cover.png';
import goodFoodGreen from '../assets/images/goodFood_green.png';

const SubscriptionScreen = () => {
  return (
    <View style={styles.subscriptionContainer}>
      <View style={styles.bgContainer}>
        <Image style={styles.bgCover} source={bgCover} />
      </View>

      <View style={styles.goodFoodLogo}>
        <Image style={styles.goodFoodGreen} source={goodFoodGreen} />
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.subtitleContainer}>
          <Text style={styles.subtitle}>
            Discover trusted restaurants, top dishes, and local favorites, rated
            by real diners.
          </Text>
        </View>

        <View style={styles.subButtonContainer}>
          <TouchableOpacity style={styles.subscriptionButton}>
            <Text style={styles.registerButtonText}>Diner Subscription</Text>
            <Text style={styles.registerButtonText}>₱59 / month</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.subscriptionButton2}>
            <Text style={styles.registerButtonText}>
              Restaurant Subscription
            </Text>
            <Text style={styles.registerButtonText}>₱99 / month</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSub}>
          <Text style={styles.bottomSubtitle}>
            Subscription helps maintain fair rankings, honest reviews, and
            quality dining experiences.
          </Text>
        </View>

        <TouchableOpacity style={styles.ContinueButton}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SubscriptionScreen;
