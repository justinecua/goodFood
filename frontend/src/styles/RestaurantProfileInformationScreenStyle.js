import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  formScroll: {
    paddingBottom: 120,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
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
    justifyContent: 'center',
    width: '100%',
    padding: 10,
    borderRadius: 15,
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

  multilineInput: {
    height: 96,
    paddingTop: 14,
    paddingBottom: 14,
  },

  coverImageButton: {
    width: '100%',
    height: 150,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 4,
    marginBottom: 4,
  },
  coverImage: {
    width: '100%',
    height: '100%',
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

  // -------- Section headings (operating hours / categories / branches) --------
  sectionTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 15,
    color: colors.maintext,
    marginTop: 18,
    marginLeft: 4,
  },
  sectionHint: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
    marginLeft: 4,
    marginBottom: 4,
  },

  // -------- Operating hours --------
  hoursRow: {
    backgroundColor: colors.container_bg,
    borderRadius: 14,
    padding: 12,
    gap: 8,
    marginTop: 8,
  },
  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hoursDay: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.maintext,
  },
  hoursTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hoursTimeLabel: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
    width: 48,
  },
  hoursInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: colors.container_bg2,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    textAlign: 'center',
  },
  periodToggle: {
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.button,
  },
  periodOption: {
    width: 38,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.container_bg2,
  },
  periodOptionActive: {
    backgroundColor: colors.button,
  },
  periodOptionText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.button,
  },
  periodOptionTextActive: {
    color: '#fff',
  },
  closedPill: {
    paddingHorizontal: 12,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.subtextInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closedPillActive: {
    backgroundColor: colors.button,
    borderColor: colors.button,
  },
  closedPillText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.subtextInput,
  },
  closedPillTextActive: {
    color: '#fff',
  },

  // -------- Cuisine categories --------
  categoryInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryInput: {
    flex: 1,
  },
  categoryAddButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.button_green_light,
  },
  chipText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.button,
  },

  // -------- Branches --------
  branchCard: {
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 12,
    gap: 6,
    marginTop: 8,
  },
  branchCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  branchCardTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 13,
    color: colors.maintext,
  },
  branchCoordRow: {
    flexDirection: 'row',
    gap: 8,
  },
  branchCoordInput: {
    flex: 1,
  },
  addBranchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.button,
    marginTop: 10,
  },
  addBranchButtonText: {
    color: colors.button,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default styles;
