import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    backgroundColor: colors.container_bg2,
    justifyContent: 'space-between',
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
    marginTop: 30,
    flex: 1,
    gap: 10,
    justifyContent: 'center',
  },
  addDishInput: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
  },
  descriptionInput: {
    height: 130,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  imagePreviewContainer: {
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  imageIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.container_bg2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIconText: {
    color: colors.subtextInput,
    fontSize: 12,
    fontWeight: '600',
  },
  imagePreviewText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
  },
  dropdownContainer: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
  },
  dropdownArrow: {
    color: colors.subtextInput,
    fontSize: 11,
  },
  bottomContainer: {
    gap: 10,
    marginTop: 10,
  },
  addDishButton: {
    backgroundColor: colors.button,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDishButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelDishButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.button,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelDishButtonText: {
    color: colors.button,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
  },
  bottomNavigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 35,
    backgroundColor: colors.container_bg2,
    position: 'absolute',
    bottom: 0,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  homeIcon: {
    marginTop: -3,
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  chatIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginBottom: 2,
  },
  dishIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  notifIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  profileIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
  },
  navIconText: {
    marginTop: 2,
    color: colors.subtextInput,
    fontSize: 10,
    fontWeight: '600',
  },
  homenavIconText: {
    marginTop: 2,
    color: colors.subtextInput,
    fontSize: 10,
    fontWeight: '600',
  },

  // Anchor for the unread badge. The icons are sized individually, so the
  // wrapper stays a fixed square and the badge always lands in the same place
  // relative to the tab rather than shifting with each icon's dimensions.
  // Wider than the icons it holds so the badge stays inside the wrapper's
  // bounds - Android clips children that spill past a parent.
  iconWrap: {
    width: 36,
    height: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadge: {
    position: 'absolute',
    top: -5,
    left: 18,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 9,
    backgroundColor: colors.badge,
    alignItems: 'center',
    justifyContent: 'center',
    // A ring in the bar's own colour keeps the bubble legible where it
    // overlaps the icon underneath.
    borderWidth: 2,
    borderColor: colors.container_bg2,
  },
  navBadgeText: {
    color: '#fff',
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '700',
  },
});

export default styles;
