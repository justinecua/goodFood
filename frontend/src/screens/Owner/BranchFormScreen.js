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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Trash2 } from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/BranchFormScreenStyle';
import colors from '../../constants/colors';
import { addBranch, updateBranch, deleteBranch } from '../../api/services/home';

const Field = ({ label, ...props }) => (
  <View>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      placeholder={label}
      placeholderTextColor={colors.subtextInput}
      style={styles.input}
      {...props}
    />
  </View>
);

const BranchFormScreen = ({ navigation, route }) => {
  const editing = route.params?.branch;
  const isEdit = !!editing?.branch_id;

  const [form, setForm] = useState({
    branch_name: editing?.branch_name ?? '',
    address: editing?.address ?? '',
    contact_number: editing?.contact_number ?? '',
    latitude: editing?.latitude ?? '',
    longitude: editing?.longitude ?? '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (
      !form.branch_name.trim() ||
      !form.address.trim() ||
      !form.contact_number.trim()
    ) {
      Alert.alert(
        'Validation Error',
        'Branch name, address and contact number are required.',
      );
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
    if (isEdit) body.append('branch_id', String(editing.branch_id));
    Object.entries(form).forEach(([key, value]) =>
      body.append(key, value.trim()),
    );

    try {
      setIsLoading(true);
      const res = await (isEdit ? updateBranch(body) : addBranch(body));
      if (res.error) {
        Alert.alert('Branch Not Saved', res.error);
        return;
      }
      Alert.alert('Success', isEdit ? 'Branch updated.' : 'Branch added.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert('Failed', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert('Delete Branch', `Remove "${editing.branch_name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            setDeleting(true);
            const res = await deleteBranch(editing.branch_id);
            if (res.error) {
              Alert.alert('Not Deleted', res.error);
              return;
            }
            navigation.goBack();
          } catch (err) {
            Alert.alert('Failed', err.message);
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title={isEdit ? 'Edit Branch' : 'Add Branch'}
          onBack={() => navigation.goBack()}
        />

        <ScrollView contentContainerStyle={styles.formScroll}>
          <View style={styles.form}>
            <Field
              label="Branch Name"
              value={form.branch_name}
              onChangeText={t => set('branch_name', t)}
            />
            <Field
              label="Address"
              value={form.address}
              onChangeText={t => set('address', t)}
            />
            <Field
              label="Contact Number"
              value={form.contact_number}
              onChangeText={t => set('contact_number', t)}
              keyboardType="phone-pad"
            />
            <View style={styles.coordRow}>
              <View style={styles.coordCol}>
                <Field
                  label="Latitude"
                  value={form.latitude}
                  onChangeText={t => set('latitude', t)}
                />
              </View>
              <View style={styles.coordCol}>
                <Field
                  label="Longitude"
                  value={form.longitude}
                  onChangeText={t => set('longitude', t)}
                />
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEdit ? 'Save Changes' : 'Add Branch'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>

            {isEdit && (
              <TouchableOpacity
                style={styles.deleteLink}
                onPress={confirmDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <ActivityIndicator color="#c0392b" />
                ) : (
                  <>
                    <Trash2 size={15} color="#c0392b" />
                    <Text style={styles.deleteLinkText}>Delete branch</Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default BranchFormScreen;
