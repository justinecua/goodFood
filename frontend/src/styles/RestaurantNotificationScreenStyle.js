import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  background: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: colors.container_bg2,
  },
  card: {
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 25,
  },
  headerContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '200',
    fontSize: 22,
    color: colors.maintext,
  },
  midContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'flex-start',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Ezra-SemiBold',
    color: colors.button,
  },

  // --- Notification list -------------------------------------------------
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  headerSpacer: {
    width: 70,
  },
  markAll: {
    width: 70,
    alignItems: 'flex-end',
  },
  markAllText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.button,
  },
  unreadBadge: {
    alignSelf: 'center',
    backgroundColor: colors.button_green_light,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
    marginBottom: 4,
  },
  unreadBadgeText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.button,
  },
  list: {
    paddingVertical: 12,
    paddingBottom: 110,
    gap: 10,
  },

  // One notification. Unread rows get a tinted background and a dot.
  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 15,
  },
  itemUnread: {
    backgroundColor: colors.button_green_light,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.container_bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemBody: {
    flex: 1,
    gap: 3,
  },
  itemTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.maintext,
  },
  itemMessage: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    lineHeight: 18,
    color: colors.subtext,
  },
  itemTime: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.button,
    marginTop: 6,
  },
});

export default styles;
