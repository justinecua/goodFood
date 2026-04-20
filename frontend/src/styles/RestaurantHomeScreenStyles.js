import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    padding: 25,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.container_bg
  },
  bottomNavBar: {
    height: 80,
    backgroundColor: colors.container_bg2
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 12
  },
  icon: {
    height: 24,
    width: 24
  },
  icon1: {
    height: 26,
    width: 26
  },
  icon2: {
    height: 27,
    width: 27
  },
  icon3: {
    height: 28,
    width: 28
  },
  navBotton: {
    alignItems: 'center'
  },
  upperContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  userProfile: {
    height: 55,
    width: 55
  }
});

export default styles;