import {Image, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import React, {useRef} from 'react';
import {useNavigation} from '@react-navigation/native';
import Container from '../../components/Container/Container';
// import PhoneInput from 'react-native-phone-number-input';
import {Formik, useFormik} from 'formik';
import * as yup from 'yup';
import TextInputField from '../../components/CustomInput/TextInputField';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import userIcon from '../../assets/Icons/user-2.png';
import BorderBtn from '../../components/Button/BorderBtn';
import UploadPicture from '../../components/Upload/UploadPicture';
import ScreenNames from '../../utils/ScreenNames';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {PostApiWithToken, endPoint} from '../../services/Service';
import {userDetailsHandler} from '../../redux/UserDetails';
import Toast from 'react-native-toast-message';
import PhoneInput from '../../components/PhoneInput/PhoneInput';
import {USMobileNumberFormatHandler} from '../../utils/Method';

const userIconPath = Image.resolveAssetSource(userIcon).uri;

const initialValues = {
  name: '',
  email: '',
};

const validationSchema = yup.object().shape({
  name: yup.string().required('Name is Required'),
  email: yup
    .string()
    .email('Please enter valid email')
    .required('Email Address is Required'),
});

const EditProfile = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const formikRef = useRef<Formik>();
  const {email, name, mobile, countryCode, profileImage, userName, cca2} =
    useAppSelector(state => state.userDetails);
  const [loader, setLoader] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any>({});
  const [err, setErr] = React.useState<{name: boolean; mobile: boolean}>({
    name: false,
    mobile: false,
  });
  React.useEffect(() => {
    getUserData();
  }, [email, name, mobile, countryCode, profileImage, userName, cca2]);

  const getUserData = async () => {
    try {
      let fileType;
      if (profileImage) {
        const temp = profileImage?.split('.');
        const _temp = temp[temp.length - 2]?.split('/');
        const profileName = _temp[_temp.length - 1];
        setData({
          name,
          email,
          mobile: USMobileNumberFormatHandler(mobile) || '',
          countryCode: countryCode || '+1',
          cca2: cca2 === 'undefined' ? 'US' : cca2 ? cca2 : 'US',
          file: {
            uri: profileImage || '',
            name: profileName || '',
            type: `image/${fileType || ''}`,
          },
          userName,
        });
      } else {
        setData({
          name,
          email,
          mobile: USMobileNumberFormatHandler(mobile) || '',
          countryCode: countryCode || '+1',
          cca2: cca2 === 'undefined' ? 'US' : cca2 ? cca2 : 'US',
          userName,
        });
      }
      formikRef.current?.setValues({
        name,
        email,
      });
    } catch (err: any) {
      console.log('err in edit profile split', err.messsage);
    }
  };

  const submitHandler = async (values: any) => {
    try {
      setLoader(true);
      let data1;
      if (!data?.file) {
        data1 = {
          name: data?.name,
          mobile: data?.mobile?.replace(/\D/g, ''),
          country_code: data?.countryCode,
          country_flag: data?.cca2,
          user_name: data?.userName,
        };
      } else {
        let type;
        if (!data?.file?.type?.split('/')[1]) {
          const temp = data?.file?.uri?.split('.');
          if (temp?.length > 0) {
            type = `image/${temp[temp?.length - 1]}`;
          }
        }
        data1 = {
          name: data?.name,
          mobile: data?.mobile?.replace(/\D/g, ''),
          country_code: data?.countryCode,
          country_flag: data?.cca2,
          file: type ? {...data?.file, type} : data?.file,
          user_name: data?.userName,
        };
      }
      // if (data?.file) {
      //   data1 = {
      //     name: data?.name,
      //     mobile: data?.mobile?.replace(/\D/g, ''),
      //     country_code: data?.countryCode,
      //     country_flag: data?.cca2,
      //     file: data?.file,
      //     user_name: data?.userName,
      //   };
      // }
      //  else {
      //   data1 = {
      //     name: data?.name,
      //     mobile: data?.mobile?.replace(/\D/g, ''),
      //     country_code: data?.countryCode,
      //     country_flag: data?.cca2,
      //     user_name: data?.userName,
      //   };
      // }

      if (data1?.mobile?.length !== 10 || !data1?.name) {
        if (data1?.mobile?.length !== 10) {
          setErr(preData => ({...preData, mobile: true}));
        }
        if (!data1?.name) {
          setErr(preData => ({...preData, name: true}));
        }
        return;
      }
      const response = await PostApiWithToken(
        endPoint.updateProfile,
        data1,
        token,
      );
      if (response?.data?.status) {
        dispatch(
          userDetailsHandler({
            name: data?.name,
            countryCode: data?.countryCode,
            mobile: data?.mobile,
            profileImage: data?.file?.uri,
            cca2: data?.cca2,
          }),
        );
        navigation.goBack();
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err update profile', err.message);
    } finally {
      setLoader(false);
    }
  };
  // modificationDate
  const imagePicker = (
    result: {
      filename: string;
      type: string;
      uri: string;
    }[],
  ) => {
    setData((preData: any) => ({
      ...preData,
      file: {
        type: result[0]?.type,
        name: result[0]?.filename,
        uri: result[0]?.uri,
      },
    }));
  };

  const changePasswordHandler = () => {
    navigation.navigate(ScreenNames.ChangePassword);
  };

  const numberHandler = (text: string) => {
    const number = USMobileNumberFormatHandler(text);
    setData((preData: any) => ({
      ...preData,
      mobile: number,
    }));
    setErr(preData => ({...preData, mobile: false}));
  };

  return (
    <Container headerText="Edit Profile">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Formik
          innerRef={formikRef}
          validationSchema={validationSchema}
          initialValues={initialValues}
          onSubmit={values => {
            submitHandler(values);
          }}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <>
              <TextInputField
                containerStyle={styles.input}
                uri={userIconPath}
                placeholder="Name"
                onChangeText={text => {
                  handleChange('name')(text);
                  setData((preData: any) => ({
                    ...preData,
                    name: text,
                  }));
                }}
                value={values?.name}
                onBlur={() => {
                  handleBlur('name');
                }}
                errorText={touched.name && errors.name}
              />
              <TextInputField
                containerStyle={styles.input}
                onChangeText={text => {
                  handleChange('email')(text);
                  setData((preData: any) => ({
                    ...preData,
                    email: text,
                  }));
                }}
                value={values?.email}
                onBlur={() => {
                  handleBlur('email');
                }}
                errorText={touched.email && errors.email}
                editable={false}
              />
              <PhoneInput
                value={data?.mobile}
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
                style={{
                  borderWidth: responsiveWidth(0.23),
                  borderColor: err.mobile ? 'red' : 'transparent',
                }}
              />
              {/* <PhoneInput
                value={mobile ? mobile : ''}
                defaultCode="IN"
                layout="first"
                placeholder={data?.mobile}
                onChangeText={numberHandler}
                containerStyle={{
                  ...styles.phoneInput,
                  borderColor: 'red',
                  borderWidth: err.mobile ? responsiveWidth(0.23) : 0,
                }}
                onChangeCountry={country => {
                  setData((preData: any) => ({
                    ...preData,
                    countryCode: `+${country.callingCode[0]}`,
                    cca2: country.cca2
                  }));
                }}
                textContainerStyle={styles.textContainerStyle}
                textInputStyle={styles.textInputStyle}
                countryPickerButtonStyle={{width: responsiveWidth(17)}}
                codeTextStyle={{width: 0}}
              /> */}
              <UploadPicture
                onClick={imagePicker}
                style={styles.upload}
                placeholder="Upload Profile Image"
                uri={[data?.file]}
                multipleImage={false}
              />
              <BorderBtn
                loader={loader}
                buttonText="Update"
                onClick={handleSubmit}
                containerStyle={styles.button}
              />
            </>
          )}
        </Formik>
        <BorderBtn
          buttonText="Change Password"
          onClick={changePasswordHandler}
          containerStyle={styles.button}
        />
      </KeyboardAvoidingView>
    </Container>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    marginTop: responsiveHeight(2),
  },
  input: {
    marginTop: 0,
    width: '100%',
  },
  upload: {
    marginTop: 0,
    marginBottom: responsiveHeight(0),
    backgroundColor: 'white',
  },
  button: {
    marginTop: responsiveHeight(1),
    width: '100%',
  },
  phoneInput: {
    marginTop: responsiveHeight(0.2),
    marginBottom: responsiveHeight(2.2),
    height: responsiveHeight(7),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  textContainerStyle: {
    padding: 0,
    backgroundColor: 'white',
    borderLeftWidth: 1,
    borderLeftColor: globalStyles.lightGray,
  },
  textInputStyle: {
    fontSize: responsiveFontSize(1.7),
    marginLeft: responsiveWidth(-4),
    height: responsiveHeight(7),
    backgroundColor: 'white',
  },
});
