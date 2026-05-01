import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  bottomContainer: { marginBottom: 30 },
  bottomContent: {
    marginBottom: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSubContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 7,
  },

  bottomsubHeadingLogin: {
    color: colors.button,
    fontFamily: 'Averta-Cyrillic-Bold',
    fontWeight: 700,
  },

  topContainer: {
    gap: 5,
  },
  headings: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 30,
    marginBottom: 10,
    color: colors.maintext,
    fontWeight: 600,
  },
  subHeadings: {
    fontFamily: 'Ezra-Regular',
    fontSize: 21,
    color: colors.subtext,
  },
  subHeadings2: {
    fontFamily: 'Ezra-Regular',
    fontSize: 18,
    color: colors.subtext,
    marginBottom: 40,
    fontWeight: 400,
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

  dropdown: {
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.container_bg,
    paddingHorizontal: 15,
    borderWidth: 0,
  },

  dropdownContainer: {
    borderRadius: 20,
    backgroundColor: colors.container_bg,
    borderWidth: 0,
  },

  dropdownText: {
    paddingLeft: 7,
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
  },

  dropdownPlaceholder: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtextInput,
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
    width: '100%',
    paddingTop: 40,
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
