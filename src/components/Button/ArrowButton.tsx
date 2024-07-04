/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';

interface ArrowButtonProps {
  arrowType?: string;
  containerStyle?: ViewStyle;
  onPress?: () => void;
  disable?: boolean;
}

const ArrowButton: React.FC<ArrowButtonProps> = ({
  arrowType = 'right',
  containerStyle,
  onPress,
  disable = false,
}) => {
  const clickHandler = () => {
    if (onPress) {
      onPress();
    }
  };
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        {
          backgroundColor: disable ? 'gray' : globalStyles.themeBlue,
          opacity: disable ? 0.3 : 1,
        },
      ]}>
      <TouchableOpacity
        onPress={clickHandler}
        style={styles.touch}
        disabled={disable}>
        {arrowType === 'right' ? (
          <Image
            source={require('../../assets/Icons/right-arrow.png')}
            style={styles.img}
            resizeMode="contain"
          />
        ) : (
          <Image
            source={require('../../assets/Icons/left-arrow.png')}
            style={styles.img}
            resizeMode="contain"
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default ArrowButton;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(4.5),
    width: responsiveHeight(4.5),
    borderRadius: responsiveWidth(1.5),
    overflow: 'hidden',
  },
  touch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  img: {
    height: responsiveHeight(3),
    width: responsiveWidth(7),
  },
});
