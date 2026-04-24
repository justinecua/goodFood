import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  bottomContainer: { marginBottom: 50 },
  bottomContent: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSubContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  bottomsubHeadingLogin: {
    color: colors.button,
    fontFamily: 'Averta Cyrillic Bold',
    fontWeight: 700,
  },

  topContainer: {},
  headings: {
    fontFamily: 'Averta Cyrillic Bold',
    fontSize: 33,
    marginBottom: 20,
    color: colors.maintext,
    fontWeight: 600,
  },
  subHeadings: {
    fontFamily: 'Averta-Cyrillic-SemiBold',
    fontSize: 21,
    color: colors.subtext,
    fontWeight: 500,
  },
  subHeadings2: {
    fontFamily: 'Averta-Cyrillic-SemiBold',
    fontSize: 21,
    color: colors.subtext,
    marginBottom: 40,
    fontWeight: 500,
  },
  midContainer: {
    gap: 12,
  },
  registerInput: {
    height: 60,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 20,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
  },
  registerButton: {
    backgroundColor: colors.button,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: colors.container_bg,
    fontFamily: 'Ezra-SemiBold',
  },
  bottomsubHeading: {
    fontFamily: 'Averta-Cyrillic-SemiBold',
    fontWeight: 600,
    color: colors.subtext,
  },
  UpperLogo: {
    width: 130,
    height: 40,
    resizeMode: 'contain',
  },
  UpperLogoContainer: {
    marginTop: 20,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  background: {
    padding: 25,
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: colors.container_bg2,
  },
});

export default styles;
