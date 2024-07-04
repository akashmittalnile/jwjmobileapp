/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  StyleSheet,
  ViewStyle,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface TextInputWithoutIconProps {
  containerStyle?: ViewStyle;
  uri?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  onChangeText: (value: string) => void;
  errorText?: string | undefined | boolean;
  onBlur?: () => void;
  value: string;
  textInputStyle?: {};
  isIcon?: boolean;
  multiline?: boolean;
}

const TextInputWithoutIcon: React.FC<TextInputWithoutIconProps> = ({
  containerStyle,
  placeholder = 'Email Address',
  placeholderTextColor = 'rgba(137, 137, 137, .7)',
  onChangeText,
  onBlur,
  errorText = '',
  value,
  textInputStyle,
  multiline = false,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.subContainer,
          {
            borderWidth: errorText ? 1.3 : 0,
            borderColor: errorText ? 'red' : 'none',
          },
        ]}>
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[styles.input, textInputStyle]}
            onChangeText={onChangeText}
            onBlur={onBlur}
            multiline={multiline}
          />
        </View>
      </View>
      <View style={styles.errContainer}>
        {errorText && <Text style={styles.errText}>{errorText}</Text>}
      </View>
    </View>
  );
};

export default TextInputWithoutIcon;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(8),
    width: '95%',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '75%',
    width: '100%',
    borderRadius: responsiveWidth(2),
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.7,
    shadowRadius: 3,
    backgroundColor: 'white',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '15%',
    height: '100%',
    borderRadius: responsiveWidth(2),
  },
  icon: {
    height: '40%',
    width: '100%',
  },
  inputContainer: {
    height: '100%',
    width: '100%',

    borderRadius: responsiveWidth(2),
  },
  input: {
    height: '100%',
    width: '100%',
    color: 'black',
    fontSize: responsiveFontSize(2),
    paddingLeft: responsiveWidth(4),
    letterSpacing: 1.2,
    lineHeight: responsiveHeight(2.2)
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    width: '100%',
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: 'red',
  },
  btnStyle: {},
  errContainer: {
    height: '25%',
    paddingLeft: responsiveWidth(2),
    paddingTop: responsiveHeight(0.1),
  },
  errText: {
    color: 'red',
    fontSize: responsiveFontSize(1.5),
  },
});
