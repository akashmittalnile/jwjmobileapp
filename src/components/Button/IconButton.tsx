import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ViewStyle,
  StyleSheet,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import FastImage from 'react-native-fast-image';

interface IconButtonProps {
  iconUri?: string;
  text?: string;
  disable?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress: () => void;
  iconSide?: 'left' | 'right';
  loader?: boolean;
  loaderColor?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  iconUri = ' ',
  text,
  disable = false,
  style,
  textStyle,
  onPress,
  iconSide = 'left',
  loader = false,
  loaderColor,
}) => {
  return (
    <View style={[styles.container, style]}>
      {loader ? (
        <ActivityIndicator color={loaderColor ? loaderColor : 'white'} />
      ) : (
        <TouchableOpacity
          style={styles.touch}
          disabled={disable || loader}
          onPress={onPress}
          activeOpacity={disable ? 1 : 0.5}>
          {iconSide === 'right' && text && (
            <Text style={[styles.text, textStyle, {marginRight: '5%'}]}>
              {text}
            </Text>
          )}
          {iconUri && (
            <FastImage
              style={{
                width: responsiveWidth(4),
                height: '100%',
                borderRadius: responsiveWidth(2),
              }}
              source={{
                uri: iconUri,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            // <Image
            //   source={{uri: iconUri}}
            //   resizeMode="contain"
            //   style={styles.img}
            // />
          )}
          {iconSide === 'left' && text && (
            <Text style={[styles.text, textStyle]}>{text}</Text>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  container: {
    height: responsiveHeight(6),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  img: {
    height: '100%',
    width: responsiveWidth(4),
  },
  text: {
    marginLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    color: 'black',
  },
});
