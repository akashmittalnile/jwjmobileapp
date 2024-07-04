/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import {
  View,
  StyleSheet,
  ViewStyle,
  ImageStyle,
  Image,
  TouchableOpacity,
  Text,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface PaymentTypeProps {
  type?: string;
  containerStyle?: ViewStyle;
  isClicked?: boolean;
  imageStyle?: ImageStyle;
  tickStyle?: ImageStyle;
  onPress: () => void;
}

const PaymentType: React.FC<PaymentTypeProps> = ({
  type = 'paypal',
  containerStyle,
  isClicked,
  tickStyle,
  imageStyle,
  onPress,
}) => {
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          borderColor: isClicked ? globalStyles.themeBlue : 'white',
          borderWidth: isClicked ? responsiveWidth(0.23) : 0,
        },
      ]}>
      <TouchableOpacity
        style={styles.touch}
        activeOpacity={0.7}
        onPress={onPress}>
        {isClicked ? (
          <Image
            source={require('../../assets/Icons/tick-circle.png')}
            style={[styles.tick, tickStyle]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../assets/Icons/tick-circle-white.png')}
            style={[styles.tick, tickStyle]}
            resizeMode="contain"
          />
        )}
        {type === 'paypal' ? (
          <Image
            source={require('../../assets/Icons/paypal.png')}
            style={[styles.img, imageStyle]}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../assets/Icons/cards.png')}
            style={[styles.img, imageStyle]}
            resizeMode="contain"
          />
        )}
        <Text style={{color: 'black'}}>
          {type.substring(0, 1).toUpperCase() + type.substring(1)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PaymentType;

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: responsiveHeight(12),
    width: responsiveWidth(44),
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: globalStyles.shadowColor,
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  img: {
    height: responsiveHeight(7),
    width: responsiveWidth(10),
  },
  tick: {
    position: 'absolute',
    zIndex: 1000,
    top: responsiveHeight(1),
    right: responsiveWidth(3),
    height: responsiveHeight(4),
    width: responsiveWidth(5),
  },
});
