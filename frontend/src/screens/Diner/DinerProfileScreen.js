import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import styles from '../../styles/ProfileScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { clearSession, logoutAccount } from '../../api/services/auth';
import { mediaUrl } from '../../constants/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pfp from '../../assets/images/pfp.jpg';
import { useCallback, useState } from 'react';
import {
  User,
  LogOut,
  Heart,
  CircleDollarSign,
  Info,
  ChevronRight,
  Camera,
  GlobeLock,
} from 'lucide-react-native';
import colors from '../../constants/colors';

const DinerProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const photoUrl = mediaUrl(user?.account_profile_photo);
  const profilePicture = photoUrl ? { uri: photoUrl } : pfp;

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const refresh = await AsyncStorage.getItem('refreshToken');

      if (refresh) {
        await logoutAccount(refresh);
      }
    } catch (e) {
      console.log('Logout error:', e);
    } finally {
      setIsLoading(false);
    }

    await clearSession();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  useFocusEffect(
    useCallback(() => {
      AsyncStorage.getItem('user').then(res => {
        if (res) setUser(JSON.parse(res));
      });
    }, []),
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Profile</Text>
        </View>
        <View style={styles.section}>
          <View style={styles.profileBanner}>
            <View style={styles.leftprofileBanner}>
              <Image style={styles.profileImage} source={profilePicture} />
            </View>
            <View style={styles.rightprofileBanner}>
              <Text style={styles.username}>{user?.username}</Text>
              <View style={styles.bottomrightprofileBanner}>
                <Text style={styles.email_address}>{user?.email_address}</Text>
                <Text style={styles.mobile_number}>{user?.mobile_number}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.bottomSectionTitle}>General</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 90 }}>
            <View style={styles.bottomSection}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ChangeProfilePicture')}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconButton}>
                    <Camera size={20} color={colors.food_bg} />
                  </View>
                  <Text style={styles.buttonText}>Change Profile Picture</Text>
                </View>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('ProfileInformation')}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconButton}>
                    <User size={20} color={colors.food_bg} />
                  </View>
                  <Text style={styles.buttonText}>
                    Complete your personal information
                  </Text>
                </View>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('DinerFavorites')}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconButton}>
                    <Heart size={20} color={colors.food_bg} />
                  </View>
                  <Text style={styles.buttonText}>My Favorites</Text>
                </View>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('DinerPlanBilling')}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconButton}>
                    <CircleDollarSign size={20} color={colors.food_bg} />
                  </View>
                  <Text style={styles.buttonText}>Plan and Billing </Text>
                </View>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('PrivacyPolicy')}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconButton}>
                    <GlobeLock size={20} color={colors.food_bg} />
                  </View>
                  <Text style={styles.buttonText}>Privacy Policy</Text>
                </View>
                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('About')}
              >
                <View style={styles.buttonContent}>
                  <View style={styles.iconButton}>
                    <Info size={20} color={colors.food_bg} />
                  </View>
                  <Text style={styles.buttonText}>About</Text>
                </View>

                <ChevronRight size={20} color="#999" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleLogout}
                style={[styles.button, isLoading && { opacity: 0.7 }]}
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.buttonContent,
                    isLoading && {
                      flex: 1,
                      justifyContent: 'center',
                      padding: 15,
                    },
                  ]}
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.food_bg} />
                  ) : (
                    <>
                      <View style={styles.iconButton}>
                        <LogOut size={20} color={colors.food_bg} />
                      </View>
                      <Text style={styles.buttonText}>Logout</Text>
                    </>
                  )}
                </View>

                <ChevronRight
                  size={20}
                  color={isLoading ? 'transparent' : '#999'}
                />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerProfileScreen;
