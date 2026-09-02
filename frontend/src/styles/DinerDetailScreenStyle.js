import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

// Shared layout for the diner's restaurant and dish pages: a hero image, a
// rating panel, some sections, then the review list and a rate button pinned
// to the bottom.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 30,
  },
  notFound: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
  },
  scroll: {
    paddingBottom: 110,
  },

  // Hero
  cover: {
    width: '100%',
    height: 180,
    backgroundColor: colors.container_bg,
  },
  coverEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    padding: 15,
    gap: 6,
    backgroundColor: colors.container_bg2,
  },
  title: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 20,
    color: colors.maintext,
  },
  price: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 18,
    color: colors.button,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  subtitle: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
    lineHeight: 18,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },

  // Chips (cuisine categories, dish tags)
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: colors.button_green_light,
    borderRadius: 20,
    paddingHorizontal: 11,
    paddingVertical: 5,
  },
  chipText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.button,
  },
  chipMuted: {
    backgroundColor: colors.container_bg,
  },
  chipTextMuted: {
    color: colors.subtext,
  },

  // Sections
  section: {
    marginTop: 12,
    padding: 15,
    backgroundColor: colors.container_bg2,
    gap: 8,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.maintext,
  },
  sectionLink: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.button,
  },
  sectionBody: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    lineHeight: 20,
    color: colors.maintext,
  },

  // Rating panel: big average on the left, 5..1 bars on the right.
  ratingPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  ratingAverage: {
    alignItems: 'center',
    gap: 3,
  },
  ratingAverageValue: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 34,
    color: colors.maintext,
  },
  ratingAverageCount: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
  },
  ratingBars: {
    flex: 1,
    gap: 4,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingBarLabel: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
    width: 10,
  },
  ratingBarTrack: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.container_bg,
    overflow: 'hidden',
  },
  ratingBarFill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.button,
  },
  ratingBreakdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.container_bg,
  },
  ratingCriterion: {
    alignItems: 'center',
    gap: 3,
  },
  ratingCriterionLabel: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
  },
  ratingCriterionValue: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.maintext,
  },

  // Menu rows
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  menuThumb: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.container_bg,
  },
  menuThumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuBody: {
    flex: 1,
    gap: 2,
  },
  menuName: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.maintext,
  },
  menuMeta: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
  },
  menuPrice: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.button,
  },

  // Hours
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  hoursDay: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.maintext,
  },
  hoursTime: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
  },
  hoursClosed: {
    color: colors.subtextInput,
  },

  reviewList: {
    gap: 10,
    marginTop: 4,
  },

  // Pinned "rate this" button
  rateBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 20,
  },
  rateBarRow: {
    flexDirection: 'row',
    gap: 10,
  },
  rateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.button,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: colors.container_bg2,
    borderWidth: 1.5,
    borderColor: colors.button,
  },
  messageButtonText: {
    color: colors.button,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  rateButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
