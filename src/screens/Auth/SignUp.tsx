/* eslint-disable prettier/prettier */
import {
  View,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import React, {useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
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
import {
  useNavigation,
  useRoute,
  RouteProp,
  useIsFocused,
} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import Toast from 'react-native-toast-message';
import {PostApi, endPoint} from '../../services/Service';
import userIcon from '../../assets/Icons/user-2.png';
import userIcon3 from '../../assets/Icons/user-3.png';
import {RootStackParamList} from '../../navigation/MainNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authHandler} from '../../redux/Auth';
import {useAppDispatch} from '../../redux/Store';
import {userDetailsHandler} from '../../redux/UserDetails';
import PhoneInput from '../../components/PhoneInput/PhoneInput';
import {USMobileNumberFormatHandler} from '../../utils/Method';

const userIconPath = Image.resolveAssetSource(userIcon).uri;
const userIconPath3 = Image.resolveAssetSource(userIcon3).uri;

interface SignUpProps {}

type SignUpParamsProps = RouteProp<RootStackParamList, 'SignUp'>;

const SignUp: React.FC<SignUpProps> = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const focused = useIsFocused();
  const {params} = useRoute<SignUpParamsProps>();
  const formikRef = useRef<Formik>(null);
  const [verifyEmailLoader, setVerifyEmailLoader] =
    React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [gender, setGender] = React.useState<string>('1');
  const [phoneNumber, setPhoneNumber] = React.useState<{
    mobile: string;
    err: boolean;
  }>({mobile: '', err: false});

  React.useEffect(() => {
    if (focused && !params?.emailVerified) {
      formikRef.current?.setValues({
        firstname: '',
        lastname: '',
        user_name: '',
        email: '',
        password: '',
        phoone_number: '',
      });
      formikRef.current?.setTouched({
        firstname: false,
        lastname: false,
        user_name: false,
        email: false,
        password: false,
      });
    }
  }, [focused]);

  const initialValues = {
    firstname: '',
    lastname: '',
    user_name: '',
    email: '',
    password: '',
  };

  const validationSchema = yup.object().shape({
    firstname: yup.string().required('Enter first name').min(1, ' '),
    lastname: yup.string().required('Enter last name').min(1, ' '),
    user_name: yup.string().required('Enter user name').min(1, ' '),
    email: yup.string().required('Enter email').email('Invalid email'),
    password: yup.string().required('Enter Password').min(1, ''),
  });

  const goToSignIn = () => {
    navigation.navigate(ScreenNames.SignIn);
  };

  const submitHandler = async (values: any) => {
    setLoader(true);
    try {
      if (params?.emailVerified) {
        const response = await PostApi(endPoint.register, {
          name: values.firstname + ' ' + values.lastname,
          password: values.password,
          user_name: values.user_name,
          email: values.email,
          id: params?.id,
          gender,
          mobile: values?.phone_Number,
        });
        if (response?.data?.status) {
          await AsyncStorage.setItem(
            'token',
            response?.data?.data?.access_token,
          );
          dispatch(authHandler(response?.data?.data?.access_token));
          dispatch(
            userDetailsHandler({
              isSubscribed: false,
            }),
          );
          // navigation.navigate(ScreenNames.SubscriptionPlans);
          navigation.reset({
            index: 0,
            routes: [{name: ScreenNames.SubscriptionPlans}],
          });
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
      } else {
        Toast.show({
          type: 'info',
          text1: 'Please verify your email',
        });
      }
    } catch (err: any) {
      console.log('err signup', err.message);
    } finally {
      setLoader(false);
    }
  };

  const verifyEmailHandler = async () => {
    setVerifyEmailLoader(true);
    try {
      if (
        formikRef.current?.values.email.length > 1 &&
        [...formikRef.current?.values.email].includes('@')
      ) {
        const response = await PostApi(endPoint.sendOtp, {
          email: formikRef.current?.values?.email,
        });
        if (response?.data?.status) {
          navigation.navigate(ScreenNames.VerifyOtp, {
            verifyEmail: true,
            email: formikRef.current?.values.email,
            otp: response.data?.data?.otp,
          });
        } else if (!response?.data?.status) {
          Toast.show({
            type: 'error',
            text1: response?.data?.message,
          });
        }
      }
    } catch (err: any) {
      console.log('err in verifyEmail', err.message);
    } finally {
      setVerifyEmailLoader(false);
    }
  };

  const selectGender = (value: string) => {
    setGender(value);
  };

  const numberHandler = (text: string) => {
    const number = USMobileNumberFormatHandler(text);
    setPhoneNumber({err: false, mobile: number});
  };

  return (
    <KeyboardAvoidingViewWrapper>
      <View style={styles.container}>
        <BgImage />
        <Header title="Sign Up" />
        <Wrapper containerStyle={{marginTop: responsiveHeight(7)}}>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
              console.log('clciked hegfigiufegiugefugeg')
              submitHandler(values);
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
                  value={values.firstname}
                  placeholder="First Name"
                  onChangeText={handleChange('firstname')}
                  onBlur={() => {
                    setFieldTouched('firstname');
                    handleBlur('firstname');
                  }}
                  errorText={touched.firstname && errors.firstname}
                  uri={userIconPath3}
                />
                <TextInputField
                  value={values.lastname}
                  placeholder="Last Name"
                  onChangeText={handleChange('lastname')}
                  onBlur={() => {
                    setFieldTouched('lastname');
                    handleBlur('lastname');
                  }}
                  errorText={touched.lastname && errors.lastname}
                  uri={userIconPath3}
                />
                <View style={styles.mainGenderContainer}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                    <Image
                      source={require('../../assets/Icons/gender.png')}
                      resizeMode="contain"
                      style={{
                        ...styles.genderImage,
                        height: responsiveHeight(3),
                        width: responsiveHeight(3),
                      }}
                    />
                    <Text style={styles.genderText}>Gender</Text>
                  </View>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={{
                        ...styles.genderTouch,
                        borderColor:
                          gender === '1'
                            ? globalStyles.themeBlue
                            : globalStyles.lightGray,
                      }}
                      onPress={() => {
                        selectGender('1');
                      }}>
                      <Image
                        source={require('../../assets/Icons/user.png')}
                        resizeMode="cover"
                        style={styles.genderImage}
                      />
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.6),
                          color: 'black',
                          fontWeight: '500',
                        }}>
                        Male
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.genderContainer}>
                    <TouchableOpacity
                      style={{
                        ...styles.genderTouch,
                        borderColor:
                          gender === '2'
                            ? globalStyles.themeBlue
                            : globalStyles.lightGray,
                      }}
                      onPress={() => {
                        selectGender('2');
                      }}>
                      <Image
                        source={require('../../assets/Icons/girl.png')}
                        resizeMode="cover"
                        style={styles.genderImage}
                      />
                      <Text
                        style={{
                          fontSize: responsiveFontSize(1.6),
                          color: 'black',
                          fontWeight: '500',
                        }}>
                        Female
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInputField
                  value={values.user_name}
                  placeholder="User Name"
                  onChangeText={handleChange('user_name')}
                  onBlur={() => {
                    setFieldTouched('user_name');
                    handleBlur('user_name');
                  }}
                  errorText={touched.user_name && errors.user_name}
                  uri={userIconPath}
                />
                <TextInputField
                  loader={verifyEmailLoader}
                  loaderColor="white"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    setFieldTouched('email');
                    handleBlur('email');
                  }}
                  errorText={touched.email && errors.email}
                  isVerifyBtn={true}
                  verifyHandler={verifyEmailHandler}
                  verifyBtnText={
                    params?.emailVerified ? 'Verified' : 'Send Otp'
                  }
                  disableButton={params?.emailVerified ? true : false}
                  editable={!params?.emailVerified ? true : false}
                />
                {/* <View
                  style={{
                    ...styles.phoneInputContainer,
                  }}>
                  <PhoneInput
                    value={phoneNumber?.mobile}
                    countryCode={data?.cca2}
                    onChangeText={numberHandler}
                    onCountryChange={country => {
                      setData((preData: any) => ({
                        ...preData,
                        cca2: country?.cca2,
                        countryCode: country?.callingCode[0],
                      }));
                    }}
                    placeHolder="Contact number"
                    maxLength={14}
                    style={{...styles.phoneInput, borderColor: phoneNumber?.err ? 'red' : 'transparent'}}
                  />
                  <View style={styles.errContainer}>
                    {errorText && <Text style={styles.errText}>{errorText}</Text>}
                  </View>
                </View> */}
                <PasswordInput
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => {
                    setFieldTouched('password');
                    handleBlur('password');
                  }}
                  errorText={touched.password && errors.password}
                />
                <BorderBtn
                  loader={loader}
                  buttonText="Get Started"
                  onClick={handleSubmit}
                  containerStyle={{marginTop: responsiveHeight(1)}}
                />
              </>
            )}
          </Formik>
        </Wrapper>
        <View style={styles.btnContainer}>
          <Text style={styles.signupTxt}>Already have an account? </Text>
          <BorderLessBtn
            buttonText=" SignIn"
            onClick={goToSignIn}
            containerStyle={styles.signupBtn}
            buttonTextStyle={{fontWeight: 'bold'}}
          />
        </View>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
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
    marginTop: responsiveHeight(2),
    height: '100%',
    width: 'auto',
  },
  signupText: {
    textAlign: 'left',
  },
  mainGenderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    paddingVertical: responsiveHeight(1),
    paddingLeft: responsiveWidth(4),
    borderRadius: responsiveWidth(1.5),
    width: '95%',
    ...Platform.select({
      ios: {
        shadowColor: globalStyles.shadowColor,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
    backgroundColor: 'white',
  },
  genderContainer: {
    marginLeft: responsiveWidth(4),
    height: responsiveHeight(5),
    width: '30%',
  },
  genderText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
    color: 'rgba(137, 137, 137, .7)',
    paddingLeft: responsiveWidth(2),
  },
  genderTouch: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: '5%',
    height: responsiveHeight(5),
    width: '100%',
    borderRadius: responsiveHeight(5),
    borderWidth: responsiveWidth(0.4),
    overflow: 'hidden',
  },
  genderImage: {
    height: responsiveHeight(3.5),
    width: responsiveHeight(3.5),
  },
  phoneInputContainer: {
    marginTop: responsiveHeight(1),
    height: Platform.OS === 'ios' ? responsiveHeight(8) : responsiveHeight(10),
    width: '95%',
    borderRadius: responsiveWidth(2),
    backgroundColor: 'white',
  },
  phoneInput: {
    height: '80%',
    ...Platform.select({
      ios: {
        shadowColor: globalStyles.shadowColor,
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.7,
        shadowRadius: 3,
      },
      android: {
        elevation: 1.5,
      },
    }),
    backgroundColor: 'white',
    overflow: 'visible',
    borderWidth: responsiveWidth(0.4),
  },
  errContainer: {
    height: '25%',
    paddingLeft: responsiveWidth(2),
    paddingTop: responsiveHeight(0.1),
  },
  errText: {
    color: 'red',
    fontSize: responsiveFontSize(1.5),
  },
});
