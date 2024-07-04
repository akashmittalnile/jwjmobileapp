/* eslint-disable prettier/prettier */
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface BorderBtnProps {
  buttonText: string;
  containerStyle?: ViewStyle;
  buttonTextStyle?: TextStyle;
  onClick: () => void;
  disable?: boolean;
  loader?: boolean;
  loaderColor?: string;
  activeOpacity?: number | undefined;
}

const BorderBtn: React.FC<BorderBtnProps> = ({
  buttonText,
  containerStyle,
  buttonTextStyle,
  onClick,
  disable = false,
  loader = false,
  loaderColor,
  activeOpacity,
}) => {
  const clickHandler = () => {
    if (onClick) {
      onClick();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={activeOpacity ? activeOpacity : 0.3}
      onPress={clickHandler}
      style={[
        styles.touch,
        containerStyle,
        disable && {backgroundColor: 'gray', opacity: 0.3},
      ]}
      disabled={disable || loader}>
      {loader ? (
        <ActivityIndicator color={loaderColor ? loaderColor : 'white'} />
      ) : (
        <Text style={[styles.text, buttonTextStyle]} allowFontScaling={false}>{buttonText}</Text>
      )}
    </TouchableOpacity>
  );
};

export default BorderBtn;

const styles = StyleSheet.create({
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    height: responsiveHeight(6),
    backgroundColor: globalStyles.themeBlue,
    width: '95%',
  },
  text: {
    color: 'white',
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    textAlign: 'center',
  },
});
