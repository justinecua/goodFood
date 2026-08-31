import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.container_bg2,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  iconBadge: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 21,
    color: colors.maintext,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 10,
    fontFamily: 'Averta-Cyrillic-Regular',
    fontSize: 15,
    lineHeight: 22,
    color: colors.subtext,
    textAlign: 'center',
  },

  points: {
    marginTop: 30,
    width: '100%',
  },
  point: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.container_bg,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
  },
  pointIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  pointText: {
    flex: 1,
    fontFamily: 'Averta-Cyrillic-Regular',
    fontSize: 13,
    lineHeight: 19,
    color: colors.subtext,
  },

  actions: {
    paddingHorizontal: 22,
    paddingBottom: 28,
  },
  allowButton: {
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowButtonText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.button_text,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  cancelButton: {
    marginTop: 10,
    height: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.button,
  },
});

export default styles;
