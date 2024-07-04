/* eslint-disable prettier/prettier */
import {StyleSheet, Text, Alert} from 'react-native';
import React, {SetStateAction, useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  responsiveWidth as wd,
  responsiveHeight as hg,
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import NetInfo from '@react-native-community/netinfo';
import BorderBtn from '../../components/Button/BorderBtn';

interface NoInternetProps {
  isInternetReachable?: boolean;
  setShow?: React.Dispatch<SetStateAction<boolean>>;
  setIsInternetReachable?: React.Dispatch<SetStateAction<boolean>>;
}

const NoInternet: React.FC<NoInternetProps> = ({
  isInternetReachable,
  setShow,
  setIsInternetReachable,
}) => {
  const translateX = useSharedValue(wd(100));

  useEffect(() => {
    animationHandler();
  }, [isInternetReachable]);

  const animationHandler = () => {
    translateX.value = withTiming(translateX.value > 0 ? 0 : wd(100), {
      duration: 700,
    });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  const checkInternet = async () => {
    const state = await NetInfo.fetch();
    if (state.isConnected && state.isInternetReachable) {
      setShow && setShow(false);
      setIsInternetReachable && setIsInternetReachable(true);
    } else {
      Alert.alert('No internet connection.');
    }
  };

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>No Internet Connection.</Text>
      <BorderBtn
        buttonText="Retry"
        onClick={checkInternet}
        containerStyle={{
          marginTop: responsiveHeight(2),
          width: responsiveWidth(50),
        }}
      />
    </Animated.View>
  );
};

export default NoInternet;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: hg(120),
    width: wd(100),
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10000,
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  text: {
    marginTop: responsiveHeight(40),
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    color: globalStyles.themeBlueText,
  },
});
