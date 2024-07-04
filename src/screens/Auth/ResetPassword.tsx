/* eslint-disable prettier/prettier */
import {View, Image, StyleSheet} from 'react-native';
import React, {useRef} from 'react';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BgImage from '../../components/BgImage/BgImage';
import PasswordInput from '../../components/CustomInput/PasswordInput';
import BorderBtn from '../../components/Button/BorderBtn';
import Header from '../../components/Header/Header';
import Wrapper from '../../components/Wrapper/Wrapper';
import {Formik} from 'formik';
import * as yup from 'yup';
import KeyboardAvoidingViewWrapper from '../../components/Wrapper/KeyboardAvoidingViewWrapper';
import Modal from '../../components/Modal/Modal';
import {
  useNavigation,
  useRoute,
  RouteProp,
  RouteConfig,
} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {PostApi, endPoint} from '../../services/Service';
import Toast from 'react-native-toast-message';
import {RootStackParamList} from '../../navigation/MainNavigation';

type ResetPasswordRouteProps = RouteProp<RootStackParamList, 'ResetPassword'>;

const ResetPassword = () => {
  const navigation = useNavigation();
  const {params} = useRoute<ResetPasswordRouteProps>();
  const formikRef = useRef<Formik>();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);
  const initialValues = {
    password: '',
    confirmPassword: '',
  };

  const validationSchema = yup.object().shape({
    password: yup
      .string()
      .required('Enter New Password')
      .min(5, 'Enter minimum 5 letter'),
    confirmPassword: yup
      .string()
      .required('Enter Confirm Password')
      .oneOf([yup.ref('password')], 'Passwords do not match'),
  });

  const savePasswordHandler = async () => {
    try {
      setLoader(true);
      const response = await PostApi(endPoint.resetPassword, {
        email: params?.email,
        otp: params?.otp,
        password: formikRef.current?.values?.password,
      });
      if (response?.data?.status) {
        setOpenModal(true);
      } else if (!response?.data?.status) {
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err reset password', err.message);
    } finally {
      setLoader(false);
    }
  };

  const changePasswordHandler = () => {
    setOpenModal(false);
    navigation.navigate(ScreenNames.SignIn);
  };

  return (
    <>
      <KeyboardAvoidingViewWrapper>
        <View style={styles.container}>
          <BgImage />
          <Header title="Set Your New Password" />
          <Wrapper containerStyle={{marginTop: responsiveHeight(32)}}>
            <Formik
              innerRef={formikRef}
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={savePasswordHandler}>
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
                    source={require('../../assets/Icons/reset.png')}
                    resizeMode="contain"
                    style={styles.icon}
                  />
                  <PasswordInput
                    value={values.password}
                    onChangeText={handleChange('password')}
                    onBlur={() => {
                      setFieldTouched('password');
                      handleBlur('password');
                    }}
                    errorText={touched.password && errors.password}
                    placeholder="Enter New Password"
                  />
                  <PasswordInput
                    value={values.confirmPassword}
                    onChangeText={handleChange('confirmPassword')}
                    onBlur={() => {
                      setFieldTouched('confirmPassword');
                      handleBlur('confirmPassword');
                    }}
                    errorText={
                      touched.confirmPassword && errors.confirmPassword
                    }
                    placeholder="Confirm New Password"
                  />
                  <BorderBtn
                    loader={loader}
                    buttonText="Change password"
                    onClick={handleSubmit}
                  />
                </>
              )}
            </Formik>
          </Wrapper>
        </View>
      </KeyboardAvoidingViewWrapper>
      {openModal && (
        <Modal
          modalHandler={() => {
            changePasswordHandler();
          }}
          text="Your password has been changed successfully"
        />
      )}
    </>
  );
};

export default ResetPassword;

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
    height: responsiveHeight(15),
  },
});
