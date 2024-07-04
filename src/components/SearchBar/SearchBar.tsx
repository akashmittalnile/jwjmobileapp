/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface SearchBarProps {
  containerStyle?: ViewStyle;
  placeholder?: string;
  onSearch?: () => void;
  focus?: boolean;
}
const SearchBar: React.FC<SearchBarProps> = ({
  containerStyle,
  placeholder = 'Search (John,Thanksgiving, etc.)',
  onSearch,
  focus = false,
}) => {
  const inputRef = React.useRef<TextInput>(null);
  React.useEffect(() => {
    if (focus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 700);
    }
  }, []);
  const onPress = () => {
    if (onSearch) {
      onSearch();
    }
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.inputContainer}>
        <TextInput
          ref={inputRef}
          placeholder={placeholder}
          placeholderTextColor={globalStyles.lightGray}
          style={styles.input}
        />
      </View>
      <TouchableOpacity style={styles.touch} onPress={onPress}>
        <Image source={require('../../assets/Icons/search.png')} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    height: responsiveHeight(7),
    width: '100%',
  },
  inputContainer: {
    height: '100%',
    width: '83.5%',
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.lightGray,
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
  },
  input: {
    height: '100%',
    width: '100%',
    fontSize: responsiveFontSize(1.8),
    paddingHorizontal: responsiveWidth(2),
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '15%',
    backgroundColor: globalStyles.themeBlue,
    borderRadius: responsiveWidth(2),
  },
});
