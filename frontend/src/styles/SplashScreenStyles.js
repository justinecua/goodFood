import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSymbol: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  logo: {
    marginTop: -15,
    width: 100,
    resizeMode: 'contain',
    marginBottom: 1,
  },
});

export default styles;
