import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/ChangePasswordScreenStyle';
import colors from '../../constants/colors';
import { changePassword } from '../../api/services/auth';

const Field = ({ label, ...props }) => (
  <View>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      secureTextEntry
      autoCapitalize="none"
      placeholderTextColor={colors.subtextInput}
      style={styles.input}
      {...props}
    />
  </View>
);

const ChangePasswordScreen = ({ navigation }) => {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!current || !next || !confirm) {
      Alert.alert('Validation Error', 'Fill in all three fields.');
      return;
    }
    if (next.length < 6) {
      Alert.alert(
        'Validation Error',
        'New password must be at least 6 characters.',
      );
      return;
    }
    if (next !== confirm) {
      Alert.alert('Validation Error', 'New passwords do not match.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await changePassword(current, next);
      if (res.error) {
        Alert.alert('Not Changed', res.error);
        return;
      }
      Alert.alert('Success', 'Your password has been changed.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <ScreenHeader
        title="Change Password"
        onBack={() => navigation.goBack()}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <Field
            label="Current Password"
            value={current}
            onChangeText={setCurrent}
            placeholder="Current password"
          />
          <Field
            label="New Password"
            value={next}
            onChangeText={setNext}
            placeholder="At least 6 characters"
          />
          <Field
            label="Confirm New Password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Repeat new password"
          />

          <TouchableOpacity
            style={[styles.submitButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Update Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChangePasswordScreen;
