import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    padding: 15,
  },
  form: {
    gap: 6,
  },
  inputLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtextInput,
    marginLeft: 4,
    marginTop: 8,
    marginBottom: 5,
  },
  input: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
  },
  submitButton: {
    marginTop: 20,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
});

export default styles;
