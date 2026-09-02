import { View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

// listMode="SCROLLVIEW" matters: the picker renders a FlatList by default, and
// this dropdown sits inside a screen-level ScrollView. Nesting a virtualized
// list in a ScrollView of the same orientation makes React Native warn
// ("VirtualizedLists should never be nested inside plain ScrollViews"), because
// virtualization can't work in an unbounded parent. There are only ever a
// couple of options here, so a plain ScrollView is the right container anyway.
const GenderDropdown = ({
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
        placeholder="Select Gender"
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

export default GenderDropdown;
