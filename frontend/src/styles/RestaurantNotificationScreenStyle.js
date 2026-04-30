import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
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
    justifyContent: 'topS',
  },
  cardText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Ezra-SemiBold',
    color: colors.button,
  },
});

export default styles;
