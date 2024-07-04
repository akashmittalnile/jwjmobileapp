import {StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import React, {useRef} from 'react';
import {Formik} from 'formik';
import * as yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/Container/Container';
import {responsiveHeight} from 'react-native-responsive-dimensions';
import BorderBtn from '../../components/Button/BorderBtn';
import PasswordInput from '../../components/CustomInput/PasswordInput';
import ScreenNames from '../../utils/ScreenNames';
import {PostApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';

const initialValues = {
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
};

const validationSchema = yup.object().shape({
  oldPassword: yup.string().required('Enter Old Password').min(1, ''),
  newPassword: yup.string().required('Enter New Password').min(1, ''),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref('newPassword')], 'Passwords must match')
    .required('Enter Confirm Password'),
});

const ChangePassword = () => {
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const [loader, setLoader] = React.useState<boolean>(false);
  const formikRef = useRef<Formik>();

  const changePasswordHandler = async () => {
    try {
      setLoader(true);
      const response = await PostApiWithToken(
        endPoint.changePassword,
        {
          old_password: formikRef.current?.values?.oldPassword,
          new_password: formikRef.current?.values?.newPassword,
        },
        token,
      );
      if (response?.data?.status) {
        navigation.navigate(ScreenNames.Profile);
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err change password', err.message);
    } finally {
      setLoader(false);
    }
  };

  return (
    <Container headerText="Change Password">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={changePasswordHandler}>
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
              <PasswordInput
                containerStyle={styles.password}
                placeholder="Old Password"
                value={values.oldPassword}
                onChangeText={handleChange('oldPassword')}
                onBlur={() => {
                  setFieldTouched('oldPassword');
                  handleBlur('oldPassword');
                }}
                errorText={touched.oldPassword && errors.oldPassword}
              />
              <PasswordInput
                containerStyle={styles.password}
                placeholder="New Password"
                value={values.newPassword}
                onChangeText={handleChange('newPassword')}
                onBlur={() => {
                  setFieldTouched('newPassword');
                  handleBlur('newPassword');
                }}
                errorText={touched.newPassword && errors.newPassword}
              />
              <PasswordInput
                containerStyle={styles.password}
                placeholder="Confirm New Password"
                value={values.confirmNewPassword}
                onChangeText={handleChange('confirmNewPassword')}
                onBlur={() => {
                  setFieldTouched('confirmNewPassword');
                  handleBlur('confirmNewPassword');
                }}
                errorText={
                  touched.confirmNewPassword && errors.confirmNewPassword
                }
              />
              <BorderBtn
                loader={loader}
                buttonText="Update password"
                onClick={handleSubmit}
                containerStyle={styles.button}
              />
            </>
          )}
        </Formik>
      </KeyboardAvoidingView>
    </Container>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  password: {
    marginTop: 0,
    width: '100%',
  },
  button: {
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    width: '100%',
  },
});
