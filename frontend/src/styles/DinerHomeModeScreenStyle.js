import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.container_bg2,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
  logo: {
    width: 130,
    height: 34,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 28,
  },
  title: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 21,
    color: colors.maintext,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 8,
    fontFamily: 'Averta-Cyrillic-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.subtext,
    textAlign: 'center',
  },
  options: {
    marginTop: 26,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.container_bg,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  optionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  optionBody: {
    flex: 1,
  },
  optionTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.maintext,
  },
  optionText: {
    marginTop: 3,
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: colors.subtext,
  },
});

export default styles;
