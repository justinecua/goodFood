import { StyleSheet } from 'react-native';
import colors from '../constants/colors';

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
  },
  notFound: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.subtext,
  },

  scroll: {
    padding: 15,
    paddingBottom: 40,
  },

  image: {
    width: '100%',
    height: 210,
    borderRadius: 18,
    backgroundColor: colors.container_bg,
  },
  imageEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  imageEmptyText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 12,
    color: colors.subtextInput,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  name: {
    flex: 1,
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 20,
    color: colors.maintext,
  },
  price: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 18,
    color: colors.button,
  },
  category: {
    fontFamily: 'Ezra-Regular',
    fontSize: 13,
    color: colors.subtext,
    marginTop: 2,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  tag: {
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.button_green_light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagMuted: {
    backgroundColor: colors.container_bg,
  },
  tagText: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 11,
    color: colors.button,
  },
  tagTextMuted: {
    color: colors.subtext,
  },

  section: {
    marginTop: 20,
    gap: 4,
  },
  sectionTitle: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 13,
    color: colors.subtextInput,
  },
  sectionBody: {
    fontFamily: 'Ezra-Regular',
    fontSize: 14,
    lineHeight: 21,
    color: colors.maintext,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 15,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: colors.container_bg,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 50,
    borderRadius: 20,
  },
  editBtn: {
    backgroundColor: colors.button,
  },
  deleteBtn: {
    backgroundColor: colors.container_bg2,
    borderWidth: 1.5,
    borderColor: '#c0392b',
  },
  actionBtnText: {
    color: '#fff',
    fontFamily: 'Ezra-SemiBold',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteBtnText: {
    color: '#c0392b',
  },
});

export default styles;
