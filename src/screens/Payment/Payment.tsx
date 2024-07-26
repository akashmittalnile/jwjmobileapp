import React, {useEffect, useState, useRef} from 'react';
import {
  RefreshControl,
  View,
  Image,
  Text,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import Header from '../../components/Header/Header';
import {
  CardField,
  CardFieldInput,
  useStripe,
  StripeContainer,
} from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import {globalStyles} from '../../utils/constant';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import BorderBtn from '../../components/Button/BorderBtn';
import {useAppDispatch, useAppSelector} from '../../redux/Store';
import {
  GetApiWithToken,
  PostApiWithToken,
  endPoint,
} from '../../services/Service';
import {RouteProp, useRoute, useNavigation} from '@react-navigation/native';
import {RootStackParamList} from '../../navigation/MainNavigation';
import Modal from '../../components/Modal/Modal';
import ScreenNames from '../../utils/ScreenNames';
import {reloadHandler} from '../../redux/ReloadScreen';
import Card from '../../components/Card/Card';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {fetchPdf} from '../../utils/Method';

type PaymentRouteProps = RouteProp<RootStackParamList, 'Payment'>;

const Payment = (props: any) => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const scrollRef = React.useRef(null);
  const token = useAppSelector(state => state.auth.token);
  const reload = useAppSelector(state => state.reload);
  const {params} = useRoute<PaymentRouteProps>();
  const [card, setCard] = useState(CardFieldInput.Details | null);
  const [addpayment, setaddpayment] = useState(false);
  const {createToken} = useStripe();
  const [loading, setLoading] = useState<{
    loader: boolean;
    cardLoader: boolean;
  }>({
    loader: false,
    cardLoader: false,
  });
  const [allCardList, setallCardList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [selectedCard, setSelectedCard] = React.useState<string>('');
  const [skeletonLoader, setSkeletonLoader] = React.useState<boolean>(false);
  const [submitLoader, setSubmitLoader] = React.useState<boolean>(false);

  useEffect(() => {
    console.log(params);
    getCardList();
  }, []);

  useEffect(() => {
    const keyboardEvent = Keyboard.addListener('keyboardDidHide', () => {
      scrollRef.current?.scrollTo({
        x: 0,
        y: 0,
        animated: true,
      });
    });
    return () => {
      keyboardEvent;
    };
  }, []);

  const checkcon = () => {
    getpaymentList();
  };

  const wait = (timeout: any) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    // checkcon();
    // wait(2000).then(() => {
    //   setRefreshing(false);
    // });
  }, []);

  const handlePayClick = async () => {
    setLoading(preData => ({...preData, cardLoader: true}));
    setSubmitLoader(true);
    try {
      if (params?.downloadJournal) {
        const data = {card_id: selectedCard, start_date: params?.startDate};
        const response = await PostApiWithToken(
          endPoint.buyJournalPdf,
          data,
          token,
        );
        if (response?.data?.status) {
          const result = await fetchPdf(response?.data?.data);
          if (result) {
            dispatch(reloadHandler({[ScreenNames.Profile]: !reload?.Profile}));
            navigation.navigate(ScreenNames.Journals);
          }
        }
      } else {
        // const res: any = await createToken({card, type: 'Card'});
        let data;
        if (selectedCard) {
          data = {
            plan_timeperiod:
              params?.data?.anually_price_id == params?.data?.monthly_price_id
                ? 3
                : params?.data?.selected_plan
                ? '2'
                : '1',
            price_id: params?.data?.selected_plan
              ? params?.data?.anually_price_id
              : params?.data?.monthly_price_id,
            price: params?.data?.selected_plan
              ? params?.data?.anually_price
              : params?.data?.monthly_price,
            plan_id: params?.data?.id,
            card_id: selectedCard,
          };
        }
        // else {
        //   console.log('2');
        //   data = {
        //     stripeToken: res.token.id,
        //     plan_timeperiod:
        //       params?.data?.anually_price_id == params?.data?.monthly_price_id
        //         ? 3
        //         : params?.data?.selected_plan
        //         ? '2'
        //         : '1',
        //     price_id: params?.data?.selected_plan
        //       ? params?.data?.anually_price_id
        //       : params?.data?.monthly_price_id,
        //     price: params?.data?.selected_plan
        //       ? params?.data?.anually_price
        //       : params?.data?.monthly_price,
        //     plan_id: params?.data?.id,
        //   };
        // }
        const response = await PostApiWithToken(endPoint.buyPlan, data, token);
        if (response?.data?.status) {
          // getpaymentList();
          dispatch(reloadHandler({[ScreenNames.Home]: !reload?.Home}));
          addpayment && setaddpayment(false);
          navigation.navigate(ScreenNames.Home);
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('err in payment', err?.message);
    } finally {
      // addpayment && setaddpayment(false);
      showModal && setShowModal(true);
      setLoading(preData => ({...preData, cardLoader: false, loader: false}));
      setSubmitLoader(false);
    }
  };

  const addNewCard = async () => {
    try {
      if (card == 0) {
        Toast.show({text1: 'Please Add card details'});
      } else if (!card.complete) {
        Toast.show({text1: 'Please enter correct card details'});
      } else if (card?.complete) {
        setLoading(preData => ({...preData, cardLoader: true}));
        const stripeToken: any = await createToken({card, type: 'Card'});
        const response = await PostApiWithToken(
          endPoint.addCard,
          {stripeToken: stripeToken?.token.id},
          token,
        );
        console.log(response?.data);
        if (response?.data?.status) {
          setaddpayment(value => !value);
          getCardList();
        }
        Toast.show({
          type: response?.data?.status ? 'success' : 'error',
          text1: response?.data?.message,
        });
      }
    } catch (err: any) {
      console.log('error in adding new card', err?.message);
    } finally {
      setSelectedCard('');
      setLoading(preData => ({...preData, cardLoader: false}));
    }
  };

  const getCardList = async () => {
    try {
      const response = await GetApiWithToken(endPoint.cardList, token);
      if (response?.data?.status) {
        setallCardList(response?.data?.data);
      }
    } catch (err: any) {
      console.log('error in adding new card', err?.message);
    }
  };

  const modalHandler = () => {
    setShowModal(false);
    navigation.navigate(ScreenNames.Home);
  };

  const selectCardHandler = (value: string) => {
    setSelectedCard(value);
    setaddpayment(false);
  };

  return (
    <>
      <StripeContainer>
        <ScrollView
          ref={scrollRef}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="never"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{paddingBottom: responsiveHeight(0)}}>
          {/* <View style={styles.container}> */}
          <View style={styles.headerContainer}>
            <Header
              title="Payment"
              disableBackButton={loading?.cardLoader || submitLoader}
            />
          </View>

          <View style={{width: '92%', alignSelf: 'center'}}>
            <View
              style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
                marginVertical: 15,
              }}>
              <Text
                style={{
                  color: globalStyles.midGray,
                  fontWeight: '500',
                  fontSize: 12,
                }}>
                CHOOSE PAYMENT OPTION
              </Text>

              <Text
                style={{
                  color: addpayment ? 'red' : globalStyles.themeBlue,
                  fontWeight: '500',
                  textDecorationLine: addpayment ? 'none' : 'underline',
                  fontSize: 13,
                }}
                onPress={() => {
                  setaddpayment(value => !value);
                }}>
                {addpayment ? 'Cancel' : 'Add New Card'}
              </Text>
            </View>

            {addpayment ? (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={20}
                style={{flex: 1}}>
                <View style={{}}>
                  <CardField
                    accessible={true}
                    postalCodeEnabled={false}
                    placeholder={{
                      number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                      borderRadius: 20,
                      borderColor: 'red',
                      borderWidth: 1,
                      textColor: 'black',
                      placeholderColor: '#c9c9c9',
                    }}
                    style={{
                      width: responsiveWidth(92),
                      height: 200,
                      marginTop: 20,
                      marginBottom: 30,
                      color: '#000',
                    }}
                    onCardChange={cardDetails => {
                      setCard(cardDetails);
                      if (cardDetails?.complete) {
                        Keyboard.dismiss();
                      }
                    }}
                    onFocus={focusedField => {
                      console.log('focusField', focusedField);
                    }}
                  />
                </View>

                <View style={{width: '100%', marginTop: -10}}>
                  <BorderBtn
                    buttonText="Add Card"
                    disable={loading?.cardLoader}
                    loader={loading?.cardLoader}
                    containerStyle={styles.btnStyle}
                    onClick={() => {
                      addNewCard();
                      // handlePayClick();
                    }}
                    buttonTextStyle={{
                      fontSize: responsiveFontSize(2.2),
                      fontWeight: '500',
                    }}
                  />
                </View>
              </KeyboardAvoidingView>
            ) : null}

            <View>
              {skeletonLoader ? (
                <>
                  <SkeletonPlaceholder />
                </>
              ) : (
                allCardList?.length > 0 &&
                allCardList?.map((item: any, index: number) => (
                  <Card
                    cardId={item?.card_id}
                    key={index}
                    onPress={selectCardHandler}
                    isSelected={selectedCard === item?.card_id}
                    lastDigit={item?.last4}
                    name={item?.brand}
                    expire={`${
                      item?.exp_month < 10
                        ? '0' + item?.exp_month
                        : item?.exp_month
                    }/${item?.exp_year}`}
                  />
                ))
              )}
            </View>

            <View style={{width: '100%', marginTop: 0}}>
              <BorderBtn
                loader={submitLoader}
                disable={addpayment || !selectedCard || submitLoader}
                buttonText="Submit"
                onClick={handlePayClick}
                containerStyle={styles.btnStyle}
                buttonTextStyle={{
                  fontSize: responsiveFontSize(2.2),
                  fontWeight: '500',
                }}
              />
            </View>
          </View>

          <View style={{height: 100}} />
        </ScrollView>
      </StripeContainer>
      {showModal && (
        <Modal
          text="Payment Successful"
          buttonText="Close"
          modalHandler={modalHandler}
        />
      )}
    </>
  );
};
const styles = StyleSheet.create({
  input: {
    paddingLeft: 15,
    width: '100%',
    fontSize: 13,
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth: 0.5,
    // backgroundColor: '#34333a',
    color: '#fff',
    height: 100,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    // color: Mycolors.Black,
  },
  headerContainer: {
    justifyContent: 'center',
    backgroundColor: globalStyles.themeBlue,
    paddingBottom: responsiveHeight(2),
  },
  btnStyle: {
    marginTop: responsiveHeight(0),
    marginBottom: responsiveHeight(3),
    height: responsiveHeight(7),
    width: responsiveWidth(92),
  },
});

export default Payment;
