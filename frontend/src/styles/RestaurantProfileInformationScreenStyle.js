import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  section: {
    alignItems: 'center',
    flex: 1,
  },

  midContainer: {
    gap: 10,
    padding: 15,
    justifyContent: 'center',
    width: '100%',
  },

  addDishInput: {
    height: 57,
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
  headerContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '200',
    fontSize: 19,
    color: colors.maintext,
  },
});

export default styles;
