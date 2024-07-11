/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eol-last */
/* eslint-disable prettier/prettier */
import {
  View,
  StyleSheet,
  Image,
  ScrollView,
  NativeModules,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import {globalStyles} from '../../utils/constant';
import {
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {useNavigation} from '@react-navigation/native';
import Wrapper from '../../components/Wrapper/Wrapper';
import SubscriptionPlanHeader from '../../components/Subscription/SubscriptionPlanHeader';
import SubscriptionBenifitViewer from '../../components/Subscription/SubscriptionBenifitViewer';
import BorderBtn from '../../components/Button/BorderBtn';
import freeIcon from '../../assets/Icons/free.png';
import planBIcon from '../../assets/Icons/plan-b.png';
import planCIcon from '../../assets/Icons/plan-c.png';
import ScreenNames from '../../utils/ScreenNames';
import {
  GetApiWithToken,
  PostApiWithToken,
  endPoint,
} from '../../services/Service';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {reloadHandler} from '../../redux/ReloadScreen';
import Toast from 'react-native-toast-message';
import ImageSkeleton from '../../components/Skeleton/ImageSkeleton';
import ToggleSwitch from 'toggle-switch-react-native';
import {
  handleSubscription,
  subscribedToSubscriptionListener,
  unSubscribedToSubscriptionListener,
} from '../../services/HandleIosSubscription';

const freeIconPath = Image.resolveAssetSource(freeIcon).uri;
const planBIconPath = Image.resolveAssetSource(planBIcon).uri;
const planCIconPath = Image.resolveAssetSource(planCIcon).uri;

interface plan {
  id: string;
  name: string;
  current_plan: boolean;
  selected_plan: number;
  monthly_price: number;
  anually_price: number;
  monthly_price_id: string;
  anually_price_id: string;
  currency: string;
  point1: string;
  point2: string;
  point3: string;
  point4: string;
}

const {StatusBarManager} = NativeModules;

const SubscriptionPlans = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const homeReload = useAppSelector(state => state.reload.Home);
  const token = useAppSelector(state => state.auth.token);
  const planDetails = useAppSelector(state => state.userDetails.currentPlan);
  const [plans, setPlans] = React.useState<[]>([]);
  const [currentPlan, setCurrentPlan] = React.useState<plan | undefined>();
  const [iosPlan, setIosPlan] = React.useState<string>('');
  const [toggle, setToggle] = React.useState<boolean>(false);
  const [showSkeletonLoader, setShowSkeletonLoader] =
    React.useState<boolean>(false);
  const [myPurchasedPlan, setMyPurchasedPlan] = React.useState<boolean>(false);
  const [nextButtonLoader, setNextButtonLoader] =
    React.useState<boolean>(false);

  React.useEffect(() => {
    if (planDetails?.plan_timeperiod === 'Yearly') {
      setMyPurchasedPlan(true);
    } else if (planDetails?.plan_timeperiod === 'Monthly') {
      setMyPurchasedPlan(false);
    } else {
      setMyPurchasedPlan(false);
    }
    getPlanHandler();
    // getProducts({
    //   skus: ['journeywithjournaltest'],
    // })
    //   .then((products: any) => {
    //     console.log('Products:', products);
    //   })
    //   .catch((error: any) => {
    //     console.log('Error fetching products:', error);
    //   });
  }, []);

  React.useEffect(() => {
    Platform.OS === 'ios' &&
      subscribedToSubscriptionListener(SubscriptionListenerCallback);
    return () => {
      Platform.OS === 'ios' && unSubscribedToSubscriptionListener();
    };
  }, []);

  const SubscriptionListenerCallback = (value: boolean) => {
    setNextButtonLoader(value);
  };

  const updateSubscription = async (_response: any) => {
    try {
      if (_response && _response.transactionReceipt) {
        const data = {
          plan_timeperiod: toggle ? '2' : '1',
          price_id: toggle
            ? currentPlan?.anually_price_id
            : currentPlan?.monthly_price_id,
          price: toggle
            ? currentPlan?.anually_price
            : currentPlan?.monthly_price,
          plan_id: currentPlan?.id,
          transaction_id: _response?.transactionId,
        };
        const response = await PostApiWithToken(
          endPoint.buyPlanIos,
          data,
          token,
        );
        if (response?.data?.status) {
          dispatch(reloadHandler({[ScreenNames.Home]: !homeReload}));
          navigation.reset({
            index: 0,
            routes: [{name: ScreenNames.Drawer}],
          });
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in updateSubscription', err?.message);
    }
  };

  const handleSubscribe = async (sku: string) => {
    try {
      setNextButtonLoader(true);
      await handleSubscription(sku, updateSubscription);
    } catch (err: any) {
      console.log('err in subscription', err?.message);
    } finally {
      setNextButtonLoader(false);
    }
  };

  const getPlanHandler = async () => {
    setShowSkeletonLoader(true);
    try {
      const response = await GetApiWithToken(endPoint.plans, token);
      if (response?.data?.status) {
        setPlans(response?.data.data);
      } else if (!response?.data?.status) {
        Toast.show({
          type: 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in subscription plan', err?.message);
    } finally {
      setShowSkeletonLoader(false);
    }
  };

  const goToHomeScreenHandler = async () => {
    try {
      // if (!currentPlan?.anually_price_id && !currentPlan?.monthly_price_id) {
      //   setNextButtonLoader(true);
      //   const response = await PostApiWithToken(
      //     endPoint.buyFreePlan,
      //     {plan_id: currentPlan?.id, price: 0},
      //     token,
      //   );
      //   if (response?.data?.status) {
      //     dispatch(reloadHandler({[ScreenNames.Home]: !homeReload}));
      //   }
      //   setNextButtonLoader(false);
      //   Toast.show({
      //     type: response?.data?.status ? 'success' : 'error',
      //     text1: response?.data?.message,
      //   });
      //   navigation.navigate(ScreenNames.Home);
      // }
      if (Platform.OS === 'android') {
        navigation.navigate(ScreenNames.Payment, {data: currentPlan});
      } else {
        iosPlan && setNextButtonLoader(true);
        iosPlan && handleSubscribe(iosPlan);
      }
    } catch (err: any) {
      console.log('err in purchasing subscription', err?.message);
    }
  };

  const selectPlan = (item: plan) => {
    setCurrentPlan({...item, selected_plan: toggle ? 1 : 0});
    if (Platform.OS === 'ios') {
      if (item?.product_id === null) {
        setIosPlan('');
        return;
      }
      if (toggle) {
        if (item?.name === 'Plan B') {
          setIosPlan('prod_PVqNani9ws1r6k');
        } else if (item?.name === 'Plan C') {
          setIosPlan('prod_PVqNHEOuvDDSKy_plan_c_yearly');
        } else {
          setIosPlan('journeywithjournaltest');
        }
      } else {
        if (item?.name === 'Plan B') {
          setIosPlan('prod_PVqNani9ws1r6k_plan_b_monthly');
        } else if (item?.name === 'Plan C') {
          setIosPlan('prod_PVqNHEOuvDDSKy_plan_c_monthly');
        } else {
          setIosPlan('journeywithjournaltest');
        }
      }
    }
  };

  const renderPlans = plans?.map((item: plan) => {
    return (
      <Wrapper
        containerStyle={{
          ...styles.wrapperStyle,
          backgroundColor:
            (item?.current_plan && toggle === myPurchasedPlan) ||
            (item?.current_plan &&
              !toggle === myPurchasedPlan &&
              item?.monthly_price === 0)
              ? 'rgba(0,0,0,0.1)'
              : 'white',
          borderColor:
            currentPlan?.id == item?.id
              ? globalStyles.themeBlue
              : 'transparent',
        }}
        key={item?.id}>
        <TouchableOpacity
          disabled={item?.current_plan && toggle === myPurchasedPlan}
          style={styles.touch}
          activeOpacity={0.4}
          onPress={() => {
            selectPlan(item);
          }}>
          <SubscriptionPlanHeader
            imageUrl={
              item?.name == 'Plan A'
                ? freeIconPath
                : item?.name == 'Plan B'
                ? planBIconPath
                : planCIconPath
            }
            planName={item?.name}
            planDetails={
              item?.current_plan && toggle === myPurchasedPlan
                ? 'Current Plan'
                : item?.current_plan &&
                  !toggle === myPurchasedPlan &&
                  item?.monthly_price === 0
                ? 'Current Plan'
                : ''
            }
            planPrice={
              item?.name == 'Plan A'
                ? `USD ${item?.monthly_price}`
                : `${item?.currency.toUpperCase()} ${
                    toggle ? item?.anually_price : item?.monthly_price
                  }`
            }
            planTenure={
              item?.name === 'Plan A'
                ? ''
                : toggle
                ? '/ Per Year'
                : '/ Per Month'
            }
          />
          <View>
            <SubscriptionBenifitViewer text={item?.point1} />
            <SubscriptionBenifitViewer text={item?.point2} />
            <SubscriptionBenifitViewer text={item?.point3} />
            <SubscriptionBenifitViewer text={item?.point4} />
          </View>
        </TouchableOpacity>
      </Wrapper>
    );
  });

  return (
    <>
      <View style={{...styles.container, backgroundColor: '#F0F0F0'}}>
        <View style={styles.headerContainer}>
          <Header title="Subscription Plan" />
          <View style={styles.switchBtnContainer}>
            <ToggleSwitch
              isOn={toggle}
              onColor="#B9D9EB"
              offColor="white"
              size="medium"
              onToggle={() => {
                planDetails?.plan_timeperiod === 'One-Time' &&
                  setMyPurchasedPlan(value => !value);
                setToggle(value => !value);
                setCurrentPlan(undefined);
              }}
            />
          </View>
        </View>
        <View style={styles.scrollViewContainer}>
          <ScrollView
            bounces={false}
            style={styles.scrollView}
            contentContainerStyle={{paddingBottom: responsiveHeight(8)}}>
            {showSkeletonLoader ? (
              <>
                <ImageSkeleton
                  height={responsiveHeight(30)}
                  width={responsiveWidth(90)}
                />
                <ImageSkeleton
                  height={responsiveHeight(30)}
                  width={responsiveWidth(90)}
                />
                <ImageSkeleton
                  height={responsiveHeight(30)}
                  width={responsiveWidth(90)}
                />
              </>
            ) : (
              plans?.length > 0 && renderPlans
            )}
            {plans?.length > 0 && (
              <BorderBtn
                loader={nextButtonLoader}
                disable={(currentPlan ? false : true) || nextButtonLoader}
                buttonText="Next"
                onClick={goToHomeScreenHandler}
                containerStyle={{width: '100%'}}
              />
            )}
          </ScrollView>
        </View>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={nextButtonLoader}
        style={{backgroundColor: 'rgba(0,0,0,0.3)'}}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={'white'} />
        </View>
      </Modal>
    </>
  );
};

export default SubscriptionPlans;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  touch: {
    width: '100%',
  },
  headerContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: responsiveHeight(2),
    backgroundColor: globalStyles.themeBlue,
  },
  switchBtnContainer: {
    position: 'absolute',
    zIndex: 1000,
    right: responsiveWidth(3),
    top: StatusBarManager.HEIGHT,
  },
  scrollViewContainer: {
    flex: 1,
    width: responsiveWidth(100),
    alignItems: 'center',
  },
  scrollView: {
    paddingVertical: responsiveHeight(3),
    paddingHorizontal: responsiveWidth(3.5),
  },
  wrapperStyle: {
    alignItems: 'flex-start',
    marginBottom: responsiveHeight(2),
    paddingTop: responsiveHeight(1),
    paddingBottom: responsiveHeight(2),
    paddingLeft: responsiveWidth(5),
    borderRadius: responsiveWidth(2),
    width: responsiveWidth(93),
    borderWidth: responsiveWidth(0.23),
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
