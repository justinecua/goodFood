import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../styles/RestaurantInboxScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import ConversationList from '../../components/shared/ConversationList';

// The diner's threads are with the restaurants they have written to.
const DinerInboxScreen = ({ navigation }) => (
  <SafeAreaView style={styles.screen}>
    <View style={styles.screen}>
      <View style={styles.background}>
        <View style={styles.headerContainer}>
          <Text style={styles.heading}>Messages</Text>
        </View>

        <ConversationList
          emptyMessage="Chats with restaurants you have messaged will appear here."
          onOpen={conversation =>
            navigation.navigate('MessageThread', {
              conversationId: conversation.conversation_id,
              title: conversation.counterpart_name,
            })
          }
        />
      </View>

      <DinerBottomNavbar navigation={navigation} />
    </View>
  </SafeAreaView>
);

export default DinerInboxScreen;
