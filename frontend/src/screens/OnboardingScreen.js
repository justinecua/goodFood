import { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UtensilsCrossed, Star, MapPin } from 'lucide-react-native';
import styles from '../styles/OnboardingScreenStyle';
import colors from '../constants/colors';
import goodFoodGreen from '../assets/images/goodFood_green.png';
import { markOnboardingSeen } from '../utils/onboarding';

const SLIDES = [
  {
    key: 'discover',
    Icon: UtensilsCrossed,
    title: 'Discover trusted restaurants',
    body: 'Browse places and dishes that real diners keep coming back to, not paid placements.',
  },
  {
    key: 'rate',
    Icon: Star,
    title: 'Rate what you eat',
    body: 'Score food, service and ambiance so the rankings stay honest for everyone.',
  },
  {
    key: 'nearby',
    Icon: MapPin,
    title: 'Find what is near you',
    body: 'Share your location and goodFood suggests the best restaurants around you.',
  },
];

const OnboardingScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const isLast = index === SLIDES.length - 1;

  const finish = async () => {
    await markOnboardingSeen();
    navigation.replace('Login');
  };

  const next = () => {
    if (isLast) {
      finish();
      return;
    }
    listRef.current?.scrollToIndex({ index: index + 1, animated: true });
  };

  // Track the visible slide from the scroll offset — simpler than
  // onViewableItemsChanged for a paged list this small.
  const onMomentumScrollEnd = event => {
    const offset = event.nativeEvent.contentOffset.x;
    setIndex(Math.round(offset / width));
  };

  const renderSlide = ({ item }) => {
    const { Icon } = item;

    return (
      <View style={[styles.slide, { width }]}>
        <View style={styles.iconBadge}>
          <Icon size={44} color={colors.button} />
        </View>
        <Text style={styles.slideTitle}>{item.title}</Text>
        <Text style={styles.slideBody}>{item.body}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.topBar}>
        <Image style={styles.logo} source={goodFoodGreen} />
        <TouchableOpacity onPress={finish} hitSlop={styles.hitSlop}>
          <Text style={styles.skip}>{isLast ? '' : 'Skip'}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={item => item.key}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        getItemLayout={(_, i) => ({
          length: width,
          offset: width * i,
          index: i,
        })}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, i) => (
            <View
              key={slide.key}
              style={[styles.dot, i === index && styles.dotActive]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={next}>
          <Text style={styles.primaryButtonText}>
            {isLast ? 'Get Started' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
