/* eslint-disable prettier/prettier */
import {View, Image, StyleSheet} from 'react-native';
import React from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BgImage from '../../components/BgImage/BgImage';
import Header from '../../components/Header/Header';
import KeyboardAvoidingViewWrapper from '../../components/Wrapper/KeyboardAvoidingViewWrapper';
import Wrapper from '../../components/Wrapper/Wrapper';
import TextInputField from '../../components/CustomInput/TextInputField';
import BorderBtn from '../../components/Button/BorderBtn';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {PostApi, endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
  const navigation = useNavigation();
  const [email, setEmail] = React.useState<string>('');
  const [err, setErr] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  const textInputHandler = (text: string) => {
    setEmail(text);
    setErr(false);
  };

  const submitHandler = async () => {
    setLoader(true);
    try {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(email);
      if (!isValidEmail) {
        setErr(true);
        return;
      }
      const response = await PostApi(endPoint.forgotPassword, {email});
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
      if (response?.data?.status) {
        navigation.navigate(ScreenNames.VerifyOtp, {
          screenName: ScreenNames.SignIn,
          email: email,
          otp: response?.data?.data?.otp,
        });
      }
    } catch (err: any) {
      console.log('err forgot password', err.message);
    } finally {
      setLoader(false);
    }
  };
  return (
    <KeyboardAvoidingViewWrapper>
      <View style={styles.container}>
        <BgImage />
        <Header title="Forgot Password" />
        <Wrapper containerStyle={{marginTop: responsiveHeight(35)}}>
          <Image
            source={require('../../assets/Icons/mobilePassword.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <TextInputField
            value={email}
            onChangeText={textInputHandler}
            errorText={
              err ? (email ? 'Invalid email' : 'Please enter email') : ''
            }
          />
          <BorderBtn
            loader={loader}
            onClick={submitHandler}
            buttonText="Validate OTP & Login"
            containerStyle={{marginTop: responsiveHeight(1), marginBottom: responsiveHeight(2)}}
          />
        </Wrapper>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    width: responsiveWidth(100),
    alignItems: 'center',
    backgroundColor: 'white',
  },
  img: {
    height: responsiveHeight(25),
  },
});
