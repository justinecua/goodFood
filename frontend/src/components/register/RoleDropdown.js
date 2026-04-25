import { View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';

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
    <View style={{ zIndex: 2 }}>
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Role Selection"
        style={styles.dropdown}
        dropDownContainerStyle={styles.dropdownContainer}
        textStyle={styles.dropdownText}
        placeholderStyle={styles.dropdownPlaceholder}
      />
    </View>
  );
};

export default RoleDropdown;
