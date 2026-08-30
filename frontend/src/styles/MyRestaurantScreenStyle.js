import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  header: {
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 8,
  },
  heading: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 19,
    color: colors.maintext,
  },

  // Loading / empty state
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8,
  },
  emptyIconWrap: {
    width: 74,
    height: 74,
    borderRadius: 37,
    backgroundColor: colors.container_bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  emptyTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 16,
    color: colors.maintext,
  },
  emptyText: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.subtext,
    textAlign: 'center',
    marginBottom: 12,
  },
  primaryButton: {
    backgroundColor: colors.button,
    paddingHorizontal: 22,
    height: 48,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },

  // Details
  scroll: {
    padding: 15,
    paddingBottom: 120,
    gap: 14,
  },

  coverWrap: {
    marginBottom: 34,
  },
  cover: {
    width: '100%',
    height: 150,
    borderRadius: 18,
    backgroundColor: colors.container_bg,
  },
  coverEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverEmptyText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtextInput,
  },
  logoWrap: {
    position: 'absolute',
    bottom: -30,
    left: 18,
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.background,
    backgroundColor: colors.container_bg2,
  },
  logoEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  name: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    color: colors.maintext,
  },
  description: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    lineHeight: 19,
    color: colors.subtext,
  },

  card: {
    backgroundColor: colors.container_bg2,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 14,
    color: colors.maintext,
  },

  detailRow: {
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: colors.background,
    gap: 2,
  },
  detailLabel: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
  },
  detailValue: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    color: colors.maintext,
  },
  detailValueEmpty: {
    color: colors.subtextInput,
    fontFamily: 'Ezra-Regular',
  },

  footnote: {
    fontFamily: 'Ezra-Regular',
    fontSize: 11,
    color: colors.subtextInput,
    textAlign: 'center',
    marginTop: 2,
  },

  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.button,
    backgroundColor: 'transparent',
  },
  editButtonText: {
    color: colors.button,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
