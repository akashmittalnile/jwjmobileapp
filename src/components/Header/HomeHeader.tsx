/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
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
import {globalStyles} from '../../utils/constant';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {useAppSelector} from '../../redux/Store';
import FastImage from 'react-native-fast-image';

interface HomeHeaderProps {
  containerStyle?: ViewStyle;
  isProfile?: boolean;
  isNotification?: boolean;
  dotsHandler?: () => void;
  profileHandler?: () => void;
  notificationHandler?: () => void;
}

const {StatusBarManager} = NativeModules;

const HomeHeader: React.FC<HomeHeaderProps> = ({
  containerStyle,
  isProfile = true,
  isNotification = true,
  dotsHandler,
  profileHandler,
  notificationHandler,
}) => {
  const navigation = useNavigation();
  const notificationCount = useAppSelector(
    state => state.TrackNumber.notificationCount,
  );
  const {name, profileImage} = useAppSelector(state => state.userDetails);
  const _notificationHandler = () => {
    if (notificationHandler) {
      notificationHandler();
    } else {
      navigation.navigate(ScreenNames.Notification);
    }
  };

  const drawerHandler = () => {
    if (dotsHandler) {
      dotsHandler();
    } else {
      navigation?.openDrawer();
    }
  };

  const profileHandler1 = () => {
    if (profileHandler) {
      profileHandler();
    } else {
      navigation.navigate(ScreenNames.Profile);
    }
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.subContainer}>
        <View style={styles.leftSide}>
          <View style={styles.dots}>
            <TouchableOpacity style={styles.touch} onPress={drawerHandler}>
              <Image
                source={require('../../assets/Icons/element-3.png')}
                style={styles.img}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          {isProfile && (
            <View style={[styles.profile, {justifyContent: 'center',}]}>
              <TouchableOpacity
                style={[
                  styles.touch,
                  {height: '90%', width: '150%', overflow: 'hidden'},
                ]}
                onPress={profileHandler1}>
                {profileImage ? (
                  <FastImage
                    style={{
                      width: responsiveHeight(5),
                      height: responsiveHeight(5),
                      borderRadius: responsiveHeight(5),
                      backgroundColor: '#add8e6'
                    }}
                    source={{
                      uri: profileImage,
                      priority: FastImage.priority.high,
                    }}
                    resizeMode={FastImage.resizeMode.cover}
                  />
                ) : (
                  // <Image
                  //   source={{uri: profileImage}}
                  //   style={styles.profileIcon}
                  //   resizeMode="cover"
                  // />
                  <Image
                    source={require('../../assets/Icons/user.png')}
                    style={styles.profileIcon}
                    resizeMode="cover"
                  />
                )}

                <View style={styles.textContainer}>
                  <Text style={{...styles.text}}>Hi </Text>
                  <Text style={[styles.text]}>{name?.split(' ')[0]}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
        {isNotification && (
          <View style={styles.rightSide}>
            <TouchableOpacity
              style={styles.touch}
              onPress={_notificationHandler}>
              {notificationCount > 0 && (
                <View style={styles.notificationDotContainer}></View>
              )}
              <Image
                source={require('../../assets/Icons/notification.png')}
                style={styles.img}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    // marginTop: responsiveHeight(3),
    flexDirection: 'row',
    width: responsiveWidth(100),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flexDirection: 'row',
    marginTop: StatusBarManager.HEIGHT,
    height: responsiveHeight(7),
  },
  profileIcon: {
    height: responsiveHeight(5),
    width: responsiveHeight(5),
    borderRadius: responsiveHeight(2.5),
  },
  leftSide: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '60%',
  },
  rightSide: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: responsiveWidth(3),
    height: '100%',
    width: responsiveWidth(37),
  },
  dots: {
    height: '100%',
    marginLeft: responsiveWidth(3),
  },
  profile: {
    height: '100%',
    marginHorizontal: responsiveWidth(2),
  },
  touch: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
  },
  notificationDotContainer: {
    position: 'absolute',
    top: '20%',
    right: 0,
    height: responsiveHeight(1.5),
    width: responsiveHeight(1.5),
    borderRadius: responsiveHeight(1.5),
    backgroundColor: 'white',
  },
  img: {
    height: '100%',
    width: responsiveWidth(6),
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: responsiveWidth(2),
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: responsiveFontSize(2.2),
    lineHeight: responsiveHeight(2.5),
    fontWeight: '600',
  },
});
