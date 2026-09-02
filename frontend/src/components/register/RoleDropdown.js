import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

// See GenderDropdown for why listMode is SCROLLVIEW rather than the default
// FlatList - this dropdown has the same handful of options and the same risk
// of ending up inside a scrolling screen.
const RoleDropdown = ({
  open,
  value,
  items,
  setOpen,
  setValue,
  setItems,
  styles,
}) => {
  return (
    <View style={localStyles.wrap}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        listMode="SCROLLVIEW"
        placeholder="Role Selection"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.dropdownPlaceholder}
      />
    </View>
  );
};

// Keeps the open list above the fields underneath it.
const localStyles = StyleSheet.create({
  wrap: {
    zIndex: 2,
  },
});

export default RoleDropdown;
