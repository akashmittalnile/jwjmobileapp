import React, {useCallback, useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import HomeHeader from '../../components/Header/HomeHeader';
import {
  responsiveWidth,
  responsiveHeight,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import IconTab from '../../components/Tab/IconTab';
import EmojiTab from '../../components/Tab/EmojiTab';
import BorderBtn from '../../components/Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import ScreenNames from '../../utils/ScreenNames';
import TodayMood from '../../components/Modal/TodayMood';
import {useAppSelector} from '../../redux/Store';
import {GetApiWithToken, endPoint} from '../../services/Service';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import SearchBarWithInsideIcon from '../../components/SearchBar/SearchBarWithInsideIcon';
import BorderLessBtn from '../../components/Button/BorderLessBtn';
import moment from 'moment';
import debounce from 'lodash/debounce';

const pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const Journals = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload.Journals);
  const [date, setDate] = React.useState<string | undefined>(
    moment().format('YYYY-MM-DD'),
  );
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [journals, setJournals] = React.useState<[] | undefined>([]);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [dateErr, setDateErr] = React.useState<boolean>(false);
  const [showCalendar, setShowCalendar] = React.useState<boolean>(false);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [search, setSearch] = React.useState<string>('');
  const [paginationLoader, setPaginationLoader] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (!focused) {
      showModal && setShowModal(false);
    }
    if (focused || reload) {
      setShowSkeleton(true);
      pagination.currentPage = 1;
      pagination.lastPage = 1;
      pagination.loader = false;
      onRefresh();
    }
    // }
  }, [focused, reload]);

  const getJournalsList = async (key: string, loader = false) => {
    loader && !showSkeleton && setShowSkeleton(true);
    let _endpoint = `${endPoint.journals}${key}`;
    if (key?.includes('title') && date) {
      console.log({date});
      _endpoint = `${endPoint.journals}${key}&date=${date}`;
    }
    console.log(_endpoint);
    try {
      const response = await GetApiWithToken(_endpoint, token);
      if (response?.data?.status) {
        pagination.currentPage === 1
          ? setJournals(response?.data?.data?.data)
          : setJournals(preData => [...preData, ...response?.data?.data?.data]);
        pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1;
        pagination.lastPage = response?.data?.data?.pagination?.lastPage;
        pagination.loader = false;
      }
    } catch (err: any) {
      console.log('err in getting journals list', err.message);
    } finally {
      loader && setShowSkeleton(false);
      setPaginationLoader(false);
    }
  };

  const onRefresh = async () => {
    setDate(() => moment().format('YYYY-MM-DD'));
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setshouldRefresh(value => !value);
    await getJournalsList(`?date=${moment().format('YYYY-MM-DD')}`, true);
    setshouldRefresh(value => !value);
  };

  const _dateHandler = async (date: string) => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setDate(date);
    showCalendar && setShowCalendar(false);
    await getJournalsList(`?date=${date}`, true);
  };

  const clearDateFilter = () => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    date && getJournalsList('', true);
    setDate('');
    setSearch('');
  };

  const calendarHandler = () => {
    setShowCalendar(true);
  };

  const addNewJournals = () => {
    setShowModal(true);
  };

  const moodHandler = (value: string) => {
    if (value) {
      navigation.navigate(ScreenNames.AddNewJournals, {mood: value});
    }
  };

  const showJournalsDetails = (journalsId: string) => {
    navigation.navigate(ScreenNames.JournalsInfo, {journalsId});
  };

  const debouncedSearch = (text: any) => {
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setSearch(text?.split('=')[1]);
    getJournalsList(text, true);
  };

  const searchBar = (
    <SearchBarWithInsideIcon
      value={search}
      searchKey="title"
      placeHolder="Search Title"
      onSearch={debouncedSearch}
      style={{
        marginTop: responsiveHeight(2),
        height: responsiveHeight(7),
        elevation: 3,
        shadowColor: globalStyles.veryLightGray,
      }}
      onClear={() => {
        pagination.currentPage = 1;
        pagination.lastPage = 1;
        pagination.loader = false;
        setSearch('');
        getJournalsList(date ? `?date=${date}` : '', true);
      }}
      // clearSearch={() => {
      //   setSearch('')
      // }}
      resetFilter={focused}
    />
  );

  const addNewJournal = (
    <View style={styles.addnewJournalsContainer}>
      <View
        style={{
          ...styles.addnewJournalsCalendar,
          borderColor: dateErr ? 'red' : 'white',
        }}>
        <TouchableOpacity style={styles.touch} onPress={calendarHandler}>
          <Image
            source={require('../../assets/Icons/calendar-blue.png')}
            resizeMode="contain"
            style={{...styles.img, marginLeft: responsiveWidth(2)}}
          />
          <Text style={styles.textInput}>
            {date ? moment(date)?.format('MM-DD-YYYY') : 'MM-DD-YYYY'}
          </Text>
        </TouchableOpacity>
        {date && (
          <BorderLessBtn
            buttonText="Clear filter"
            onClick={clearDateFilter}
            containerStyle={{
              width: responsiveWidth(17),
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
        )}
      </View>
      <View style={styles.addnewJournalsButton}>
        <BorderBtn
          buttonText="Add New Journal"
          onClick={addNewJournals}
          containerStyle={{
            height: '100%',
            width: '100%',
            borderRadius: responsiveWidth(2),
            marginTop: 0,
            elevation: 3,
          }}
          buttonTextStyle={{fontSize: responsiveFontSize(1.5)}}
        />
      </View>
    </View>
  );

  const renderData = useCallback(
    ({item}: {item: any}) => (
      <EmojiTab
        data={item}
        id={item.id}
        onClick={() => {
          showJournalsDetails(item.id);
        }}
        imageUri={item.mood_logo}
        headerText={item.title}
        headerButtonText="View"
        emojiText={item.mood_name}
        description={item.content}
        date={item.created_at}
        pdfLink={item?.download_pdf}
      />
    ),
    [],
  );

  const handlePagination = useCallback(() => {
    if (
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(journals) &&
      journals?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      let key = `?page=${pagination.currentPage}`;
      if (date) key = `?date=${date}&&page=${pagination.currentPage}`;
      if (search) key = `?title=${search}&&page=${pagination.currentPage}`;
      getJournalsList(key, false);
    }
  }, [date, search, journals]);

  return (
    <>
      <View style={styles.mainContainer}>
        <HomeHeader />
        <View style={styles.subContainer}>
          {showSkeleton ? (
            <SkeletonContainer />
          ) : (
            <FlatList
              data={journals}
              renderItem={renderData}
              keyExtractor={(_, index) => index.toString()}
              onEndReachedThreshold={0.5}
              onEndReached={handlePagination}
              initialNumToRender={10}
              windowSize={21}
              removeClippedSubviews
              contentContainerStyle={{paddingBottom: responsiveHeight(15)}}
              refreshControl={
                <RefreshControl
                  refreshing={shouldRefresh}
                  onRefresh={onRefresh}
                />
              }
              showsVerticalScrollIndicator={false}
              ListFooterComponent={
                paginationLoader ? (
                  <ActivityIndicator
                    style={{marginTop: responsiveHeight(2)}}
                    color={globalStyles.themeBlue}
                    size="large"
                  />
                ) : null
              }
              ListHeaderComponent={
                <>
                  {searchBar}
                  {addNewJournal}
                  {journals?.length === 0 && pagination.currentPage > 1 && (
                    <View
                      style={{
                        marginTop: responsiveHeight(8),
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        source={require('../../assets/Icons/no-data-found.png')}
                        style={{
                          height: responsiveHeight(10),
                          width: responsiveWidth(30),
                        }}
                        resizeMode="contain"
                      />
                      <Text
                        style={{
                          textAlign: 'center',
                          fontSize: responsiveFontSize(2.8),
                          color: 'black',
                          letterSpacing: 0.8,
                        }}>
                        No Journals Found
                      </Text>
                    </View>
                  )}
                </>
              }
            />
          )}
        </View>
      </View>
      {showModal && (
        <View
          style={{
            ...styles.calendarContainer,
            backgroundColor: 'rgba(0,0,0,0.1)',
          }}>
          <TodayMood
            onPress={moodHandler}
            disableModal={() => {
              setShowModal(false);
            }}
          />
        </View>
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
    </>
  );
};

export default Journals;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    zIndex: 100,
  },
  subContainer: {
    flex: 1,
    width: responsiveWidth(95),
  },
  addnewJournalsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: responsiveHeight(2),
    height: responsiveHeight(7),
    width: '100%',
  },
  addnewJournalsCalendar: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100%',
    width: '67%',
    backgroundColor: 'white',
    borderRadius: responsiveWidth(2),
    elevation: 3,
    shadowColor: globalStyles.veryLightGray,
    borderWidth: responsiveWidth(0.2),
    overflow: 'hidden',
  },
  touch: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: responsiveWidth(43),
  },
  img: {
    flex: 1.2,
    height: '50%',
  },
  textInput: {
    flex: 8,
    fontSize: responsiveFontSize(2),
    color: 'black',
    fontWeight: '400',
    paddingLeft: responsiveWidth(2),
  },
  addnewJournalsButton: {
    height: '100%',
    width: '32%',
    borderRadius: responsiveWidth(2),
  },
  categoriesTabs: {
    marginTop: responsiveHeight(2),
  },
  flatlist: {
    flex: 1,
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
});
