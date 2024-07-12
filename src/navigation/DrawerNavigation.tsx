import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  NativeModules,
  Linking,
  Modal,
  Alert,
} from 'react-native';
import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../utils/ScreenNames';
import {globalStyles} from '../utils/constant';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Tab from '../components/Drawer/Tab';
import BottomTab from './BottomTab';
import {useAppDispatch, useAppSelector} from '../redux/Store';
import {userDetailsHandler} from '../redux/UserDetails';
import Wrapper from '../components/Wrapper/Wrapper';
import BorderBtn from '../components/Button/BorderBtn';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authHandler} from '../redux/Auth';
import {GetApiWithToken, endPoint} from '../services/Service';
import Toast from 'react-native-toast-message';

const {StatusBarManager} = NativeModules;
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const dispatch = useAppDispatch();
  const userDetails = useAppSelector(state => state.userDetails);
  const [logoutLoader, setLogoutLoader] = React.useState<boolean>(false);
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const unSeenMessage = useAppSelector(
    state => state.TrackNumber.unSeenMessage,
  );

  const logoutHandler = () => {
    setModalVisible(true);
  };

  const profileHandler = () => {
    navigation.navigate(ScreenNames.Profile);
  };

  const deepLinkHandler = async (url: string) => {
    try {
      if (url) {
        const supported = await Linking.canOpenURL(url);
        Linking.openURL(url);
        if (supported) {
          Linking.openURL(url);
        }
      }
    } catch (err: any) {
      console.log('err in deep link social icon', err?.message);
    }
  };
  const _logoutHandler = async () => {
    try {
      setLogoutLoader(true);
      const response = await GetApiWithToken(endPoint.logout, token);
      if (response?.data?.status) {
        await AsyncStorage.clear();
        setModalVisible(false);
        dispatch(authHandler(''));
        // dispatch(userDetailsHandler({showLogoutModal: false}));
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err edit profile', err.message);
    } finally {
      setLogoutLoader(false);
    }
  };

  return (
    <>
      <Drawer.Navigator
        initialRouteName={ScreenNames.BottomTab}
        screenOptions={() => ({
          headerShown: false,
          drawerStyle: {backgroundColor: globalStyles.themeBlue},
          drawerInactiveTintColor: 'white',
          drawerActiveTintColor: globalStyles.themeBlue,
          drawerActiveBackgroundColor: 'white',
        })}
        drawerContent={props => {
          return (
            <DrawerContentScrollView>
              <View style={styles.splashLogo}>
                <Image
                  source={require('../assets/Icons/splashLogo.png')}
                  resizeMode="contain"
                  style={{height: '100%', width: '100%'}}
                />
              </View>

              {/* profile tab */}
              <View style={styles.profile}>
                <TouchableOpacity
                  style={styles.profileTouch}
                  onPress={profileHandler}>
                  <View style={styles.profileImage}>
                    <Image
                      source={
                        userDetails?.profileImage
                          ? {uri: userDetails?.profileImage}
                          : require('../assets/Icons/user.png')
                      }
                      resizeMode="cover"
                      style={{
                        height: responsiveHeight(4),
                        width: responsiveHeight(4),
                        borderRadius: responsiveHeight(2),
                      }}
                    />
                  </View>
                  <View style={styles.name}>
                    <Text style={styles.text}>{userDetails?.name}</Text>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: responsiveFontSize(1.5),
                        fontWeight: '400',
                      }}>
                      View Profile
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* rest tabs */}
              {/* <DrawerItemList {...props} /> */}

              <Tab
                name="Home"
                imageUri={require('../assets/Icons/home-white.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  navigation.navigate(ScreenNames.Home);
                }}
                selected={false}
              />

              <Tab
                name="Journals"
                imageUri={require('../assets/Icons/menu-board.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.Journals);
                }}
                selected={false}
              />

              <Tab
                name="Communities"
                imageUri={require('../assets/Icons/community-white.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.Community);
                }}
                selected={false}
              />

              <Tab
                name="Routines"
                imageUri={require('../assets/Icons/routine-white.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.Routine);
                }}
                selected={false}
              />

              <Tab
                name="Contact Us"
                imageUri={require('../assets/Icons/sms-white.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.Contact);
                }}
                selected={false}
              />

              <Tab
                name={`Messages ${
                  unSeenMessage ? `(${unSeenMessage} New)` : ''
                }`}
                // name={`Messages`}
                imageUri={require('../assets/Icons/message-2.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.Chat);
                }}
                selected={false}
              />

              {!userDetails.ratingSubmit && (
                <Tab
                  name="Rate Us"
                  imageUri={require('../assets/Icons/star-white.png')}
                  onPress={() => {
                    props.navigation.closeDrawer();
                    dispatch(userDetailsHandler({showReviewModal: true}));
                  }}
                  selected={false}
                />
              )}

              {/* <Tab
              name="Rating & Reviews"
              imageUri={require('../assets/Icons/message-favorite.png')}
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate(ScreenNames.Review);
              }}
              selected={false}
            /> */}
              <Tab
                name="Terms & Conditions"
                imageUri={require('../assets/Icons/stickynote.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.TermAndCondition);
                }}
                selected={false}
              />
              <Tab
                name="Privacy Policy"
                imageUri={require('../assets/Icons/stickynote1.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  props.navigation.navigate(ScreenNames.TermAndCondition, {
                    privacy: true,
                  });
                }}
                selected={false}
              />
              <Tab
                name="Logout"
                imageUri={require('../assets/Icons/logout-white.png')}
                onPress={() => {
                  props.navigation.closeDrawer();
                  logoutHandler();
                }}
                selected={false}
              />

              {/* socila media */}
              <View style={styles.socialMediaContainer}>
                <Text style={{...styles.text, fontWeight: '400'}}>
                  Follow Us!
                </Text>
                <View style={styles.imageContainer}>
                  <TouchableOpacity
                    style={styles.touch}
                    onPress={() => {
                      deepLinkHandler(
                        'https://www.facebook.com/profile.php?id=61559025368524&mibextid=JRoKGi',
                      );
                    }}>
                    <Image
                      resizeMode="contain"
                      source={require('../assets/Icons/facebook.png')}
                      style={{
                        height: responsiveHeight(2.5),
                        width: responsiveHeight(2.5),
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.touch}
                    onPress={() => {
                      deepLinkHandler('https://www.youtube.com');
                    }}>
                    <Image
                      resizeMode="contain"
                      source={require('../assets/Icons/youtube.png')}
                      style={{
                        height: responsiveHeight(2.5),
                        width: responsiveHeight(2.5),
                      }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.touch}
                    onPress={() => {
                      deepLinkHandler(
                        'https://www.instagram.com/journeywithjournals/',
                      );
                    }}>
                    <Image
                      resizeMode="contain"
                      source={require('../assets/Icons/instagram.png')}
                      style={{
                        height: responsiveHeight(2.5),
                        width: responsiveHeight(2.5),
                      }}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* app version text */}
              <Text style={styles.appVersionText}>App Version: V1.0.0.12</Text>
            </DrawerContentScrollView>
          );
        }}>
        <Drawer.Screen
          name={ScreenNames.BottomTab}
          component={BottomTab}
          options={() => ({
            drawerLabel: 'Home',
            drawerIcon: ({focused}) =>
              focused ? (
                <Image
                  source={require('../assets/Icons/home-2.png')}
                  resizeMode="contain"
                  style={styles.drawerIcon}
                />
              ) : (
                <Image
                  source={require('../assets/Icons/home-white.png')}
                  resizeMode="contain"
                  style={styles.drawerIcon}
                />
              ),
            drawerLabelStyle: {marginLeft: responsiveWidth(-5)},
          })}
        />
      </Drawer.Navigator>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <Wrapper
            containerStyle={{...styles.wrapper, width: responsiveWidth(90)}}>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <View style={styles.modalButtonContainer}>
              <BorderBtn
                loader={logoutLoader}
                loaderColor="red"
                buttonText="Logout"
                onClick={_logoutHandler}
                containerStyle={{
                  ...styles.modalButtonStyle,
                  borderColor: 'red',
                }}
                buttonTextStyle={{color: 'red'}}
              />
              <BorderBtn
                buttonText="Cancel"
                onClick={() => {
                  setModalVisible(false);
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

export default DrawerNavigation;

const styles = StyleSheet.create({
  splashLogo: {
    marginTop: -StatusBarManager.HEIGHT + responsiveHeight(-1),
    paddingTop: StatusBarManager.HEIGHT + responsiveHeight(1),
    paddingBottom: responsiveHeight(1),
    height: responsiveHeight(20),
    width: '100%',
    backgroundColor: 'white',
  },
  drawerIcon: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
  profile: {
    marginTop: responsiveHeight(3),
    marginBottom: responsiveHeight(3),
  },
  profileTouch: {
    flexDirection: 'row',
    paddingLeft: responsiveWidth(4),
  },
  profileImage: {
    height: responsiveHeight(4),
    width: responsiveHeight(4),
    borderRadius: responsiveHeight(2),
  },
  name: {
    justifyContent: 'space-between',
    marginLeft: responsiveWidth(2),
  },
  logoutTouch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    alignSelf: 'center',
    paddingVertical: '2%',
    paddingLeft: '7%',
    width: '90%',
    borderRadius: responsiveWidth(1),
    borderWidth: 1,
  },
  text: {
    color: 'white',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  socialMediaContainer: {
    marginTop: responsiveHeight(4),
    paddingTop: responsiveHeight(1.8),
    paddingLeft: responsiveWidth(5),
    backgroundColor: '#22A6FF',
  },
  imageContainer: {
    flexDirection: 'row',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(3),
  },
  appVersionText: {
    marginTop: responsiveHeight(2),
    marginLeft: responsiveWidth(5),
    color: 'white',
    fontSize: responsiveFontSize(1.5),
    fontWeight: '500',
    opacity: 0.8,
  },
  touch: {
    marginRight: responsiveWidth(3),
    height: responsiveHeight(2.5),
    width: responsiveHeight(2.5),
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    width: '100%',
    borderRadius: responsiveWidth(2),
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
  },
});
