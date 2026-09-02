import { useCallback, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { MessageSquare, Search, Store, CircleUser } from 'lucide-react-native';
import EmptyState from './EmptyState';
import styles from '../../styles/RestaurantInboxScreenStyle';
import colors from '../../constants/colors';
import { mediaUrl } from '../../constants/config';
import { getConversations } from '../../api/services/messaging';

// The inbox. Owners and diners get the same list - the backend decides which
// side of each thread the signed-in account is on and returns the other
// party's name and photo - so each role's screen only supplies its navbar and
// empty-state wording.

// Times on the rows are clock times for today and dates before that, which is
// how a messaging list normally reads.
const stamp = iso => {
  if (!iso) return '';

  const sent = new Date(iso);
  const now = new Date();
  const sameDay = sent.toDateString() === now.toDateString();

  if (sameDay) {
    return sent.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  if (sent.toDateString() === yesterday.toDateString()) return 'Yesterday';

  return sent.toLocaleDateString([], { month: 'short', day: 'numeric' });
};

const ConversationList = ({ emptyMessage, onOpen }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [search, setSearch] = useState('');

  const load = useCallback(
    term =>
      getConversations(term)
        .then(data => setConversations(data?.conversations ?? []))
        .catch(err => console.log('getConversations failed:', err.message)),
    [],
  );

  // Reloads on focus so a thread you just replied in moves to the top.
  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      load(search).finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [load, search]),
  );

  const refresh = () => {
    setRefreshing(true);
    load(search).finally(() => setRefreshing(false));
  };

  return (
    <>
      <View style={styles.searchInput}>
        <TextInput
          style={styles.searchField}
          placeholder="Search ..."
          placeholderTextColor={colors.subtextInput}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        <Search size={18} color={colors.subtext} />
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
        </View>
      ) : conversations.length === 0 ? (
        <View style={styles.midContainer}>
          <EmptyState
            icon={MessageSquare}
            title={search ? 'No matches' : 'No messages yet'}
            message={
              search
                ? 'No conversation matches that name or message.'
                : emptyMessage
            }
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.button}
            />
          }
        >
          {conversations.map(conversation => {
            const unread = conversation.unread_count > 0;
            // A diner's threads are with restaurants, an owner's with people.
            const Placeholder =
              conversation.my_role === 'diner' ? Store : CircleUser;

            return (
              <TouchableOpacity
                key={conversation.conversation_id}
                style={styles.row}
                onPress={() => onOpen(conversation)}
              >
                {conversation.counterpart_photo ? (
                  <Image
                    source={{ uri: mediaUrl(conversation.counterpart_photo) }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarEmpty]}>
                    <Placeholder size={24} color={colors.subtext} />
                  </View>
                )}

                <View style={styles.rowBody}>
                  <View style={styles.rowTopLine}>
                    <Text style={styles.rowName} numberOfLines={1}>
                      {conversation.counterpart_name}
                    </Text>
                    <Text style={styles.rowTime}>
                      {stamp(conversation.last_message_at)}
                    </Text>
                  </View>

                  <View style={styles.rowTopLine}>
                    <Text
                      style={[
                        styles.rowPreview,
                        unread && styles.rowPreviewUnread,
                      ]}
                      numberOfLines={1}
                    >
                      {conversation.last_message || 'No messages yet'}
                    </Text>
                    {unread && <View style={styles.unreadDot} />}
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </>
  );
};

export default ConversationList;
