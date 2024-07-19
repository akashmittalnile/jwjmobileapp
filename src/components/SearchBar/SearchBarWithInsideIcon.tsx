/* eslint-disable prettier/prettier */
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {globalStyles} from '../../utils/constant';
import {
  responsiveFontSize,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderLessBtn from '../Button/BorderLessBtn';

interface SearchBarWithInsideIconProps {
  value?: string;
  searchKey?: string;
  onSearch?: (key: string) => void;
  iconColor?: string;
  style?: ViewStyle;
  placeHolder?: string;
  placeHolderColor?: string;
  arrowSide?: string;
  onClear?: (key: string) => void;
  focus?: boolean;
  resetFilter?: boolean;
  clearSearch?: () => void;
}

let timeOut: any;
const SearchBarWithInsideIcon: React.FC<SearchBarWithInsideIconProps> = ({
  value,
  searchKey = 'name',
  onSearch,
  iconColor = 'blue',
  style,
  placeHolder = 'Search',
  placeHolderColor = globalStyles.lightGray,
  arrowSide = 'right',
  onClear,
  focus,
  resetFilter,
  clearSearch,
}) => {
  const [_value, setValue] = React.useState<string>('');
  const inputRef = React.useRef<TextInput>(null);
  React.useEffect(() => {
    if (value) {
      setValue(value);
    }
    if (focus) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, []);

  React.useEffect(() => {
    if (resetFilter && _value) {
      setValue('');
      onClear && onClear('');
    }
  }, [resetFilter]);

  const onChangeTextHandler = (text: string) => {
    setValue(text);
    // if (timeOut) {
    //   clearTimeout(timeOut);
    // }
    // timeOut = setTimeout(() => {
    //   if (onSearch) {
    //     text ? onSearch(`?${searchKey}=${text}`) : onSearch('');
    //   }
    // }, 400);
  };

  const crossHandler = () => {
    if (clearSearch) {
      setValue('');
      clearSearch();
    }
  };

  const clearHandler = () => {
    setValue('');
    onClear && onClear('');
  };

  const searchHandler = () => {
    if (onSearch) {
      onSearch(`?${searchKey}=${_value}`);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {arrowSide === 'left' &&
        (iconColor === 'blue' ? (
          <Image
            source={require('../../assets/Icons/search-blue.png')}
            style={[{width: '10%', height: '35%'}]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../assets/Icons/search.png')}
            style={styles.image}
            resizeMode="contain"
          />
        ))}
      <TextInput
        ref={inputRef}
        value={_value}
        placeholder={placeHolder}
        placeholderTextColor={placeHolderColor}
        style={[styles.textInput]}
        onChangeText={onChangeTextHandler}
        returnKeyType="done"
        onSubmitEditing={searchHandler}
      />
      {/* <BorderLessBtn
        buttonText="Clear"
        buttonTextStyle={styles.clearText}
        containerStyle={styles.buttonTextContainer}
        onClick={clearHandler}
      /> */}
      {arrowSide === 'right' && (
        <TouchableOpacity style={styles.touch} onPress={clearHandler}>
          {_value ? (
            <Image
              source={require('../../assets/Icons/close-blue.png')}
              style={styles.image}
              resizeMode="contain"
            />
          ) : iconColor === 'blue' ? (
            <Image
              source={require('../../assets/Icons/search-blue.png')}
              style={styles.image}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={require('../../assets/Icons/search.png')}
              style={styles.image}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBarWithInsideIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    elevation: 1,
    shadowColor: globalStyles.shadowColor,
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: responsiveWidth(10),
  },
  image: {
    height: '50%',
    width: '50%',
  },
  textInput: {
    height: '100%',
    width: '85%',
    paddingHorizontal: 2,
    fontSize: responsiveFontSize(1.7),
    color: 'black',
  },
  buttonTextContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '12%',
  },
});
