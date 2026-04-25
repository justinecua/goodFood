import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/ProfileScreenStyle';
import DinerBottomNavbar from '../../components/shared/DinerBottomNavbar';
import { SafeAreaView } from 'react-native-safe-area-context';

const DinerMapScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.section}>
          <Text>Map</Text>
        </View>
        <DinerBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default DinerMapScreen;
