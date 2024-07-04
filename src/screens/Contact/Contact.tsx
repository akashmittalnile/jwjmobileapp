import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Container from '../../components/Container/Container';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../../components/Button/BorderBtn';
import {globalStyles} from '../../utils/constant';
import ContactTabContainer from '../../components/Contact/ContactTabContainer';
import ContactTab from '../../components/Contact/ContactTab';
import CustomCalendar from '../../components/Calendar/CustomCalendar';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import SkeletonContainer from '../../components/Skeleton/SkeletonContainer';
import {GetApiWithToken, endPoint} from '../../services/Service';
import {useAppSelector} from '../../redux/Store';
import Toast from 'react-native-toast-message';
import ContactMainTab from '../../components/Contact/ContactMainTab';
import moment from 'moment';
import Header from '../../components/Header/Header';

let pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const Contact = () => {
  const navigation = useNavigation();
  const reload = useAppSelector(state => state.reload.Contact);
  const token = useAppSelector(state => state.auth.token);
  const [modal, setModal] = React.useState<boolean>(false);
  const [date, setDate] = React.useState<string>(moment().format('YYYY-MM-DD'));
  const [statusCompletedAdminTab, setStatusCompletedAdminTab] =
    React.useState<boolean>(false);
  const [statusProgressAdminTab, setStatusProgressAdminTab] =
    React.useState<boolean>(false);
  const [statusPendingAdminTab, setStatusPendingAdminTab] =
    React.useState<boolean>(false);
  const [showSkeleton, setShowSkeleton] = React.useState<boolean>(false);
  const [data, setData] = React.useState<any[]>([]);
  const [paginatonLoader, setPaginationLoader] = React.useState<boolean>(false);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);

  const dateHandler = (date: any) => {
    setDate(`${date}`);
    setModal(value => !value);
    getQueryList(`?date=${date}`);
  };

  React.useEffect(() => {
    pagination = {
      currentPage: 1,
      lastPage: 1,
      loader: false,
    };
    setDate(moment().format('YYYY-MM-DD'));
    getQueryList(moment().format('YYYY-MM-DD'));
  }, [reload]);

  const getQueryList = async (param: string) => {
    setShowSkeleton(true);
    try {
      const response = await GetApiWithToken(
        `${endPoint.queryList}${param}`,
        token,
      );
      if (response?.data?.status) {
        setData(response?.data?.data?.data);
        pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1;
        pagination.lastPage = response?.data?.data?.pagination?.lastPage;
        pagination.loader = false;
      } else if (response?.data?.status) {
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('error in query list', err?.message);
    } finally {
      setShowSkeleton(false);
      setPaginationLoader(false);
      setshouldRefresh(false);
    }
  };

  const addQueryHandler = () => {
    navigation.navigate(ScreenNames.ContactForQuery);
  };

  const calendarhandler = () => {
    setModal(true);
  };

  const upperSection = (
    <View style={styles.add}>
      <TouchableOpacity style={styles.touch} onPress={calendarhandler}>
        <Image
          source={require('../../assets/Icons/calendar-blue.png')}
          resizeMode="contain"
          style={styles.icon}
        />
        {/* <Text style={styles.addText}>{date?.split('-').reverse().join('-')}</Text> */}
        <Text style={styles.addText}>{moment(date)?.format('MM-DD-YYYY')}</Text>
      </TouchableOpacity>
      <BorderBtn
        buttonText="+"
        onClick={addQueryHandler}
        containerStyle={styles.buttonStyle}
        buttonTextStyle={styles.buttonText}
      />
    </View>
  );

  const noDataFound = (
    <View style={{alignItems: 'center'}}>
      <Image
        source={require('../../assets/Icons/no-data-found.png')}
        resizeMode="contain"
        style={{
          marginTop: responsiveHeight(5),
          height: responsiveHeight(15),
          width: responsiveWidth(30),
        }}
      />
      <Text style={styles.noDataText}>No Data Found</Text>
    </View>
  );

  const renderData = ({item}: {item: any}) => <ContactMainTab data={item} />;

  const handlePagination = () => {
    if (
      date &&
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      data?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      getQueryList(`?date=${date}&page=${pagination.currentPage}`);
    }
    if (
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      data?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      getQueryList(`?page=${pagination.currentPage}`);
    }
  };

  const onRefresh = async () => {
    setshouldRefresh(true);
    pagination.currentPage = 1;
    pagination.lastPage = 1;
    pagination.loader = false;
    setDate(`${moment(new Date()).format('YYYY-MM-DD')}`);
    getQueryList('');
  };

  return (
    <>
      <View style={styles.headerContainer}>
        <Header title="Contact us" notificationButton={false} />
      </View>
      {showSkeleton ? (
        <SkeletonContainer />
      ) : (
        <FlatList
          ListHeaderComponent={
            <>
              {upperSection}
              {data?.length === 0 ? noDataFound : null}
            </>
          }
          data={data}
          renderItem={renderData}
          keyExtractor={(_, index) => index?.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handlePagination}
          ListFooterComponent={
            paginatonLoader ? (
              <ActivityIndicator
                size="large"
                color={globalStyles.themeBlue}
                style={{marginTop: responsiveHeight(2)}}
              />
            ) : null
          }
          refreshControl={
            <RefreshControl refreshing={shouldRefresh} onRefresh={onRefresh} />
          }
        />
      )}
      {modal && (
        <View style={styles.calendarContainer}>
          <CustomCalendar
            containerStyle={styles.calendar}
            dateHandler={dateHandler}
          />
        </View>
      )}
    </>
  );
};

export default Contact;

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  add: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: responsiveWidth(95),
    alignSelf: 'center',
  },
  icon: {
    height: responsiveHeight(2),
    width: responsiveHeight(2),
  },
  touch: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: responsiveWidth(1.5),
    paddingHorizontal: responsiveWidth(3),
    borderRadius: responsiveWidth(2),
    ...globalStyles.shadowStyle,
    borderWidth: responsiveWidth(0.23),
    borderColor: globalStyles.lightGray,
  },
  addText: {
    marginLeft: responsiveWidth(2),
    color: globalStyles.midGray,
  },
  buttonStyle: {
    flex: 1,
  },
  buttonText: {
    fontSize: responsiveFontSize(3),
  },
  scrollView: {
    flex: 1,
    marginTop: responsiveHeight(1.2),
  },
  calendarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  calendar: {
    width: responsiveWidth(85),
    borderRadius: responsiveWidth(2),
    paddingVertical: responsiveHeight(1),
  },
  noDataText: {
    marginTop: responsiveHeight(1),
    textAlign: 'center',
    fontSize: responsiveFontSize(3),
    color: 'black',
  },
});
