import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibrary } from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ImagePlus } from 'lucide-react-native';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/ChangeProfilePictureScreenStyle';
import colors from '../../constants/colors';
import { updateProfilePhoto } from '../../api/services/home';
import { mediaUrl } from '../../constants/config';
import pfp from '../../assets/images/pfp.jpg';

const isLocalFile = uri => !!uri && !/^https?:/i.test(uri);

const ChangeProfilePictureScreen = ({ navigation }) => {
  const [current, setCurrent] = useState(null); // remote URL of the saved photo
  const [picked, setPicked] = useState(null); // freshly chosen local asset
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('user').then(res => {
      if (!res) return;
      const url = mediaUrl(JSON.parse(res).account_profile_photo);
      if (url) setCurrent(url);
    });
  }, []);

  const choose = () => {
    launchImageLibrary({ mediaType: 'photo' }, res => {
      if (res.didCancel || res.errorCode) return;
      const asset = res.assets?.[0];
      if (asset?.uri) setPicked(asset);
    });
  };

  const preview = picked?.uri || current;

  const save = async () => {
    if (!isLocalFile(picked?.uri)) {
      Alert.alert('Pick a photo', 'Choose a new photo first.');
      return;
    }

    const stored = await AsyncStorage.getItem('user');
    const accountId = stored ? JSON.parse(stored).account_id : null;
    if (!accountId) {
      Alert.alert('Failed', 'You are not signed in. Please log in again.');
      return;
    }

    const body = new FormData();
    body.append('account_id', String(accountId));
    body.append('profile_image', {
      uri: picked.uri,
      name: picked.fileName || 'profile.jpg',
      type: picked.type || 'image/jpeg',
    });

    try {
      setIsSaving(true);
      const resp = await updateProfilePhoto(body);
      if (resp.error) {
        Alert.alert('Not Saved', resp.error);
        return;
      }
      if (resp.user) {
        const prev = JSON.parse((await AsyncStorage.getItem('user')) || '{}');
        await AsyncStorage.setItem(
          'user',
          JSON.stringify({ ...prev, ...resp.user }),
        );
      }
      Alert.alert('Success', 'Profile picture updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title="Change Profile Picture"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.body}>
        <Image
          source={preview ? { uri: preview } : pfp}
          style={styles.preview}
        />

        <TouchableOpacity style={styles.chooseButton} onPress={choose}>
          <ImagePlus size={16} color={colors.button} />
          <Text style={styles.chooseButtonText}>
            {picked ? 'Choose a different photo' : 'Choose from gallery'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, (!picked || isSaving) && styles.disabled]}
          onPress={save}
          disabled={!picked || isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ChangeProfilePictureScreen;
