import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

// The chat thread: a header carrying the other party, a scroll of bubbles
// (mine right and green, theirs left and white), and a composer pinned to the
// bottom.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 30,
  },
  notFound: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.container_bg2,
  },
  backButton: {
    width: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.container_bg,
  },
  headerAvatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerBody: {
    flex: 1,
    gap: 2,
  },
  headerName: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 17,
    color: colors.maintext,
  },
  headerMeta: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtext,
  },

  // Message scroll
  thread: {
    padding: 15,
    paddingBottom: 20,
    gap: 10,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  dateSeparator: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
    marginVertical: 12,
  },

  // One message. Theirs is prefixed by a small avatar, mine is not.
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    maxWidth: '86%',
  },
  messageRowMine: {
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
  },
  messageRowTheirs: {
    alignSelf: 'flex-start',
  },
  bubbleAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.container_bg,
  },
  bubbleAvatarEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Keeps consecutive messages from the same person aligned when only the
  // first of the run carries an avatar.
  bubbleAvatarSpacer: {
    width: 30,
  },
  bubble: {
    flexShrink: 1,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  bubbleMine: {
    backgroundColor: colors.button,
    borderBottomRightRadius: 6,
  },
  bubbleTheirs: {
    backgroundColor: colors.container_bg2,
    borderBottomLeftRadius: 6,
  },
  // Marks which bubble the composer is currently rewriting.
  bubbleEditing: {
    borderWidth: 2,
    borderColor: colors.bg_black,
  },
  bubbleText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMine: {
    color: colors.button_text,
  },
  bubbleTextTheirs: {
    color: colors.maintext,
  },
  bubbleTime: {
    fontFamily: 'Ezra-Regular',
    fontSize: 10,
    marginTop: 4,
  },
  bubbleTimeMine: {
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'right',
  },
  bubbleTimeTheirs: {
    color: colors.subtextInput,
  },

  // "Editing" banner above the composer while a message is being rewritten.
  editBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 2,
    backgroundColor: colors.container_bg2,
  },
  editBannerBar: {
    width: 3,
    alignSelf: 'stretch',
    borderRadius: 2,
    backgroundColor: colors.button,
  },
  editBannerBody: {
    flex: 1,
    gap: 1,
  },
  editBannerLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.button,
  },
  editBannerText: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
  },

  // Composer
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: colors.container_bg2,
  },
  composerField: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 25,
    backgroundColor: colors.container_bg,
  },
  composerInput: {
    flex: 1,
    padding: 0,
    maxHeight: 110,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
  sendButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.subtextInput,
  },
  error: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: '#c0392b',
    textAlign: 'center',
    paddingBottom: 6,
  },
});

export default styles;
