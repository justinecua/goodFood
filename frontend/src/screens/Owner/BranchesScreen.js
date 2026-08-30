import { useCallback, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import {
  ChevronRight,
  GitBranch,
  MapPin,
  Phone,
  Plus,
} from 'lucide-react-native';
import RestaurantBottomNavbar from '../../components/shared/RestaurantBottomNavbar';
import EmptyState from '../../components/shared/EmptyState';
import ScreenHeader from '../../components/shared/ScreenHeader';
import styles from '../../styles/OwnerListScreenStyle';
import colors from '../../constants/colors';
import { getRestaurantInfo } from '../../api/services/home';

const BranchesScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [hasRestaurant, setHasRestaurant] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getRestaurantInfo()
        .then(data => {
          if (!active) return;
          setHasRestaurant(!!data?.restaurant);
          setBranches(data?.branches ?? []);
        })
        .catch(err => {
          console.log('getRestaurantInfo failed:', err.message);
          if (active) {
            setHasRestaurant(false);
            setBranches([]);
          }
        })
        .finally(() => active && setLoading(false));

      return () => {
        active = false;
      };
    }, []),
  );

  const addBranch = () => navigation.navigate('BranchForm');
  const editBranch = branch => navigation.navigate('BranchForm', { branch });

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>
        <ScreenHeader
          title="Branches"
          subtitle={`${branches.length} ${
            branches.length === 1 ? 'branch' : 'branches'
          }`}
          onBack={() => navigation.goBack()}
        />

        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator color={colors.button} />
          </View>
        ) : !hasRestaurant ? (
          <EmptyState
            icon={GitBranch}
            title="No restaurant yet"
            message="Add your restaurant information first, then you can list its branches."
            actionLabel="Add Restaurant Information"
            onAction={() => navigation.navigate('RestaurantInformationScreen')}
          />
        ) : branches.length === 0 ? (
          <EmptyState
            icon={GitBranch}
            title="No branches added"
            message="Add branch locations with the button below."
          />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {branches.map(branch => (
              <TouchableOpacity
                key={branch.branch_id}
                style={styles.row}
                onPress={() => editBranch(branch)}
              >
                <View style={styles.rowIconWrap}>
                  <GitBranch size={16} color={colors.button} />
                </View>
                <View style={styles.rowBody}>
                  <Text style={styles.rowTitle}>{branch.branch_name}</Text>
                  {branch.address ? (
                    <View style={styles.metaLine}>
                      <MapPin size={11} color={colors.subtext} />
                      <Text style={styles.rowMeta}>{branch.address}</Text>
                    </View>
                  ) : null}
                  {branch.contact_number ? (
                    <View style={styles.metaLine}>
                      <Phone size={11} color={colors.subtext} />
                      <Text style={styles.rowMeta}>
                        {branch.contact_number}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <ChevronRight size={16} color={colors.subtextInput} />
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {hasRestaurant ? (
          <View style={styles.actionBar}>
            <TouchableOpacity style={styles.actionButton} onPress={addBranch}>
              <Plus size={15} color="#fff" />
              <Text style={styles.actionButtonText}>Add Branch</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <RestaurantBottomNavbar navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default BranchesScreen;
