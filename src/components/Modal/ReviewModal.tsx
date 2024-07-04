/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import Review from '../Review/Review';
import BorderBtn from '../Button/BorderBtn';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {PostApiWithToken, endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userDetailsHandler} from '../../redux/UserDetails';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const ReviewModal = () => {
  const dispatch = useAppDispatch();
  const [loader, setLoader] = React.useState<boolean>(false);
  const [review, setReview] = React.useState<{review: number; comment: string}>(
    {review: 1, comment: ''},
  );
  const [err, setErr] = React.useState<boolean>(false);
  const [keyBoardHeight, setKeyboardHeight] = React.useState<number>(
    responsiveHeight(25),
  );

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      keyBoard => {
        setKeyboardHeight(
          keyBoard?.endCoordinates?.height + responsiveHeight(2),
        );
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(responsiveHeight(25));
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    bottom: withTiming(keyBoardHeight, {
      duration: 200,
      easing: Easing.linear,
    }),
  }));

  const modalHandler = async () => {
    setLoader(true);
    try {
      if (!review?.comment) {
        setErr(true);
        return;
      }
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        return;
      }
      const response = await PostApiWithToken(
        endPoint.submitRating,
        {rating: review.review, description: review.comment},
        token,
      );
      if (response?.data?.status) {
        dispatch(
          userDetailsHandler({ratingSubmit: true, showReviewModal: false}),
        );
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in rating', err?.message);
    } finally {
      setLoader(false);
    }
  };

  const cancelModal = () => {
    dispatch(userDetailsHandler({showReviewModal: false}));
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={{
          // height: '100%',
          width: '100%',
        }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView bounces={false} scrollEnabled={false}>
          <TouchableOpacity
            style={styles.touch}
            disabled={false}
            activeOpacity={1}
            onPress={() => {
              Keyboard.dismiss();
            }}>
            <Animated.View
              style={[
                {
                  ...styles.wrapper,
                },
                animatedStyle,
              ]}>
              <View style={styles.imageContainer}>
                <Image
                  source={require('../../assets/Icons/review.png')}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.rateus}>Rate Us</Text>
              <Text
                style={{
                  fontSize: responsiveFontSize(1.4),
                  color: globalStyles.lightGray,
                }}>
                Your Valuable Feedback!!
              </Text>
              <View>
                <Review
                  onPress={(value: number) => {
                    setReview(preData => ({
                      ...preData,
                      review: value,
                    }));
                  }}
                />
              </View>
              <View
                style={{
                  ...styles.textInputContainer,
                  borderColor: err ? 'red' : 'transparent',
                }}>
                <TextInput
                  multiline={true}
                  style={{...styles.textInput, borderColor: err ? 'red' : globalStyles.lightGray, color: 'black'}}
                  placeholder="Type Your Feedback Here…"
                  placeholderTextColor='gray'
                  onChangeText={text => {
                    setErr(false);
                    setReview(preData => ({
                      ...preData,
                      comment: text,
                    }));
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '90%',
                }}>
                <BorderBtn
                  buttonText="Cancel"
                  onClick={() => {
                    dispatch(userDetailsHandler({showReviewModal: false}));
                  }}
                  containerStyle={{
                    marginTop: responsiveHeight(3),
                    width: '47%',
                    backgroundColor: 'white',
                    borderColor: 'red',
                    borderWidth: responsiveWidth(0.23),
                  }}
                  buttonTextStyle={{color: 'red'}}
                />
                <BorderBtn
                  loader={loader}
                  buttonText="Submit"
                  onClick={modalHandler}
                  containerStyle={{
                    marginTop: responsiveHeight(3),
                    width: '47%',
                  }}
                />
              </View>
              <TouchableOpacity style={styles.cancel} onPress={cancelModal}>
                <Image
                  source={require('../../assets/Icons/cancel.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(2.5),
                    width: responsiveHeight(2.5),
                  }}
                />
              </TouchableOpacity>
            </Animated.View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ReviewModal;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  touch: {
    flex: 1,
    alignItems: 'center',
    height: responsiveHeight(100),
    width: responsiveWidth(100),
  },
  wrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '92%',
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(2),
    backgroundColor: 'white',
  },
  imageContainer: {
    height: responsiveHeight(12),
    width: responsiveWidth(30),
  },
  image: {
    height: '100%',
    width: '100%',
  },
  rateus: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'black',
  },
  textInputContainer: {
    marginTop: responsiveHeight(2),
    width: '90%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
  },
  textInput: {
    padding: responsiveWidth(2),
    height: responsiveHeight(15),
    width: '100%',
    borderWidth: responsiveWidth(0.3),
    borderColor: globalStyles.borderColor,
    borderRadius: responsiveWidth(2),
  },
  cancel: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveWidth(2),
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
});
