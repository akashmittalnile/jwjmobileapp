/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import HomeHeader from '../../components/Header/HomeHeader';
import SearchBarWithInsideIcon from '../../components/SearchBar/SearchBarWithInsideIcon';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {GetApiWithToken, endPoint} from '../../services/Service';
import IconTab from '../../components/Tab/IconTab';
import Wrapper from '../../components/Wrapper/Wrapper';
import {globalStyles} from '../../utils/constant';
import BorderBtn from '../../components/Button/BorderBtn';
import GoalModal from '../../components/Modal/GoalModal';
import ScreenNames from '../../utils/ScreenNames';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {goalDataHandler} from '../../redux/GoalList';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import ImageSkeleton from '../../components/Skeleton/ImageSkeleton';
import RenderRoutineTabs from '../../components/Routine/RenderRoutineTabs';
import Toast from 'react-native-toast-message';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import BorderLessBtn from '../../components/Button/BorderLessBtn';
import moment from 'moment';
import RoutineListItem from '../../components/Routine/RoutineListItem';

let pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const Routine = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const token = useAppSelector(state => state.auth.token);
  const goalData = useAppSelector(state => state.goal);
  const dispatch = useAppDispatch();
  const reload = useAppSelector(state => state.reload.Routine);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [routine, setRoutine] = React.useState<{}[]>([]);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(true);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [paginationLoader, setPaginationLoader] =
    React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [date, setDate] = React.useState<string | undefined>(
    moment().format('YYYY-MM-DD'),
  );
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [sharedRoutineCount, setSharedRoutineCount] = React.useState<
    number | undefined
  >(undefined);

  React.useEffect(() => {
    setShowSkeleton(true);
    if (focused) {
      showCalendar && setShowCalendar(false);
      pagination = {
        currentPage: 1,
        lastPage: 1,
        loader: false,
      };
      const tempDate = moment().format('YYYY-MM-DD');
      setDate(tempDate);
      getData(tempDate);
      setSearch('');
      getSharedCount();
    }
  }, [focused]);

  const getData = async (_date: any) => {
    await goalDatahandler();
    _date && searchHandler(`?date=${_date}`);
  };

  const getSharedCount = async () => {
    try {
      const resp = await GetApiWithToken(endPoint.shareRoutineList, token);
      if (resp?.data?.status) {
        setSharedRoutineCount(resp?.data?.data?.data?.length);
      }
    } catch (err: any) {
      console.log('shared routine count', err?.message);
    }
  };

  // const getRoutineList = async () => {
  //   setShowSkeleton(true);
  //   try {
  //     const response = await GetApiWithToken(endPoint.routine, token);
  //     if (response?.data?.status) {
  //       setRoutine(response.data?.data?.data);
  //     }
  //   } catch (err: any) {
  //     console.log('error in routine list', err.message);
  //   } finally {
  //     setShowSkeleton(false);
  //   }
  // };

  const goalDatahandler = React.useCallback(async () => {
    try {
      const response = await GetApiWithToken(endPoint.routineCategory, token);
      if (response?.data?.status) {
        dispatch(goalDataHandler(response?.data?.data));
      }
    } catch (err: any) {
      console.log('error in routine useEffect', err.message);
    }
  }, []);

  const onRefresh = async () => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setshouldRefresh(value => !value);
    setDate(moment().format('YYYY-MM-DD'));
    searchHandler(`?date=${moment().format('YYYY-MM-DD')}`);
    setshouldRefresh(value => !value);
  };

  const renderCategoryTab = React.useCallback(({item}: {item: any}) => {
    return (
      <IconTab
        imageUri={item.logo}
        text={item.name}
        percentage={item.percentage}
        style={{borderColor: 'white'}}
      />
    );
  }, []);

  const selectGoalHandler = (goal: string) => {
    if (goal) {
      setShowModal(false);
      navigation.navigate(ScreenNames.AddNewRoutine, {goal});
    }
  };

  const shareRoutineHandler = () => {
    navigation.navigate(ScreenNames.SharedRoutine);
  };

  const goToRoutine = () => {
    setShowModal(true);
  };

  const disableModalHandler = () => {
    setShowModal(false);
  };

  const searchHandler = async (key: string, loader = true) => {
    let _endpoint = `${endPoint?.routine}${key}`;
    if (key?.includes('name') && date) {
      _endpoint = `${endPoint?.routine}${key}&date=${date}`;
    }
    console.log(_endpoint)
    try {
      loader && !showSkeleton && setShowSkeleton(true);
      const response = await GetApiWithToken(_endpoint, token);
      if (response?.data?.status) {
        pagination.currentPage === 1
          ? setRoutine(response.data?.data?.data)
          : setRoutine(preData => [...preData, ...response.data?.data?.data]);
        pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1;
        pagination.lastPage = response?.data?.data?.pagination?.lastPage;
        pagination.loader = false;
      }
    } catch (err: any) {
      console.log('err in routine search', err?.message);
    } finally {
      setShowSkeleton(false);
      setPaginationLoader(false);
    }
  };

  const _dateHandler = async (date: string) => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setDate(date);
    showCalendar && setShowCalendar(false);
    searchHandler(`?date=${date}`);
  };

  const clearDateFilter = () => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setDate('');
    setSearch('');
    searchHandler('');
  };

  const calendarHandler = () => {
    setShowCalendar(true);
  };

  const upperSection = (
    <>
      <View style={styles.searchAndDropdownContainer}>
        <View style={styles.search}>
          <SearchBarWithInsideIcon
            value={search}
            arrowSide="right"
            onSearch={key => {
              (pagination.currentPage = 1), (pagination.lastPage = 1);
              pagination.loader = false;
              setSearch(key?.split('=')[1]);
              searchHandler(key);
            }}
            onClear={() => {
              pagination.currentPage = 1;
              (pagination.lastPage = 1), (pagination.loader = false);
              setSearch('');
              searchHandler(date ? `?date=${date}` : '');
            }}
            // clearSearch={() => {
            //   setSearch('')
            // }}
            resetFilter={focused}
          />
        </View>
        <View
          style={{
            ...styles.addnewJournalsCalendar,
          }}>
          <TouchableOpacity onPress={calendarHandler} style={styles.touch2}>
            <Image
              source={require('../../assets/Icons/calendar-blue.png')}
              resizeMode="contain"
              style={styles.img}
            />

            {/* <TextInput
                  value={date}
                  style={styles.textInput}
                  placeholder="yyyy-mm-dd"
                  placeholderTextColor={globalStyles.lightGray}
                  keyboardType="number-pad"
                  onChangeText={dateHandler}
                  maxLength={10}
                /> */}

            {/* <Text style={styles.textInput}>{date ? date?.split('-').reverse().join('-') : 'YYYY-MM-DD'?.split('-').reverse().join('-')}</Text> */}
            <Text style={styles.textInput}>
              {date ? moment(date)?.format('MM-DD-YYYY') : 'MM-DD-YYYY'}
            </Text>
            {date && (
              <BorderLessBtn
                buttonText="Clear filter"
                onClick={clearDateFilter}
                containerStyle={styles.clearButtom}
              />
            )}
          </TouchableOpacity>
        </View>
        {/* <View style={styles.dropdown}>
              <DropdownComponent
                onSearch={key => {
                  searchHandler(key);
                }}
              />
            </View> */}
      </View>

      {/* categories container */}
      <View style={styles.categoriesTabs}>
        {Array.isArray(goalData) &&
        goalData?.length > 0 &&
        goalData[0]?.logo ? (
          <FlatList
            data={goalData}
            renderItem={renderCategoryTab}
            keyExtractor={(_, index) => index.toString()}
            horizontal
            style={styles.flatlist}
            showsHorizontalScrollIndicator={false}
          />
        ) : (
          <ImageSkeleton />
        )}
      </View>

      {/* share routine tab */}
      <Wrapper containerStyle={styles.wrapper}>
        <TouchableOpacity style={styles.touch} onPress={shareRoutineHandler}>
          <View style={styles.routineTextContainer}>
            <Text style={styles.shareRoutineHeading}>Shared Routines</Text>
            <Text style={styles.shareRoutineNumber}>{sharedRoutineCount}</Text>
          </View>
          <View style={styles.routineImageContainer}>
            <Image
              source={require('../../assets/Icons/share-routine.png')}
              resizeMode="contain"
              style={styles.shareRoutineImg}
            />
          </View>
        </TouchableOpacity>
      </Wrapper>

      {/* add new routine */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: responsiveHeight(1),
        }}>
        <Text
          style={{
            fontSize: responsiveFontSize(1.6),
            fontWeight: '500',
            color: 'black',
          }}>
          My Routines
        </Text>
        <View style={{width: '35%'}}>
          <BorderBtn
            buttonText="Add New Routine"
            onClick={goToRoutine}
            buttonTextStyle={{fontSize: responsiveFontSize(1.4)}}
          />
        </View>
      </View>
    </>
  );

  const renderData = () => <RenderRoutineTabs data={routine} />;

  const handlePagination = React.useCallback(() => {
    if (
      date &&
      search &&
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(routine) &&
      routine?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      searchHandler(
        `?date=${date}&&name=${search}&&page=${pagination.currentPage}`,
        false,
      );
    } else if (
      date &&
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(routine) &&
      routine?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      searchHandler(`?date=${date}&&page=${pagination.currentPage}`, false);
    } else if (
      search &&
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(routine) &&
      routine?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      searchHandler(`?name=${search}&&page=${pagination.currentPage}`, false);
    } else if (
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(routine) &&
      routine?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      searchHandler(`?page=${pagination.currentPage}`, false);
    }
  }, [date, search, pagination, routine]);
  return (
    <View style={styles.mainContainer}>
      <HomeHeader />
      <View style={styles.subContainer}>
        {showSkeleton ? (
          <SkeletonContainer />
        ) : (
          <FlatList
            data={[1]}
            ListHeaderComponent={
              <>
                {upperSection}
                {routine?.length === 0 && (
                  <View style={styles.noDataFoundContainer}>
                    <Image
                      source={require('../../assets/Icons/no-data-found.png')}
                      style={styles.noUserFoundImage}
                      resizeMode="contain"
                    />
                    <Text style={styles.noUserFound}>No Routines Found</Text>
                  </View>
                )}
              </>
            }
            renderItem={renderData}
            keyExtractor={(_, index) => index.toString()}
            refreshControl={
              <RefreshControl
                refreshing={shouldRefresh}
                onRefresh={onRefresh}
              />
            }
            onEndReachedThreshold={0.5}
            onEndReached={handlePagination}
            ListFooterComponent={
              paginationLoader ? (
                <ActivityIndicator
                  size="large"
                  color={globalStyles.themeBlue}
                  style={{marginTop: responsiveHeight(2)}}
                />
              ) : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: responsiveHeight(12)}}
            style={{flex: 1}}
          />
        )}
      </View>
      {showModal && (
        <GoalModal
          onClick={selectGoalHandler}
          disableModal={disableModalHandler}
        />
      )}
      {showCalendar && (
        <View style={styles.calendarContainer}>
          <CustomCalendar
            value={date}
            containerStyle={styles.calendarStyle}
            dateHandler={_dateHandler}
          />
        </View>
      )}
    </View>
  );
};

