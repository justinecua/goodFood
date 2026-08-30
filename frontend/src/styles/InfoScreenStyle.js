import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

// Shared style for plain text screens (Privacy Policy, About).
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 18,
    paddingBottom: 40,
  },
  intro: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: colors.subtext,
    marginBottom: 8,
  },
  blockTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: colors.maintext,
    marginTop: 20,
    marginBottom: 6,
  },
  blockBody: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    lineHeight: 21,
    color: colors.maintext,
  },
  meta: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
    marginTop: 24,
  },

  // About screen
  logoWrap: {
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 18,
    color: colors.maintext,
  },
  version: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtextInput,
  },
});

export default styles;
