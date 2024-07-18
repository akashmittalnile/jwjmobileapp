/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import FastImage from 'react-native-fast-image';
import {moodColorHandler} from '../../utils/Method';

interface EmojiProps {
  style?: ViewStyle;
  imageUri?: string;
  text?: string;
  imageStyle?: ImageStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}
const Emoji: React.FC<EmojiProps> = ({
  text,
  imageUri,
  style,
  imageStyle,
  textStyle,
  onPress,
}) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity onPress={onPress} style={styles.touch}>
        <View style={styles.imgContainer}>
          {imageUri && (
            <FastImage
              style={{
                width: responsiveHeight(4),
                height: responsiveHeight(4),
                borderRadius: responsiveHeight(2),
              }}
              source={{
                uri: imageUri,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />
            // <Image
            //   source={{uri: imageUri}}
            //   style={[styles.img, imageStyle]}
            //   resizeMode="contain"
            // />
          )}
        </View>
        <View style={{height: responsiveHeight(5)}}>
          <Text
            style={[
              styles.text,
              {color: moodColorHandler(text?.toLowerCase())},
              textStyle,
            ]}>
            {text}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default Emoji;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start',
  },
  touch: {
    alignItems: 'center',
  },
  imgContainer: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
    overflow: 'hidden',
  },
  img: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
  },
  text: {
    marginTop: responsiveHeight(0.5),
    // transform: [{rotate: '90deg'}],
    fontSize: responsiveHeight(1.6),
    fontWeight: '500',
    color: globalStyles.themeBlue,
    textAlign: 'center',
  },
});
