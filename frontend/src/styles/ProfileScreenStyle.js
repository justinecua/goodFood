import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  section: {
    flex: 1,
    padding: 15,
  },

  headerContainer: {
    alignItems: 'center',
    marginTop: 15,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '200',
    fontSize: 19,
    color: colors.maintext,
  },
  profileBanner: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: colors.background2,
    borderRadius: 20,
  },
  profileImage: {
    borderRadius: 15,
    width: 80,
    height: 80,
    objectFit: 'cover',
  },
  username: {
    fontSize: 19,
    fontFamily: 'Ezra-SemiBold',
  },
  email_address: {
    fontSize: 13,
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
  },

  mobile_number: {
    fontSize: 13,
    fontFamily: 'Ezra-SemiBold',
    color: colors.subtext,
  },

  leftprofileBanner: {
    marginRight: 15,
  },
  rightprofileBanner: {
    justifyContent: 'space-evenly',
  },
  bottomrightprofileBanner: {
    gap: 3,
  },

  button: {
    backgroundColor: colors.background2,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    justifyContent: 'space-between',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.bg_black,
    opacity: 0.7,
  },

  iconButton: {
    backgroundColor: colors.container_bg,
    padding: 13,
    marginRight: 10,
    borderRadius: 25,
  },
  bottomSection: {
    gap: 8,
  },

  bottomSectionTitle: {
    marginTop: 15,
    marginBottom: 10,
    fontFamily: 'Ezra-SemiBold',
    padding: 10,
  },
});

export default styles;
