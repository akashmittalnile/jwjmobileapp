/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  TextInput,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import smsIcon from '../../assets/Icons/sms.png';
import BorderBtn from '../Button/BorderBtn';

interface TextInputFieldProps {
  containerStyle?: ViewStyle;
  uri?: string;
  placeholder?: string;
  placeholderTextColor?: string;
  onChangeText: (value: string) => void;
  errorText?: string | undefined | boolean;
  onBlur?: () => void;
  value: string;
  textInputStyle?: ViewStyle;
  isIcon?: boolean;
  isVerifyBtn?: boolean;
  verifyBtnText?: string;
  disableButton?: boolean;
  verifyHandler?: () => void;
  iconSide?: string;
  loader?: boolean;
  loaderColor?: string;
  editable?: boolean;
}

const TextInputField: React.FC<TextInputFieldProps> = ({
  containerStyle,
  uri,
  placeholder = 'Email Address',
  placeholderTextColor = 'rgba(137, 137, 137, .7)',
  onChangeText,
  onBlur,
  errorText = '',
  value,
  textInputStyle,
  isVerifyBtn = false,
  verifyHandler,
  iconSide = 'left',
  verifyBtnText = 'Send Otp',
  disableButton = false,
  loader = false,
  loaderColor,
  editable = true,
}) => {
  const smsIconPath = Image.resolveAssetSource(smsIcon).uri;

  return (
    <View style={[styles.container, containerStyle]}>
      <View
        style={[
          styles.subContainer,
          {
            borderWidth: errorText ? 1.3 : 0,
            borderColor: errorText ? 'red' : 'none',
            backgroundColor: editable ? 'white' : 'rgba(137, 137, 137, .2)',
          },
        ]}>
        {iconSide === 'left' && (
          <View style={styles.iconContainer}>
            <Image
              source={{uri: uri ? uri : smsIconPath}}
              resizeMode="contain"
              style={styles.icon}
            />
          </View>
        )}
        <View
          style={[
            styles.inputContainer,
            {width: isVerifyBtn ? '65%' : '85%'},
            iconSide === 'right' && {paddingLeft: responsiveWidth(3)},
          ]}>
          <TextInput
            editable={editable}
            value={value}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[styles.input, textInputStyle]}
            onChangeText={onChangeText}
            onBlur={onBlur}
          />
        </View>
        {iconSide === 'right' && !isVerifyBtn && (
          <View style={{...styles.iconContainer}}>
            <Image
              source={{uri: uri ? uri : smsIconPath}}
              resizeMode="contain"
              style={styles.icon}
            />
          </View>
        )}
        {isVerifyBtn && (
          <View style={[styles.iconContainer, {height: '55%'}]}>
            <BorderBtn
              disable={disableButton}
              onClick={() => {
                verifyHandler && verifyHandler();
              }}
              buttonText={verifyBtnText}
              buttonTextStyle={{fontSize: responsiveFontSize(1)}}
              containerStyle={{
                height: '90%',
                borderRadius: responsiveWidth(1.5),
              }}
              loader={loader}
              loaderColor={loaderColor}
            />
          </View>
        )}
      </View>
      <View style={styles.errContainer}>
        {errorText && <Text style={styles.errText}>{errorText}</Text>}
      </View>
    </View>
  );
};

export default TextInputField;

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
  // subContainer: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   height: Platform.OS === 'ios' ? responsiveHeight(6) : responsiveHeight(8),
  //   width: '100%',
  //   borderRadius: responsiveWidth(2),
  //   ...(Platform.OS === 'ios'
  //     ? {
  //         shadowOffset: {width: 0, height: 0},
  //         shadowOpacity: 0.7,
  //         shadowRadius: 3,
  //       }
  //     : {elevation: 5}),
  //   shadowColor: globalStyles.shadowColor,
  //   backgroundColor: 'white',
  // },
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
