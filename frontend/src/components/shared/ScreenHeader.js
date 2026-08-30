import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import colors from '../../constants/colors';

// Centered screen title with an optional back arrow on the left.
//
//   <ScreenHeader title="Menu" subtitle="5 dishes" onBack={navigation.goBack} />
const ScreenHeader = ({ title, subtitle, onBack, right }) => (
  <View style={styles.wrap}>
    {onBack ? (
      <TouchableOpacity
        style={styles.side}
        onPress={onBack}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <ChevronLeft size={24} color={colors.maintext} />
      </TouchableOpacity>
    ) : (
      <View style={styles.side} />
    )}

    <View style={styles.titleWrap}>
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>

    <View style={styles.side}>{right}</View>
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginTop: 15,
    marginBottom: 6,
  },
  side: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Ezra-SemiBold',
    fontWeight: '600',
    fontSize: 19,
    color: colors.maintext,
  },
  subtitle: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtextInput,
    marginTop: 2,
  },
});

export default ScreenHeader;
