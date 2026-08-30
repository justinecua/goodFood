import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 24,
  },
  preview: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.container_bg,
  },
  chooseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.button,
  },
  chooseButtonText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    fontWeight: '600',
    color: colors.button,
  },

  footer: {
    padding: 15,
  },
  saveButton: {
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default styles;
