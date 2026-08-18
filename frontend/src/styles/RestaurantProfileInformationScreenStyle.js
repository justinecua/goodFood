import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  section: {
    alignItems: 'center',
    flex: 1,
  },
  midContainer: {
    gap: 6,
    padding: 15,
    justifyContent: 'center',
    width: '100%',
  },

  midSubContainer: {
    gap: 6,
    padding: 15,
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 15,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 4,
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
    marginBottom: 4,
  },

  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.subtextInput,
  },
  stepDotActive: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  stepLine: {
    width: 28,
    height: 2,
    backgroundColor: colors.button,
    marginHorizontal: 4,
  },

  profileImageWrapper: {
    alignSelf: 'center',
    marginBottom: 6,
    marginTop: 4,
  },
  profileImageButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.container_bg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  profileImageText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 5,
    right: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },

  cameraBadgeText: {
    fontSize: 14,
  },

  inputLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtextInput,
    marginLeft: 4,
    marginTop: 5,
    marginBottom: 5,
  },

  addDishInput: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
    justifyContent: 'center',
  },

  bottomContainer: {
    gap: 10,
    marginTop: 10,
  },
  addDishButton: {
    backgroundColor: colors.button,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addDishButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    fontWeight: '600',
  },
  cancelDishButton: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.button,
    height: 52,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelDishButtonText: {
    color: colors.button,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
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

  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalSubContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 30,
  },

  modalContentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  modalCancel: {
    fontSize: 16,
    color: 'gray',
  },

  modalDone: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },

  modalDateTimePicker: {
    alignItems: 'center',
    width: '100%',
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
});

export default styles;
