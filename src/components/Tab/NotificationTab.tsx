import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import bellIcon from '../../assets/Icons/notification-blue.png';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

interface NotificationTabProps {
  id: string;
  imageUri?: string;
  style?: ViewStyle;
  type?: string;
  message?: string;
  time?: string;
  onPress?: () => void;
  onSwipe?: (id: string) => void;
  name?: string;
}

const NotificationTab: React.FC<NotificationTabProps> = ({
  id,
  imageUri,
  style,
  type = 'notification',
  message = 'You have a new messages from John…',
  time = '12:03pm',
  onPress = () => {},
  onSwipe = id => {},
  name = '',
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const pan = Gesture.Pan()
    ?.minDistance(1)
    ?.onChange(value => {
      if (value?.translationX < 0) {
        translateX.value = value.translationX;
        if (value?.translationX) {
          opacity.value = interpolate(
            -1 * value.translationX,
            [0, responsiveWidth(100)],
            [1, 0],
          );
        }
      }
    })
    ?.onEnd(value => {
      if (-1 * value?.translationX >= 90) {
        translateX.value = withTiming(responsiveWidth(-100), {
          duration: 300,
        });
        setTimeout(() => {
          onSwipe(id);
        }, 400);
      } else {
        translateX.value = withTiming(0, {
          duration: 300,
        });
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    right: -1 * translateX?.value,
  }));

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <GestureDetector gesture={pan}>
      <View style={styes.mainContainer}>
        <Animated.View
          style={[
            {position: 'relative', zIndex: 1000},
            animatedStyle,
            opacityStyle,
          ]}>
          <Wrapper containerStyle={{...styes.wrapper, ...style}}>
            <TouchableOpacity style={styes.touch} onPress={onPress}>
              <View style={styes.imageContainer}>
                <Image
                  source={{
                    uri: imageUri
                      ? imageUri
                      : Image.resolveAssetSource(bellIcon)?.uri,
                  }}
                  resizeMode="cover"
                  style={{
                    height: imageUri
                      ? responsiveHeight(5)
                      : responsiveHeight(3),
                    width: imageUri ? responsiveHeight(5) : responsiveHeight(3),
                  }}
                />
              </View>
              <View style={styes.textContainer}>
                <Text style={styes.message}>{message}</Text>
                <Text style={styes.date}>{time}</Text>
              </View>
            </TouchableOpacity>
          </Wrapper>
        </Animated.View>
        {/* <View style={styes.deleteIconContainer}>
          <Animated.Image
            source={require('../../assets/Icons/trash-red.png')}
            resizeMode="contain"
            style={[styes.deleteIcon, animatedStyle]}
          />
        </View> */}
      </View>
    </GestureDetector>
  );
};

export default NotificationTab;

const styes = StyleSheet.create({
  mainContainer: {
    position: 'relative',
  },
  wrapper: {
    paddingBottom: 0,
    paddingTop: 0,
    width: '100%',
    // height: responsiveHeight(8),
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: '100%',
    width: '100%',
    paddingHorizontal: responsiveWidth(2),
    paddingBottom: responsiveHeight(1),
    paddingTop: responsiveHeight(1),
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(3),
    overflow: 'hidden',
    backgroundColor: globalStyles.veryLightGray,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingLeft: responsiveWidth(2),
    // height: '100%',
  },
  message: {
    fontSize: responsiveFontSize(1.6),
    width: '100%',
    color: 'black',
    fontWeight: '400',
  },
  date: {
    marginTop: responsiveHeight(2),
    fontSize: responsiveFontSize(1.4),
    color: globalStyles.lightGray,
    fontWeight: '400',
  },
  deleteIconContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    paddingRight: responsiveWidth(3),
    top: responsiveHeight(1.2),
    right: responsiveWidth(2.5),
    bottom: 0,
    zIndex: 100,
    width: responsiveWidth(20),
    borderRadius: responsiveWidth(2),
  },
  deleteIcon: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
});
