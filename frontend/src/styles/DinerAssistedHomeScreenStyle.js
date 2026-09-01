import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.container_bg2,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingTop: 18,
  },
  headerText: {
    flex: 1,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 20,
    color: colors.maintext,
  },
  subheading: {
    marginTop: 3,
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
  },
  switchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  hitSlop: { top: 8, bottom: 8, left: 8, right: 8 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
    marginTop: 16,
    paddingHorizontal: 16,
    height: 52,
    borderRadius: 18,
    backgroundColor: colors.container_bg,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    paddingVertical: 0,
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.maintext,
  },
  clear: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.button,
  },

  chipRow: {
    // Without both, the populated results list squeezes the chips and the
    // map card rides up over them.
    flexGrow: 0,
    flexShrink: 0,
    marginTop: 14,
  },
  chipRowContent: {
    paddingHorizontal: 25,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    backgroundColor: colors.container_bg,
  },
  chipActive: {
    backgroundColor: colors.button,
  },
  chipText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtext,
  },
  chipTextActive: {
    color: colors.button_text,
  },

  mapWrap: {
    height: 200,
    flexShrink: 0,
    marginHorizontal: 25,
    marginTop: 14,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.container_bg,
  },
  map: {
    flex: 1,
  },

  results: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 25,
    paddingTop: 14,
    paddingBottom: 90,
  },
  listEmpty: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 90,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.container_bg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardName: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
  cardMeta: {
    marginTop: 2,
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
    textTransform: 'capitalize',
  },
  cardAddress: {
    marginTop: 2,
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
  },
  cardDistance: {
    alignItems: 'center',
    marginLeft: 10,
  },
  cardDistanceText: {
    marginTop: 3,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.subtext,
  },

  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  centeredText: {
    marginTop: 10,
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
  },
});

export default styles;
