/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import React from 'react';
import HomeHeader from '../../components/Header/HomeHeader';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import Wrapper from '../../components/Wrapper/Wrapper';
import IconTab from '../../components/Tab/IconTab';
import userPic from '../../assets/Icons/user.png';
import emailIcon from '../../assets/Icons/email.png';
import callIcon from '../../assets/Icons/call.png';
import happyIcon from '../../assets/Icons/happy.png';
import angryIcon from '../../assets/Icons/angry.png';
import sadIcon from '../../assets/Icons/sad.png';
import verySadIcon from '../../assets/Icons/very-sad.png';
import TextWithIcon from '../../components/CustomText/TextWithIcon';
import BorderBtn from '../../components/Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import ScreenNames from '../../utils/ScreenNames';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {authHandler} from '../../redux/Auth';
import Toast from 'react-native-toast-message';
import {followedCommunityHandler} from '../../redux/TrackNumbers';
import FastImage from 'react-native-fast-image';
import {USMobileNumberFormatHandler} from '../../utils/Method';
import MonthYearCalendar from '../../components/Calendar/MonthYearCalendar';

const Profile = () => {
  const navigation = useNavigation();
  const userDetails = useAppSelector(state => state.userDetails);
  const followedCommunity = useAppSelector(
    state => state.TrackNumber.followedCommunity,
  );
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload.Profile);
  // const moodData = useAppSelector(state => state.mood);
  const dispatch = useAppDispatch();
  const userPicPath = Image.resolveAssetSource(userPic).uri;
  const emailIconPath = Image.resolveAssetSource(emailIcon).uri;
  const callIconPath = Image.resolveAssetSource(callIcon).uri;
  const [logoutLoader, setLogoutLoader] = React.useState<boolean>(false);
  const [sharedRoutineCount, setShareddRoutineCount] = React.useState<
    number | undefined
  >();
  const [moodData, setMoodData] = React.useState<any[]>([]);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [showDateModal, setShowDateModal] = React.useState<boolean>(false);
  const [moodDate, setMoodDate] = React.useState<string>(
    `${new Date().getFullYear()}-${
      new Date().getMonth() + 1 < 10
        ? '0' + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1
    }`,
  );
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);

  React.useEffect(() => {
    getInitialData(moodDate);
  }, [reload]);

  const getInitialData = (_date: string) => {
    getMoodData(_date);
    getFollowedCommunityCount();
    getSharedroutineCount();
  };

  const getFollowedCommunityCount = async () => {
    try {
      const response = await GetApiWithToken(endPoint.followedCommunity, token);
      if (response?.data?.status) {
        dispatch(
          followedCommunityHandler({
            followedCommunity: response?.data?.data?.totalFollow,
          }),
        );
      }
    } catch (err: any) {
      console.log('err in profile', err?.message);
    }
  };

  const getSharedroutineCount = async () => {
    try {
      const response = await GetApiWithToken(endPoint.shareRoutineList, token);
      if (response?.data?.status) {
        setShareddRoutineCount(response?.data?.data?.data?.length);
      }
    } catch (err: any) {
      console.log('err in profile', err?.message);
    } finally {
      setshouldRefresh(false);
    }
  };

  const renderCategoryTab = ({
    item,
  }: {
    item: {uri: string; percentage: string; name: string};
  }) => (
    <IconTab
      imageUri={item.uri}
      text={item.name}
      percentage={item.percentage}
      style={{borderColor: 'white'}}
      imageStyle={{height: '40%'}}
    />
  );

  const goToEditDetailsScreen = () => {
    navigation.navigate(ScreenNames.EditProfile);
  };

  const logoutModalHandler = () => {
    setShowModal(true);
  };

  const logoutHandler = async () => {
    try {
      setLogoutLoader(true);
      const response = await GetApiWithToken(endPoint.logout, token);
      if (response?.data?.status) {
        await AsyncStorage.clear();
        dispatch(authHandler(''));
        setShowModal(false);
        // navigation.reset({
        //   index: 0,
        //   routes: [{name: ScreenNames.SignIn}],
        // });
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

  const findMoodIconUri = (name: string) => {
    if (name?.toLowerCase() === 'happy') {
      return Image.resolveAssetSource(happyIcon).uri;
    } else if (name?.toLowerCase() === 'anger') {
      return Image.resolveAssetSource(angryIcon).uri;
    } else if (name?.toLowerCase() === 'sad') {
      return Image.resolveAssetSource(sadIcon).uri;
    } else {
      return Image.resolveAssetSource(verySadIcon).uri;
    }
  };

  const getMoodData = async (date: string) => {
    try {
      const response = await GetApiWithToken(
        `${endPoint.profile}?date=${date}`,
        token,
      );
      if (response?.data?.status) {
        const arr = [];
        for (const property in response?.data?.data?.average_mood_data) {
          const name =
            [...property][0]?.toUpperCase() +
            property?.substring(1, property?.length);
          arr.push({
            name,
            percentage: response?.data?.data?.average_mood_data[property],
            uri: findMoodIconUri(property),
          });
        }
        setMoodData(arr);
      }
    } catch (err: any) {
      console.log('err in mood date in profile', err?.message);
    } finally {
    }
  };

  const moodDateFilterHandler = (value: string) => {
    setMoodDate(value);
    setShowDateModal(false);
    getMoodData(value);
  };

  const onRefresh = async () => {
    const _date = `${new Date().getFullYear()}-${
      new Date().getMonth() + 1 < 10
        ? '0' + (new Date().getMonth() + 1)
        : new Date().getMonth() + 1
    }`;
    setMoodDate(_date);
    setshouldRefresh(true);
    setShowDateModal(false);
    getInitialData(_date);
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      <View style={styles.subContainer}>
        <ScrollView
          contentContainerStyle={{paddingBottom: responsiveHeight(16)}}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={shouldRefresh} onRefresh={onRefresh} />
          }>
          {/* profile section */}
          <Wrapper containerStyle={styles.wrapper}>
            <View style={styles.profile}>
              <FastImage
                source={{
                  uri: userDetails?.profileImage
                    ? userDetails?.profileImage
                    : userPicPath,
                  priority: FastImage.priority.high,
                }}
                style={styles.image}
                resizeMode={FastImage.resizeMode.cover}
              />
            </View>
            <Text style={styles.userName}>{userDetails?.name}</Text>
            <TextWithIcon
              imageUri={emailIconPath}
              text={userDetails?.email}
              containerStyle={{justifyContent: 'center'}}
            />
            {userDetails?.countryCode && (
              <TextWithIcon
                imageUri={callIconPath}
                text={`${
                  userDetails?.countryCode
                } ${USMobileNumberFormatHandler(userDetails?.mobile)}`}
                containerStyle={{marginTop: responsiveHeight(0.3)}}
              />
            )}
            <View style={styles.buttonsContainer}>
              <BorderBtn
                buttonText="Edit Details"
                onClick={goToEditDetailsScreen}
                containerStyle={{
                  height: responsiveHeight(6),
                  width: '48%',
                  borderRadius: responsiveWidth(2),
                }}
              />
              <BorderBtn
                buttonText="Logout"
                onClick={logoutModalHandler}
                containerStyle={{
                  height: responsiveHeight(6),
                  width: '48%',
                  borderRadius: responsiveWidth(2),
                  backgroundColor: '#455A64',
                }}
              />
            </View>
          </Wrapper>

          {/* plan details */}
          <View style={styles.plan}>
            <Image
              source={require('../../assets/Icons/planBGMask.png')}
              resizeMode="stretch"
              style={{height: '120%'}}
            />
            <View style={styles.planDetails}>
              <View style={{flex: 2, paddingLeft: responsiveWidth(5)}}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(1.6),
                    fontWeight: '500',
                  }}>
                  {userDetails?.currentPlan?.price === '0'
                    ? 'Plan A'
                    : userDetails?.currentPlan?.name}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontSize: responsiveFontSize(2.8),
                    fontWeight: '500',
                  }}>
                  {userDetails?.currentPlan?.price === '0'
                    ? 'FREE'
                    : '$' +
                      userDetails?.currentPlan?.price +
                      '/' +
                      (userDetails?.currentPlan?.plan_timeperiod?.toLowerCase() ===
                      'monthly'
                        ? 'Month'
                        : 'Year')}
                </Text>
              </View>
              <View style={{flex: 1.5}}>
                <BorderBtn
                  buttonText="Change Plan"
                  onClick={() => {
                    navigation.navigate(ScreenNames.SubscriptionPlans);
                  }}
                  containerStyle={{
                    width: '80%',
                    height: responsiveHeight(6),
                    backgroundColor: 'white',
                  }}
                  buttonTextStyle={{color: globalStyles.themeBlue}}
                />
              </View>
            </View>
          </View>

          {/* mood section */}
          <View style={styles.categoriesTabs}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: responsiveHeight(1),
              }}>
              <Text style={styles.moodHeading}>Mood</Text>
              <View
                style={{
                  position: 'relative',
                  borderWidth: responsiveWidth(0.13),
                  borderRadius: responsiveWidth(2),
                  borderColor: globalStyles.veryLightGray,
                  backgroundColor: 'white',
                }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowDateModal(value => !value);
                  }}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    paddingHorizontal: responsiveWidth(3),
                    paddingVertical: responsiveHeight(1),
                  }}>
                  <Text
                    style={{
                      fontSize: responsiveFontSize(2),
                      fontWeight: '500',
                      letterSpacing: 0.8,
                      color: 'black',
                    }}>
                    {moodDate}
                  </Text>
                  <Image
                    source={require('../../assets/Icons/arrow-down.png')}
                    style={{
                      height: responsiveHeight(1.3),
                      width: responsiveHeight(1.3),
                      marginLeft: responsiveWidth(2),
                    }}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              {showDateModal && (
                <MonthYearCalendar
                value={moodDate}
                  onSelectMonth={moodDateFilterHandler}
                  onCancel={() => {
                    setShowDateModal(false);
                  }}
                />
              )}
            </View>
            {moodData?.length > 0 && (
              <FlatList
                data={moodData}
                renderItem={renderCategoryTab}
                keyExtractor={(_, index) => index.toString()}
                horizontal
                style={styles.flatlist}
                showsHorizontalScrollIndicator={false}
              />
            )}
          </View>

          {/* lower section */}
          <View style={styles.communityAndMessageBox}>
            <View style={styles.communityContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ScreenNames.FollowedCommunity);
                }}>
                <Image
                  source={require('../../assets/Icons/global-search.png')}
                  style={styles.img}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Followed Community</Text>
                <View>
                  <Text style={styles.number}>{followedCommunity}</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.communityContainer}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ScreenNames.SharedRoutine);
                }}>
                <Image
                  source={require('../../assets/Icons/share-routine-number.png')}
                  style={styles.img}
                  resizeMode="contain"
                />
                <Text style={styles.text}>Shared Routine</Text>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.number}>
                    {sharedRoutineCount ? sharedRoutineCount : 0}
                  </Text>
                  {/* <Text style={{ color: globalStyles.lightGray, textAlignVertical: 'center', marginLeft: responsiveWidth(1) }}>New</Text> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      {showModal && (
        <View style={styles.modalContainer}>
          <Wrapper
            containerStyle={{...styles.wrapper, width: responsiveWidth(90)}}>
            <Text style={styles.modalText}>Do you want to logout?</Text>
            <View style={styles.modalButtonContainer}>
              <BorderBtn
                loader={logoutLoader}
                loaderColor="red"
                buttonText="Logout"
                onClick={logoutHandler}
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
      )}
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  profile: {
    height: responsiveHeight(10),
    width: responsiveHeight(10),
    borderRadius: responsiveHeight(5),
    overflow: 'hidden',
  },
  image: {
    height: '100%',
    width: '100%',
  },
  userName: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    width: '65%',
  },
  plan: {
    position: 'relative',
    marginTop: responsiveHeight(2),
    height: responsiveHeight(13),
    backgroundColor: globalStyles.themeBlue,
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  planDetails: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  categoriesTabs: {
    marginVertical: responsiveHeight(2),
  },
  moodHeading: {
    marginBottom: responsiveHeight(0.5),
    fontSize: responsiveHeight(2),
    fontWeight: '400',
    color: 'black',
  },
  flatlist: {},
  communityAndMessageBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  communityContainer: {
    width: '48%',
    backgroundColor: 'white',
    elevation: 3,
    borderRadius: responsiveWidth(2),
    shadowColor: globalStyles.lightGray,
    paddingHorizontal: responsiveWidth(2),
  },
  img: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    width: responsiveWidth(10),
  },
  text: {
    marginTop: responsiveHeight(1),
    color: 'black',
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
  },
  number: {
    marginTop: responsiveHeight(0.5),
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(2.6),
    fontWeight: '500',
    paddingBottom: responsiveHeight(1),
    textAlignVertical: 'center',
  },
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
