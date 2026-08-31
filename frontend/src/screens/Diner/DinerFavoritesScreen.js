import { View, ScrollView } from 'react-native';
import { Heart } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/shared/ScreenHeader';
import EmptyState from '../../components/shared/EmptyState';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import styles from '../../styles/DinerListScreenStyle';

// Favorites aren't wired to the backend yet (the `favorite` app has no
// endpoints), so this always shows the empty state. The list slots into the
// scroll view once the API exists.
const DinerFavoritesScreen = ({ navigation }) => {
  const favorites = [];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title="My Favorites"
          subtitle="Restaurants and dishes you saved"
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.scroll}>
          {favorites.length === 0 ? (
            <EmptyState
              icon={Heart}
              title="No favorites yet"
              message="Tap the heart on a restaurant or dish and it will be saved here for quick access."
              actionLabel="Find restaurants"
              onAction={() => navigation.navigate('DinerHome')}
            />
          ) : null}
        </ScrollView>

        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerFavoritesScreen;
