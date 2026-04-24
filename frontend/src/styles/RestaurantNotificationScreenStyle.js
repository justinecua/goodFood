import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 25,
    backgroundColor: colors.container_bg2,
  },
  back: {
    fontSize: 22,
    color: colors.maintext,
    marginBottom: 10,
    fontFamily: 'Ezra-SemiBold',
  },
  card: {
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 25,
  },
  headerContainer: {
    alignItems: 'center',
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
    justifyContent: 'topS',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Ezra-SemiBold',
    color: colors.button,
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
    height: 90,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
});

export default styles;
