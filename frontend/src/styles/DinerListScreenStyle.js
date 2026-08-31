import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

// Shared by the simple diner sub-screens reached from the profile tab
// (favorites, plan and billing).
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.container_bg2,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 90,
  },

  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  planIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  planBody: {
    flex: 1,
  },
  planName: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.maintext,
  },
  planMeta: {
    marginTop: 3,
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    lineHeight: 17,
    color: colors.subtext,
  },
  planButton: {
    marginTop: 12,
    height: 52,
    borderRadius: 16,
    backgroundColor: colors.button,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planButtonText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.button_text,
  },
  sectionTitle: {
    marginTop: 26,
    marginBottom: 4,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
});

export default styles;
