import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: colors.background,
  },
  formScroll: {
    paddingBottom: 120,
  },
  form: {
    gap: 6,
    padding: 15,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 19,
    color: colors.maintext,
  },
  subheading: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.subtextInput,
    marginTop: 4,
  },

  inputLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtextInput,
    marginLeft: 4,
    marginTop: 6,
    marginBottom: 5,
  },
  input: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
    justifyContent: 'center',
  },
  multilineInput: {
    height: 96,
    paddingTop: 14,
    paddingBottom: 14,
  },

  photoButton: {
    height: 140,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    overflow: 'hidden',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  photoText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtextInput,
  },

  dropdown: {
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    paddingHorizontal: 18,
  },
  dropdownText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.subtext,
  },
  dropdownPlaceholder: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.subtextInput,
  },

  toggleGroup: {
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginTop: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  toggleLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.maintext,
  },
  pill: {
    paddingHorizontal: 14,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.subtextInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  pillText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.subtextInput,
  },
  pillTextActive: {
    color: '#fff',
  },

  bottomContainer: {
    gap: 10,
    marginTop: 18,
  },
  submitButton: {
    backgroundColor: colors.button,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.button,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: colors.button,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },

  bottomNavigationBar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    paddingVertical: 15,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 35,
    backgroundColor: colors.container_bg2,
    position: 'absolute',
    bottom: 0,
  },
});

export default styles;
