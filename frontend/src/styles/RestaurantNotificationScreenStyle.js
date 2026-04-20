import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.container_bg2,
  },
  back: {
    fontSize: 22,
    color: colors.maintext,
    marginBottom: 10,
    fontFamily: 'Ezra-SemiBold',
  },
  card: {
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 25,
  },
  headerContainer: {
    alignItems: 'center',
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '200',
    fontSize: 22,
    color: colors.maintext,
  },
  midContainer: {
    flex: 1,
    gap: 10,
    justifyContent: 'topS',
  },
    cardText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Ezra-SemiBold',
    color: colors.button,
  },
  addDishInput: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    color: colors.subtext,
    fontFamily: 'Ezra-SemiBold',
    justifyContent: 'center',
  },
  placeholderText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
  },
  descriptionInput: {
    height: 90,
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  imagePreviewContainer: {
    height: 80,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  imageIconCircle: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: colors.container_bg2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIconText: {
    color: colors.subtextInput,
    fontSize: 12,
    fontWeight: '600',
  },
  imagePreviewText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
  },
  dropdownContainer: {
    height: 48,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: colors.container_bg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
  },
  dropdownArrow: {
    color: colors.subtextInput,
    fontSize: 11,
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
  justifyContent: 'space-around',
  alignItems: 'center',
  height: 65,
  borderRadius: 25,
  backgroundColor: colors.container_bg,
  marginTop: 10,
  paddingHorizontal: 10,
  },
  navItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  navIconImage: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
    navIconText: {
    color: colors.subtextInput,
    fontSize: 10,
    fontWeight: '600',
  },
});

export default styles;