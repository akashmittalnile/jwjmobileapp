/* eslint-disable prettier/prettier */
import {View, Image, StyleSheet, Text} from 'react-native';
import React, {useRef} from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BgImage from '../../components/BgImage/BgImage';
import TextInputField from '../../components/CustomInput/TextInputField';
import PasswordInput from '../../components/CustomInput/PasswordInput';
import TextInputWithoutIcon from '../../components/CustomInput/TextInputWithoutIcon';
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

  React.useEffect(() => {
    if (focused && !params?.emailVerified) {
      formikRef.current?.setValues({
        firstname: '',
        lastname: '',
        user_name: '',
        email: '',
        password: '',
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
        });
        if (response?.data?.status) {
          await AsyncStorage.setItem(
            'token',
            response?.data?.data?.access_token,
          );
          dispatch(authHandler(response?.data?.data?.access_token));
          navigation.navigate(ScreenNames.SubscriptionPlans);
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

  return (
    <KeyboardAvoidingViewWrapper>
      <View style={styles.container}>
        <BgImage />
        <Header title="Sign Up" />
        <Wrapper containerStyle={{marginTop: responsiveHeight(12)}}>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={values => {
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
});
