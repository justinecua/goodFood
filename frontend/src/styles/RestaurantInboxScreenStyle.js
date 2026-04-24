import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
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
    justifyContent: 'top',
  },
  searchInput: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
    flexDirection: 'row',       
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  placeholderText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
  },
  searchIcon: {  
    width: 16,
    height: 16,
    marginRight: 19,
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
});

export default styles;