import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Database, Store } from 'lucide-react-native';
import styles from '../styles/LocationPermissionScreenStyle';
import colors from '../constants/colors';
import { useLocationPermission } from '../hooks/useLocationPermission';

const POINTS = [
  {
    key: 'store',
    Icon: Database,
    text: 'The app will store your location on this device.',
  },
  {
    key: 'suggest',
    Icon: Store,
    text: 'The app will suggest which restaurants are near you.',
  },
];

/**
 * Shown right after a successful login. Whichever button is pressed the user
 * lands on `route.params.next` — sharing the location is optional.
 */
const LocationPermissionScreen = ({ navigation, route }) => {
  const next = route.params?.next;

  const goToHome = () => {
    navigation.reset({ index: 0, routes: [{ name: next }] });
  };

  const { isRequesting, allow, cancel } = useLocationPermission(goToHome);

  // The user is already logged in at this point, so the hardware back button
  // must not drop them back onto the login screen.
  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => subscription.remove();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.iconBadge}>
          <MapPin size={44} color={colors.button} />
        </View>

        <Text style={styles.title}>goodFood wants to track your location</Text>
        <Text style={styles.subtitle}>Do you want to share your location?</Text>

        <View style={styles.points}>
          {POINTS.map(({ key, Icon, text }) => (
            <View key={key} style={styles.point}>
              <View style={styles.pointIcon}>
                <Icon size={18} color={colors.button} />
              </View>
              <Text style={styles.pointText}>{text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.allowButton, isRequesting && styles.buttonDisabled]}
          onPress={allow}
          disabled={isRequesting}
        >
          {isRequesting ? (
            <ActivityIndicator color={colors.button_text} />
          ) : (
            <Text style={styles.allowButtonText}>Allow</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={cancel}
          disabled={isRequesting}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LocationPermissionScreen;
