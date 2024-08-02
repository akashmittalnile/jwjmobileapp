import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../../components/Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import TextInputField from '../../components/CustomInput/TextInputField';
import {Formik} from 'formik';
import * as yup from 'yup';
// import PhoneInput from 'react-native-phone-number-input';
import TextInputWithoutIcon from '../../components/CustomInput/TextInputWithoutIcon';
import userIcon from '../../assets/Icons/user-2.png';
import tickBlueIcon from '../../assets/Icons/tick-circle.png';
import tickIcon from '../../assets/Icons/tick-circle-gray.png';
import CommunityModal from '../../components/Modal/CommunityModal';
import {useNavigation} from '@react-navigation/native';
import {PostApiWithToken, endPoint} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import {reloadHandler} from '../../redux/ReloadScreen';
import ScreenNames from '../../utils/ScreenNames';
const userIconPath = Image.resolveAssetSource(userIcon).uri;
const tickBlueIconPath = Image.resolveAssetSource(tickBlueIcon).uri;
const tickIconPath = Image.resolveAssetSource(tickIcon).uri;
import PhoneInput from '../../components/PhoneInput/PhoneInput';
import {USMobileNumberFormatHandler} from '../../utils/Method';

const tempData = [
  {text: 'Plan Related', value: 1},
  {text: 'Billing Related', value: 2},
  {text: 'General Inquiry', value: 3},
  {text: 'Community Related', value: 4},
  {text: 'Journals Related', value: 5},
  {text: 'Others', value: 6},
];
const ContactForQuery = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const userData = useAppSelector(state => state.userDetails);
  const contact = useAppSelector(state => state.reload.Contact);
  const formikRef = React.useRef<Formik>();
  const [selectedButton, setSelectedButton] = React.useState<number>(1);
  const [modal, setModal] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  React.useEffect(() => {
    formikRef?.current?.setValues({
      user: userData?.userName,
      email: userData?.email,
      phoneNumber: userData?.mobile,
      countryCode: `${userData?.countryCode}${userData?.mobile?.replace(
        /\D/g,
        '',
      )}`,
      description: '',
    });
  }, []);

  const validationSchema = yup?.object()?.shape({
    user: yup.string().required('Name is Required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email address is required'),
    description: yup.string().required('Description is required'),
    // phoneNumber: yup.string().required('Phone number is required'),
  });

  const submitHandler = async (values: any) => {
    setLoader(true);
    try {
      const data = {
        name: values?.user,
        email: values?.email,
        contact: values?.countryCode,
        message: values?.description,
        type: selectedButton,
      };
      const response = await PostApiWithToken(
        endPoint.createQuery,
        data,
        token,
      );
      if (response?.data?.status) {
        dispatch(reloadHandler({[ScreenNames.Contact]: !contact}));
        setModal(true);
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in create enquiry', err?.message);
    } finally {
      setLoader(false);
    }
  };

  const modalHandler = () => {
    setModal(false);
    navigation.goBack();
  };

  const inquiryHandler = (number: number) => {
    setSelectedButton(number);
  };
  return (
    <>
      <Container
        headerText="Contact us"
        reloadOnScroll={false}
        scrollViewContentContainerStyle={{height: responsiveHeight(75)}}>
        <Formik
          innerRef={formikRef}
          validationSchema={validationSchema}
          initialValues={{
            user: '',
            email: '',
            phoneNumber: '',
            countryCode: '',
            description: '',
          }}
          onSubmit={values => submitHandler(values)}>
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
          }) => (
            <View style={{paddingTop: responsiveHeight(1.5)}}>
              <TextInputField
                editable={false}
                placeholder="Name"
                uri={userIconPath}
                value={values.user}
                onChangeText={handleChange('user')}
                onBlur={() => {
                  handleBlur('user');
                }}
                errorText={touched.user && errors.user}
                containerStyle={styles.textInput}
              />
              <TextInputField
                editable={false}
                value={touched && values.email}
                onChangeText={handleChange('email')}
                onBlur={() => {
                  handleBlur('email');
                }}
                errorText={touched.email && errors.email}
                containerStyle={styles.textInput}
              />
              <PhoneInput
                disabled={true}
                value={USMobileNumberFormatHandler(userData?.mobile)}
                countryCode={userData?.cca2 ? userData?.cca2 : 'US'}
                onChangeText={handleChange('phoneNumber')}
                onChangeFormattedText={handleChange('countryCode')}
                placeHolder="Contact number"
              />
              {/* <PhoneInput
                disabled={true}
                value={userData?.mobile}
                defaultCode="US"
                layout="first"
                placeholder={values?.phoneNumber}
                
                onChangeText={handleChange('phoneNumber')}
                onChangeFormattedText={handleChange('countryCode')}
                containerStyle={{
                  ...styles.phoneInput,
                  borderColor:
                    touched.phoneNumber && errors.phoneNumber
                      ? 'red'
                      : 'transparent',
                }}
                textContainerStyle={styles.textContainerStyle}
                textInputStyle={styles.textInputStyle}
                countryPickerButtonStyle={{width: responsiveWidth(17)}}
                codeTextStyle={{width: 0}}
              /> */}
              <ScrollView
                horizontal
                style={{marginTop: responsiveHeight(2)}}
                showsHorizontalScrollIndicator={false}>
                {tempData.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => {
                      inquiryHandler(item?.value);
                    }}
                    key={index}
                    style={{
                      ...styles.touch,
                      borderColor:
                        selectedButton === item?.value
                          ? globalStyles.themeBlue
                          : 'transparent',
                    }}>
                    <Text
                      style={{
                        color:
                          selectedButton === item?.value
                            ? globalStyles.themeBlue
                            : 'gray',
                      }}>
                      {item?.text}
                    </Text>
                    <Image
                      source={{
                        uri:
                          selectedButton === item?.value
                            ? tickBlueIconPath
                            : tickIconPath,
                      }}
                      resizeMode="contain"
                      style={{
                        marginLeft: responsiveWidth(2),
                        height: responsiveHeight(2),
                        width: responsiveHeight(2),
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TextInputWithoutIcon
                value={values.description}
                onChangeText={handleChange('description')}
                onBlur={() => {
                  handleBlur('description');
                }}
                errorText={touched.description && errors.description}
                placeholder="Type Your Description Here…"
                textInputStyle={{
                  fontSize: responsiveFontSize(1.7),
                  paddingTop: responsiveHeight(1),
                }}
                containerStyle={styles.textInputWithoutIcon}
                multiline={true}
              />
              <BorderBtn
                loader={loader}
                onClick={handleSubmit}
                buttonText="Submit"
                containerStyle={styles.button}
              />
            </View>
          )}
        </Formik>
      </Container>
      {modal && (
        <CommunityModal
          heading="Thank You For Submitting
Your Inquiry! 🌟"
          text="Your Question Has Been Successfully Received. Our Team Is Diligently Working To Provide You With A Detailed And Helpful Response.
Please Note That We Aim To Address All Inquiries Within The Next 24-48 Hours. Your Patience Is Appreciated As We Strive To Ensure The Best Possible Support For Our Valued Users."
          buttonText="Close"
          modalHandler={modalHandler}
        />
      )}
    </>
  );
};

export default ContactForQuery;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  textInput: {
    width: '100%',
    marginTop: 0,
    marginBottom: responsiveHeight(0.5),
  },
  button: {
    width: '100%',
  },
  phoneInput: {
    marginTop: responsiveHeight(0.2),
    width: '100%',
    backgroundColor: 'rgba(137, 137, 137, .2)',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  textContainerStyle: {
    padding: 0,
    backgroundColor: 'rgba(137, 137, 137, .05)',
    borderLeftWidth: 1,
    borderLeftColor: globalStyles.lightGray,
  },
  textInputStyle: {
    fontSize: responsiveFontSize(1.7),
    marginLeft: responsiveWidth(-2),
  },
  textInputWithoutIcon: {
    marginTop: responsiveHeight(2),
    marginBottom: 0,
    height: responsiveHeight(17),
    width: '100%',
  },
  iconButtonStyle: {
    marginRight: responsiveWidth(2),
    backgroundColor: 'white',
    borderWidth: responsiveWidth(0.23),
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: responsiveWidth(2),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(3),
    borderWidth: responsiveWidth(0.23),
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
  },
});
