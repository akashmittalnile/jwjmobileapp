/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Platform,
  Modal,
  Image,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {globalStyles} from '../../utils/constant';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import NotificationTab from '../../components/Tab/NotificationTab';
import Subscription from '../../components/Subscription/Subscription';
import {
  GetApiWithToken,
  PostApiWithToken,
  endPoint,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import ImageSkeletonContainer from '../../components/Skeleton/ImageSkeletonContainer';
import BorderLessBtn from '../../components/Button/BorderLessBtn';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import ScreenNames from '../../utils/ScreenNames';
import {reloadHandler} from '../../redux/ReloadScreen';
import {
  subscribedToSubscriptionListener,
  unSubscribedToSubscriptionListener,
  handleSubscription,
} from '../../services/HandleIosSubscription';
import {notificationCounter} from '../../redux/TrackNumbers';

let pagination = {
  currentPage: 1,
  lastPage: 1,
  loader: false,
};

const Notification = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const token = useAppSelector(state => state.auth.token);
  const reloadHome = useAppSelector(state => state.reload.Home);
  const planDetails = useAppSelector(state => state.userDetails.currentPlan);
  const [allPlans, setAllPlans] = React.useState<any[]>([]);
  const [notification, setNotification] = React.useState<any[] | undefined>(
    undefined,
  );
  const [loader, setLoader] = React.useState<boolean>(true);
  const [shouldRefresh, setshouldRefresh] = React.useState<boolean>(false);
  const [modalLoader, setModalLoader] = React.useState<boolean>(false);
  const [paginationLoader, setPaginationLoader] =
    React.useState<boolean>(false);
  React.useEffect(() => {
    pagination = {
      currentPage: 1,
      lastPage: 1,
      loader: false,
    };
    getAllNotifications();
    notificationSeen();
    getPlanHandler();
    Platform.OS === 'ios' &&
      subscribedToSubscriptionListener(SubscriptionListenerCallback);

    return () => {
      Platform.OS === 'ios' && unSubscribedToSubscriptionListener();
    };
  }, []);

  const SubscriptionListenerCallback = (value: boolean) => {
    setModalLoader(value);
  };

  const getAllNotifications = async () => {
    try {
      const response = await GetApiWithToken(
        `${endPoint.notifications}?page=${pagination.currentPage}`,
        token,
      );
      if (response?.data?.status) {
        pagination.currentPage === 1
          ? setNotification(response?.data?.data?.data)
          : setNotification(preData => [
              ...preData,
              ...response?.data?.data?.data,
            ]);
        pagination.currentPage =
          response?.data?.data?.pagination?.currentPage + 1;
        pagination.lastPage = response?.data?.data?.pagination?.lastPage;
        pagination.loader = false;
      }
    } catch (err: any) {
      console.log('err in notification', err?.message);
    } finally {
      setLoader(false);
      setPaginationLoader(false);
    }
  };

  const notificationSeen = async () => {
    try {
      const response = await PostApiWithToken(
        endPoint.notificationSeen,
        {},
        token,
      );
      console.log(response?.data);
      if (response?.data?.status) {
        dispatch(notificationCounter({notificationCount: 0}));
      }
    } catch (err: any) {
      console.log('err in notification seen', err?.message);
    }
  };

  const getPlanHandler = async () => {
    try {
      const response = await GetApiWithToken(endPoint.plans, token);
      if (response?.data?.status) {
        setAllPlans(response?.data.data);
      }
    } catch (err: any) {
      console.log('err in notification plans', err?.message);
    }
  };

  const noDataFound = (
    <View style={{marginTop: responsiveHeight(17),marginVertical: responsiveHeight(2), width: '100%'}}>
      <Image
        source={require('../../assets/Icons/no-data-found.png')}
        resizeMode="contain"
        style={{
          alignSelf: 'center',
          marginTop: responsiveHeight(5),
          height: responsiveHeight(15),
          width: responsiveWidth(30),
        }}
      />
      <Text
        style={{
          fontSize: responsiveFontSize(2.5),
          fontWeight: '500',
          textAlign: 'center',
          color: 'black',
        }}>
        No notifications found
      </Text>
    </View>
  );

  const updateSubscription = async (response: any, item: any) => {
    try {
      if (response && response.transactionReceipt) {
        const data = {
          plan_timeperiod:
            planDetails?.plan_timeperiod === 'Yearly' ? '2' : '1',
          price_id:
            planDetails?.plan_timeperiod === 'Yearly'
              ? item?.anually_price_id
              : item?.monthly_price_id,
          price:
            planDetails?.plan_timeperiod === 'Yearly'
              ? item?.anually_price
              : item?.monthly_price,
          plan_id: item?.id,
          transaction_id: 'currently testing',
        };
        const apiResponse = await PostApiWithToken(
          endPoint.buyPlanIos,
          data,
          token,
        );
        if (apiResponse?.data?.status) {
          dispatch(reloadHandler({[ScreenNames.Home]: !reloadHome}));
          navigation.reset({
            index: 0,
            routes: [{name: ScreenNames.Drawer}],
          });
        }
        Toast.show({
          type: apiResponse?.data?.status ? 'success' : 'error',
          text1: apiResponse?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in updateSubscription', err?.message);
    } finally {
      return true;
    }
  };

  const selectPlan = (item: any) => {
    try {
      return new Promise<void>((resolve, reject) => {
        let sku = '';
        if (planDetails?.plan_timeperiod === 'Yearly') {
          if (item?.name === 'Plan B') {
            sku = 'prod_PVqNani9ws1r6k';
          } else {
            sku = 'prod_PVqNHEOuvDDSKy_plan_c_yearly';
          }
        } else {
          if (item?.name === 'Plan B') {
            sku = 'prod_PVqNani9ws1r6k_plan_b_monthly';
          } else {
            sku = 'prod_PVqNHEOuvDDSKy_plan_c_monthly';
          }
        }
        handleSubscription(sku, async (response: any) => {
          const resp = await updateSubscription(response, item);
          if (resp) {
            resolve();
          } else {
            reject();
          }
        });
      });
    } catch (err: any) {
      console.log('err in selectPlan', err?.message);
    }
  };

  const handlePayment = async (item: any) => {
    setModalLoader(true);
    try {
      if (!item?.anually_price_id && !item?.monthly_price_id) {
        const response = await PostApiWithToken(
          endPoint.buyFreePlan,
          {plan_id: item?.id, price: 0},
          token,
        );
        if (response?.data?.status) {
          dispatch(reloadHandler({[ScreenNames.Home]: !reloadHome}));
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
        navigation.navigate(ScreenNames.Home);
      } else if (Platform.OS === 'ios') {
        await selectPlan(item);
      } else {
        navigation.navigate(ScreenNames.Payment, {
          data: {
            ...item,
            selected_plan: planDetails?.plan_timeperiod === 'Yearly' ? 1 : 0,
          },
        });
      }
    } catch (err: any) {
      console.log('err in puchasing subscription', err?.message);
    } finally {
      setModalLoader(false);
    }
  };

  const lowerSection = (
    <View
      style={{
        ...styles.subscriptionContainer,
        marginTop: Number(planDetails.price) !== 0 ? responsiveHeight(2) : 0,
      }}>
      {Number(planDetails.price) === 0 && (
        <Text style={styles.subscriptionHeading}>
          What Am I Missing By Not Subscribing?
        </Text>
      )}
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        {allPlans?.map(
          (item, index) =>
            planDetails?.name != item?.name && (
              <Subscription
                key={index}
                current={true}
                type={
                  Number(item?.price) === 0
                    ? 'a'
                    : item?.name?.split(' ')[1]?.toLowerCase()
                }
                price={
                  planDetails?.plan_timeperiod === 'Yearly'
                    ? item?.anually_price === 0
                      ? 'FREE'
                      : `$${item?.anually_price}/Year`
                    : item?.monthly_price === 0
                    ? 'FREE'
                    : `$${item?.monthly_price}/Month`
                }
                buttonText={
                  planDetails?.plan_timeperiod === 'Yearly'
                    ? Number(item?.anually_price) > Number(planDetails.price)
                      ? 'Upgrade'
                      : 'Downgrade'
                    : Number(item?.monthly_price) > Number(planDetails.price)
                    ? 'Upgrade'
                    : 'Downgrade'
                }
                style={styles.subscription}
                onClick={() => {
                  handlePayment(item);
                }}
              />
            ),
        )}
        {/* <Subscription
          current={false}
          type="b"
          price="$5.99"
          style={styles.subscription}
        />
        <Subscription
          current={false}
          type="c"
          price="$9.99"
          style={styles.subscription}
        /> */}
      </ScrollView>
    </View>
  );
  // Number(item?.price) === 0
  // ? 'Free'
  // : `$${item?.price}/${
  //     planDetails?.plan_timeperiod === 'Monthly' ? 'Month' : 'Year'
  //   } `
  const renderData = ({item}: {item: any}) => (
    <NotificationTab
      name={item?.sender_name}
      // imageUri={item?.sender_image}
      imageUri={item?.image}
      message={item?.message}
      time={moment(item?.created_date, 'DD MMM, YYYY hh:mm A').format(
        'MMM DD, YYYY hh:mm A',
      )}
      style={styles.notificationTab}
      type="community"
    />
  );

  const handlePagination = () => {
    if (
      pagination.currentPage <= pagination.lastPage &&
      !pagination.loader &&
      Array.isArray(notification) &&
      notification?.length % 10 === 0
    ) {
      pagination.loader = true;
      setPaginationLoader(true);
      getAllNotifications();
    }
  };

  const clearNoticationHandler = async () => {
    try {
      setLoader(true);
      const response = await PostApiWithToken(
        endPoint.clearNotifications,
        {},
        token,
      );
      if (response?.data?.status) {
        setNotification([]);
      }
      Toast.show({
        type: response?.data?.status ? 'success' : 'error',
        text1: response?.data?.message,
      });
    } catch (err: any) {
      console.log('err in clear notification', err?.message);
    } finally {
      setLoader(false);
    }
  };
  const onRefresh = async () => {
    setLoader(true);
    setshouldRefresh(true);
    pagination = {
      currentPage: 1,
      lastPage: 1,
      loader: false,
    };
    getAllNotifications();
    getPlanHandler();
    setshouldRefresh(false);
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Notification Center" />
        </View>
        <View style={styles.subContainer}>
          {loader ? (
            <View style={{marginTop: responsiveHeight(5)}}>
              <ImageSkeletonContainer
                height={responsiveHeight(7)}
                width={responsiveWidth(95)}
              />
            </View>
          ) : (
            <FlatList
              data={notification}
              ListHeaderComponent={
                <>
                  {Array.isArray(notification) && notification?.length > 0 && (
                    <View
                      style={{
                        alignItems: 'flex-end',
                        marginTop: responsiveHeight(1),
                        height: responsiveHeight(3),
                      }}>
                      <BorderLessBtn
                        buttonText="Clear All"
                        onClick={clearNoticationHandler}
                        buttonTextStyle={{fontSize: responsiveFontSize(2)}}
                      />
                    </View>
                  )}
                  {notification?.length === 0 ? noDataFound : null}
                </>
              }
              refreshControl={
                <RefreshControl
                  refreshing={shouldRefresh}
                  onRefresh={onRefresh}
                />
              }
              renderItem={renderData}
              ListFooterComponent={
                <>
                  {/* {Array.isArray(notification) ? lowerSection : null} */}
                  {paginationLoader ? (
                    <ActivityIndicator
                      size="large"
                      color={globalStyles.themeBlue}
                      style={{marginTop: responsiveHeight(2)}}
                    />
                  ) : null}
                </>
              }
              showsVerticalScrollIndicator={false}
              onEndReachedThreshold={0.5}
              onEndReached={handlePagination}
              style={{width: '100%'}}
              contentContainerStyle={{paddingBottom: responsiveHeight(12)}}
            />
          )}
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalLoader}
        style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={'white'} />
        </View>
      </Modal>
    </>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F0F0F0',
  },
  headerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    // height: responsiveHeight(7),
    paddingBottom: responsiveHeight(1.5),
    backgroundColor: globalStyles.themeBlue,
  },
  subContainer: {
    alignItems: 'center',
    // marginTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(5),
    // height: responsiveHeight(85),
    width: responsiveWidth(95),
  },
  notificationTab: {
    marginVertical: responsiveHeight(0.5),
  },
  subscriptionContainer: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.02)',
    borderRadius: responsiveWidth(3),
  },
  subscriptionHeading: {
    marginVertical: responsiveHeight(1.5),
    fontSize: responsiveFontSize(1.8),
    fontWeight: '500',
    color: globalStyles.textGray,
  },
  subscription: {
    marginRight: responsiveWidth(2),
    width: 'auto',
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
});
