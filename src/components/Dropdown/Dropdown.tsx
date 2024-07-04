/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

const data = [
  {label: 'January', value: '01'},
  {label: 'February', value: '02'},
  {label: 'March', value: '03'},
  {label: 'April', value: '04'},
  {label: 'May', value: '05'},
  {label: 'June', value: '06'},
  {label: 'July', value: '07'},
  {label: 'August', value: '08'},
  {label: 'September', value: '09'},
  {label: 'October', value: '10'},
  {label: 'November', value: '11'},
  {label: 'December', value: '12'},
];

interface DropdownComponentProps {
  onSearch?: (key: string) => void;
}
const DropdownComponent: React.FC<DropdownComponentProps> = ({onSearch}) => {
  const [value, setValue] = useState(null);
  const monthHandler = (item: any) => {
    if (onSearch) {
      onSearch(`date=${item?.value}`);
    }
    setValue(item.value);
  };
  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      iconStyle={styles.iconStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Month"
      searchPlaceholder="Search..."
      value={value}
      onChange={item => {
        monthHandler(item);
      }}
      // renderLeftIcon={() => (
      //     <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
      // )}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    height: '100%',
    width: '100%',
    padding: responsiveWidth(2),
    backgroundColor: 'white',
    borderBottomColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: responsiveFontSize(1.6),
    color: globalStyles.lightGray,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
