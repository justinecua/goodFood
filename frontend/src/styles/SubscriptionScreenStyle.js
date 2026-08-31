import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  subscriptionContainer: {
    flex: 1,
    backgroundColor: colors.container_bg2,
  },
  bgContainer: {},
  bgCover: {
    width: '100%',
    height: 500,
    resizeMode: 'contain',
  },
  goodFoodLogo: {
    marginTop: '-30',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitleContainer: {
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  subtitle: {
    fontFamily: 'Averta-Cyrillic-SemiBold',
    color: colors.subtext,
    fontSize: 20,
    textAlign: 'center',
  },

  subscriptionButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 23,
    paddingHorizontal: 22,
    borderWidth: 1,
    borderColor: colors.button,
    borderRadius: 20,
  },

  subscriptionButton2: {
    marginTop: 10,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 23,
    paddingHorizontal: 22,
    borderRadius: 20,
    backgroundColor: colors.container_bg,
  },
  subButtonContainer: {
    marginTop: 17,
    width: '100%',
  },
  registerButtonText: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
    fontSize: 12,
    textAlign: 'left',
  },
  registerButtonPrice: {
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
    fontSize: 12,
    textAlign: 'right',
  },

  bottomSub: {
    marginTop: 12,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomSubtitle: {
    width: '90%',
    textAlign: 'center',
    fontFamily: 'Averta-Cyrillic-SemiBold',
    color: colors.subtext,
    fontSize: 12,
  },
  ContinueButton: {
    marginTop: 20,
    backgroundColor: colors.button,
    height: 60,
    borderRadius: 20,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButtonText: {
    color: colors.container_bg,
    fontFamily: 'Ezra-SemiBold',
  },

  contentContainer: {
    flex: 1,
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginBottom: 90,
    padding: 15,
  },
});

export default styles;
