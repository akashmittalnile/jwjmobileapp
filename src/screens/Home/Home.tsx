/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  Modal,
} from 'react-native';
import React from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import HomeHeader from '../../components/Header/HomeHeader';
import Wrapper from '../../components/Wrapper/Wrapper';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import Emoji from '../../components/Emoji/Emoji';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../../components/Button/BorderBtn';
import ScreenNames from '../../utils/ScreenNames';
import {
  GetApiWithToken,
  PostApiWithToken,
  endPoint,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {userDetailsHandler} from '../../redux/UserDetails';
import Toast from 'react-native-toast-message';
import {moodDataHandler} from '../../redux/MoodData';
import ToadyCommunity from '../../components/Home/ToadyCommunity';
import Journal from '../../components/Home/Journal';
import MoodCalendar from '../../components/Calendar/MoodCalendar';
import {reloadHandler} from '../../redux/ReloadScreen';
import {RefreshControl} from 'react-native';
import RoutineHomeTab from '../../components/Routine/RoutineHomeTab';
import {SplashScreenSliceHandler} from '../../redux/SplashScreenHandler';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import {notificationCounter, numberHandler} from '../../redux/TrackNumbers';
import TodayMood from '../../components/Modal/TodayMood';
import {err} from 'react-native-svg';



interface HomeData {
  mood: [{id: string; name: string; logo: string}];
  user:
    | {
        id: string;
        name: string;
        email: string;
        country_code: string;
        mobile: string;
        profile_image: string;
      }
    | undefined;
  community: {}[] | undefined;
  my_journal: {}[] | undefined;
  mood_calender: {}[] | undefined;
  my_routine: {}[] | undefined;
}

const Home = () => {
  const focused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const reloadMoodCalendar = useAppSelector(state => state.reload.MoodCalendar);
  const reloadHome = useAppSelector(state => state.reload.Home);
  const reloadProfile = useAppSelector(state => state.reload.Profile);
  const token = useAppSelector(state => state.auth.token);
  const _userDetails = useAppSelector(state => state.userDetails);
  const splashSliceHandler = useAppSelector(state => state.splash.isValid);
  const moodData = useAppSelector(state => state.mood);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [homeData, setHomeData] = React.useState<HomeData | undefined>(
    undefined,
  );
  const [todayMood, setTodayMood] = React.useState<boolean>(true);
  const [moodLoader, setMoodLoader] = React.useState<boolean>(false);
  const [_date, _setDate] = React.useState<string>('');
  React.useEffect(() => {
    if (focused) {
      _userDetails.showReviewModal &&
        dispatch(userDetailsHandler({showReviewModal: false}));
    }
  }, [focused]);

  React.useEffect(() => {
    getHomeData();
    getNotificationCount();
    getUserDetails();
    getUnseenMessage();
    splashSliceHandler && dispatch(SplashScreenSliceHandler(false));
  }, [reloadHome]);

  React.useEffect(() => {
    getTodayMoodData();
  }, []);

  const onRefresh = async () => {
    setshouldRefresh(true);
    getHomeData();
    getTodayMoodData();
    getNotificationCount();
    getUserDetails();
  };

  const getHomeData = async () => {
    try {
      const response = await GetApiWithToken(endPoint.home, token);
      if (response?.data?.status) {
        setHomeData(response?.data?.data[0]);
        dispatch(
          userDetailsHandler({
            currentPlan: response?.data?.data[0]?.current_plan,
            ratingSubmit: response?.data?.data[0]?.rating_submit,
          }),
        );
        // response?.data?.data[0]?.average_mood;
        const temp = response?.data?.data[0]?.mood?.map((item: any) => {
          return {
            ...item,
            percentage:
              response?.data?.data[0]?.average_mood[item?.name.toLowerCase()],
          };
        });
        dispatch(moodDataHandler(temp));
      }
    } catch (err: any) {
      console.log('err homeData', err.message);
    } finally {
      setshouldRefresh(false);
    }
  };

  const getTodayMoodData = async () => {
    try {
      const response = await GetApiWithToken(endPoint.home, token);
      if (response?.data?.status) {
        getTodayMoodHandler(response?.data?.data[0]);
      }
    } catch (error: any) {
      console.error('error in getting home screen mood data', error?.message);
    }
  };

  const getNotificationCount = async () => {
    try {
      const response = await GetApiWithToken(endPoint.notificationCount, token);
      if (response?.data?.status) {
        dispatch(
          notificationCounter({notificationCount: response?.data?.data}),
        );
      }
    } catch (err: any) {
      console.log('err in getting notification count home', err?.message);
    }
  };

  const getUserDetails = async () => {
    try {
      const userDetails = await GetApiWithToken(endPoint.profile, token);
      if (userDetails?.data?.status) {
        const {
          id,
          name,
          email,
          country_code,
          mobile,
          profile_image,
          user_name,
          country_flag,
          admin,
        } = userDetails?.data?.data;
        dispatch(
          userDetailsHandler({
            id: id,
            name: name,
            email: email,
            countryCode: country_code,
            mobile: mobile,
            profileImage: profile_image,
            userName: user_name,
            cca2: country_flag,
            adminProfileImage: admin?.profile,
          }),
        );
      }
    } catch (err: any) {
      console.log('err in userDetails home', err.message);
    }
  };

  const getUnseenMessage = async () => {
    try {
      const response = await GetApiWithToken(
        endPoint.unseenMessageCount,
        token,
      );
      if (response?.data?.status) {
        dispatch(numberHandler({unSeenMessage: response?.data?.data}));
      }
    } catch (err: any) {
      console.log('err in unseen message api home screen', err?.message);
    }
  };

  const getTodayMoodHandler = (data: any) => {
    const date = new Date().getDate();
    if (data?.mood_calender) {
      const moodCalender: any = data?.mood_calender;
      const targetDate = moodCalender[moodCalender?.length - 1]?.date;
      if (date == targetDate) {
        setTodayMood(true);
      } else {
        setTodayMood(false);
      }
    }
  };

  const reviewHandler = () => {
    dispatch(userDetailsHandler({showReviewModal: true}));
  };

  const todayMoodHandler = async (mood_id: string) => {
    setMoodLoader(true);
    // dispatch(userDetailsHandler({homeScreenLoader: true}));
    try {
      const response = await PostApiWithToken(
        endPoint.moodCapture,
        {mood_id},
        token,
      );
      if (response?.data?.status) {
        setTodayMood(true);
        getHomeData();
        dispatch(
          reloadHandler({
            MoodCalendar: !reloadMoodCalendar,
            Profile: !reloadProfile,
          }),
        );
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in mood updating home', err.message);
    } finally {
      setMoodLoader(false);
      // dispatch(userDetailsHandler({homeScreenLoader: false}));
    }
  };

  const dateHandler = (date: string) => {
    date && _setDate(date);
  };

  const goToRoutineBottomTabHandler = () => {
    navigation.navigate(ScreenNames.Routine);
  };

  const onFocusSearchBarHandler = () => {
    Keyboard.dismiss();
    navigation.navigate(ScreenNames.Search);
  };

  return (
    <>
      <View style={styles.container}>
        <HomeHeader />
        <View style={{flexDirection: 'row'}}>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={shouldRefresh}
                onRefresh={onRefresh}
              />
            }
            // bounces={false}
            style={styles.scrollView}
            contentContainerStyle={{paddingBottom: responsiveHeight(25)}}
            showsVerticalScrollIndicator={false}>
            <View style={styles.subContainer}>
              <View
                style={{
                  ...styles.textInputContainer,
                  // width: todayMood ? responsiveWidth(95) : responsiveWidth(77),
                  width: responsiveWidth(95),
                }}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search"
                  placeholderTextColor="gray"
                  onFocus={onFocusSearchBarHandler}
                />
                <Image
                  source={require('../../assets/Icons/search-blue.png')}
                  style={styles.searchIcon}
                  resizeMode="contain"
                />
              </View>
              {/* <SearchBar
                containerStyle={{
                  width: todayMood ? responsiveWidth(95) : responsiveWidth(77),
                }}
                onSearch={onSearch}
              /> */}

              {homeData ? (
                <>
                  {/* Daily Journal */}

                  {Array.isArray(homeData?.my_journal) && (
                    <Journal
                      data={homeData?.my_journal}
                      style={{
                        // width: todayMood
                        //   ? responsiveWidth(95)
                        //   : responsiveWidth(77),
                        width: responsiveWidth(95),
                      }}
                    />
                  )}

                  {/* Today Entries */}
                  {Array.isArray(homeData?.community) && (
                    <ToadyCommunity
                      data={homeData?.community?.filter(
                        (item: any) =>
                          item?.follow || (item?.my_community && item),
                      )}
                      style={{
                        // width: todayMood
                        //   ? responsiveWidth(95)
                        //   : responsiveWidth(77),
                        width: responsiveWidth(95),
                      }}
                    />
                  )}

                  {/* Routines*/}
                  {Array.isArray(homeData?.my_routine) && (
                    <Wrapper
                      containerStyle={{
                        ...styles.wrapper,
                        paddingTop: responsiveHeight(1),
                        paddingBottom: responsiveHeight(1),
                        // width: todayMood
                        //   ? responsiveWidth(95)
                        //   : responsiveWidth(77),
                        width: responsiveWidth(95),
                      }}>
                      <View style={styles.header}>
                        <View>
                          <Text style={styles.headerText}>Today Routines</Text>
                        </View>
                        <View>
                          {Array.isArray(homeData?.my_routine) &&
                            homeData?.my_routine?.length > 0 && (
                              <TouchableOpacity
                                onPress={goToRoutineBottomTabHandler}>
                                <Text style={styles.headerButton}>See All</Text>
                              </TouchableOpacity>
                            )}
                        </View>
                      </View>
                      <View
                        style={{
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                        }}>
                        {Array.isArray(homeData?.my_routine) &&
                        homeData?.my_routine?.length > 0 ? (
                          <>
                            {homeData?.my_routine?.length > 0 && (
                              <RoutineHomeTab
                                data={homeData?.my_routine[0] || {}}
                              />
                            )}
                            {homeData?.my_routine?.length > 1 && (
                              <RoutineHomeTab
                                data={homeData?.my_routine[1] || {}}
                              />
                            )}
                            {homeData?.my_routine?.length > 2 && (
                              <RoutineHomeTab
                                data={homeData?.my_routine[2] || {}}
                              />
                            )}
                          </>
                        ) : (
                          <>
                            <Image
                              source={require('../../assets/Icons/no-data-found.png')}
                              style={{
                                ...styles.noData,
                                // width: todayMood
                                //   ? responsiveWidth(95)
                                //   : responsiveWidth(77),
                                width: responsiveWidth(95),
                              }}
                              resizeMode="contain"
                            />
                            <Text
                              style={{
                                ...styles.TodayEntriesText,
                                fontWeight: 'bold',
                              }}>
                              No Routines Found
                            </Text>
                          </>
                        )}
                      </View>
                    </Wrapper>
                  )}

                  {/* Today Journals */}
                  {/* {Array.isArray(homeData?.my_journal) && (
                <TodayJournals
                  data={homeData?.my_journal}
                  style={{
                    width: todayMood
                      ? responsiveWidth(95)
                      : responsiveWidth(77),
                  }}
                />
              )} */}
                </>
              ) : (
                <SkeletonContainer />
              )}

              {/* Calendar */}
              <Wrapper
                containerStyle={{
                  ...styles.wrapper,
                  // width: todayMood ? responsiveWidth(95) : responsiveWidth(77),
                  width: responsiveWidth(95),
                }}>
                <MoodCalendar dateHandler={dateHandler} value={_date} />
              </Wrapper>

              {/* Rating */}
              {!_userDetails.ratingSubmit && (
                <Wrapper
                  containerStyle={{
                    ...styles.wrapper,
                    flexDirection: 'row',
                    alignItems: 'center',
                    // width: todayMood
                    //   ? responsiveWidth(95)
                    //   : responsiveWidth(77),
                    width: responsiveWidth(95),
                  }}>
                  <View style={{flex: 3, paddingLeft: responsiveWidth(5)}}>
                    <Text
                      style={{
                        color: 'black',
                        fontSize: responsiveFontSize(2.5),
                      }}>
                      Rate Us
                    </Text>
                    <Text
                      style={{
                        color: globalStyles.textGray,
                        fontSize: responsiveFontSize(1.6),
                      }}>
                      Your Valuable Feedback!!
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: responsiveHeight(1),
                      }}>
                      <Image
                        source={require('../../assets/Icons/disable-star.png')}
                        resizeMode="contain"
                        style={styles.starIcon}
                      />
                      <Image
                        source={require('../../assets/Icons/disable-star.png')}
                        resizeMode="contain"
                        style={styles.starIcon}
                      />
                      <Image
                        source={require('../../assets/Icons/disable-star.png')}
                        resizeMode="contain"
                        style={styles.starIcon}
                      />
                      <Image
                        source={require('../../assets/Icons/disable-star.png')}
                        resizeMode="contain"
                        style={styles.starIcon}
                      />
                      <Image
                        source={require('../../assets/Icons/disable-star.png')}
                        resizeMode="contain"
                        style={styles.starIcon}
                      />
                    </View>
                    <BorderBtn
                      onClick={reviewHandler}
                      buttonText="Submit Rating"
                      containerStyle={{
                        marginTop: responsiveHeight(1.2),
                        marginBottom: responsiveHeight(3),
                      }}
                      buttonTextStyle={{
                        fontSize: responsiveFontSize(1.6),
                        fontWeight: '600',
                        paddingHorizontal: responsiveWidth(5),
                      }}
                    />
                  </View>
                  <View style={{flex: 2, justifyContent: 'center'}}>
                    <Image
                      source={require('../../assets/Icons/review.png')}
                      resizeMode="contain"
                      style={{
                        height: responsiveHeight(18),
                        width: responsiveWidth(25),
                      }}
                    />
                  </View>
                </Wrapper>
              )}
            </View>
          </ScrollView>

          {/* Emoji */}
          {/* {!todayMood && (
            <View style={styles.moodContainer}>
              <View style={styles.moodTextContainer}>
                {[...text].map((item, index) => (
                  <Text key={index} style={styles.textMood}>
                    {item}
                  </Text>
                ))}
              </View>
              <View style={styles.emojiContainer}>
                {moodData?.map((item, index) => (
                  <Emoji
                    key={item?.id}
                    text={item.name}
                    imageUri={item.logo}
                    style={{marginTop: responsiveHeight(2)}}
                    onPress={() => {
                      todayMoodHandler(item?.id);
                    }}
                  />
                ))}
              </View>
            </View>
          )} */}
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={!todayMood}>
        <TodayMood
          loader={moodLoader}
          onPress={todayMoodHandler}
          disableModal={() => {
            setTodayMood(true);
          }}
        />
      </Modal>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    width: responsiveWidth(75),
    marginLeft: responsiveWidth(2.5),
  },
  subContainer: {
    flex: 1,
    width: '100%',
  },
  textInputContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
    overflow: 'hidden',
  },
  searchInput: {
    flex: 5,
    height: responsiveHeight(6),
    fontSize: responsiveFontSize(2),
    paddingHorizontal: responsiveWidth(2),
  },
  searchIcon: {
    flex: 1,
    height: responsiveHeight(2.5),
    width: responsiveWidth(5),
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    borderRadius: responsiveWidth(2),
  },
  markCompletedContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '100%',
  },
  markCompletedContainerText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: responsiveHeight(1.5),
    marginBottom: responsiveHeight(1.5),
    width: responsiveWidth(77),
  },
  moodContainer: {
    width: responsiveWidth(18),
    backgroundColor: 'white',
  },
  moodTextContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: responsiveHeight(7),
    transform: [{rotate: '90deg'}],
  },
  textMood: {
    width: 'auto',
    fontSize: responsiveHeight(2),
    color: 'black',
    overflow: 'hidden',
  },
  emojiContainer: {
    marginTop: responsiveHeight(22),
  },
  TodayEntriesContainer: {
    // marginBottom: responsiveHeight(3)
  },
  TodayEntriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(4),
    width: '100%',
  },
  TodayEntriesText: {
    color: globalStyles.textGray,
  },
  todayEntriesBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    width: '100%',
  },
  todayEntriesTouch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: responsiveHeight(6),
    width: '48%',
    borderRadius: responsiveWidth(1),
    elevation: 1,
    shadowColor: globalStyles.lightGray,
  },
  todayEntriesText: {
    color: 'black',
    marginHorizontal: responsiveWidth(2),
  },
  starIcon: {
    marginRight: responsiveWidth(1.2),
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(2),
    width: '100%',
  },
  headerText: {
    color: 'black',
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },
  headerButton: {
    color: globalStyles.themeBlue,
    fontSize: responsiveFontSize(2),
    fontWeight: '500',
  },
  noData: {
    height: responsiveHeight(10),
  },
});
