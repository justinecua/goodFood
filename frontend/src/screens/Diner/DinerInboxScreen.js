import { View, Text, TouchableOpacity, Image } from 'react-native';
import { MessageSquare } from 'lucide-react-native';
import styles from '../../styles/RestaurantInboxScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import EmptyState from '../../components/shared/EmptyState';
import SearchButton from '../../assets/images/searchbutton.png';
import { SafeAreaView } from 'react-native-safe-area-context';

// Messaging isn't wired to the backend yet, so this shows the empty state.
// The conversation list will slot in below the search bar once the API exists.
const DinerInboxScreen = ({ navigation }) => {
  const conversations = [];

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.screen}>
        <View style={styles.background}>
          <View style={styles.headerContainer}>
            <Text style={styles.heading}>Messages</Text>
          </View>

          <View style={styles.midContainer}>
            <TouchableOpacity style={styles.searchInput}>
              <Text style={styles.placeholderText}>Search</Text>
              <Image style={styles.searchIcon} source={SearchButton} />
            </TouchableOpacity>

            {conversations.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No messages yet"
                message="Chats with restaurants you have visited will appear here."
              />
            ) : (
              conversations.map(item => (
                <View key={item.id}>
                  <Text>{item.name}</Text>
                </View>
              ))
            )}
          </View>

          <DinerBottomNavbar navigation={navigation} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DinerInboxScreen;
