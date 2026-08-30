import { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Moon, Sun } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import { useTheme } from '../../contexts/ThemeContext';

const OPTIONS = [
  { key: 'light', label: 'Light', icon: Sun },
  { key: 'dark', label: 'Dark', icon: Moon },
];

const RestaurantSettingsScreen = ({ navigation }) => {
  const { mode, setMode, colors } = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader title="Settings" onBack={() => navigation.goBack()} />

      <View style={styles.body}>
        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.card}>
          {OPTIONS.map((option, i) => {
            const Icon = option.icon;
            const active = mode === option.key;
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.row, i > 0 && styles.rowBorder]}
                onPress={() => setMode(option.key)}
              >
                <Icon size={18} color={colors.maintext} />
                <Text style={styles.rowText}>{option.label}</Text>
                {active ? (
                  <Check size={18} color={colors.button} />
                ) : (
                  <View style={styles.checkPlaceholder} />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.hint}>
          Your choice is saved on this device. Screens are being updated to
          follow the theme.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const makeStyles = colors =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
    body: {
      padding: 15,
    },
    sectionLabel: {
      fontFamily: 'Ezra-SemiBold',
      fontSize: 12,
      color: colors.subtextInput,
      marginLeft: 4,
      marginBottom: 8,
    },
    card: {
      backgroundColor: colors.container_bg2,
      borderRadius: 16,
      overflow: 'hidden',
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
    },
    rowBorder: {
      borderTopWidth: 1,
      borderTopColor: colors.background,
    },
    rowText: {
      flex: 1,
      fontFamily: 'Ezra-SemiBold',
      fontSize: 14,
      color: colors.maintext,
    },
    checkPlaceholder: {
      width: 18,
    },
    hint: {
      fontFamily: 'Ezra-Regular',
      fontSize: 11,
      color: colors.subtextInput,
      marginTop: 12,
      marginLeft: 4,
      lineHeight: 16,
    },
  });

export default RestaurantSettingsScreen;
