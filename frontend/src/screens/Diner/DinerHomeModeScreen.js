import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LayoutGrid, Sparkles, ChevronRight } from 'lucide-react-native';
import styles from '../../styles/DinerHomeModeScreenStyle';
import colors from '../../constants/colors';
import goodFoodGreen from '../../assets/images/goodFood_green.png';
import { getHomeMode, setHomeMode, routeForMode } from '../../utils/homeMode';

const OPTIONS = [
  {
    mode: 'default',
    Icon: LayoutGrid,
    title: 'Default home',
    body: 'Browse top dishes and top restaurants, the way the app normally opens.',
  },
  {
    mode: 'assisted',
    Icon: Sparkles,
    title: 'Assisted home',
    body: 'Tell us what you feel like eating and we suggest food places near you.',
  },
];

/**
 * Lets the diner pick which home screen they land on. The choice is
 * remembered, so this only interrupts the first time - reaching it again
 * (the "Switch" control on either home screen) passes `change: true`, which
 * skips the auto-forward and shows the options.
 */
const DinerHomeModeScreen = ({ navigation, route }) => {
  const isChanging = route.params?.change === true;
  const [checking, setChecking] = useState(!isChanging);

  useEffect(() => {
    if (isChanging) return;

    let cancelled = false;

    getHomeMode().then(mode => {
      if (cancelled) return;

      if (mode) {
        navigation.replace(routeForMode(mode));
        return;
      }

      setChecking(false);
    });

    return () => {
      cancelled = true;
    };
  }, [isChanging, navigation]);

  const choose = async mode => {
    await setHomeMode(mode);
    navigation.replace(routeForMode(mode));
  };

  // Nothing to show while the stored choice is being read - rendering the
  // options first would flash them at everyone who already picked.
  if (checking) return <SafeAreaView style={styles.screen} />;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <Image style={styles.logo} source={goodFoodGreen} />

        <Text style={styles.title}>How do you want to start?</Text>
        <Text style={styles.subtitle}>
          You can switch between the two at any time from your home screen.
        </Text>

        <View style={styles.options}>
          {OPTIONS.map(({ mode, Icon, title, body }) => (
            <TouchableOpacity
              key={mode}
              style={styles.option}
              onPress={() => choose(mode)}
              activeOpacity={0.85}
            >
              <View style={styles.optionIcon}>
                <Icon size={22} color={colors.button} />
              </View>

              <View style={styles.optionBody}>
                <Text style={styles.optionTitle}>{title}</Text>
                <Text style={styles.optionText}>{body}</Text>
              </View>

              <ChevronRight size={20} color={colors.subtextInput} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DinerHomeModeScreen;
