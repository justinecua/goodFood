import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RestaurantHomeScreen from '../screens/RestaurantHomeScreen';
import AddDish from '../screens/RestaurantAddDishScreen';
import DishDetails from '../screens/RestaurantDishDetailsScreen';
import Notifications from '../screens/RestaurantNotificationScreen';
import SubscriptionScreen from '../screens/SubscriptionScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MessageScreen from '../screens/MessageScreen';
import RestaurantInboxScreen from '../screens/RestaurantInboxScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />

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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
