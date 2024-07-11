import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  RefreshControl,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../../components/Button/BorderBtn';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import TodayMood from '../../components/Modal/TodayMood';
import {
  GetApiWithToken,
  endPoint,
  PostApiWithToken,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import RenderRoutineTabs from '../../components/Routine/RenderRoutineTabs';
import EmojiTab from '../../components/Tab/EmojiTab';
import CommunityListItem from '../../components/CommunityListItem/CommunityListItem';
import {followedCommunityHandler} from '../../redux/TrackNumbers';
import SearchBarWithInsideIcon from '../../components/SearchBar/SearchBarWithInsideIcon';
import moment from 'moment';

const Search = () => {
  const navigation = useNavigation();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload.Search);
  const dispatch = useAppDispatch();
  const followedCommunityNumber = useAppSelector(
    state => state.TrackNumber.followedCommunity,
  );
  const [date, setDate] = React.useState<string>(moment().format('YYYY-MM-DD'));
  const [openCalendarModal, setDateOpenModal] = React.useState<boolean>(false);
  const [showMoodModal, setShowMoodModal] = React.useState<boolean>(false);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [data, setData] = React.useState<
    {community: []; journal: []; routine: []}[] | null
  >(null);

  React.useEffect(() => {
    getData(`?date=${date}`);
  }, [reload]);

  const onRefresh = async () => {
    setDate(moment().format('YYYY-MM-DD'));
    setshouldRefresh(true);
    getData(`?date=${moment().format('YYYY-MM-DD')}`);
  };

  const getData = async (key: string) => {
    let _endpoint = `${endPoint.search}${key}`;
    if (key?.includes('search') && date) {
      _endpoint = `${endPoint.search}${key}&date=${date}`;
    }
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(_endpoint, token);
      if (response?.data?.status) {
        setData(response?.data?.data);
      } else if (!response?.data?.status) {
        response?.data?.message &&
          Toast.show({
            type: 'error',
            text1: response?.data?.message,
          });
      }
    } catch (err: any) {
      console.log('err in search', err?.message);
    } finally {
      setShowSkeleton(false);
      setshouldRefresh(false);
    }
  };

  const dateHandler = (date: string) => {
    const _date = moment(date).format('YYYY-MM-DD');
    setDate(_date);
    setDateOpenModal(false);
    getData(`?date=${_date}`);
  };

  const addNewJournalsHandler = () => {
    setShowMoodModal(true);
  };

  const moodHandler = (value: string) => {
    if (value) {
      setShowMoodModal(false);
      navigation.navigate(ScreenNames.AddNewJournals, {mood: value});
    }
  };

  const showJournalsDetails = (journalsId: string) => {
    navigation.navigate(ScreenNames.JournalsInfo, {journalsId});
  };

  const followinHandler = async (
    value: boolean,
    community_id: string,
    index: number,
  ) => {
    try {
      const response = await PostApiWithToken(
        endPoint.followUnfollow,
        {community_id, status: !value ? 1 : 0},
        token,
      );
      if (response?.data?.status) {
        if (Array.isArray(data) && data[0]?.community?.length > 0) {
          const temp = [data[0]?.community];
          temp[index] = {
            ...temp[index],
            follow: !value,
            member_follow_count: !value
              ? temp[index].member_follow_count + 1
              : temp[index].member_follow_count - 1,
          };
          // if (followedCommunityNumber && followedCommunityNumber > 0) {
          dispatch(
            followedCommunityHandler({
              followedCommunity: !value
                ? followedCommunityNumber + 1
                : followedCommunityNumber - 1,
            }),
          );
          // }
          setData(prevData => [{...prevData[0], community: temp}]);
          Toast.show({
            type: 'success',
            text1: response?.data?.message,
          });
        }
      } else if (!response?.data?.status) {
        Toast.show({
          type: 'error',
          text1: response?.data?.message
            ? response?.data?.message
            : 'Error occured',
        });
      }
    } catch (err: any) {
      console.log('err in following handler of community', err.message);
    } finally {
      showSkeleton && setShowSkeleton(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Search" notificationButton={false} />
        </View>
        <View style={styles.subContainer}>
          <ScrollView
            contentContainerStyle={{paddingBottom: responsiveHeight(7)}}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={shouldRefresh}
                onRefresh={onRefresh}
              />
            }>
            {/* searchBar */}
            {/* <SearchBar containerStyle={styles.searchBar} focus={true} /> */}
            <SearchBarWithInsideIcon
              searchKey="search"
              style={styles.searchBar}
              onSearch={key => {
                getData(key);
              }}
              onClear={() => {
                getData('');
              }}
            />

            {/* date */}
            <View style={styles.calendarContainer}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: '65%',
                  backgroundColor: 'white',
                  borderRadius: responsiveWidth(2),
                  overflow: 'hidden',
                }}>
                <>
                  <TouchableOpacity
                    style={styles.touch}
                    onPress={() => {
                      setDateOpenModal(true);
                    }}>
                    <Image
                      source={require('../../assets/Icons/calendar-blue.png')}
                      resizeMode="contain"
                      style={styles.img}
                    />
                    <Text style={styles.text}>
                      {date ? date : 'Select Date'}
                    </Text>
                  </TouchableOpacity>
                </>
                <>
                  {date && (
                    <TouchableOpacity
                      style={styles.touch}
                      onPress={() => {
                        getData('');
                        setDate('');
                      }}>
                      <Text
                        style={{
                          color: globalStyles.themeBlue,
                          fontSize: responsiveHeight(1.5),
                          fontWeight: '400',
                        }}>
                        Clear filter
                      </Text>
                    </TouchableOpacity>
                  )}
                </>
              </View>
              {/* <TextInput
                style={styles.textInput}
                placeholder="10/10/2023"
                value={date}
                onChangeText={onDateChange}
                maxLength={10}
              /> */}
              <BorderBtn
                buttonText="Add New Journal"
                onClick={addNewJournalsHandler}
                containerStyle={styles.dateButtonStyle}
                buttonTextStyle={styles.dateButtonTextStyle}
              />
            </View>

            {/* story */}
            {showSkeleton && <SkeletonContainer />}
            {Array.isArray(data) &&
            data[0]?.routine?.length === 0 &&
            data[0]?.community?.length === 0 &&
            data[0]?.journal?.length === 0 ? (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: responsiveHeight(15),
                }}>
                <Image
                  source={require('../../assets/Icons/no-data-found.png')}
                  resizeMode="contain"
                  style={{
                    height: responsiveHeight(15),
                    width: responsiveWidth(30),
                  }}
                />
                <Text style={styles.noDataText}>No Data Found</Text>
              </View>
            ) : (
              <View>
                {Array.isArray(data) && data[0]?.journal?.length > 0 && (
                  <>
                    <View style={{marginTop: responsiveHeight(2)}}>
                      <Text style={styles.text}>Journals</Text>
                      {data[0]?.journal?.map((item: any, index: number) => (
                        <EmojiTab
                          data={item}
                          id={item?.id}
                          onClick={() => {
                            showJournalsDetails(item?.id);
                          }}
                          imageUri={item?.mood_logo}
                          key={index.toString()}
                          headerText={item?.title}
                          headerButtonText="View"
                          emojiText={item?.mood_name}
                          description={item?.content}
                          date={item?.created_at}
                          pdfLink={item?.download_pdf}
                        />
                      ))}
                    </View>
                  </>
                )}
                {Array.isArray(data) && data[0]?.community?.length > 0 && (
                  <>
                    <View style={{marginTop: responsiveHeight(2)}}>
                      <Text style={styles.text}>Communities</Text>
                      {data[0]?.community?.map((item: any, index: number) => (
                        <CommunityListItem
                          onClick={() => {
                            followinHandler(item?.follow, item?.id, index);
                          }}
                          key={index?.toString()}
                          id={item?.id}
                          headerHeading={item?.name}
                          headerButtonText={
                            item?.follow ? 'Unfollow' : 'Follow'
                          }
                          planPrice={`${item?.plan_price_currency?.toUpperCase()} ${
                            item?.plan_monthly_price
                          }/month`}
                          planName={item?.plan_name}
                          memberCount={item?.member_follow_count}
                          memberImages={item?.member_image}
                          images={[item?.posted_by_image]}
                          totalPost={item?.post_count}
                          onPress={() => {
                            // goToFollowedCommunityDetails(
                            //   item?.follow,
                            //   item?.id,
                            // );
                          }}
                          showDeleteButton={true}
                          editButtonHandler={() => {
                            // editCommunityHandler(item);
                          }}
                        />
                      ))}
                    </View>
                  </>
                )}
                {Array.isArray(data) && data[0]?.routine?.length > 0 && (
                  <View style={{marginTop: responsiveHeight(2)}}>
                    <Text style={styles.text}>Routines</Text>
                    <RenderRoutineTabs data={data[0]?.routine} />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* calendar modal */}
      {openCalendarModal && (
        <View style={styles.customCalendarPicker}>
          <TouchableOpacity
            style={styles.calendarTouch}
            activeOpacity={1}
            onPress={() => {
              setDateOpenModal(false);
            }}>
            <CustomCalendar
              containerStyle={styles.customCalendarStyle}
              dateHandler={dateHandler}
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Mood Modal */}
      {showMoodModal && (
        <View
          style={{
            ...styles.moodModalContainer,
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <TodayMood
            onPress={moodHandler}
            disableModal={() => {
              setShowMoodModal(false);
            }}
          />
        </View>
      )}
    </>
  );
};

export default Search;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
    paddingTop: responsiveHeight(1.5),
  },
  searchBar: {
    marginTop: 0,
    height: responsiveHeight(6),
  },
  calendarContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  calendarTouch: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(2),
    height: responsiveHeight(6),
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: globalStyles.shadowColor,
    borderRadius: responsiveWidth(2),
  },
  img: {
    height: responsiveHeight(2.2),
    width: responsiveHeight(2.2),
  },
  text: {
    paddingLeft: responsiveWidth(2),
    fontSize: responsiveFontSize(2),
    fontWeight: '400',
    color: 'black',
  },
  dateButtonStyle: {
    marginLeft: '2%',
    width: '33%',
  },
  dateButtonTextStyle: {
    fontSize: responsiveFontSize(1.4),
    fontWeight: '700',
    color: 'white',
  },
  customCalendarPicker: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  customCalendarStyle: {
    padding: responsiveWidth(7),
    width: responsiveWidth(80),
    borderRadius: responsiveWidth(3),
  },
  wrapper: {
    marginTop: responsiveHeight(1.5),
    paddingTop: responsiveHeight(2.5),
    padding: responsiveWidth(3),
    width: '100%',
    borderRadius: responsiveWidth(2),
  },
  emojiContainer: {
    alignItems: 'center',
  },
  emojiIcon: {
    height: responsiveHeight(9),
    width: responsiveHeight(9),
  },
  emojiText: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    color: globalStyles.textGray,
  },
  storyHeading: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '600',
    width: '100%',
  },
  storyText: {
    marginTop: responsiveHeight(0.5),
    fontSize: responsiveFontSize(1.6),
    fontWeight: '400',
    color: globalStyles.textGray,
    letterSpacing: 1,
  },
  storyImageContainer: {
    marginTop: responsiveHeight(1.5),
    height: responsiveHeight(15),
    width: '100%',
    borderRadius: responsiveWidth(2),
    overflow: 'hidden',
  },
  storyImage: {
    height: '100%',
    width: '100%',
  },
  unlockImageStyle: {
    height: responsiveHeight(3),
    width: responsiveHeight(3),
  },
  unlockBtnStyle: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(4),
    width: responsiveWidth(25),
  },
  moodModalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  noDataText: {
    fontSize: responsiveFontSize(2.8),
    color: 'black',
    textAlign: 'center',
  },
});
