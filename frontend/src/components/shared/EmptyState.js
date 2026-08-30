import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import colors from '../../constants/colors';

// Centered "nothing here yet" block. Used on list screens and the owner's
// home / inbox / notification tabs.
//
//   <EmptyState icon={Bell} title="No notifications" message="..." />
//   <EmptyState ... actionLabel="Add Dish" onAction={goToAddDish} />
//
// `compact` drops the big icon circle and tightens the spacing, for empty
// sections sitting inside a scroll view rather than filling the screen.
const EmptyState = ({
  icon: Icon,
  title,
  message,
  actionLabel,
  onAction,
  compact = false,
}) => (
  <View style={[styles.wrap, compact && styles.wrapCompact]}>
    {Icon && !compact ? (
      <View style={styles.iconCircle}>
        <Icon size={30} color={colors.subtext} />
      </View>
    ) : null}

    {Icon && compact ? <Icon size={22} color={colors.subtextInput} /> : null}

    <Text style={styles.title}>{title}</Text>
    {message ? <Text style={styles.message}>{message}</Text> : null}

    {actionLabel && onAction ? (
      <TouchableOpacity style={styles.button} onPress={onAction}>
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 8,
  },
  wrapCompact: {
    flex: 0,
    paddingVertical: 26,
    gap: 6,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.container_bg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  title: {
    fontFamily: 'Ezra-SemiBold',
    fontSize: 15,
    color: colors.maintext,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Ezra-Regular',
    fontSize: 12,
    color: colors.subtext,
    textAlign: 'center',
    lineHeight: 18,
  },
  button: {
    marginTop: 6,
    backgroundColor: colors.button,
    paddingHorizontal: 22,
    height: 46,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.button_text,
    fontFamily: 'Ezra-SemiBold',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default EmptyState;
