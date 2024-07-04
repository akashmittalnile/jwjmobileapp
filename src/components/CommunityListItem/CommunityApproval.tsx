import {Text, Image, StyleSheet} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../Button/BorderBtn';
import {globalStyles} from '../../utils/constant';

interface CommunityApprovalProps {
  modalHandler: () => void;
  heading?: string;
  text?: string;
  buttonText?: string;
  disableButton?: boolean;
}

const CommunityApproval: React.FC<CommunityApprovalProps> = ({
  modalHandler,
  heading = 'New Community Requires Admin Approval',
  text = 'You Will Receive An Email Notification If This Community Is Been Accepted Or Rejected From The Admin Within 24 To 48 Hrs',
  buttonText = '',
  disableButton = false,
}) => {
  return (
    <Wrapper containerStyle={styles.wrapper}>
      <Image
        source={require('../../assets/Icons/communityModalIcon.png')}
        resizeMode="contain"
        style={styles.img}
      />
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.text}>{text}</Text>
      <BorderBtn
        buttonText={`${buttonText === '' ? 'Continue' : buttonText}`}
        onClick={modalHandler}
        containerStyle={{...styles.btnStyle, opacity: disableButton ? 0.1 : 1}}
        disable={disableButton}
      />
    </Wrapper>
  );
};

export default CommunityApproval;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: responsiveHeight(1.2),
    width: '100%',
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
    width: '90%',
    fontSize: responsiveFontSize(1.4),
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
