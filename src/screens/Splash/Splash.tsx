/* eslint-disable quotes */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import splashLogo from '../../assets/Images/splashLogo.png';
import BgLinearGradient from '../../components/BgLinearGradient/BgLinearGradient';
import {
  responsiveFontSize,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {useAppDispatch} from '../../redux/Store';
import {authHandler} from '../../redux/Auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {endPoint, GetApiWithToken} from '../../services/Service';
import { userDetailsHandler } from '../../redux/UserDetails';

const Splash = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    setTimeout(() => {
      getTokenFromLocal();
    }, 5000);

    const animateOpacity = () => {
      opacity.value = withTiming(1, {duration: 3500});
    };

    const timer = setTimeout(animateOpacity, 1000);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const checkPlanDetails = async (token: string) => {
    try {
      const response = await GetApiWithToken(endPoint.profile, token);
      console.log(response?.data)
      if (response?.data?.status) {
        if (!response?.data?.data?.current_plan?.name) {
          dispatch(authHandler(token));
          dispatch(userDetailsHandler({
            isSubscribed: response?.data?.data?.current_plan?.name
              ? true
              : false,
          }))
          navigation.reset({
            index: 0,
            routes: [{name: ScreenNames.SubscriptionPlans}],
          });
        } else {
          dispatch(authHandler(token));
        }
      }
    } catch (err: any) {
      console.log('error in bottom tab', err?.message);
    }
  };

  const getTokenFromLocal = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        checkPlanDetails(token);
      } else {
        navigation.reset({
          index: 0,
          routes: [{name: ScreenNames.Welcome}],
        });
      }
    } catch (err: any) {
      console.log('err main navigation', err.message);
    }
  };

  const splashLogoPath = Image.resolveAssetSource(splashLogo).uri;

  return (
    <View style={styles.container}>
      <BgLinearGradient />
      <Animated.View style={[styles.animatedViewStyle, animatedStyle]}>
        <Image
          source={{uri: splashLogoPath}}
          style={styles.logoStyle}
          resizeMode="contain"
        />
      </Animated.View>
      <Animated.View style={[styles.animatedTextStyle, animatedStyle]}>
        <Text style={styles.text1}>{`JOURNEY `}</Text>
        <Text style={styles.text2}>WITH JOURNALS</Text>
      </Animated.View>
    </View>
  );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: responsiveHeight(25),
    alignItems: 'center',
  },
  animatedViewStyle: {
    height: responsiveHeight(25),
    width: '100%',
  },
  logoStyle: {
    height: responsiveHeight(25),
  },
  animatedTextStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: responsiveHeight(5),
    width: '100%',
  },
  text1: {
    color: '#505A61',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '800',
  },
  text2: {
    color: '#1079C0',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '800',
  },
});

// /* eslint-disable quotes */
// /* eslint-disable react/self-closing-comp */
// /* eslint-disable prettier/prettier */
// import {View, Text, StyleSheet, Image} from 'react-native';
// import React from 'react';
// import splashLogo from '../../assets/Images/splashLogo.png';
// import BgLinearGradient from '../../components/BgLinearGradient/BgLinearGradient';
// import {
//   responsiveFontSize,
//   responsiveHeight,
// } from 'react-native-responsive-dimensions';
// import Animated, {
//   withTiming,
//   useAnimatedStyle,
//   useSharedValue,
//   withSequence,
//   Easing,
// } from 'react-native-reanimated';
// import {useNavigation} from '@react-navigation/native';
// import ScreenNames from '../../utils/ScreenNames';
// import {useAppDispatch} from '../../redux/Store';
// import {authHandler} from '../../redux/Auth';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// const Splash = () => {
//   const navigation = useNavigation();
//   const dispatch = useAppDispatch();
//   const logoYTranslate = useSharedValue(responsiveHeight(0));
//   const textYTranslate = useSharedValue(responsiveHeight(-20));
//   React.useEffect(() => {
//     startAnimation();
//     setTimeout(() => {
//       getTokenFromLocal();
//     }, 2500);
//   }, []);

//   const animatedLogoY = useAnimatedStyle(() => ({
//     transform: [{translateY: logoYTranslate.value}],
//   }));

//   const animatedTextY = useAnimatedStyle(() => ({
//     bottom: textYTranslate.value,
//   }));

//   const startAnimation = () => {
//     logoYTranslate.value = withSequence(
//       withTiming(responsiveHeight(25), {
//         duration: 200,
//         easing: Easing.linear,
//       }),
//       withTiming(responsiveHeight(70), {
//         duration: 200,
//         easing: Easing.linear,
//       }),
//       withTiming(responsiveHeight(45), {
//         duration: 200,
//         easing: Easing.linear,
//       }),
//       withTiming(responsiveHeight(65), {
//         duration: 200,
//         easing: Easing.linear,
//       }),
//       withTiming(responsiveHeight(59), {
//         duration: 200,
//         easing: Easing.linear,
//       }),
//     );

//     setTimeout(() => {
//       textYTranslate.value = withSequence(
//         withTiming(responsiveHeight(65), {
//           duration: 300,
//           easing: Easing.linear,
//         }),
//         withTiming(responsiveHeight(30), {
//           duration: 200,
//           easing: Easing.linear,
//         }),
//         withTiming(responsiveHeight(50), {
//           duration: 200,
//           easing: Easing.linear,
//         }),
//         withTiming(responsiveHeight(38), {
//           duration: 200,
//           easing: Easing.linear,
//         }),
//         withTiming(responsiveHeight(45), {
//           duration: 200,
//           easing: Easing.linear,
//         }),
//       );
//     }, 1000);
//   };

//   const getTokenFromLocal = async () => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (token) {
//         dispatch(authHandler(token));
//       } else {
//         navigation.reset({
//           index: 0,
//           routes: [{name: ScreenNames.Welcome}],
//         });
//       }
//     } catch (err: any) {
//       console.log('err main navigation', err.message);
//     }
//   };

//   const splashLogoPath = Image.resolveAssetSource(splashLogo).uri;
//   return (
//     <View style={styles.container}>
//       <BgLinearGradient />
//       <Animated.View style={[styles.animatedViewStyle, animatedLogoY]}>
//         <Image
//           source={{uri: splashLogoPath}}
//           style={styles.logoStyle}
//           resizeMode="contain"
//         />
//       </Animated.View>
//       <Animated.View style={[styles.animatedTextStyle, animatedTextY]}>
//         <Text style={styles.text1}>{`JOURNEY `}</Text>
//         <Text style={styles.text2}>WITH JOURNALS</Text>
//       </Animated.View>
//     </View>
//   );
// };

// export default Splash;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     width: '100%',
//     position: 'relative',
//   },
//   animatedViewStyle: {
//     height: responsiveHeight(25),
//     width: '100%',
//     position: 'absolute',
//     top: responsiveHeight(-30),
//   },
//   logoStyle: {
//     height: responsiveHeight(25),
//   },
//   animatedTextStyle: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     height: responsiveHeight(5),
//     width: '100%',
//     position: 'absolute',
//     bottom: responsiveHeight(-20),
//   },
//   text1: {
//     color: '#505A61',
//     fontSize: responsiveFontSize(2.5),
//     fontWeight: '800',
//   },
//   text2: {
//     color: '#1079C0',
//     fontSize: responsiveFontSize(2.5),
//     fontWeight: '800',
//   },
// });
