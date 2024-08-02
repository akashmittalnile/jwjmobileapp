import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React from 'react';
import SvgUri from 'react-native-svg-uri';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {globalStyles} from '../../utils/constant';
import defaultImage from '../../assets/Icons/meditation.png';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import Wrapper from '../Wrapper/Wrapper';
import BorderBtn from '../Button/BorderBtn';
import {endPoint, PostApiWithToken} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';

interface RoutineHomeTabProps {
  data: any;
}

const RoutineHomeTab: React.FC<RoutineHomeTabProps> = ({data}) => {
  const token = useAppSelector(state => state.auth.token);
  const navigation = useNavigation();
  const [routineCompleted, setRoutineCompleted] =
    React.useState<boolean>(false);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [loader, setLoader] = React.useState<boolean>(false);

  React.useEffect(() => {
    setRoutineCompleted(
      data?.status?.toLowerCase() === 'pending' ? false : true,
    );
  }, [data]);

  const goToRoutineDetailsScreenHandler = () => {
    navigation.navigate(ScreenNames.RoutineDetailsWithTask, {
      id: data?.routineid,
    });
  };

  const statusHandler = (status: string) => {
    if (status === 'closed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26'}}>Closed</Text>
        </View>
      );
    } else if (status === 'completed') {
      return (
        <View style={styles.status}>
          <Image
            source={require('../../assets/Icons/tick-green.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#82AD26', width: 'auto'}}>Completed</Text>
        </View>
      );
    } else if (status === 'progress') {
      return (
        <View style={{...styles.status, borderColor: globalStyles.themeBlue}}>
          <Image
            source={require('../../assets/Icons/progress.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: globalStyles.themeBlue}}>In-progress</Text>
        </View>
      );
    } else if (status === 'pending') {
      return (
        <View style={{...styles.status, borderColor: '#FFA412'}}>
          <Image
            source={require('../../assets/Icons/timer.png')}
            resizeMode="contain"
            style={styles.icon}
          />
          <Text style={{color: '#FFA412'}}>Pending</Text>
        </View>
      );
    } else {
      return (
        <View style={{...styles.status, borderColor: globalStyles.midGray}}>
          <Text style={{color: 'black', paddingLeft: responsiveWidth(2)}}>
            {status}
          </Text>
        </View>
      );
    }
  };

  const showModalHandler = () => {
    setShowModal(true);
  };

  const routineCompleteHandler = async () => {
    setLoader(true);
    try {
      const response = await PostApiWithToken(
        endPoint.routineComplete,
        {id: data?.routineid, time: data?.time},
        token,
      );
      console.log(response?.data)
      if (response?.data?.status) {
        setRoutineCompleted(value => !value);
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in marking routine completed', err?.message);
    } finally {
      setLoader(false);
      setShowModal(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={goToRoutineDetailsScreenHandler}>
          {/* <View style={{flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: responsiveHeight(1)}}>
          <Text style={{marginLeft: responsiveWidth(3),color: 'black'}}>Status: </Text>
          {statusHandler(data?.status?.toLowerCase())}
        </View> */}
          <View style={styles.touch}>
            <View style={{flex: 1}}>
              <SvgUri
                source={{
                  uri: data
                    ? data?.category_logo
                    : Image.resolveAssetSource(defaultImage)?.uri,
                }}
                height={responsiveHeight(7)}
                width={responsiveHeight(7)}
              />
            </View>
            <View style={{flex: 3}}>
              <Text
                style={{
                  ...styles.text,
                  fontSize: responsiveFontSize(2),
                  color: globalStyles.themeBlue,
                  width: '90%',
                }}>{`${data?.routinename}`}</Text>
              <Text style={styles.text}>{`${data?.description} ${
                data?.time ? '@' + data?.time : ''
              }`}</Text>
            </View>
          </View>
        </TouchableOpacity>
        {!routineCompleted && (
          <TouchableOpacity
            onPress={showModalHandler}
            style={styles.circle}></TouchableOpacity>
        )}
        {routineCompleted && (
          <TouchableOpacity
            onPress={showModalHandler}
            style={{
              ...styles.circle,
              borderWidth: 0,
            }}>
            <Image
              source={require('../../assets/Icons/tick-green.png')}
              resizeMode="cover"
              style={styles.circleIcon}
            />
          </TouchableOpacity>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <Wrapper
            containerStyle={{...styles.wrapper, width: responsiveWidth(90)}}>
            <Text style={styles.modalText}>
              {`Are you sure you want to ${
                !routineCompleted ? 'mark this Routine complete ?' : 'mark this Routine incomplete ?'
              } `}
            </Text>
            <View style={styles.modalButtonContainer}>
              <BorderBtn
                loader={loader}
                loaderColor="red"
                buttonText="Yes"
                onClick={routineCompleteHandler}
                containerStyle={{
                  ...styles.modalButtonStyle,
                  borderColor: 'red',
                }}
                buttonTextStyle={{color: 'red'}}
              />
              <BorderBtn
                buttonText="Cancel"
                onClick={() => {
                  setShowModal(false);
                }}
                containerStyle={{
                  ...styles.modalButtonStyle,
                  borderColor: globalStyles.themeBlue,
                }}
                buttonTextStyle={{color: globalStyles.themeBlue}}
              />
            </View>
          </Wrapper>
        </View>
      </Modal>
    </>
  );
};

export default React.memo(RoutineHomeTab);

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
    marginVertical: responsiveHeight(1),
    width: '95%',
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(2),
    borderColor: globalStyles.veryLightGray,
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  text: {
    color: 'black',
    letterSpacing: 0.8,
    fontSize: responsiveFontSize(1.7),
    fontWeight: '400',
  },
  status: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: responsiveHeight(0.3),
    paddingRight: responsiveWidth(2.5),
    borderWidth: responsiveWidth(0.2),
    borderRadius: responsiveWidth(1),
    borderColor: '#82AD26',
  },
  icon: {
    height: responsiveHeight(1.7),
    width: responsiveWidth(8),
  },
  circle: {
    position: 'absolute',
    top: responsiveHeight(1),
    right: responsiveHeight(1),
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
    borderRadius: responsiveHeight(2),
    borderWidth: responsiveWidth(0.35),
    borderColor: globalStyles.themeBlue,
  },
  circleIcon: {
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  close: {
    position: 'absolute',
    top: responsiveHeight(5),
    left: responsiveWidth(2),
    zIndex: 10000,
    height: responsiveHeight(5),
    width: responsiveHeight(5),
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
  },
  modalButtonStyle: {
    width: responsiveWidth(35),
    backgroundColor: 'white',
    borderWidth: responsiveWidth(0.23),
  },
  modalText: {
    marginBottom: responsiveHeight(2),
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    letterSpacing: 0.5,
    width: '80%',
    textAlign: 'center',
  },
});
