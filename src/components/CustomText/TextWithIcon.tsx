/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';

interface TextWithIconProps {
  imageUri: string;
  text: string;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
  ImageStyle?: ImageStyle;
  iconSide?: 'left' | 'right';
  disable?: boolean;
  onPress?: () => void;
}

const TextWithIcon: React.FC<TextWithIconProps> = ({
  imageUri,
  text,
  textStyle,
  containerStyle,
  ImageStyle,
  iconSide = 'left',
  disable = false,
  onPress,
}) => {
  const clickHandler = () => {
    if (onPress) {
      onPress();
    }
  };
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        style={styles.touch}
        activeOpacity={0.5}
        onPress={clickHandler}
        disabled={disable}>
        {iconSide === 'right' && (
          <Text
            style={[styles.text, textStyle, {marginRight: responsiveWidth(2)}]}>
            {text}
          </Text>
        )}
        <View>
          {imageUri && (
            <FastImage
              source={{uri: imageUri, priority: FastImage.priority.high}}
              style={[styles.image, ImageStyle]}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        </View>
        {iconSide === 'left' && (
          <Text
            style={[styles.text, textStyle, {marginLeft: responsiveWidth(2)}]}>
            {text}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default TextWithIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  image: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
  text: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '400',
    color: globalStyles.lightGray,
    marginLeft: responsiveWidth(1),
  },
});
