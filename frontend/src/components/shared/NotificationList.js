import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  Bell,
  MessageSquare,
  Star,
  Store,
  UtensilsCrossed,
} from 'lucide-react-native';
import EmptyState from './EmptyState';
import styles from '../../styles/RestaurantNotificationScreenStyle';
import colors from '../../constants/colors';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../api/services/notification';
import { refreshUnreadCounts } from '../../utils/unreadCounts';

// The notification feed. Owners and diners get the same screen - the backend
// returns whichever notifications belong to the signed-in account - so this
// holds all of the behaviour and each role's screen just supplies its navbar
// and empty-state wording.
//
//   <NotificationList
//     emptyMessage="Reservations, reviews and messages show up here."
//     onOpen={notification => ...}
//   />

// The notification table has no type column, so the kind is read back out of
// the wording. Both the icon and where a tap leads depend on it, so the
// matching lives here rather than being repeated per screen.
export const notificationKind = title => {
  const text = String(title || '').toLowerCase();

  if (text.includes('message')) return 'message';
  if (text.includes('dish')) return 'dish';
  if (text.includes('review') || text.includes('rated')) return 'review';
  if (text.includes('restaurant') || text.includes('trending')) return 'restaurant';

  return 'general';
};

const ICONS = {
  message: MessageSquare,
  dish: UtensilsCrossed,
  review: Star,
  restaurant: Store,
  general: Bell,
};

const timeAgo = iso => {
  if (!iso) return '';

  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units = [
    ['y', 31536000],
    ['mo', 2592000],
    ['w', 604800],
    ['d', 86400],
    ['h', 3600],
    ['m', 60],
  ];

  for (const [label, span] of units) {
    const amount = Math.floor(seconds / span);
    if (amount >= 1) return `${amount}${label} ago`;
  }

  return 'just now';
};

const NotificationList = ({ emptyMessage, onOpen }) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(
    () =>
      getNotifications()
        .then(data => {
          setNotifications(data?.notifications ?? []);
          setUnread(data?.unread_count ?? 0);
        })
        .catch(err => console.log('getNotifications failed:', err.message)),
    [],
  );

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      load().finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, [load]),
  );

  const refresh = () => {
    setRefreshing(true);
    load().finally(() => setRefreshing(false));
  };

  // Marked read straight away in the list, then confirmed with the server.
  const open = notification => {
    if (!notification.is_read) {
      setNotifications(current =>
        current.map(item =>
          item.notification_id === notification.notification_id
            ? { ...item, is_read: true }
            : item,
        ),
      );
      setUnread(count => Math.max(0, count - 1));

      markNotificationRead(notification.notification_id)
        // The navbar badge is showing right now, so it has to follow.
        .then(refreshUnreadCounts)
        .catch(err => console.log('markNotificationRead failed:', err.message));
    }

    if (onOpen) onOpen(notification);
  };

  const markAll = () => {
    setNotifications(current => current.map(item => ({ ...item, is_read: true })));
    setUnread(0);

    markAllNotificationsRead()
      .then(refreshUnreadCounts)
      .catch(err =>
        console.log('markAllNotificationsRead failed:', err.message),
      );
  };

  return (
    <View style={styles.background}>
      <View style={styles.headerRow}>
        <View style={styles.headerSpacer} />
        <Text style={styles.heading}>Notifications</Text>
        {unread > 0 ? (
          <TouchableOpacity style={styles.markAll} onPress={markAll}>
            <Text style={styles.markAllText}>Mark all</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.markAll} />
        )}
      </View>

      {unread > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadBadgeText}>
            {unread} unread
          </Text>
        </View>
      )}

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={colors.button} />
        </View>
      ) : notifications.length === 0 ? (
        <View style={styles.midContainer}>
          <EmptyState
            icon={Bell}
            title="No notifications"
            message={emptyMessage}
          />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={colors.button}
            />
          }
        >
          {notifications.map(notification => {
            const Icon = ICONS[notificationKind(notification.title)];

            return (
              <TouchableOpacity
                key={notification.notification_id}
                style={[
                  styles.item,
                  !notification.is_read && styles.itemUnread,
                ]}
                onPress={() => open(notification)}
              >
                <View style={styles.itemIcon}>
                  <Icon size={18} color={colors.button} />
                </View>

                <View style={styles.itemBody}>
                  <Text style={styles.itemTitle}>{notification.title}</Text>
                  {notification.body ? (
                    <Text style={styles.itemMessage}>{notification.body}</Text>
                  ) : null}
                  <Text style={styles.itemTime}>
                    {timeAgo(notification.created_at)}
                  </Text>
                </View>

                {!notification.is_read && <View style={styles.unreadDot} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

export default NotificationList;
