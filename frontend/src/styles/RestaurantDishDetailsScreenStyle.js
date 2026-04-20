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
    padding: 15,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'contain',
    marginBottom: 10,
    borderRadius: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Ezra-SemiBold',
    color: colors.maintext,
  },
  price: {
    fontSize: 16,
    color: colors.button,
    fontWeight: '600',
    fontFamily: 'Ezra-SemiBold',
  },
  rating: {
    fontSize: 12,
    color: colors.gray,
    marginVertical: 5,
    fontFamily: 'Ezra-SemiBold',
  },
  status: {
    fontSize: 12,
    color: colors.gray,
    marginVertical: 5,
    fontFamily: 'Ezra-SemiBold',
  },
  description: {
    fontSize: 12,
    color: colors.subtext,
    marginVertical: 10,
    fontFamily: 'Ezra-SemiBold',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  commentBtn: {
    backgroundColor: colors.button,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingBtn: {
    backgroundColor: colors.container_bg2,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.button,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentText: {
    color: colors.button_text,
    fontSize: 12,
    fontFamily: 'Ezra-SemiBold',
  },
  ratingText: {
    color: colors.button,
    fontSize: 12,
    fontFamily: 'Ezra-SemiBold',
  },
});

export default styles;