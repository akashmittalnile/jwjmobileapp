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

interface ModalProps {
  modalHandler: () => void;
  text?: string;
  buttonText?: string;
}

const Modal: React.FC<ModalProps> = ({modalHandler, text, buttonText = ''}) => {
  return (
    <View style={styles.container}>
      <Wrapper containerStyle={styles.wrapper}>
        <Image
          source={require('../../assets/Icons/success.png')}
          resizeMode="contain"
          style={styles.img}
        />
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

export default Modal;

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
  wrapper:{
    borderRadius: responsiveWidth(2)
  },
  img: {
    height: responsiveHeight(15),
  },
  text: {
    fontSize: responsiveFontSize(2),
    color: globalStyles.textGray,
  },
  btnStyle: {
    width: '90%',
    marginTop: responsiveHeight(2.5),
    marginBottom: responsiveHeight(3),
  },
});
