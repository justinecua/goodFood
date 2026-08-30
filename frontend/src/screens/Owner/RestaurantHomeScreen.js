import {
  View,
  ScrollView,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import styles from '../../styles/RestaurantHomeScreenStyles';
import ImageSource from '../../constants/imageSource';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SquarePlus,
  ChevronRight,
  CircleUser,
  UtensilsCrossed,
  Store,
} from 'lucide-react-native';
import colors from '../../constants/colors';
import EmptyState from '../../components/shared/EmptyState';
import { checkInfoComplete } from '../../api/services/home';

const RestaurantHomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [infoStatus, setInfoStatus] = useState(null);
  const [loadingInfo, setLoadingInfo] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('user').then(res => {
      if (res) {
        const user = JSON.parse(res);
        console.log(user);
        setUser(user);
      }
    });

    checkInfoComplete()
      .then(data => setInfoStatus(data))
      .catch(error => console.log(error))
      .finally(() => setLoadingInfo(false));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={styles.background}>
            <View style={styles.upperContainer}>
              <View>
                <Text style={styles.textStyle}>Hello, {user?.username}</Text>
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
                <TouchableOpacity
                  style={styles.bannerButton}
                  onPress={() => navigation.navigate('Subscription')}
                >
                  <Text style={styles.bannerButtonText}>Subscribe Now</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>

            {loadingInfo ? (
              <View style={styles.firstStepsLoading}>
                <ActivityIndicator size="small" color={colors.button} />
              </View>
            ) : (
              infoStatus &&
              (!infoStatus.personal_info_complete ||
                !infoStatus.restaurant_info_complete) && (
                <View style={styles.firstSteps}>
                  {!infoStatus.personal_info_complete && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        navigation.navigate(
                          'RestaurantProfileInformationScreen',
                        )
                      }
                    >
                      <View style={styles.buttonContent}>
                        <View style={styles.iconButton}>
                          <CircleUser size={20} color={colors.background} />
                        </View>
                        <Text style={styles.buttonText}>
                          Complete your personal information
                        </Text>
                      </View>
                      <ChevronRight size={20} color={colors.button} />
                    </TouchableOpacity>
                  )}

                  {!infoStatus.restaurant_info_complete && (
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() =>
                        navigation.navigate('RestaurantInformationScreen')
                      }
                    >
                      <View style={styles.buttonContent}>
                        <View style={styles.iconButton}>
                          <SquarePlus size={20} color={colors.background} />
                        </View>
                        <Text style={styles.buttonText}>
                          Add Restaurant information
                        </Text>
                      </View>
                      <ChevronRight size={20} color={colors.button} />
                    </TouchableOpacity>
                  )}
                </View>
              )
            )}

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
            </View>
            <View style={styles.emptySection}>
              <EmptyState
                compact
                icon={UtensilsCrossed}
                title="No top dishes yet"
                message="Once diners start rating dishes, the highest-rated ones show up here."
              />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHeaderText}>Top Restaurants</Text>
            </View>
            <View style={[styles.emptySection, styles.emptySectionLast]}>
              <EmptyState
                compact
                icon={Store}
                title="No top restaurants yet"
                message="Restaurant rankings appear here as reviews come in."
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom NavBar */}
        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default RestaurantHomeScreen;
