import {ViewStyle} from 'react-native';
import React, {useCallback} from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing
} from 'react-native-reanimated';
import {responsiveHeight} from 'react-native-responsive-dimensions';

interface AnimatedCircleProps {
  style?: ViewStyle;
}

const AnimatedCircle: React.FC<AnimatedCircleProps> = ({style}) => {
  const value = useSharedValue(responsiveHeight(1.5));
  const opacity = useSharedValue(0);

  const startAnimation = useCallback(() => {
    value.value = withRepeat(
      withTiming(value.value === responsiveHeight(1.5) ? responsiveHeight(3) : 0, { duration: 1200, easing: Easing.linear }),
      -1,
      true,
    );
    opacity.value = withRepeat(
      withTiming(opacity.value === 0 ? 1 : 0, { duration: 1200, easing: Easing.linear }),
      -1,
      true,
    );
  }, []);

  React.useEffect(() => {
    startAnimation();
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: value.value,
      width: value.value,
      borderRadius: value.value / 2,
      backgroundColor: '#D0F0C0',
        opacity: opacity.value,
    };
  });

  return <Animated.View style={[animatedStyle, style]} />;
};

export default AnimatedCircle;
