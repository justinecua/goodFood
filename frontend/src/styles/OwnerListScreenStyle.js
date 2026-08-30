import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

// Shared layout for the owner's simple list screens: Menu, Dish Categories,
// Branches. Header + scrollable list + a bottom action button + the navbar.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 6,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 19,
    color: colors.maintext,
  },
  subheading: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtextInput,
    marginTop: 2,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scroll: {
    padding: 15,
    paddingBottom: 140,
    gap: 10,
  },

  // Generic list row / card
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.container_bg2,
    borderRadius: 14,
    padding: 14,
  },
  rowIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
  rowMeta: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
  },
  metaLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  rowTrailing: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.button,
  },

  // Dish thumbnail
  thumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.container_bg,
  },
  thumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom action button(s), sitting just above the navbar
  actionBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 92,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 50,
    borderRadius: 20,
    backgroundColor: colors.button,
  },
  actionButtonOutline: {
    backgroundColor: colors.container_bg2,
    borderWidth: 1.5,
    borderColor: colors.button,
  },
  actionButtonText: {
    color: '#fff',
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    fontWeight: '600',
  },
  actionButtonTextOutline: {
    color: colors.button,
  },
});

export default styles;
