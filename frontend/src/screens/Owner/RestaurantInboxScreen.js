import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/RestaurantInboxScreenStyle';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import ConversationList from '../../components/shared/ConversationList';

// The owner's threads are with diners who wrote in about their restaurant.
const RestaurantInboxScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.screen}>
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Inbox</Text>
        </View>

        <ConversationList
          emptyMessage="Messages from diners about your restaurant will appear here."
          onOpen={conversation =>
            navigation.navigate('MessageThread', {
              conversationId: conversation.conversation_id,
              title: conversation.counterpart_name,
            })
          }
        />
      </View>

      <RestaurantBottomNavbar navigation={navigation} />
    </View>
  </SafeAreaView>
);

export default RestaurantInboxScreen;