export default Routine;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  subContainer: {
    marginTop: responsiveHeight(2),
    height: responsiveHeight(85),
    width: responsiveWidth(95),
  },
  searchAndDropdownContainer: {
    width: '100%',
  },
  search: {
    height: responsiveHeight(7),
    width: '100%',
  },
  addnewJournalsCalendar: {
    marginTop: responsiveHeight(1),
    height: responsiveHeight(6),
    width: '100%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    elevation: 3,
    shadowColor: globalStyles.veryLightGray,
    overflow: 'hidden',
  },
  touch2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  img: {
    flex: 1,
    height: '50%',
  },
  textInput: {
    flex: 6,
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontWeight: '400',
    paddingLeft: responsiveWidth(2),
  },
  clearButtom: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    height: responsiveHeight(7),
    width: '38%',
  },
  categoriesTabs: {
    // height: responsiveHeight(13),
    marginTop: responsiveHeight(1),
  },
  flatlist: {
    flex: 1,
  },
  wrapper: {
    marginTop: responsiveHeight(2),
    paddingTop: 0,
    paddingBottom: 0,
    width: '100%',
    borderRadius: responsiveWidth(1),
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  routineTextContainer: {
    height: 'auto',
    width: '65%',
  },
  shareRoutineHeading: {
    fontSize: responsiveFontSize(1.6),
    fontWeight: '500',
    color: 'black',
  },
  shareRoutineNumber: {
    marginTop: responsiveHeight(1),
    fontSize: responsiveFontSize(2.6),
    fontWeight: '500',
    color: globalStyles.themeBlueText,
  },
  routineImageContainer: {
    height: responsiveHeight(10),
    width: '25%',
  },
  shareRoutineImg: {
    height: responsiveHeight(8),
    width: '100%',
  },
  calendarContainer: {
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
  calendarStyle: {
    width: responsiveWidth(80),
    padding: 10,
    borderRadius: responsiveWidth(2),
  },
  noDataFoundContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveHeight(5),
  },
  noUserFoundImage: {
    height: responsiveHeight(10),
    width: responsiveWidth(20),
  },
  noUserFound: {
    fontSize: responsiveFontSize(2.5),
    fontWeight: '400',
    textAlign: 'center',
    color: 'black',
  },
});
