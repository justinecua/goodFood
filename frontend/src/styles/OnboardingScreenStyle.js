import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.container_bg2,
  },
  topBar: {
    height: 44,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 110,
    height: 28,
    resizeMode: 'contain',
  },
  skip: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.subtext,
  },
  hitSlop: { top: 12, bottom: 12, left: 12, right: 12 },

  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },
  iconBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 34,
  },
  slideTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 22,
    color: colors.maintext,
    textAlign: 'center',
    marginBottom: 12,
  },
  slideBody: {
    fontFamily: 'Averta-Cyrillic-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.subtext,
    textAlign: 'center',
  },

  footer: {
    paddingHorizontal: 22,
    paddingBottom: 28,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    backgroundColor: colors.subtextInput,
  },
  dotActive: {
    width: 22,
    backgroundColor: colors.button,
  },
  primaryButton: {
    width: '100%',
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.button_text,
  },
});

export default styles;
