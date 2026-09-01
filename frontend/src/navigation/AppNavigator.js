import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ThemeProvider } from '../contexts/ThemeContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RestaurantHomeScreen from '../screens/Owner/RestaurantHomeScreen';
import MyRestaurantScreen from '../screens/Owner/MyRestaurantScreen';
import DishDetails from '../screens/Owner/RestaurantDishDetailsScreen';
import Notifications from '../screens/Owner/RestaurantNotificationScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileScreen from '../screens/Owner/RestaurantProfileScreen';
import RestaurantInboxScreen from '../screens/Owner/RestaurantInboxScreen';
import RestaurantProfileInformationScreen from '../screens/Owner/RestaurantProfileInformationScreen';
import RestaurantInformationScreen from '../screens/Owner/RestaurantInformationScreen';
import AddDishScreen from '../screens/Owner/AddDishScreen';
import AddDishCategoryScreen from '../screens/Owner/AddDishCategoryScreen';
import MenuScreen from '../screens/Owner/MenuScreen';
import DishCategoriesScreen from '../screens/Owner/DishCategoriesScreen';
import BranchesScreen from '../screens/Owner/BranchesScreen';
import BranchFormScreen from '../screens/Owner/BranchFormScreen';
import ChangeProfilePictureScreen from '../screens/Owner/ChangeProfilePictureScreen';
import ChangePasswordScreen from '../screens/Owner/ChangePasswordScreen';
import PrivacyPolicyScreen from '../screens/Owner/PrivacyPolicyScreen';
import AboutScreen from '../screens/Owner/AboutScreen';
import RestaurantSettingsScreen from '../screens/Owner/RestaurantSettingsScreen';

import DinerMapScreen from '../screens/Diner/DinerMapScreen';
import DinerHomeScreen from '../screens/Diner/DinerHomeScreen';
import DinerHomeModeScreen from '../screens/Diner/DinerHomeModeScreen';
import DinerAssistedHomeScreen from '../screens/Diner/DinerAssistedHomeScreen';
import DinerNotificationScreen from '../screens/Diner/DinerNotificationScreen';
import DinerProfileScreen from '../screens/Diner/DinerProfileScreen';
import DinerInboxScreen from '../screens/Diner/DinerInboxScreen';
import DinerFavoritesScreen from '../screens/Diner/DinerFavoritesScreen';
import DinerPlanBillingScreen from '../screens/Diner/DinerPlanBillingScreen';

import SplashScreen from '../screens/SplashScreen';
import OnboardingScreen from '../screens/OnboardingScreen';
import LocationPermissionScreen from '../screens/LocationPermissionScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen
              name="LocationPermission"
              component={LocationPermissionScreen}
            />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} />

            {/* -------- Restaurant Owner ----------- */}
            <Stack.Screen
              name="RestaurantHome"
              component={RestaurantHomeScreen}
            />
            <Stack.Screen name="MyRestaurant" component={MyRestaurantScreen} />
            <Stack.Screen
              name="MessageScreen"
              component={RestaurantInboxScreen}
            />
            <Stack.Screen name="DishDetails" component={DishDetails} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen
              name="RestaurantProfileInformationScreen"
              component={RestaurantProfileInformationScreen}
            />
            {/* Same screen, role-neutral name — the diner profile links here
                and the tab bar adapts to the signed-in account type. */}
            <Stack.Screen
              name="ProfileInformation"
              component={RestaurantProfileInformationScreen}
            />
            <Stack.Screen
              name="RestaurantInformationScreen"
              component={RestaurantInformationScreen}
            />
            <Stack.Screen name="Menu" component={MenuScreen} />
            <Stack.Screen
              name="DishCategories"
              component={DishCategoriesScreen}
            />
            <Stack.Screen name="Branches" component={BranchesScreen} />
            <Stack.Screen name="BranchForm" component={BranchFormScreen} />
            <Stack.Screen
              name="ChangeProfilePicture"
              component={ChangeProfilePictureScreen}
            />
            <Stack.Screen
              name="ChangePassword"
              component={ChangePasswordScreen}
            />
            <Stack.Screen
              name="RestaurantSettings"
              component={RestaurantSettingsScreen}
            />
            <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
            />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen name="AddDish" component={AddDishScreen} />
            <Stack.Screen
              name="AddDishCategory"
              component={AddDishCategoryScreen}
            />

            {/* -------- Diner ----------- */}
            <Stack.Screen
              name="DinerHomeMode"
              component={DinerHomeModeScreen}
            />
            <Stack.Screen name="DinerHome" component={DinerHomeScreen} />
            <Stack.Screen
              name="DinerAssistedHome"
              component={DinerAssistedHomeScreen}
            />
            <Stack.Screen name="DinerMapScreen" component={DinerMapScreen} />
            <Stack.Screen
              name="DinerNotificationScreen"
              component={DinerNotificationScreen}
            />
            <Stack.Screen
              name="DinerProfileScreen"
              component={DinerProfileScreen}
            />
            <Stack.Screen
              name="DinerInboxScreen"
              component={DinerInboxScreen}
            />
            <Stack.Screen
              name="DinerFavorites"
              component={DinerFavoritesScreen}
            />
            <Stack.Screen
              name="DinerPlanBilling"
              component={DinerPlanBillingScreen}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
