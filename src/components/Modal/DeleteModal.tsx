import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import Wrapper from '../Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../Button/BorderBtn';

interface DeleteModalProps {
  title?: string;
  loader?: boolean;
  cancelButtonHandler: () => void;
  confirmButtonHandler: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  title,
  loader,
  cancelButtonHandler,
  confirmButtonHandler,
}) => {
  const confirmButton = () => {
    if (confirmButtonHandler) {
      confirmButtonHandler();
    }
  };

  const cancelButton = () => {
    if (cancelButtonHandler) {
      cancelButtonHandler();
    }
  };

  return (
    <View style={styles.container}>
      <Wrapper containerStyle={styles.wrapper}>
        <Text style={styles.text} >
          {title ? title : 'Are you sure you want to delete this community?'}
        </Text>
        <View style={styles.insideWrapper}>
          <BorderBtn
            buttonText="Cancel"
            onClick={cancelButton}
            containerStyle={styles.cancelButton}
            buttonTextStyle={{color: globalStyles.themeBlue}}
          />
          <BorderBtn
            loader={loader}
            buttonText="Yes"
            onClick={confirmButton}
            containerStyle={styles.confirmButton}
          />
        </View>
      </Wrapper>
    </View>
  );
};

export default DeleteModal;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  wrapper: {
    paddingTop: responsiveHeight(2),
    paddingVertical: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
  },
  text: {
    fontSize: responsiveFontSize(2),
    width: '90%',
    color: 'black'
  },
  insideWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: responsiveHeight(2),
    width: '80%',
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
  },
  cancelButton: {
    width: '40%',
    backgroundColor: 'white',
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.themeBlue,
  },
  confirmButton: {
    width: '40%',
    backgroundColor: 'red',
  },
});
