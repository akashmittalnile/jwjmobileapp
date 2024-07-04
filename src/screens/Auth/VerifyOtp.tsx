/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Image,
  StyleSheet,
  Text,
  TextInput,
  ActivityIndicator,
} from 'react-native';
import React, {RefObject} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BgImage from '../../components/BgImage/BgImage';
import Header from '../../components/Header/Header';
import KeyboardAvoidingViewWrapper from '../../components/Wrapper/KeyboardAvoidingViewWrapper';
import Wrapper from '../../components/Wrapper/Wrapper';
import {Formik} from 'formik';
import * as yup from 'yup';
import BorderBtn from '../../components/Button/BorderBtn';
import BorderLessBtn from '../../components/Button/BorderLessBtn';
import {globalStyles} from '../../utils/constant';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {PostApi, endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../../navigation/MainNavigation';

type VerifyOtpRouteProps = RouteProp<RootStackParamList, 'VerifyOtp'>;

let currentField = 1;
const VerifyOtp = () => {
  const navigation = useNavigation();
  const routes = useRoute<VerifyOtpRouteProps>();
  const [loader, setLoader] = React.useState<boolean>(false);
  const [resendLoader, setResendLoader] = React.useState<boolean>(false);
  const [paramOtp, setParamOtp] = React.useState<string>('');
  const formikRef = React.useRef<Formik>(null);
  const otp1Ref: RefObject<TextInput> = React.useRef(null);
  const otp2Ref: RefObject<TextInput> = React.useRef(null);
  const otp3Ref: RefObject<TextInput> = React.useRef(null);
  const otp4Ref: RefObject<TextInput> = React.useRef(null);
  const validationSchema = yup.object().shape({
    otp1: yup.string().required(),
    otp2: yup.string().required(),
    otp3: yup.string().required(),
    otp4: yup.string().required(),
  });

  const initialValues = {
    otp1: '',
    otp2: '',
    otp3: '',
    otp4: '',
  };

  React.useEffect(() => {
    if (routes?.params?.otp) {
      setParamOtp(routes?.params?.otp);
    }
    setTimeout(() => {
      otp1Ref.current?.focus();
    }, 100);
  }, []);

  const handleKeyPress = (e: any, value: string, setFieldValue: any) => {
    if (e?.nativeEvent?.key !== 'Backspace') {
      if (
        currentField === 1 &&
        typeof Number(e?.nativeEvent?.key) === 'number'
      ) {
        otp2Ref.current?.focus();
      } else if (
        currentField === 2 &&
        typeof Number(e?.nativeEvent?.key) === 'number'
      ) {
        otp3Ref.current?.focus();
      } else if (
        currentField === 3 &&
        typeof Number(e?.nativeEvent?.key) === 'number'
      ) {
        otp4Ref.current?.focus();
      }
      if (currentField < 4) {
        currentField++;
      }
    } else if (e?.nativeEvent?.key === 'Backspace') {
      if (currentField === 2) {
        if (!value) {
          setFieldValue('otp1', '').then((result: any) => {
            otp1Ref.current?.focus();
            currentField--;
          });
        }
      } else if (currentField === 3) {
        if (!value) {
          setFieldValue('otp2', '').then((result: any) => {
            otp2Ref.current?.focus();
            currentField--;
          });
        }
      } else if (currentField === 4) {
        if (!value) {
          setFieldValue('otp3', '').then((result: any) => {
            otp3Ref.current?.focus();
            currentField--;
          });
        }
      }
    }
  };

  const submitOtpHandler = async () => {
    currentField = 1;
    const otp =
      formikRef.current?.values?.otp1 +
      formikRef.current?.values?.otp2 +
      formikRef.current?.values?.otp3 +
      formikRef.current?.values?.otp4;
    try {
      setLoader(true);
      if (routes?.params?.verifyEmail) {
        const response = await PostApi(endPoint.verifyOtp, {
          email: routes?.params?.email,
          otp,
        });
        if (response?.data?.status) {
          navigation.navigate(ScreenNames.SignUp, {
            emailVerified: true,
            id: response?.data?.data?.id,
          });
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
        return;
      }
      const response = await PostApi(endPoint.otpVerfication, {
        email: routes?.params?.email,
        otp,
      });
      if (response?.data?.status) {
        navigation.navigate(ScreenNames.ResetPassword, {
          screenName: routes?.params?.screenName,
          email: routes?.params?.email,
          otp,
        });
      } else if (!response?.data?.status) {
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in verify otp', err.message);
    } finally {
      setLoader(false);
    }
  };

  const resendOtpHandler = async () => {
    setResendLoader(true);
    try {
      const response = await PostApi(
        routes?.params?.verifyEmail
          ? endPoint.sendOtp
          : endPoint.forgotPassword,
        {
          email: routes?.params?.email,
        },
      );
      if (response?.data?.status) {
        setParamOtp(response.data?.data?.otp);
        Toast.show({
          type: 'info',
          text1: 'Otp send successfully',
        });
      }
    } catch (err: any) {
      console.log('err in resend otp', err.message);
    } finally {
      setResendLoader(false);
    }
  };
  return (
    <KeyboardAvoidingViewWrapper>
      <View style={styles.container}>
        <BgImage  />
        <Header title="OTP verification" />

        <Wrapper containerStyle={{marginTop: responsiveHeight(30)}}>
          <Image
            source={require('../../assets/Icons/mobilePassword2.png')}
            style={styles.img}
            resizeMode="contain"
          />
          <Text style={styles.wohoo}>Wohoo!!!</Text>
          <Text style={styles.text}>
            Check your email we have sent you a verification code on
            {' ' + routes?.params?.email + ' ' + paramOtp}
          </Text>

          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            onSubmit={submitOtpHandler}
            validationSchema={validationSchema}
            enableReinitialize={true}>
            {({
              handleChange,
              handleBlur,
              setFieldTouched,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <>
                <View style={styles.otpContainer}>
                  <TextInput
                    value={values.otp1}
                    editable={true}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          touched.otp1 && errors.otp1
                            ? 'red'
                            : globalStyles.borderColorBlue,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={handleChange('otp1')}
                    onKeyPress={e => {
                      handleKeyPress(e, values.otp1, setFieldValue);
                    }}
                    onBlur={() => {
                      setFieldTouched('otp1');
                      handleBlur('otp1');
                    }}
                    ref={otp1Ref}
                  />

                  <TextInput
                    value={values.otp2}
                    editable={true}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          touched.otp2 && errors.otp2
                            ? 'red'
                            : globalStyles.borderColorBlue,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={handleChange('otp2')}
                    onKeyPress={e => {
                      handleKeyPress(e, values.otp2, setFieldValue);
                    }}
                    onBlur={() => {
                      setFieldTouched('otp2');
                      handleBlur('otp2');
                    }}
                    ref={otp2Ref}
                  />

                  <TextInput
                    value={values.otp3}
                    editable={true}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          touched.otp3 && errors.otp3
                            ? 'red'
                            : globalStyles.borderColorBlue,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={handleChange('otp3')}
                    onKeyPress={e => {
                      handleKeyPress(e, values.otp3, setFieldValue);
                    }}
                    onBlur={() => {
                      setFieldTouched('otp3');
                      handleBlur('otp3');
                    }}
                    ref={otp3Ref}
                  />

                  <TextInput
                    value={values.otp4}
                    editable={true}
                    style={[
                      styles.input,
                      {
                        borderColor:
                          touched.otp4 && errors.otp4
                            ? 'red'
                            : globalStyles.borderColorBlue,
                      },
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    onChangeText={handleChange('otp4')}
                    onKeyPress={e => {
                      handleKeyPress(e, values.otp4, setFieldValue);
                    }}
                    onBlur={() => {
                      setFieldTouched('otp4');
                      handleBlur('otp4');
                    }}
                    ref={otp4Ref}
                  />
                </View>
                <View style={styles.resendButtonContainer}>
                  {resendLoader ? (
                    <ActivityIndicator color={globalStyles.themeBlue} />
                  ) : (
                    <BorderLessBtn
                      onClick={resendOtpHandler}
                      buttonText="RESEND VERIFICATION CODE"
                      buttonTextStyle={{textAlign: 'center'}}
                    />
                  )}
                </View>
                <BorderBtn
                  onClick={handleSubmit}
                  buttonText="Submit"
                  loader={loader}
                  loaderColor="white"
                />
              </>
            )}
          </Formik>
        </Wrapper>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default VerifyOtp;

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
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: responsiveWidth(65),
    marginBottom: responsiveHeight(2),
  },
  input: {
    height: responsiveWidth(12),
    width: responsiveWidth(12),
    borderWidth: 1.3,
    borderColor: globalStyles.borderColor,
    elevation: 2,
    shadowColor: globalStyles.shadowColor,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 3,
    textAlign: 'center',
    color: 'black',
    borderRadius: responsiveWidth(2),
  },
  wohoo: {
    fontSize: responsiveFontSize(3),
    color: 'rgba(0,0,0,.6)',
    fontWeight: '700',
  },
  text: {
    fontSize: responsiveFontSize(1.6),
    color: 'rgba(0,0,0,.6)',
    textAlign: 'center',
    marginVertical: responsiveHeight(1),
  },
  img: {
    height: responsiveHeight(20),
  },
  resendButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(4),
  },
});
