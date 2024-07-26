import {View, Text, StyleSheet, Image, Platform} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import KeyboardAvoidingViewWrapper from '../../components/Wrapper/KeyboardAvoidingViewWrapper';
import BgImage from '../../components/BgImage/BgImage';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../../components/Button/BorderBtn';
import BorderLessBtn from '../../components/Button/BorderLessBtn';
import ScreenNames from '../../utils/ScreenNames';

const Welcome = () => {
  const navigation = useNavigation();
  const signInHandler = () => {
    navigation.navigate('SignIn');
  };
  const signUpHandler = () => {
    navigation.navigate('SignUp');
  };
  return (
    <KeyboardAvoidingViewWrapper>
      <View style={styles.container}>
        <BgImage />
        <View style={styles.contentContainer}>
          <Image
            source={require('../../assets/Images/rectangle.png')}
            resizeMode="stretch"
            style={styles.image}
          />
          <Image
            source={require('../../assets/Images/splashLogo.png')}
            resizeMode="contain"
            style={styles.splashLogo}
          />
          <View style={styles.nameContainer}>
            <Text
              style={{
                color: globalStyles.themeBlue,
                fontSize: responsiveFontSize(2),
                fontWeight: '700',
                marginRight: responsiveWidth(1),
              }}>
              JOURNEY
            </Text>
            <Text
              style={{
                color: 'black',
                fontSize: responsiveFontSize(2),
                fontWeight: '700',
                marginRight: responsiveWidth(1),
              }}>
              WITH JOURNALS
            </Text>
          </View>
          <Text
            style={{
              marginTop: responsiveHeight(0.5),
              color: 'black',
              opacity: 0.9,
              fontSize: responsiveFontSize(3),
              fontWeight: '700',
            }}>
            Welcome
          </Text>
          <Text
            style={{
              marginTop: responsiveHeight(0.5),
              color: globalStyles.textGray,
              opacity: 0.7,
              fontSize: responsiveFontSize(1.4),
              fontWeight: '700',
              width: responsiveWidth(85),
              textAlign: 'center',
            }}>
            Reference site about Lorem Ipsum, giving information on its origins,
            as well as a random Lipsum generator.
          </Text>
          <BorderBtn
            buttonText="Sign In"
            onClick={signInHandler}
            containerStyle={styles.button}
          />
          <BorderBtn
            buttonText="Get Started"
            onClick={signUpHandler}
            containerStyle={{
              ...styles.button,
              backgroundColor: 'white',
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
            }}
            buttonTextStyle={{...styles.buttonText, fontWeight: 'bold'}}
          />

          <Text
            style={{
              marginTop: responsiveHeight(2),
              color: 'black',
              opacity: 0.8,
            }}>
            {' '}
            By Creating Your Account You Agree To Our{' '}
          </Text>
          <View style={{flexDirection: 'row'}}>
            <BorderLessBtn
              onClick={() => {
                navigation.navigate(ScreenNames.TermAndCondition);
              }}
              buttonText="Terms Of Use"
              buttonTextStyle={{
                color: 'black',
                fontSize: responsiveFontSize(1.4),
                fontWeight: '600',
              }}
              containerStyle={{height: 'auto', width: 'auto'}}
            />
            <Text
              style={{
                color: 'black',
                fontSize: responsiveFontSize(1.4),
              }}>
              {' '}
              & Confirm You Have Read Our
            </Text>
            <BorderLessBtn
              onClick={() => {}}
              buttonText=" Privacy"
              buttonTextStyle={{
                color: 'black',
                fontSize: responsiveFontSize(1.4),
                fontWeight: '600',
              }}
              containerStyle={{height: 'auto', width: 'auto'}}
            />
          </View>
          <BorderLessBtn
            onClick={() => {}}
            buttonText="  Policy"
            buttonTextStyle={{
              color: 'black',
              fontSize: responsiveFontSize(1.4),
              fontWeight: '600',
            }}
            containerStyle={{height: 'auto', width: 'auto'}}
          />
        </View>
      </View>
    </KeyboardAvoidingViewWrapper>
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    height: responsiveHeight(100),
    width: responsiveWidth(100),
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'white',
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    height: responsiveHeight(75),
    width: responsiveWidth(100),
  },
  image: {
    position: 'absolute',
    height: responsiveHeight(75),
    width: responsiveWidth(100),
  },
  splashLogo: {
    height: responsiveHeight(15),
  },
  nameContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(-1),
  },
  button: {
    marginTop: responsiveHeight(2),
    width: responsiveWidth(85),
  },
  buttonText: {
    color: globalStyles.themeBlue,
  },
});
