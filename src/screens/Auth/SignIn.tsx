/* eslint-disable prettier/prettier */
import {View, Image, StyleSheet, Text} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import BgImage from '../../components/BgImage/BgImage';
import TextInputField from '../../components/CustomInput/TextInputField';
import PasswordInput from '../../components/CustomInput/PasswordInput';
import BorderLessBtn from '../../components/Button/BorderLessBtn';
import BorderBtn from '../../components/Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import Header from '../../components/Header/Header';
import Wrapper from '../../components/Wrapper/Wrapper';
import {Formik} from 'formik';
import * as yup from 'yup';
import KeyboardAvoidingViewWrapper from '../../components/Wrapper/KeyboardAvoidingViewWrapper';
import ScreenNames from '../../utils/ScreenNames';
import {PostApi, endPoint} from '../../services/Service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../../redux/Store';
import {authHandler} from '../../redux/Auth';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import {firebase} from '@react-native-firebase/firestore';

const SignIn = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const formikRef = React.useRef<Formik>();
  const [loader, setLoader] = React.useState<boolean>(false);
  const [fcmToken, setFcmToken] = React.useState<string>('');

  React.useEffect(() => {
    if (focused) {
      messaging()
        .getToken()
        .then(token => {
          setFcmToken(token);
        })
        .catch(err => {
          console.log('err in getting fcm token in signin', err);
        });
      formikRef.current?.setValues({email: '', password: ''});
      formikRef.current?.setTouched({email: false, password: false});
    }
  }, [focused]);

  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    email: yup.string().required('Enter email').email('Invalid email'),
    password: yup.string().required('Enter Password').min(1, ''),
  });

  const goToSignUp = () => {
    navigation.navigate(ScreenNames.SignUp);
  };

  const goToForgotPassword = () => {
    navigation.navigate(ScreenNames.ForgotPassword);
  };

  const signInHanlder = async () => {
    try {
      setLoader(true);
      const response = await PostApi(endPoint.login, {
        email: formikRef.current?.values?.email,
        password: formikRef.current?.values?.password,
        fcm_token: fcmToken,
      });
      if (response?.data?.status) {
        firebase
          ?.firestore()
          .collection('fcm')
          .doc(`${formikRef.current?.values?.email}`)
          ?.collection('token')
          ?.add({
            token: fcmToken,
          });
        await AsyncStorage.setItem('token', response?.data?.data?.access_token);
        dispatch(authHandler(response?.data?.data?.access_token));
        navigation.navigate(ScreenNames.Drawer);
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err login', err.message);
    } finally {
      setLoader(false);
    }
  };
  return (
    <KeyboardAvoidingViewWrapper>
      <View style={styles.container}>
        <BgImage />
        <Header
          title="Sign In"
          backButton={
            navigation?.getState()?.routeNames[0] === 'SignIn' ? false : true
          }
        />
        <Wrapper containerStyle={{marginTop: responsiveHeight(32)}}>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={() => {
              signInHanlder();
            }}>
            {({
              handleBlur,
              handleChange,
              touched,
              errors,
              values,
              setFieldTouched,
              handleSubmit,
            }) => (
              <>
                <Image
                  source={require('../../assets/Icons/Icon.png')}
                  resizeMode="contain"
                  style={styles.icon}
                />
                <TextInputField
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    setFieldTouched('email');
                    handleBlur('email');
                  }}
                  errorText={touched.email && errors.email}
                />
                <PasswordInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => {
                    setFieldTouched('password');
                    handleBlur('password');
                  }}
                  errorText={touched.password && errors.password}
                />
                <BorderLessBtn
                  containerStyle={{width: 'auto', alignSelf: 'flex-end'}}
                  buttonText="Forgot your password?"
                  onClick={goToForgotPassword}
                />
                <BorderBtn
                  buttonText="Sign In"
                  onClick={handleSubmit}
                  loader={loader}
                />
              </>
            )}
          </Formik>
        </Wrapper>
        <View style={styles.btnContainer}>
          <Text style={styles.signupTxt}>Don't have an account?</Text>
          <BorderLessBtn
            buttonText=" Signup"
            onClick={goToSignUp}
            containerStyle={styles.signupBtn}
            buttonTextStyle={{fontWeight: 'bold'}}
          />
        </View>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bgImage: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    height: '90%',
    width: '100%',
    zIndex: -100,
  },
  icon: {
    marginBottom: responsiveHeight(1),
    height: responsiveHeight(13),
  },
  btnContainer: {
    marginTop: responsiveHeight(1),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signupTxt: {
    color: globalStyles.textGray,
    fontSize: responsiveFontSize(1.7),
  },
  signupBtn: {
    height: '100%',
    width: 'auto',
  },
  signupText: {
    textAlign: 'left',
  },
});
