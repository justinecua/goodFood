import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RestaurantHomeScreen from '../screens/Owner/RestaurantHomeScreen';
import AddDish from '../screens/Owner/RestaurantAddDishScreen';
import DishDetails from '../screens/Owner/RestaurantDishDetailsScreen';
import Notifications from '../screens/Owner/RestaurantNotificationScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileScreen from '../screens/Owner/RestaurantProfileScreen';
import RestaurantInboxScreen from '../screens/Owner/RestaurantInboxScreen';
import SplashScreen from '../screens/SplashScreen';

import DinerHomeScreen from '../screens/Diner/DinerHomeScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

          {/* -------- Restaurant Owner ----------- */}
          <Stack.Screen
            name="RestaurantHome"
            component={RestaurantHomeScreen}
          />
          <Stack.Screen name="AddDish" component={AddDish} />
          <Stack.Screen
            name="MessageScreen"
            component={RestaurantInboxScreen}
          />
          <Stack.Screen name="DishDetails" component={DishDetails} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />

          {/* -------- Diner ----------- */}

          <Stack.Screen name="DinerHome" component={DinerHomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
