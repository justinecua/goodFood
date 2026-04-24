import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  fontStyle: {
    fontFamily: 'Ezra-SemiBold',
  },
  background: {
    flex: 1,
    padding: 25,
    height: '100%',
    backgroundColor: colors.container_bg,
  },
  // bottomNavBar: {
  //   height: 80,
  //   backgroundColor: colors.container_bg2,
  // },
  // iconContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   paddingTop: 12,
  // },
  // icon: {
  //   height: 24,
  //   width: 24,
  // },
  // icon1: {
  //   height: 26,
  //   width: 26,
  // },
  // icon2: {
  //   height: 27,
  //   width: 27,
  // },
  // icon3: {
  //   height: 28,
  //   width: 28,
  // },
  navBotton: {
    alignItems: 'center',
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  userProfile: {
    height: 64,
    width: 64,
  },
  textStyle: {
    fontSize: 20,
    fontFamily: 'Ezra-SemiBold',
  },
  textStyle1: {
    fontSize: 12,
    fontFamily: 'Averta Cyrillic Bold',
    color: colors.gray
    justifyContent: 'space-between',
    backgroundColor: colors.container_bg,
  },
  bottomNavBar: {
    backgroundColor: colors.container_bg2,
  },
  goodFoodText: {
    height: 28 ,
    width: 149,
    margin: 5
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
    paddingRight: 30 
  },
  bannerButton: {
    backgroundColor: '#E5E5E5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: '#2e8b57',
    fontWeight: '600',
    fontSize:12,
    fontFamily: 'Ezra-SemiBold',
  },
  cardBannerImage: {
    height: 150,
    width: 170,
    borderRadius: 15
  },
  bannerText: {
    padding: 0,
    fontSize: 19,
    color: '#f8f8f8',
    fontFamily: 'Ezra-SemiBold',
  },
  bannerText1: {
    fontSize: 25,
    color: '#f8f8f8'
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
  navBotton: {
    alignItems: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background2,
    borderRadius: 30,
    paddingHorizontal: 20,
    height: 55,
    marginTop: 25
  },
  searchBarText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12
  },
  searchLens: {
    height: 25,
    width: 25
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 5
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
    justifyContent: 'space-between'
  },
  dishCard: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 165,
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
    borderRadius: 100
  },
  dishText: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
    fontSize: 11,
    marginBottom:5
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
    height: 120,
    width: 109,
    backgroundColor: colors.background2,
    marginTop: 15,
    borderRadius: 10,
  },
  restaurantCardImage: {
    height: 60,
    width: 60
  },
  restaurantText: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
    fontSize: 11,
    marginTop: 9
  }

  userProfile: {
    height: 55,
    width: 55,
  },
});

export default styles;
