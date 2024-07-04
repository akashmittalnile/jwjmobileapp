/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  TextInput,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import smsIcon from '../../assets/Icons/lock.png';
import eye from '../../assets/Icons/eye.png';
import hide from '../../assets/Icons/hide.png';

interface PasswordInputProps {
  containerStyle?: ViewStyle;
  uri?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  onChangeText: (value: string) => void;
  errorText?: string | undefined | boolean;
  onBlur?: () => void;
  value: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({
  containerStyle,
  uri,
  placeholder = 'Password',
  placeholderTextColor = 'rgba(137, 137, 137, .7)',
  onChangeText,
  onBlur,
  errorText = '',
  value,
}) => {
  const smsIconPath = Image.resolveAssetSource(smsIcon).uri;
  const eyeIconPath = Image.resolveAssetSource(eye).uri;
  const hideIconPath = Image.resolveAssetSource(hide).uri;

  const [showPassword, setShowPassword] = React.useState(false);

  const eyeHandler = () => {
    setShowPassword(preData => !preData);
  };

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
        <View style={styles.iconContainer}>
          <Image
            source={{uri: uri ? uri : smsIconPath}}
            resizeMode="contain"
            style={styles.icon}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            value={value}
            secureTextEntry={!showPassword}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={styles.input}
            onChangeText={onChangeText}
            onBlur={onBlur}
          />
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={eyeHandler} style={styles.touch}>
            <Image
              source={{uri: showPassword ? eyeIconPath : hideIconPath}}
              resizeMode="contain"
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.errContainer}>
        {errorText && <Text style={styles.errText}>{errorText}</Text>}
      </View>
    </View>
  );
};

export default PasswordInput;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(1),
    height: Platform.OS === 'ios' ? responsiveHeight(8) : responsiveHeight(10),
    width: '95%',
  },
  subContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(8),
    width: '100%',
    borderRadius: responsiveWidth(2),
    ...Platform.select({
      ios: {
        shadowColor: globalStyles.shadowColor,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
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
    width: '70%',
  },
  input: {
    height: '100%',
    width: '100%',
    color: 'black',
    fontSize: responsiveFontSize(2),
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
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
