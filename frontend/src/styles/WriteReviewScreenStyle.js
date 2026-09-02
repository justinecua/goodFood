import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

// The review form: a subject card at the top, one rating block per criterion,
// a comment box, and a submit bar pinned to the bottom.
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    padding: 15,
    paddingBottom: 130,
    gap: 14,
  },

  // What is being reviewed.
  subject: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.container_bg2,
    borderRadius: 14,
    padding: 14,
  },
  subjectThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.container_bg,
  },
  subjectThumbEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectBody: {
    flex: 1,
    gap: 3,
  },
  subjectName: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.maintext,
  },
  subjectMeta: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
  },

  // A single 1-5 rating row.
  ratingBlock: {
    backgroundColor: colors.container_bg2,
    borderRadius: 14,
    padding: 16,
    gap: 4,
    alignItems: 'center',
  },
  ratingLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
  ratingHint: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtext,
    textAlign: 'center',
  },
  ratingStars: {
    marginTop: 8,
    gap: 6,
  },
  ratingWord: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.button,
    marginTop: 8,
    minHeight: 18,
  },

  // Running average of the three restaurant criteria.
  overall: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.button_green_light,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  overallLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    color: colors.maintext,
  },
  overallValue: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 18,
    color: colors.button,
  },

  // Comment box.
  commentBlock: {
    backgroundColor: colors.container_bg2,
    borderRadius: 14,
    padding: 16,
    gap: 8,
  },
  commentLabel: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
  commentInput: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.maintext,
    backgroundColor: colors.container_bg,
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  commentCount: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
    textAlign: 'right',
  },

  error: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: '#c0392b',
    textAlign: 'center',
  },

  // Pinned submit bar.
  submitBar: {
    position: 'absolute',
    left: 15,
    right: 15,
    bottom: 20,
    gap: 8,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 52,
    borderRadius: 20,
    backgroundColor: colors.button,
  },
  submitButtonDisabled: {
    backgroundColor: colors.subtextInput,
  },
  submitButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteLink: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  deleteLinkText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: '#c0392b',
  },
});

export default styles;
