import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/RestaurantHomeScreenStyles';
import colors from '../../constants/colors';
import ImageSource from '../../constants/imageSource';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const DinerHomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.background}>
            <View style={styles.upperContainer}>
              <View>
                <Text style={styles.textStyle}>Hello, Diner</Text>
                <Text style={styles.textStyle1}>
                  Brgy. Poblacion, Quezon Avenue, Iligan ...
                </Text>
              </View>
              <View>
                <Image
                  style={styles.userProfile}
                  source={ImageSource.userProfile}
                />
              </View>
            </View>

            <LinearGradient
              colors={['#abdfc7', '#2e8b57']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.5, y: 0.5 }}
              style={styles.cardBanner}
            >
              <Image
                style={styles.cardBannerImage}
                source={ImageSource.cardBannerImage}
              />
              <View style={styles.bannerContent}>
                <Text style={styles.bannerText}>be part of</Text>
                <Image
                  style={styles.goodFoodText}
                  source={ImageSource.goodFoodText}
                />
                {/* <Text style={styles.bannerText1}>goodfood</Text> */}
                <TouchableOpacity style={styles.bannerButton}>
                  <Text style={styles.bannerButtonText}>Subscribe Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
            <View style={styles.searchBarContainer}>
              <TextInput
                placeholder="Search foods, dishes or restaurants"
                placeholderTextColor={colors.subtext}
                style={styles.searchBarText}
              />
              <TouchableOpacity>
                <Image
                  style={styles.searchLens}
                  source={ImageSource.searchLens}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Top Dishes</Text>
              <TouchableOpacity>
                <Text style={styles.sectionHeaderText1}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dishContainer}>
              <View style={styles.dishSubContainer}>
                <View style={styles.dishCard}>
                  <Image
                    style={styles.dishImage}
                    source={ImageSource.fishTacos}
                  />
                  <View style={styles.dishUnderline}></View>
                  <Text style={styles.dishText}>Fish Tacos</Text>
                </View>
                <View style={styles.dishCard}>
                  <Image
                    style={styles.dishImage}
                    source={ImageSource.fishTacos}
                  />
                  <View style={styles.dishUnderline}></View>
                  <Text style={styles.dishText}>Fish Tacos</Text>
                </View>
              </View>
              <View style={styles.dishSubContainer}>
                <View style={styles.dishCard}>
                  <Image
                    style={styles.dishImage}
                    source={ImageSource.fishTacos}
                  />
                  <View style={styles.dishUnderline}></View>
                  <Text style={styles.dishText}>Fish Tacos</Text>
                </View>
                <View style={styles.dishCard}>
                  <Image
                    style={styles.dishImage}
                    source={ImageSource.fishTacos}
                  />
                  <View style={styles.dishUnderline}></View>
                  <Text style={styles.dishText}>Fish Tacos</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Top Restaurants</Text>
              <TouchableOpacity>
                <Text style={styles.sectionHeaderText1}>See all</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.restaurantContainer}>
              <View style={styles.restaurantSubContainer}>
                <View style={styles.restaurantCard}>
                  <Image
                    style={styles.restaurantCardImage}
                    source={ImageSource.userProfile}
                  />
                  <Text style={styles.restaurantText}>Rank 1st</Text>
                </View>
                <View style={styles.restaurantCard}>
                  <Image
                    style={styles.restaurantCardImage}
                    source={ImageSource.userProfile}
                  />
                  <Text style={styles.restaurantText}>Rank 2nd</Text>
                </View>
                <View style={styles.restaurantCard}>
                  <Image
                    style={styles.restaurantCardImage}
                    source={ImageSource.userProfile}
                  />
                  <Text style={styles.restaurantText}>Rank 3rd</Text>
                </View>
              </View>
              <View style={styles.restaurantSubContainer}>
                <View style={styles.restaurantCard}>
                  <Image
                    style={styles.restaurantCardImage}
                    source={ImageSource.userProfile}
                  />
                  <Text style={styles.restaurantText}>Rank 4th</Text>
                </View>
                <View style={styles.restaurantCard}>
                  <Image
                    style={styles.restaurantCardImage}
                    source={ImageSource.userProfile}
                  />
                  <Text style={styles.restaurantText}>Rank 5th</Text>
                </View>
                <View style={styles.restaurantCard}>
                  <Image
                    style={styles.restaurantCardImage}
                    source={ImageSource.userProfile}
                  />
                  <Text style={styles.restaurantText}>Rank 6th</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom NavBar */}
        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerHomeScreen;
