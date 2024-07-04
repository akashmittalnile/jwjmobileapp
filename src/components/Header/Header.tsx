/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ViewStyle,
  NativeModules,
} from 'react-native';
import React from 'react';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import FastImage from 'react-native-fast-image';
import backIcon from '../../assets/Icons/back.png';

interface HeaderProps {
  title?: string;
  backButton?: boolean;
  disableBackButton?: boolean;
  onClick?: () => void;
  containerStyle?: ViewStyle;
  notificationButton?: boolean;
  onClickNotification?: () => void;
}

const {StatusBarManager} = NativeModules;
const Header: React.FC<HeaderProps> = ({
  title = '',
  backButton = true,
  disableBackButton = false,
  onClick,
  containerStyle,
  notificationButton = false,
  onClickNotification,
}) => {
  const navigation = useNavigation();
  const backHandler = () => {
    if (onClick) {
      onClick();
      return;
    }
    navigation.goBack();
  };

  const notificationHandler = () => {
    if (onClickNotification) {
      onClickNotification();
      return;
    }
    navigation.navigate(ScreenNames.Notification);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {/* <View style={styles.backBtnContainer}> */}
      {backButton && (
        <TouchableOpacity style={styles.touch} onPress={backHandler} disabled={disableBackButton}>
          <FastImage
            source={{
              uri: Image.resolveAssetSource(backIcon).uri,
              priority: FastImage.priority.normal,
            }}
            style={styles.backBtn}
            resizeMode={FastImage.resizeMode.contain}
          />
        </TouchableOpacity>
      )}
      {/* </View> */}
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <Text style={styles.heading}>{title}</Text>
      </View>
      {notificationButton && (
        // <View style={styles.notificationContainer}>
        <TouchableOpacity
          style={[styles.notificationTouch]}
          onPress={notificationHandler}>
          <Image
            source={require('../../assets/Icons/notification.png')}
            style={{...styles.backBtn, height: '40%'}}
            resizeMode="contain"
          />
        </TouchableOpacity>
        // </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    position: 'relative',
    zIndex: 100,
    paddingTop: StatusBarManager.HEIGHT,
    // marginTop: responsiveHeight(3.5),
    // height: responsiveHeight(6),
    width: responsiveWidth(100),
  },
  backBtnContainer: {
    position: 'absolute',
    zIndex: 10000,
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
  touch: {
    position: 'absolute',
    bottom: 0,
    zIndex: 10000,
    height: responsiveHeight(5),
    width: responsiveWidth(10),
    left: responsiveWidth(5),
    justifyContent: 'flex-end',
  },
  backBtn: {
    height: '50%',
    width: '60%',
  },
  heading: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
    maxWidth: responsiveWidth(70),
  },
  notificationContainer: {
    position: 'absolute',
    zIndex: 1000,
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
  notificationTouch: {
    position: 'absolute',
    bottom: 0,
    zIndex: 1000,
    right: responsiveWidth(0),
    justifyContent: 'flex-end',
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
});
