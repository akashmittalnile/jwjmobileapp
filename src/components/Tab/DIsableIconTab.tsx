/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
  TouchableOpacity,
  TextStyle,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {Grayscale} from 'react-native-color-matrix-image-filters';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';

interface IconTabProps {
  style?: ViewStyle;
  imageStyle?: ImageStyle;
  text?: string;
  percentage?: string;
  disableButton?: boolean;
  disbaleImage?: boolean;
  onPress?: () => void;
  selected?: boolean;
  logo: string;
  textStyle?: TextStyle;
}
const DisableIconTab: React.FC<IconTabProps> = ({
  style,
  text,
  percentage,
  imageStyle,
  disableButton = false,
  disbaleImage = false,
  onPress,
  selected = false,
  logo,
  textStyle,
}) => {
  const clickHandler = () => {
    if (!disableButton && onPress) {
      onPress();
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          borderWidth: responsiveWidth(0.23),
          borderColor: selected ? globalStyles.themeBlue : 'white',
        },
        style,
      ]}>
      <TouchableOpacity
        style={styles.touch}
        disabled={disableButton}
        onPress={clickHandler}>
        <View style={[styles.imageContainer, imageStyle]}>
          {/* {disbaleImage ? (
            <Grayscale>
              <FastImage
                source={{uri: logo, priority: FastImage.priority.high}}
                resizeMode={FastImage.resizeMode.contain}
                style={styles.img}
              />
            </Grayscale>
          ) : (
            <FastImage
              source={{uri: logo, priority: FastImage.priority.high}}
              resizeMode={FastImage.resizeMode.contain}
              style={styles.img}
            />
          )} */}
          <FastImage
            source={{uri: logo, priority: FastImage.priority.high}}
            resizeMode={FastImage.resizeMode.contain}
            style={styles.img}
          />
        </View>
        {text && (
          <Text style={{...styles.text, ...textStyle}}>
            {text.charAt(0).toUpperCase() + text.slice(1)}
          </Text>
        )}
        {percentage && (
          <Text
            style={[
              styles.text,
              {color: globalStyles.themeBlueText, fontWeight: '700'},
            ]}>
            {percentage}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default DisableIconTab;

const styles = StyleSheet.create({
  container: {
    marginRight: responsiveWidth(2.5),
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    overflow: 'hidden',
  },
  touch: {
    alignItems: 'center',
    paddingTop: responsiveHeight(1),
    width: responsiveWidth(25),
    borderRadius: responsiveWidth(2),
  },
  imageContainer: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
    overflow: 'hidden',
  },
  img: {
    height: '100%',
    width: '100%',
  },
  text: {
    marginTop: responsiveHeight(0.3),
    marginBottom: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: 'black',
  },
});
