import { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  Check,
  ChevronLeft,
  CircleUser,
  MessageSquare,
  Send,
  Smile,
  Store,
  X,
} from 'lucide-react-native';
import styles from '../styles/MessageThreadScreenStyle';
import colors from '../constants/colors';
import { mediaUrl } from '../constants/config';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
} from '../api/services/messaging';
import { refreshUnreadCounts } from '../utils/unreadCounts';

// One conversation, for whichever side is signed in.
//
//   navigation.navigate('MessageThread', { conversationId })
//   navigation.navigate('MessageThread', { restaurantId, title })
//
// With only a restaurantId the thread doesn't exist yet - the screen opens
// empty and the first message creates it.
//
// Long-pressing one of your own messages offers Edit and Delete. Other
// people's messages have no actions - the backend enforces that too, so this
// is only about not offering something that would be refused.

const dayLabel = iso =>
  new Date(iso).toLocaleDateString([], {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

const timeLabel = iso =>
  new Date(iso).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

const MessageThreadScreen = ({ navigation, route }) => {
  const { conversationId: initialId, restaurantId, title } = route.params ?? {};

  const [conversationId, setConversationId] = useState(initialId ?? null);
  const [loading, setLoading] = useState(Boolean(initialId));
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [draft, setDraft] = useState('');
  // The message being rewritten, or null when composing a new one.
  const [editing, setEditing] = useState(null);

  const scrollRef = useRef(null);

  const load = useCallback(id => {
    if (!id) return Promise.resolve();

    // Loading the thread is also what clears its unread badge.
    return getMessages(id)
      .then(data => {
        if (data?.error) {
          setError(data.error);
          return;
        }
        setConversation(data?.conversation ?? null);
        setMessages(data?.messages ?? []);

        // Fetching the thread marked its incoming messages read, so the
        // navbar badge needs to catch up.
        refreshUnreadCounts();
      })
      .catch(err => setError(err.message));
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      if (!conversationId) {
        setLoading(false);
        return undefined;
      }

      setLoading(true);
      load(conversationId).finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [conversationId, load]),
  );

  const cancelEdit = () => {
    setEditing(null);
    setDraft('');
  };

  const submit = async () => {
    const text = draft.trim();
    if (!text || sending) return;

    setSending(true);
    setError(null);

    try {
      // The composer doubles as the edit box, so which call to make depends
      // on whether a message is currently being rewritten.
      if (editing) {
        const response = await editMessage({
          messageId: editing.message_id,
          message: text,
        });

        if (response?.error) {
          setError(response.error);
          return;
        }

        cancelEdit();
        await load(conversationId);
        return;
      }

      const response = await sendMessage({
        conversationId,
        restaurantId,
        message: text,
      });

      if (response?.error) {
        setError(response.error);
        return;
      }

      setDraft('');

      // The first message on a new thread is what gives it an id.
      if (!conversationId && response.conversation_id) {
        setConversationId(response.conversation_id);
      }

      await load(response.conversation_id ?? conversationId);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const startEdit = message => {
    setEditing(message);
    setDraft(message.message);
  };

  const confirmDelete = message => {
    Alert.alert('Delete Message', 'This removes it from the conversation.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await deleteMessage(message.message_id);

            if (response?.error) {
              Alert.alert('Not Deleted', response.error);
              return;
            }

            // Deleting the one being edited leaves nothing to save.
            if (editing?.message_id === message.message_id) cancelEdit();

            await load(conversationId);
          } catch (err) {
            Alert.alert('Failed', err.message);
          }
        },
      },
    ]);
  };

  // Only your own messages have actions.
  const openActions = message => {
    if (!message.is_mine) return;

    Alert.alert('Message', message.message, [
      { text: 'Edit', onPress: () => startEdit(message) },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => confirmDelete(message),
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const headerName = conversation?.counterpart_name || title || 'Message';
  const headerPhoto = conversation?.counterpart_photo;
  // A diner's threads are with restaurants; an owner's are with people.
  const Placeholder = conversation?.my_role === 'owner' ? CircleUser : Store;

  // The subtitle reports the last message, not presence - the app doesn't
  // track when anyone was last online.
  const lastAt = messages.length
    ? messages[messages.length - 1].sent_at
    : null;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ChevronLeft size={26} color={colors.maintext} />
        </TouchableOpacity>

        {headerPhoto ? (
          <Image
            source={{ uri: mediaUrl(headerPhoto) }}
            style={styles.headerAvatar}
          />
        ) : (
          <View style={[styles.headerAvatar, styles.headerAvatarEmpty]}>
            <Placeholder size={22} color={colors.subtext} />
          </View>
        )}

        <View style={styles.headerBody}>
          <Text style={styles.headerName} numberOfLines={1}>
            {headerName}
          </Text>
          {lastAt ? (
            <Text style={styles.headerMeta}>
              last message {timeLabel(lastAt)}
            </Text>
          ) : null}
        </View>
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.button} />
          </View>
        ) : messages.length === 0 ? (
          <View style={styles.centered}>
            <MessageSquare size={30} color={colors.subtext} />
            <Text style={styles.notFound}>
              No messages yet. Say hello to start the conversation.
            </Text>
          </View>
        ) : (
          <ScrollView
            ref={scrollRef}
            contentContainerStyle={styles.thread}
            onContentSizeChange={() =>
              scrollRef.current?.scrollToEnd({ animated: false })
            }
          >
            {messages.map((message, index) => {
              const previous = messages[index - 1];
              const mine = message.is_mine;

              // A date line whenever the day changes, and an avatar only on
              // the first message of a run from the same person.
              const newDay =
                !previous ||
                new Date(previous.sent_at).toDateString() !==
                  new Date(message.sent_at).toDateString();
              const startsRun = !previous || previous.is_mine !== mine || newDay;
              const editingThis = editing?.message_id === message.message_id;

              return (
                <View key={message.message_id}>
                  {newDay && (
                    <Text style={styles.dateSeparator}>
                      {dayLabel(message.sent_at)}
                    </Text>
                  )}

                  <View
                    style={[
                      styles.messageRow,
                      mine ? styles.messageRowMine : styles.messageRowTheirs,
                    ]}
                  >
                    {!mine &&
                      (startsRun ? (
                        message.sender_photo ? (
                          <Image
                            source={{ uri: mediaUrl(message.sender_photo) }}
                            style={styles.bubbleAvatar}
                          />
                        ) : (
                          <View
                            style={[
                              styles.bubbleAvatar,
                              styles.bubbleAvatarEmpty,
                            ]}
                          >
                            <Placeholder size={16} color={colors.subtext} />
                          </View>
                        )
                      ) : (
                        <View style={styles.bubbleAvatarSpacer} />
                      ))}

                    <TouchableOpacity
                      style={[
                        styles.bubble,
                        mine ? styles.bubbleMine : styles.bubbleTheirs,
                        editingThis && styles.bubbleEditing,
                      ]}
                      activeOpacity={mine ? 0.8 : 1}
                      onLongPress={() => openActions(message)}
                      delayLongPress={250}
                    >
                      <Text
                        style={[
                          styles.bubbleText,
                          mine
                            ? styles.bubbleTextMine
                            : styles.bubbleTextTheirs,
                        ]}
                      >
                        {message.message}
                      </Text>
                      <Text
                        style={[
                          styles.bubbleTime,
                          mine
                            ? styles.bubbleTimeMine
                            : styles.bubbleTimeTheirs,
                        ]}
                      >
                        {timeLabel(message.sent_at)}
                        {message.edited_at ? ' · edited' : ''}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {editing ? (
          <View style={styles.editBanner}>
            <View style={styles.editBannerBar} />
            <View style={styles.editBannerBody}>
              <Text style={styles.editBannerLabel}>Editing message</Text>
              <Text style={styles.editBannerText} numberOfLines={1}>
                {editing.message}
              </Text>
            </View>
            <TouchableOpacity
              onPress={cancelEdit}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color={colors.subtext} />
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.composer}>
          <View style={styles.composerField}>
            <Smile size={20} color={colors.subtext} />
            <TextInput
              style={styles.composerInput}
              placeholder={editing ? 'Edit your message ...' : 'Say something ...'}
              placeholderTextColor={colors.subtextInput}
              value={draft}
              onChangeText={setDraft}
              multiline
            />
          </View>

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!draft.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={submit}
            disabled={!draft.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : editing ? (
              <Check size={22} color="#fff" />
            ) : (
              <Send size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MessageThreadScreen;
