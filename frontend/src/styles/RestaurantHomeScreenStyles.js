import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  upperActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  switchButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },
  fontStyle: {
    fontFamily: 'Ezra-SemiBold',
  },
  background: {
    flex: 1,
    padding: 20,
    height: '100%',
    backgroundColor: colors.container_bg,
  },

  navBotton: {
    alignItems: 'center',
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 20,
    fontFamily: 'Ezra-SemiBold',
  },
  textStyle1: {
    fontSize: 12,
    fontFamily: 'Averta Cyrillic Bold',
    color: colors.gray,
    justifyContent: 'space-between',
    backgroundColor: colors.container_bg,
  },
  bottomNavBar: {
    backgroundColor: colors.container_bg2,
  },
  goodFoodText: {
    height: 28,
    width: 149,
    margin: 5,
  },
  cardBanner: {
    backgroundColor: colors.background1,
    height: 160,
    width: '100%',
    borderRadius: 20,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 30,
  },
  bannerButton: {
    backgroundColor: colors.background2,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#2e8b57',
    fontWeight: '600',
    fontSize: 12,
    fontFamily: 'Ezra-SemiBold',
  },
  cardBannerImage: {
    height: 150,
    width: 170,
    borderRadius: 15,
  },
  bannerText: {
    padding: 0,
    fontSize: 19,
    color: '#f8f8f8',
    fontFamily: 'Ezra-SemiBold',
  },
  bannerText1: {
    fontSize: 25,
    color: '#f8f8f8',
    paddingTop: 12,
  },
  icon: {
    height: 24,
    width: 24,
  },
  icon1: {
    height: 26,
    width: 26,
  },
  icon2: {
    height: 27,
    width: 27,
  },
  icon3: {
    height: 28,
    width: 28,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background2,
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    marginTop: 20,
  },
  searchBarText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
  },
  searchLens: {
    height: 25,
    width: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 5,
  },
  sectionHeaderText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
  },
  sectionHeaderText1: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.gray,
    fontSize: 12,
  },
  dishContainer: {
    flexDirection: 'column',
  },
  dishSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dishCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 190,
    width: 171,
    backgroundColor: colors.background2,
    marginTop: 15,
    borderRadius: 10,
  },
  dishImage: {
    height: 100,
    width: 150,
  },
  dishUnderline: {
    backgroundColor: colors.underlineColor,
    height: 2,
    width: 50,
    margin: 10,
    borderRadius: 100,
  },
  dishText: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
    fontSize: 11,
    marginBottom: 5,
  },
  emptySection: {
    backgroundColor: colors.background2,
    borderRadius: 14,
    marginTop: 12,
  },
  emptySectionLast: {
    marginBottom: 70,
  },
  restaurantContainer: {
    flexDirection: 'column',
  },
  restaurantSubContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  restaurantCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 140,
    width: 109,
    paddingHorizontal: 6,
    backgroundColor: colors.background2,
    marginTop: 15,
    borderRadius: 10,
  },
  restaurantCardImage: {
    height: 60,
    width: 60,
  },
  restaurantText: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
    fontSize: 11,
    marginTop: 9,
  },

  userProfile: {
    height: 55,
    width: 55,
  },

  firstSteps: {
    marginTop: 15,
    gap: 10,
  },

  firstStepsLoading: {
    marginVertical: 40,
  },
  button: {
    backgroundColor: colors.background2,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.button,
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  buttonText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.button,
  },

  iconButton: {
    backgroundColor: colors.button,
    padding: 13,
    marginRight: 10,
    borderRadius: 25,
  },

  // --- Top dishes / top restaurants --------------------------------------
  // Both lists are location-aware, so each card carries its rating and how
  // far away it is.
  sectionLoading: {
    paddingVertical: 30,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationLink: {
    fontSize: 12,
    fontFamily: 'Ezra-SemiBold',
    color: colors.button,
  },

  dishImageEmpty: {
    height: 100,
    width: 150,
    borderRadius: 8,
    backgroundColor: colors.container_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dishCardBody: {
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 2,
  },
  dishMeta: {
    fontFamily: 'Ezra-Regular',
    fontSize: 10,
    color: colors.subtextInput,
    marginBottom: 6,
  },
  // A half-width filler keeps the last row aligned when the count is odd.
  dishCardSpacer: {
    height: 190,
    width: 171,
    marginTop: 15,
  },

  restaurantCardImageEmpty: {
    height: 60,
    width: 60,
    borderRadius: 30,
    backgroundColor: colors.container_bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  restaurantMeta: {
    fontFamily: 'Ezra-Regular',
    fontSize: 10,
    color: colors.subtextInput,
    marginTop: 2,
  },
  restaurantCardSpacer: {
    height: 140,
    width: 109,
    marginTop: 15,
  },

  rankBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 10,
    color: colors.button_text,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.maintext,
  },
  ratingCount: {
    fontFamily: 'Ezra-Regular',
    fontSize: 10,
    color: colors.subtextInput,
  },

  // The "Latest Reviews" feed closes the home screen, so it carries the
  // clearance for the bottom navbar.
  reviewFeed: {
    gap: 10,
    marginTop: 12,
    marginBottom: 70,
  },
});

export default styles;
