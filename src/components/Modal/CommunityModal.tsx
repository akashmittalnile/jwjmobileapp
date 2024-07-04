/* eslint-disable prettier/prettier */
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import Wrapper from '../Wrapper/Wrapper';
import BorderBtn from '../Button/BorderBtn';
import {globalStyles} from '../../utils/constant';

interface CommunityModalProps {
  modalHandler: () => void;
  heading: string;
  text?: string;
  buttonText?: string;
  iconUri?: string;
}

const CommunityModal: React.FC<CommunityModalProps> = ({
  modalHandler,
  heading,
  text,
  buttonText = '',
  iconUri,
}) => {
  return (
    <View style={styles.container}>
      <Wrapper containerStyle={styles.wrapper}>
        <Image
          source={
            iconUri
              ? {uri: iconUri}
              : require('../../assets/Icons/communityModalIcon.png')
          }
          resizeMode="contain"
          style={styles.img}
        />
        <Text style={styles.heading}>{heading}</Text>
        <Text style={styles.text}>{text}</Text>
        <BorderBtn
          buttonText={`${buttonText === '' ? 'Continue' : buttonText}`}
          onClick={modalHandler}
          containerStyle={styles.btnStyle}
        />
      </Wrapper>
    </View>
  );
};

export default CommunityModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: responsiveWidth(100),
    backgroundColor: 'rgba(0,0,0,.5)',
  },
  wrapper: {
    borderRadius: responsiveWidth(2),
  },
  img: {
    height: responsiveHeight(15),
  },
  heading: {
    marginTop: responsiveHeight(0.5),
    textAlign: 'center',
    fontSize: responsiveFontSize(1.5),
    color: 'black',
  },
  text: {
    marginTop: responsiveHeight(1),
    width: responsiveWidth(80),
    fontSize: responsiveFontSize(1.5),
    textAlign: 'center',
    letterSpacing: 1,
    color: globalStyles.textGray,
  },
  btnStyle: {
    width: '90%',
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(3),
  },
});
