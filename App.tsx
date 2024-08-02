import React, {useEffect, useState} from 'react';
import {
  StatusBar,
  Platform,
  Modal,
  StyleSheet,
  View,
  Text,
  Alert,
} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/Store';
import {NavigationContainer} from '@react-navigation/native';
import Toast, {
  BaseToast,
  ErrorToast,
  InfoToast,
} from 'react-native-toast-message';
import MyNavigationContainer from './src/navigation/MyNavigationContainer';
import NetInfo from '@react-native-community/netinfo';
import NoInternet from './src/screens/NoInternet/NoInternet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StripeProvider} from '@stripe/stripe-react-native';
import messaging from '@react-native-firebase/messaging';
import {triggerNotification} from './src/utils/Method';
import {notificationCounter, numberHandler} from './src/redux/TrackNumbers';
import {
  responsiveFontSize,
  responsiveHeight,
  responsiveWidth,
} from 'react-native-responsive-dimensions';
import {firebase} from '@react-native-firebase/firestore';
import {endPoint, GetApiWithToken} from './src/services/Service';
import {globalStyles} from './src/utils/constant';
import BorderBtn from './src/components/Button/BorderBtn';

const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{
        height: 'auto',
        paddingVertical: responsiveHeight(1),
        borderLeftColor: 'green',
        minHeight: responsiveHeight(7),
      }}
      text1NumberOfLines={100}
      text2NumberOfLines={100}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{
        height: 'auto',
        paddingVertical: responsiveHeight(1),
        borderLeftColor: 'red',
        minHeight: responsiveHeight(7),
      }}
      text1NumberOfLines={100}
      text2NumberOfLines={100}
    />
  ),
  info: (props: any) => (
    <InfoToast
      {...props}
      style={{
        height: 'auto',
        paddingVertical: responsiveHeight(1),
        borderLeftColor: '#FFDF00',
        minHeight: responsiveHeight(7),
      }}
      text1NumberOfLines={100}
      text2NumberOfLines={100}
    />
  ),
};

function App(): React.ReactElement {
  const [isInternetReachable, setIsInternetReachable] = useState<boolean>(true);
  const [showNoInternet, setShowNoInternet] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribeNetInfo = NetInfo.addEventListener((state: any) => {
      setIsInternetReachable(state.isInternetReachable && state.isConnected);
    });
    return () => unsubscribeNetInfo();
  }, []);

  useEffect(() => {
    if (isInternetReachable === false) {
      setShowNoInternet(true);
    } else {
      setShowNoInternet(false);
    }
  }, [isInternetReachable]);

  console.log({isInternetReachable, showNoInternet});
  useEffect(() => {
    requestUserPermission()
      .then(permissionGranted => {
        if (permissionGranted) {
          messaging().onMessage(async remoteMessage => {
            // console.log('Foreground message received!', remoteMessage);
            store.dispatch(notificationCounter({notificationCount: 1}));
            triggerNotification(
              remoteMessage?.notification?.title,
              remoteMessage?.notification?.body,
            );
          });
        } else {
          console.log('Permission denied for FCM');
        }
      })
      .catch(err => {
        console.log('err in push notification', err);
      });
  }, []);

  // React.useEffect(() => {
  //   let unsubscribe = null;
  //   if (store?.getState()?.auth?.token) {
  //     console.log('rdfgh shoaib nile')
  //     unsubscribe = firebase
  //       ?.firestore()
  //       .collection('jwj_chats')
  //       .doc(`1-${store?.getState().userDetails?.id}`)
  //       .collection('messages')
  //       ?.orderBy('createdAt', 'desc')
  //       ?.limit(1)
  //       ?.onSnapshot((snapshot: any) => {
  //         getUnseenMessage();
  //       });
  //   }

  //   return () => {
  //     unsubscribe && unsubscribe();
  //   };
  // }, [store?.getState()?.auth?.token]);

  const requestUserPermission = async (): Promise<boolean> => {
    try {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      return enabled;
    } catch (error) {
      console.log('Error requesting FCM permission:', error);
      return false;
    }
  };

  // const getUnseenMessage = async () => {
  //   try {
  //     console.log('unseen 1');
  //     const response = await GetApiWithToken(
  //       endPoint.unseenMessageCount,
  //       store?.getState()?.auth?.token,
  //     );
  //     console.log('unseen 2');
  //     if (response?.data?.status) {
  //       console.log('my unseen@@ message', response?.data);
  //       dispatch(numberHandler({unSeenMessage: response?.data?.data + 1}));
  //     }
  //   } catch (err: any) {
  //     console.log('err in unseen message api home screen', err?.message);
  //   }
  // };

  const checkInternet = async () => {
    const state = await NetInfo.fetch();
    // if (state.isConnected && state.isInternetReachable) {
    if (state.isInternetReachable) {
      setIsInternetReachable(state.isInternetReachable);
    } else {
      Alert.alert('No internet connection.');
    }
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StripeProvider
        publishableKey="pk_test_51OgoamGdqn1JkKNJkKB19GFHa1Tsp6vjfpPNSViGDwDYOsPPbqk6HSqp4z542P55IlQLCReRQr96ibkc2OCXwiAd00FqBen60M"
        merchantIdentifier="merchant.identifier"
        urlScheme="your-url-scheme">
        <NavigationContainer>
          <Provider store={store}>
            <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="light-content"
            />
            <MyNavigationContainer />
            <Toast config={toastConfig} />
          </Provider>
        </NavigationContainer>
        <Modal
          visible={showNoInternet}
          transparent={true}
          animationType="slide">
          <View style={styles.container}>
            <Text style={styles.text}>No Internet Connection.</Text>
            <BorderBtn
              buttonText="Retry"
              onClick={checkInternet}
              containerStyle={{
                marginTop: responsiveHeight(2),
                width: responsiveWidth(50),
              }}
            />
          </View>
        </Modal>
        {/* {showNoInternet && (
          <NoInternet
            setIsInternetReachable={setIsInternetReachable}
            setShowNoInternet={setShowNoInternet}
          />
        )} */}
      </StripeProvider>
    </GestureHandlerRootView>
  );
}

export default App;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,.8)',
  },
  text: {
    fontSize: responsiveFontSize(3),
    textAlign: 'center',
    color: globalStyles.themeBlueText,
  },
});
